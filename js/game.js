/*
 * game.js — Motor del juego "Claude Academy".
 *
 * Marco narrativo: "Construye y lanza tu producto con IA". Cada mundo
 * desbloquea una capacidad que necesitas para lanzar tu asistente; la
 * historia envuelve, pero la documentación de Claude es la carga.
 *
 * Mecánicas:
 *  - Misión (story) → lecciones → ronda de preguntas → reto de lanzamiento (jefe).
 *  - Formatos de pregunta: opción múltiple, verdadero/falso, ordenar y emparejar.
 *  - XP, niveles, vidas, rachas, estrellas y barra de "progreso de lanzamiento".
 *  - Racha diaria, desafío diario (XP x2), sonido/confeti, resumen de fallos y compartir.
 *  - Progreso en localStorage.
 */

(function () {
  "use strict";

  const STORAGE_KEY = "claude-academy-save-v2";
  const LIVES_PER_ROUND = 3;
  const XP_PER_CORRECT = 10;
  const STREAK_BONUS = 5;
  const ROUND_SIZE = 8; // preguntas por ronda (más el jefe), muestreadas del banco.

  /* ----------------------------- Estado ----------------------------- */

  const defaultState = () => ({
    xp: 0,
    completed: {}, // worldId -> { best:%, stars:n }
    unlockedIndex: 0,
    finalUnlocked: false,
    player: "",
    scores: [],
    storyMode: true,
    introSeen: false,
    muted: false,
    streakDays: 0,
    lastActive: "", // YYYY-MM-DD del último día con actividad
    dailyDone: "", // YYYY-MM-DD del último desafío diario completado
  });

  let state = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return Object.assign(defaultState(), JSON.parse(raw));
    } catch (e) {}
    return defaultState();
  }
  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  /* ----------------------------- Utilidades ------------------------- */

  const $ = (sel) => document.querySelector(sel);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  };
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }
  function dayOffset(n) {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  }
  function fmtTime(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  }
  function level(xp) {
    const lvl = Math.floor(xp / 100) + 1;
    const titles = [
      "Aprendiz",
      "Explorador",
      "Practicante",
      "Constructor",
      "Ingeniero/a",
      "Arquitecto/a",
      "Especialista",
      "Maestro/a Claude",
    ];
    return { lvl, title: titles[Math.min(lvl - 1, titles.length - 1)], into: xp % 100 };
  }
  function launchPct() {
    const done = GAME_DATA.worlds.filter(
      (w) => state.completed[w.id] && state.completed[w.id].stars >= 1
    ).length;
    return Math.round((done / GAME_DATA.worlds.length) * 100);
  }

  /* ----------------------------- Sonido / confeti ------------------- */

  let audioCtx = null;
  function beep(kind) {
    if (state.muted) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const now = audioCtx.currentTime;
      const notes = kind === "ok" ? [660, 880] : [200, 150];
      notes.forEach((f, i) => {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.connect(g);
        g.connect(audioCtx.destination);
        o.type = kind === "ok" ? "sine" : "square";
        o.frequency.value = f;
        const t0 = now + i * 0.09;
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(0.18, t0 + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.16);
        o.start(t0);
        o.stop(t0 + 0.17);
      });
    } catch (e) {}
  }
  function confetti() {
    const c = el("canvas", "confetti-canvas");
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    document.body.appendChild(c);
    const ctx = c.getContext("2d");
    const colors = ["#c15f3c", "#5c7f67", "#d6a35c", "#7c5cff", "#1971c2", "#e64980"];
    const parts = Array.from({ length: 110 }, () => ({
      x: Math.random() * c.width,
      y: -20 - Math.random() * c.height * 0.4,
      r: 4 + Math.random() * 6,
      vy: 2 + Math.random() * 3.5,
      vx: -1.2 + Math.random() * 2.4,
      col: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * 6,
      vr: -0.2 + Math.random() * 0.4,
    }));
    let t = 0;
    (function frame() {
      t++;
      ctx.clearRect(0, 0, c.width, c.height);
      parts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.col;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
        ctx.restore();
      });
      if (t < 150) requestAnimationFrame(frame);
      else c.remove();
    })();
  }
  function toast(msg) {
    const t = el("div", "toast", msg);
    document.body.appendChild(t);
    setTimeout(() => t.classList.add("show"), 10);
    setTimeout(() => {
      t.classList.remove("show");
      setTimeout(() => t.remove(), 300);
    }, 1900);
  }

  /* ----------------------------- Navegación ------------------------- */

  const app = $("#app");
  function render(view) {
    app.innerHTML = "";
    app.appendChild(view);
    window.scrollTo(0, 0);
  }

  function header() {
    const lv = level(state.xp);
    const h = el("div", "topbar");
    const streakChip =
      state.streakDays > 0
        ? `<div class="chip" title="Días seguidos jugando">🔥 ${state.streakDays}</div>`
        : "";
    h.innerHTML = `
      <div class="brand" id="homeBtn">🎓 <span>Claude Academy</span></div>
      <div class="stats">
        ${streakChip}
        <div class="chip" title="Experiencia">⭐ ${state.xp}</div>
        <div class="chip" title="Nivel: ${lv.title}">Lv.${lv.lvl}</div>
        <div class="chip link" id="soundBtn" title="Sonido">${state.muted ? "🔇" : "🔊"}</div>
        <div class="chip link" id="storyBtn" title="Modo historia">${state.storyMode ? "📖" : "📕"}</div>
        <div class="chip link" id="scoresBtn" title="Puntuaciones">🏅</div>
      </div>`;
    h.querySelector("#homeBtn").onclick = renderMap;
    h.querySelector("#scoresBtn").onclick = renderScores;
    h.querySelector("#soundBtn").onclick = function () {
      state.muted = !state.muted;
      saveState();
      this.textContent = state.muted ? "🔇" : "🔊";
      if (!state.muted) beep("ok");
    };
    h.querySelector("#storyBtn").onclick = function () {
      state.storyMode = !state.storyMode;
      saveState();
      this.textContent = state.storyMode ? "📖" : "📕";
      toast(state.storyMode ? "Modo historia activado" : "Modo historia desactivado");
    };
    return h;
  }

  /* ----------------------------- Cinemática de inicio --------------- */

  const INTRO_SLIDES = [
    {
      icon: "🌆",
      title: "Bienvenido/a al estudio",
      text: "Las mejores ideas de hoy se construyen con IA. Acabas de unirte como builder a un pequeño estudio con una gran ambición.",
    },
    {
      icon: "💡",
      title: "Tu misión",
      text: "Construir y LANZAR tu propio producto de IA: un asistente que hable, responda con precisión, use herramientas y llegue a producción.",
    },
    {
      icon: "🗺️",
      title: "El camino",
      text: "Cada mundo te entrena en una capacidad real de Claude: entender el modelo, la API, RAG, agentes, Claude Code, MCP… Las mismas que usan los equipos profesionales.",
    },
    {
      icon: "🚀",
      title: "El reto",
      text: "Al final de cada mundo, un RETO DE LANZAMIENTO pondrá a prueba tu producto con un caso real. Supéralos todos y llegarás al día del lanzamiento.",
    },
  ];

  function renderIntro(idx) {
    idx = idx || 0;
    const slide = INTRO_SLIDES[idx];
    const view = el("div", "view cine");
    const sc = el("div", "cine-scene");
    sc.innerHTML = `
      <div class="cine-icon">${slide.icon}</div>
      <h2>${slide.title}</h2>
      <p>${slide.text}</p>`;
    const dots = el("div", "dots");
    INTRO_SLIDES.forEach((_, i) => dots.appendChild(el("span", "dot" + (i === idx ? " on" : ""))));
    sc.appendChild(dots);

    const nav = el("div", "cine-nav");
    const skip = el("button", "ghost", "Saltar intro");
    skip.onclick = finishIntro;
    const next = el(
      "button",
      "primary",
      idx === INTRO_SLIDES.length - 1 ? "¡Empezar! ▶" : "Siguiente ›"
    );
    next.onclick = () =>
      idx === INTRO_SLIDES.length - 1 ? finishIntro() : renderIntro(idx + 1);
    nav.appendChild(skip);
    nav.appendChild(next);
    sc.appendChild(nav);
    view.appendChild(sc);
    render(view);
  }

  function finishIntro() {
    state.introSeen = true;
    saveState();
    renderMap();
  }

  /* ----------------------------- Mapa ------------------------------- */

  function renderMap() {
    const view = el("div", "view");
    view.appendChild(header());

    const lv = level(state.xp);
    const hero = el("div", "hero");
    const lp = launchPct();
    const progressBlock = state.storyMode
      ? `<div class="launch">
           <div class="launch-label">🚀 Progreso de lanzamiento de tu producto</div>
           <div class="xpbar"><div class="xpfill" style="width:${lp}%"></div></div>
           <small>${lp}% · ${
             lp === 100 ? "¡Producto lanzado! 🎉" : "Completa mundos para acercarte al lanzamiento"
           }</small>
         </div>`
      : `<div class="xpbar"><div class="xpfill" style="width:${lv.into}%"></div></div>
         <small>${lv.into}/100 XP hacia el siguiente nivel</small>`;
    hero.innerHTML = `
      <h1>${GAME_DATA.meta.title}</h1>
      <p>${state.storyMode ? "Eres builder. Aprende cada capacidad de Claude y lanza tu producto de IA." : GAME_DATA.meta.subtitle}</p>
      ${progressBlock}`;
    view.appendChild(hero);

    // Desafío diario.
    const daily = el("div", "daily");
    const doneToday = state.dailyDone === todayStr();
    daily.innerHTML = doneToday
      ? `<span>✅ Desafío diario completado hoy. ¡Vuelve mañana!</span>`
      : `<div><strong>📅 Desafío diario</strong><br><small>5 preguntas mezcladas · XP x2</small></div>`;
    if (!doneToday) {
      const b = el("button", "primary", "Jugar ›");
      b.onclick = renderDaily;
      daily.appendChild(b);
    }
    view.appendChild(daily);

    const grid = el("div", "grid");
    GAME_DATA.worlds.forEach((w, i) => {
      const done = state.completed[w.id];
      const unlocked = i <= state.unlockedIndex;
      const card = el("div", "card" + (unlocked ? "" : " locked"));
      card.style.setProperty("--accent", w.color);
      const stars = done
        ? "★★★".slice(0, done.stars) + "☆☆☆".slice(0, 3 - done.stars)
        : "";
      card.innerHTML = `
        <div class="card-icon">${unlocked ? w.icon : "🔒"}</div>
        <div class="card-body">
          <h3>${i + 1}. ${w.name}</h3>
          <p>${w.blurb}</p>
          <div class="card-foot">
            ${done ? `<span class="stars">${stars}</span><span class="pct">${done.best}%</span>` : `<span class="muted">${unlocked ? "Sin completar" : "Bloqueado"}</span>`}
          </div>
        </div>`;
      if (unlocked) card.onclick = () => enterWorld(w);
      grid.appendChild(card);
    });

    const finalCard = el("div", "card final" + (state.finalUnlocked ? "" : " locked"));
    finalCard.style.setProperty("--accent", "#d6336c");
    finalCard.innerHTML = `
      <div class="card-icon">${state.finalUnlocked ? "🏆" : "🔒"}</div>
      <div class="card-body">
        <h3>Día del lanzamiento: Examen final</h3>
        <p>${state.finalUnlocked ? "Preguntas mezcladas de todos los mundos. ¡Demuestra que tu producto está listo!" : "Completa los 8 mundos para desbloquearlo."}</p>
      </div>`;
    if (state.finalUnlocked) finalCard.onclick = renderFinal;
    grid.appendChild(finalCard);
    view.appendChild(grid);

    const foot = el("div", "mapfoot");
    const replay = el("button", "reset", "🎬 Ver intro");
    replay.onclick = () => renderIntro(0);
    const reset = el("button", "reset", "↺ Reiniciar progreso");
    reset.onclick = () => {
      if (confirm("¿Borrar todo tu progreso?")) {
        state = defaultState();
        saveState();
        renderIntro(0);
      }
    };
    foot.appendChild(replay);
    foot.appendChild(reset);
    view.appendChild(foot);
    render(view);
  }

  /* ----------------------------- Misión (story) --------------------- */

  function enterWorld(world) {
    if (state.storyMode && world.mission) renderMission(world);
    else renderLessons(world);
  }

  function renderMission(world) {
    const view = el("div", "view");
    view.appendChild(header());
    const m = el("div", "mission");
    m.style.setProperty("--accent", world.color);
    const idx = GAME_DATA.worlds.findIndex((w) => w.id === world.id);
    m.innerHTML = `
      <div class="mission-icon">${world.icon}</div>
      <div class="mission-tag">Misión ${idx + 1} de ${GAME_DATA.worlds.length}</div>
      <h2>${world.name}</h2>
      <p>${world.mission}</p>`;
    const nav = el("div", "lesson-nav");
    const back = el("button", "ghost", "‹ Mapa");
    back.onclick = renderMap;
    const go = el("button", "primary", "Empezar misión ›");
    go.onclick = () => renderLessons(world);
    nav.appendChild(back);
    nav.appendChild(go);
    m.appendChild(nav);
    view.appendChild(m);
    render(view);
  }

  /* ----------------------------- Lecciones -------------------------- */

  function renderLessons(world, idx) {
    idx = idx || 0;
    const view = el("div", "view");
    view.appendChild(header());
    const lesson = world.lessons[idx];
    const wrap = el("div", "lesson");
    wrap.style.setProperty("--accent", world.color);
    wrap.innerHTML = `
      <div class="lesson-tag">${world.icon} ${world.name} · Lección ${idx + 1}/${world.lessons.length}</div>
      <h2>${lesson.title}</h2>
      <p>${lesson.body}</p>`;
    const nav = el("div", "lesson-nav");
    const back = el("button", "ghost", "‹ Atrás");
    back.onclick = () =>
      idx === 0 ? (state.storyMode && world.mission ? renderMission(world) : renderMap()) : renderLessons(world, idx - 1);
    const next = el(
      "button",
      "primary",
      idx === world.lessons.length - 1 ? "¡A jugar! ▶" : "Siguiente ›"
    );
    next.onclick = () =>
      idx === world.lessons.length - 1 ? startRound(world) : renderLessons(world, idx + 1);
    nav.appendChild(back);
    nav.appendChild(next);
    wrap.appendChild(nav);
    const dots = el("div", "dots");
    world.lessons.forEach((_, i) => dots.appendChild(el("span", "dot" + (i === idx ? " on" : ""))));
    wrap.appendChild(dots);
    view.appendChild(wrap);
    render(view);
  }

  /* ----------------------------- Ronda ------------------------------ */

  function startRound(world, opts) {
    opts = opts || {};
    let questions;
    if (opts.questions) {
      questions = opts.questions.slice();
    } else {
      const pool = shuffle(world.questions);
      questions = pool.slice(0, Math.min(ROUND_SIZE, pool.length));
      if (world.boss) questions.push(Object.assign({}, world.boss, { isBoss: true }));
    }
    const session = {
      world,
      questions,
      i: 0,
      lives: LIVES_PER_ROUND,
      correct: 0,
      streak: 0,
      gained: 0,
      wrong: [],
      isFinal: !!opts.isFinal,
      isDaily: !!opts.isDaily,
      xpMult: opts.xpMult || 1,
      startTime: Date.now(),
    };
    renderQuestion(session);
  }

  function renderQuestion(s) {
    const q = s.questions[s.i];
    const view = el("div", "view");
    view.appendChild(header());

    const bar = el("div", "qtop");
    bar.style.setProperty("--accent", s.world.color);
    bar.innerHTML = `
      <div class="lives">${"❤️".repeat(s.lives)}${"🤍".repeat(LIVES_PER_ROUND - s.lives)}</div>
      <div class="progress"><div class="pfill" style="width:${(s.i / s.questions.length) * 100}%"></div></div>
      <div class="counter">${s.i + 1}/${s.questions.length}</div>`;
    view.appendChild(bar);

    const card = el("div", "qcard");
    card.style.setProperty("--accent", s.world.color);
    if (q.isBoss) card.appendChild(el("div", "bossbanner", "🚀 Reto de lanzamiento"));
    const tag = q.isBoss
      ? "🚀 Reto de lanzamiento"
      : s.isFinal
      ? "🏆 Examen final"
      : s.isDaily
      ? "📅 Desafío diario"
      : `${s.world.icon} ${s.world.name}`;
    card.appendChild(el("div", "qtag", tag));
    card.appendChild(el("h2", "qtext", q.q));

    const type = q.type || "mc";
    if (type === "tf") renderTF(s, q, card);
    else if (type === "order") renderOrder(s, q, card);
    else if (type === "match") renderMatch(s, q, card);
    else renderMC(s, q, card);

    view.appendChild(card);
    render(view);
  }

  /* --- Renderizadores por tipo --- */

  function renderMC(s, q, card) {
    const opts = el("div", "options");
    shuffle(q.options.map((_, i) => i)).forEach((origIdx) => {
      const btn = el("button", "option", q.options[origIdx]);
      btn.onclick = () => {
        [...opts.children].forEach((b) => (b.disabled = true));
        [...opts.children].forEach((b) => {
          if (b.textContent === q.options[q.answer]) b.classList.add("correct");
        });
        const correct = origIdx === q.answer;
        if (!correct) btn.classList.add("wrong");
        afterAnswer(s, correct, q, card);
      };
      opts.appendChild(btn);
    });
    card.appendChild(opts);
  }

  function renderTF(s, q, card) {
    const wrap = el("div", "tfwrap");
    [["Verdadero", true], ["Falso", false]].forEach(([label, val]) => {
      const b = el("button", "tfbtn", label);
      b.onclick = () => {
        [...wrap.children].forEach((x) => (x.disabled = true));
        const correct = val === q.answer;
        if (correct) b.classList.add("correct");
        else {
          b.classList.add("wrong");
          [...wrap.children].forEach((x, i) => {
            if ([true, false][i] === q.answer) x.classList.add("correct");
          });
        }
        afterAnswer(s, correct, q, card);
      };
      wrap.appendChild(b);
    });
    card.appendChild(wrap);
  }

  function renderOrder(s, q, card) {
    let cur = shuffle(q.steps);
    if (cur.join("|") === q.steps.join("|")) cur = shuffle(q.steps);
    const hint = el("div", "subhint", "Ordena los pasos con ▲ ▼ y pulsa Comprobar.");
    const list = el("div", "orderlist");
    function paint() {
      list.innerHTML = "";
      cur.forEach((step, idx) => {
        const row = el("div", "orderrow");
        row.appendChild(el("span", "ordernum", String(idx + 1)));
        row.appendChild(el("span", "ordertext", step));
        const ctrls = el("div", "orderctrls");
        const up = el("button", "ordbtn", "▲");
        up.disabled = idx === 0;
        up.onclick = () => {
          [cur[idx - 1], cur[idx]] = [cur[idx], cur[idx - 1]];
          paint();
        };
        const dn = el("button", "ordbtn", "▼");
        dn.disabled = idx === cur.length - 1;
        dn.onclick = () => {
          [cur[idx + 1], cur[idx]] = [cur[idx], cur[idx + 1]];
          paint();
        };
        ctrls.appendChild(up);
        ctrls.appendChild(dn);
        row.appendChild(ctrls);
        list.appendChild(row);
      });
    }
    paint();
    card.appendChild(hint);
    card.appendChild(list);
    const check = el("button", "primary wide", "Comprobar");
    check.onclick = () => {
      const correct = cur.join("|") === q.steps.join("|");
      [...list.children].forEach((row, idx) =>
        row.classList.add(cur[idx] === q.steps[idx] ? "mok" : "mno")
      );
      list.querySelectorAll("button").forEach((b) => (b.disabled = true));
      check.remove();
      afterAnswer(s, correct, q, card);
    };
    card.appendChild(check);
  }

  function renderMatch(s, q, card) {
    const rights = shuffle(q.pairs.map((p) => p[1]));
    const sel = new Array(q.pairs.length).fill("");
    const hint = el("div", "subhint", "Elige la pareja correcta para cada elemento.");
    const wrap = el("div", "matchwrap");
    const rows = [];
    q.pairs.forEach((p, idx) => {
      const row = el("div", "matchrow");
      row.appendChild(el("span", "matchleft", p[0]));
      const s2 = document.createElement("select");
      s2.className = "matchsel";
      const o0 = document.createElement("option");
      o0.value = "";
      o0.textContent = "Elige…";
      s2.appendChild(o0);
      rights.forEach((r) => {
        const o = document.createElement("option");
        o.value = r;
        o.textContent = r;
        s2.appendChild(o);
      });
      s2.onchange = () => {
        sel[idx] = s2.value;
        check.disabled = sel.some((v) => !v);
      };
      row.appendChild(s2);
      wrap.appendChild(row);
      rows.push(row);
    });
    card.appendChild(hint);
    card.appendChild(wrap);
    const check = el("button", "primary wide", "Comprobar");
    check.disabled = true;
    check.onclick = () => {
      const correct = q.pairs.every((p, idx) => sel[idx] === p[1]);
      rows.forEach((row, idx) => {
        row.classList.add(sel[idx] === q.pairs[idx][1] ? "mok" : "mno");
        row.querySelector("select").disabled = true;
      });
      check.remove();
      afterAnswer(s, correct, q, card);
    };
    card.appendChild(check);
  }

  /* --- Resolución común --- */

  function afterAnswer(s, correct, q, card) {
    if (correct) {
      s.correct++;
      s.streak++;
      const bonus = s.streak >= 2 ? STREAK_BONUS : 0;
      const gain = (XP_PER_CORRECT + bonus) * (q.isBoss ? 2 : 1) * s.xpMult;
      s.gained += gain;
      state.xp += gain;
      beep("ok");
    } else {
      s.streak = 0;
      s.lives--;
      s.wrong.push({ q: q.q, explain: q.explain });
      beep("bad");
    }
    saveState();

    const fb = el("div", "feedback " + (correct ? "ok" : "no"));
    fb.innerHTML = `
      <strong>${correct ? "✔ ¡Correcto!" : "✘ Casi"}</strong>
      <span>${q.explain}</span>
      ${correct && s.streak >= 2 ? `<em class="streak">🔥 Racha x${s.streak} (+${STREAK_BONUS} bonus)</em>` : ""}`;
    card.appendChild(fb);

    const last = s.i >= s.questions.length - 1;
    const nextIsBoss = !last && s.questions[s.i + 1] && s.questions[s.i + 1].isBoss;
    const cont = el(
      "button",
      "primary wide",
      last ? "Ver resultados ›" : nextIsBoss ? "Continuar… ⚠️" : "Continuar ›"
    );
    cont.onclick = () => {
      if (s.lives <= 0) return renderFail(s);
      s.i++;
      if (s.i >= s.questions.length) return renderResult(s);
      if (s.questions[s.i].isBoss) return renderBossIntro(s);
      renderQuestion(s);
    };
    card.appendChild(cont);
  }

  /* ----------------------------- Interstitial del jefe -------------- */

  function renderBossIntro(s) {
    const view = el("div", "view");
    view.appendChild(header());
    const b = el("div", "bossintro");
    b.style.setProperty("--accent", s.world.color);
    b.innerHTML = `
      <div class="boss-flash">⚠️</div>
      <div class="mission-tag">Fase final del mundo</div>
      <h2>🚀 Reto de lanzamiento</h2>
      <p>Has completado el entrenamiento de <strong>${s.world.name}</strong>.
      Ahora un escenario real pone a prueba tu producto: no es teoría, es lo que
      te encontrarás construyendo de verdad.</p>
      <p class="boss-reward">Acierta y ganas <strong>XP doble</strong>. Fallar cuesta una vida, como siempre.</p>`;
    const go = el("button", "primary wide", "¡Acepto el reto! ▶");
    go.onclick = () => renderQuestion(s);
    b.appendChild(go);
    view.appendChild(b);
    render(view);
  }

  /* ----------------------------- Resumen de fallos ------------------ */

  function mistakesBlock(s) {
    if (!s.wrong.length) return null;
    const box = el("div", "mistakes");
    box.appendChild(el("h3", null, `📌 Repaso de tus ${s.wrong.length} fallo(s)`));
    s.wrong.forEach((w) => {
      const it = el("div", "mistake");
      it.innerHTML = `<div class="mq">${w.q}</div><div class="me">${w.explain}</div>`;
      box.appendChild(it);
    });
    return box;
  }

  /* ----------------------------- Racha diaria ----------------------- */

  function touchStreak() {
    const t = todayStr();
    if (state.lastActive === t) return;
    state.streakDays = state.lastActive === dayOffset(-1) ? state.streakDays + 1 : 1;
    state.lastActive = t;
  }

  /* ----------------------------- Resultados ------------------------- */

  function renderFail(s) {
    touchStreak();
    saveState();
    const view = el("div", "view");
    view.appendChild(header());
    const r = el("div", "result");
    r.innerHTML = `
      <div class="result-emoji">💔</div>
      <h2>Te quedaste sin vidas</h2>
      <p>Llegaste a la pregunta ${s.i + 1} de ${s.questions.length}. Repasa y vuelve a intentarlo.</p>`;
    const mb = mistakesBlock(s);
    if (mb) r.appendChild(mb);
    const again = el("button", "primary wide", "↺ Reintentar");
    again.onclick = () => retry(s);
    const home = el("button", "ghost wide", "Volver al mapa");
    home.onclick = renderMap;
    r.appendChild(again);
    r.appendChild(home);
    view.appendChild(r);
    render(view);
  }

  function retry(s) {
    if (s.isFinal) return renderFinal();
    if (s.isDaily) return renderDaily();
    return startRound(s.world);
  }

  function renderResult(s) {
    const pct = Math.round((s.correct / s.questions.length) * 100);
    const stars = pct === 100 ? 3 : pct >= 80 ? 2 : pct >= 60 ? 1 : 0;
    const secs = Math.round((Date.now() - s.startTime) / 1000);

    touchStreak();

    state.scores.push({
      name: state.player || "Jugador/a",
      worldId: s.world.id,
      worldName: s.world.name,
      icon: s.world.icon,
      pct,
      xp: s.gained,
      secs,
      date: todayStr(),
      final: !!s.isFinal,
    });
    if (state.scores.length > 100) state.scores = state.scores.slice(-100);

    let unlockedNext = false;
    if (s.isDaily) {
      state.dailyDone = todayStr();
    } else if (!s.isFinal) {
      const prev = state.completed[s.world.id];
      if (!prev || pct > prev.best) state.completed[s.world.id] = { best: pct, stars };
      else if (stars > prev.stars) prev.stars = stars;
      const idx = GAME_DATA.worlds.findIndex((w) => w.id === s.world.id);
      if (stars >= 1 && idx === state.unlockedIndex) {
        state.unlockedIndex = Math.min(state.unlockedIndex + 1, GAME_DATA.worlds.length - 1);
        unlockedNext = true;
      }
      if (GAME_DATA.worlds.every((w) => state.completed[w.id] && state.completed[w.id].stars >= 1))
        state.finalUnlocked = true;
    }
    saveState();

    const celebrate = stars >= 2 || (s.isFinal && pct >= 80) || (s.isDaily && pct >= 80);
    if (celebrate) confetti();

    const view = el("div", "view");
    view.appendChild(header());
    const r = el("div", "result");
    const emoji = stars === 3 ? "🏆" : stars === 2 ? "🎉" : stars >= 1 ? "👍" : "📚";
    const starStr = "★★★".slice(0, stars) + "☆☆☆".slice(0, 3 - stars);
    const title = s.isFinal
      ? "Día del lanzamiento"
      : s.isDaily
      ? "Desafío diario completado"
      : "¡Misión completada!";
    r.innerHTML = `
      <div class="result-emoji">${emoji}</div>
      <h2>${title}</h2>
      <div class="result-stars">${starStr}</div>
      <p class="big">${s.correct}/${s.questions.length} aciertos · ${pct}%</p>
      <p>+${s.gained} XP${s.isDaily ? " (x2)" : ""} · ⏱ ${fmtTime(secs)}</p>`;

    // Outcome narrativo + progreso de lanzamiento.
    if (state.storyMode && !s.isFinal && !s.isDaily && stars >= 1 && s.world.outcome) {
      const out = el("div", "outcome");
      out.innerHTML = `<div class="outcome-line">${s.world.outcome}</div>
        <div class="launch-label">🚀 Progreso de lanzamiento: ${launchPct()}%</div>
        <div class="xpbar"><div class="xpfill" style="width:${launchPct()}%"></div></div>`;
      r.appendChild(out);
    }
    if (unlockedNext) r.appendChild(el("div", "unlocked", "🔓 ¡Nueva capacidad desbloqueada!"));
    if (s.isFinal && pct >= 80)
      r.appendChild(
        el("div", "diploma", "🎓 ¡Felicidades! Tu producto está en producción. Has demostrado maestría en los cursos de Claude.")
      );

    const mb = mistakesBlock(s);
    if (mb) r.appendChild(mb);

    const home = el("button", "primary wide", "Continuar al mapa ›");
    home.onclick = renderMap;
    r.appendChild(home);

    const share = el("button", "ghost wide", "📋 Compartir mi resultado");
    share.onclick = () => doShare(s, pct, stars);
    r.appendChild(share);

    const again = el("button", "ghost wide", "↺ Reintentar");
    again.onclick = () => retry(s);
    r.appendChild(again);

    view.appendChild(r);
    render(view);
  }

  /* ----------------------------- Compartir -------------------------- */

  function doShare(s, pct, stars) {
    const starStr = stars ? "★".repeat(stars) + "☆".repeat(3 - stars) : "";
    const what = s.isFinal ? "Examen final" : s.isDaily ? "Desafío diario" : s.world.name;
    const text =
      `🎓 Claude Academy — ${what}: ${pct}% ${starStr} (+${s.gained} XP)\n` +
      `🚀 Progreso de lanzamiento: ${launchPct()}%\n` +
      `Aprendo los cursos de Claude jugando.`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => toast("¡Resultado copiado al portapapeles!"),
        () => fallbackCopy(text)
      );
    } else fallbackCopy(text);
  }
  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      toast("¡Resultado copiado!");
    } catch (e) {
      toast("Copia manual: " + text);
    }
    ta.remove();
  }

  /* ----------------------------- Puntuaciones ----------------------- */

  function renderScores() {
    const view = el("div", "view");
    view.appendChild(header());
    const box = el("div", "scorebox");
    box.appendChild(el("h2", null, "🏅 Tabla de puntuaciones"));

    const nameRow = el("div", "name-row");
    nameRow.innerHTML = `
      <label for="playerName">Tu nombre:</label>
      <input id="playerName" maxlength="20" placeholder="Jugador/a" value="${(state.player || "").replace(/"/g, "&quot;")}" />
      <button class="primary" id="saveName">Guardar</button>`;
    nameRow.querySelector("#saveName").onclick = () => {
      state.player = nameRow.querySelector("#playerName").value.trim();
      saveState();
      renderScores();
    };
    box.appendChild(nameRow);

    box.appendChild(el("h3", null, "Mejores marcas por mundo"));
    const bests = el("table", "scoretable");
    bests.innerHTML = "<tr><th>Mundo</th><th>Mejor %</th><th>Estrellas</th></tr>";
    GAME_DATA.worlds.forEach((w) => {
      const done = state.completed[w.id];
      const tr = el("tr");
      tr.innerHTML = `
        <td>${w.icon} ${w.name}</td>
        <td>${done ? done.best + "%" : "—"}</td>
        <td class="stars">${done ? "★★★".slice(0, done.stars) + "☆☆☆".slice(0, 3 - done.stars) : "—"}</td>`;
      bests.appendChild(tr);
    });
    box.appendChild(bests);

    const ranked = state.scores.slice().sort((a, b) => b.pct - a.pct || a.secs - b.secs).slice(0, 15);
    box.appendChild(el("h3", null, "Mejores rondas"));
    if (!ranked.length) {
      box.appendChild(el("p", "muted", "Aún no hay rondas. ¡Juega un mundo para estrenar la tabla!"));
    } else {
      const t = el("table", "scoretable");
      t.innerHTML =
        "<tr><th>#</th><th>Jugador/a</th><th>Mundo</th><th>%</th><th>XP</th><th>Tiempo</th></tr>";
      ranked.forEach((r, i) => {
        const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1;
        const tr = el("tr", r.final ? "finalrow" : null);
        tr.innerHTML = `
          <td>${medal}</td><td>${r.name}</td>
          <td>${r.icon} ${r.final ? "<strong>Final</strong>" : r.worldName}</td>
          <td>${r.pct}%</td><td>+${r.xp}</td><td>${fmtTime(r.secs)}</td>`;
        t.appendChild(tr);
      });
      box.appendChild(t);
    }

    const back = el("button", "primary wide", "‹ Volver al mapa");
    back.onclick = renderMap;
    box.appendChild(back);
    view.appendChild(box);
    render(view);
  }

  /* ----------------------------- Desafío diario / Final ------------- */

  function renderDaily() {
    let pool = [];
    GAME_DATA.worlds.slice(0, state.unlockedIndex + 1).forEach((w) => {
      shuffle(w.questions).slice(0, 3).forEach((q) => pool.push(q));
    });
    pool = shuffle(pool).slice(0, 5);
    const dailyWorld = { id: "daily", name: "Desafío diario", icon: "📅", color: "#c15f3c" };
    startRound(dailyWorld, { questions: pool, isDaily: true, xpMult: 2 });
  }

  function renderFinal() {
    let pool = [];
    GAME_DATA.worlds.forEach((w) => {
      shuffle(w.questions).slice(0, 2).forEach((q) => pool.push(q));
    });
    pool = shuffle(pool);
    const fakeWorld = { id: "final", name: "Examen final", icon: "🏆", color: "#d6336c" };
    startRound(fakeWorld, { questions: pool, isFinal: true });
  }

  /* ----------------------------- Init ------------------------------- */

  if (!state.introSeen) renderIntro(0);
  else renderMap();
})();
