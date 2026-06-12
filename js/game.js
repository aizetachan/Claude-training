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
  const PERFECT_BONUS = 20; // XP extra por terminar una ronda sin perder vidas.
  const LIFE_BONUS = 5; // XP por cada vida que sobra al acabar.

  // Layout del mapa de mundos: "route" (sendero) o "grid" (tarjetas).
  // Cambia a "grid" para revertir al diseño anterior en un solo sitio.
  const MAP_LAYOUT = "route";

  /* Logros: cada uno se evalúa contra el estado global. */
  const ACHIEVEMENTS = [
    { id: "first", icon: "rocket", name: "Primer despegue", desc: "Completa tu primera misión.", has: (s) => Object.keys(s.completed).length >= 1 },
    { id: "perfect", icon: "heart", name: "Sin un rasguño", desc: "Termina una misión sin perder vidas.", has: (s) => Object.keys(s.perfectWorlds).length >= 1 },
    { id: "boss1", icon: "alert", name: "Cazador de retos", desc: "Supera tu primer reto de lanzamiento.", has: (s) => Object.keys(s.bossWins).length >= 1 },
    { id: "streak3", icon: "flame", name: "En racha", desc: "Juega 3 días seguidos.", has: (s) => s.streakDays >= 3 },
    { id: "streak7", icon: "bolt", name: "Imparable", desc: "Juega 7 días seguidos.", has: (s) => s.streakDays >= 7 },
    { id: "daily3", icon: "calendar", name: "Constante", desc: "Completa 3 desafíos diarios.", has: (s) => s.dailyCount >= 3 },
    { id: "explorer", icon: "map", name: "Producto completo", desc: "Completa los 8 mundos.", has: (s) => GAME_DATA.worlds.every((w) => s.completed[w.id]) },
    { id: "bossall", icon: "target", name: "Mata-jefes", desc: "Supera los 8 retos de lanzamiento.", has: (s) => Object.keys(s.bossWins).length >= GAME_DATA.worlds.length },
    { id: "graduate", icon: "cap", name: "Graduado/a", desc: "Aprueba el examen final.", has: (s) => s.finalPassed },
    { id: "mastery", icon: "trophy", name: "Maestría total", desc: "Logra 3 estrellas en los 8 mundos.", has: (s) => GAME_DATA.worlds.every((w) => s.completed[w.id] && s.completed[w.id].stars === 3) },
  ];

  function checkAchievements() {
    const newly = [];
    ACHIEVEMENTS.forEach((a) => {
      if (!state.achievements.includes(a.id) && a.has(state)) {
        state.achievements.push(a.id);
        newly.push(a);
      }
    });
    if (newly.length) saveState();
    return newly;
  }

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
    achievements: [], // ids de logros desbloqueados
    bossWins: {}, // worldId -> true (reto de lanzamiento superado)
    perfectWorlds: {}, // worldId -> true (ronda sin perder vidas)
    dailyCount: 0, // desafíos diarios completados
    finalPassed: false, // examen final superado (>=80%)
    firstPlay: "", // YYYY-MM-DD del primer día jugado (el diario sale al día siguiente)
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

  // Contador que sube de `from` a `to` animado.
  function animateCount(node, from, to, dur, prefix, suffix) {
    prefix = prefix || "";
    suffix = suffix || "";
    const start = performance.now();
    function step(now) {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      node.textContent = prefix + Math.round(from + (to - from) * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // "+X" flotante que sube y se desvanece sobre un elemento ancla.
  function floatXp(anchor, amount) {
    if (!anchor || !anchor.getBoundingClientRect) return;
    const rect = anchor.getBoundingClientRect();
    const f = el("div", "floatxp", "+" + amount);
    f.style.left = rect.right - 24 + "px";
    f.style.top = rect.top + 8 + "px";
    document.body.appendChild(f);
    setTimeout(() => f.classList.add("go"), 10);
    setTimeout(() => f.remove(), 900);
  }

  // Celebra logros recién desbloqueados (toast en cadena).
  function celebrateAchievements(list) {
    list.forEach((a, i) => {
      setTimeout(() => toast(icon("award", { size: 16 }) + " Logro: " + a.name), 600 + i * 1400);
    });
  }

  /* ----------------------------- Navegación ------------------------- */

  const app = $("#app");
  function render(view) {
    app.innerHTML = "";
    app.appendChild(view);
    window.scrollTo(0, 0);
  }

  // Chip que sirve de dos cosas: muestra el nivel y se rellena (naranja Claude)
  // con el progreso de XP hacia el siguiente nivel. El texto sobre la zona
  // rellenada se ve en blanco.
  function xpChipHtml() {
    const lv = level(state.xp);
    const pct = lv.into; // 0..99
    const label = `Lv.${lv.lvl}`;
    return `<div class="xpchip" id="xpChip" title="Nivel ${lv.lvl}: ${lv.title} · ${pct}/100 XP">
        <div class="xpchip-fill" style="width:${pct}%"></div>
        <span class="xpchip-lbl">${label}</span>
        <span class="xpchip-lbl white" style="clip-path:inset(0 ${100 - pct}% 0 0)">${label}</span>
      </div>`;
  }

  // Actualiza la chip de XP en vivo (sin re-renderizar la cabecera).
  function updateXpChip() {
    const chip = document.querySelector("#xpChip");
    if (!chip) return;
    const lv = level(state.xp);
    const pct = lv.into;
    const label = `Lv.${lv.lvl}`;
    const fill = chip.querySelector(".xpchip-fill");
    const base = chip.querySelector(".xpchip-lbl:not(.white)");
    const white = chip.querySelector(".xpchip-lbl.white");
    const leveled = base && base.textContent.trim() !== label;
    chip.title = `Nivel ${lv.lvl}: ${lv.title} · ${pct}/100 XP`;
    if (leveled) {
      // Se llena del todo, sube de nivel y se reinicia.
      fill.style.width = "100%";
      white.style.clipPath = "inset(0 0 0 0)";
      setTimeout(() => {
        base.textContent = label;
        white.textContent = label;
        fill.style.transition = "none";
        white.style.transition = "none";
        fill.style.width = "0%";
        white.style.clipPath = "inset(0 100% 0 0)";
        requestAnimationFrame(() => {
          fill.style.transition = "";
          white.style.transition = "";
          fill.style.width = pct + "%";
          white.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
        });
        toast(icon("bolt", { size: 16 }) + ` ¡Nivel ${lv.lvl}: ${lv.title}!`);
        confetti();
      }, 520);
    } else {
      fill.style.width = pct + "%";
      white.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    }
  }

  function header() {
    const h = el("div", "topbar");
    const streakChip =
      state.streakDays > 0
        ? `<div class="chip" title="Días seguidos jugando">${icon("flame", { size: 15 })} ${state.streakDays}</div>`
        : "";
    h.innerHTML = `
      <div class="brand" id="homeBtn">${icon("cap", { size: 22 })} <span>Claude Academy</span></div>
      <div class="stats">
        ${streakChip}
        ${xpChipHtml()}
        <div class="chip link" id="soundBtn" title="Sonido">${icon(state.muted ? "volumeOff" : "volume", { size: 16 })}</div>
        <div class="chip link" id="storyBtn" title="Modo historia">${icon(state.storyMode ? "book" : "bookOff", { size: 16 })}</div>
        <div class="chip link" id="scoresBtn" title="Puntuaciones">${icon("trophy", { size: 16 })}</div>
      </div>`;
    h.querySelector("#homeBtn").onclick = renderMap;
    h.querySelector("#scoresBtn").onclick = renderScores;
    h.querySelector("#soundBtn").onclick = function () {
      state.muted = !state.muted;
      saveState();
      this.innerHTML = icon(state.muted ? "volumeOff" : "volume", { size: 16 });
      if (!state.muted) beep("ok");
    };
    h.querySelector("#storyBtn").onclick = function () {
      state.storyMode = !state.storyMode;
      saveState();
      this.innerHTML = icon(state.storyMode ? "book" : "bookOff", { size: 16 });
      toast(state.storyMode ? "Modo historia activado" : "Modo historia desactivado");
    };
    return h;
  }

  /* ----------------------------- Cinemática de inicio --------------- */

  const INTRO_SLIDES = [
    {
      icon: "building",
      title: "Bienvenido/a al estudio",
      text: "Las mejores ideas de hoy se construyen con IA. Acabas de unirte como builder a un pequeño estudio con una gran ambición.",
    },
    {
      icon: "bulb",
      title: "Tu misión",
      text: "Construir y LANZAR tu propio producto de IA: un asistente que hable, responda con precisión, use herramientas y llegue a producción.",
    },
    {
      icon: "map",
      title: "El camino",
      text: "Cada mundo te entrena en una capacidad real de Claude: entender el modelo, la API, RAG, agentes, Claude Code, MCP… Las mismas que usan los equipos profesionales.",
    },
    {
      icon: "rocket",
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
      <div class="cine-icon">${icon(slide.icon, { size: 64 })}</div>
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
    // Marca el primer día jugado (el desafío diario se desbloquea al siguiente).
    if (!state.firstPlay) {
      state.firstPlay = todayStr();
      saveState();
    }
    const view = el("div", "view");
    view.appendChild(header());

    const lv = level(state.xp);
    const hero = el("div", "hero");
    const lp = launchPct();
    const progressBlock = state.storyMode
      ? `<div class="launch">
           <div class="launch-label">${icon("rocket", { size: 16 })} Progreso de lanzamiento de tu producto</div>
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

    // Desafío diario: se desbloquea al día siguiente del primer juego.
    const daily = el("div", "daily");
    const doneToday = state.dailyDone === todayStr();
    const available = state.firstPlay && todayStr() > state.firstPlay;
    if (!available) {
      daily.classList.add("soft");
      daily.innerHTML = `<span>${icon("calendar", { size: 18 })} El desafío diario se desbloquea mañana.</span>`;
    } else if (doneToday) {
      daily.innerHTML = `<span>${icon("circleCheck", { size: 18 })} Desafío diario completado hoy. ¡Vuelve mañana!</span>`;
    } else {
      daily.innerHTML = `<div><strong>${icon("calendar", { size: 18 })} Desafío diario</strong><br><small>5 preguntas mezcladas · XP x2</small></div>`;
      const b = el("button", "primary", "Jugar ›");
      b.onclick = renderDaily;
      daily.appendChild(b);
    }
    view.appendChild(daily);

    view.appendChild(MAP_LAYOUT === "route" ? worldsRoute() : worldsGrid());

    const foot = el("div", "mapfoot");
    const replay = el("button", "reset", icon("movie", { size: 15 }) + " Ver intro");
    replay.onclick = () => renderIntro(0);
    const reset = el("button", "reset", icon("refresh", { size: 15 }) + " Reiniciar progreso");
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

  // Layout clásico: rejilla de tarjetas (revertir cambiando MAP_LAYOUT).
  function worldsGrid() {
    const grid = el("div", "grid");
    GAME_DATA.worlds.forEach((w, i) => {
      const done = state.completed[w.id];
      const unlocked = i <= state.unlockedIndex;
      const card = el("div", "card" + (unlocked ? "" : " locked"));
      card.style.setProperty("--accent", w.color);
      const stars = done ? "★★★".slice(0, done.stars) + "☆☆☆".slice(0, 3 - done.stars) : "";
      card.innerHTML = `
        <div class="card-icon">${unlocked ? icon(w.icon, { size: 44 }) : icon("lock", { size: 40 })}</div>
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
      <div class="card-icon">${state.finalUnlocked ? icon("trophy", { size: 44 }) : icon("lock", { size: 40 })}</div>
      <div class="card-body">
        <h3>Día del lanzamiento: Examen final</h3>
        <p>${state.finalUnlocked ? "Preguntas mezcladas de todos los mundos. ¡Demuestra que tu producto está listo!" : "Completa los 8 mundos para desbloquearlo."}</p>
      </div>`;
    if (state.finalUnlocked) finalCard.onclick = renderFinal;
    grid.appendChild(finalCard);
    return grid;
  }

  // Layout sendero: paradas conectadas hacia el lanzamiento.
  function worldsRoute() {
    const route = el("div", "route");
    route.appendChild(el("div", "route-end route-top", icon("flag", { size: 16 }) + " Inicio"));

    GAME_DATA.worlds.forEach((w, i) => {
      const done = state.completed[w.id];
      const unlocked = i <= state.unlockedIndex;
      const stop = el(
        "div",
        "stop " + (i % 2 ? "right" : "left") + (unlocked ? "" : " locked") + (done ? " done" : "")
      );
      stop.style.setProperty("--accent", w.color);
      const stars = done ? "★★★".slice(0, done.stars) + "☆☆☆".slice(0, 3 - done.stars) : "";
      const status = done
        ? `<span class="stars">${stars}</span> <span class="pct">${done.best}%</span>`
        : unlocked
        ? "Disponible"
        : "Bloqueado";
      stop.innerHTML = `
        <div class="stop-node">${unlocked ? icon(w.icon, { size: 26 }) : icon("lock", { size: 22 })}</div>
        <div class="stop-card">
          <h3>${i + 1}. ${w.name}</h3>
          <div class="stop-status">${status}</div>
        </div>`;
      if (unlocked) stop.onclick = () => enterWorld(w);
      route.appendChild(stop);
    });

    const fin = el("div", "stop final " + (state.finalUnlocked ? "" : "locked"));
    fin.style.setProperty("--accent", "#d6336c");
    fin.innerHTML = `
      <div class="stop-node big">${state.finalUnlocked ? icon("rocket", { size: 30 }) : icon("lock", { size: 24 })}</div>
      <div class="stop-card">
        <h3>Día del lanzamiento</h3>
        <div class="stop-status">${state.finalUnlocked ? "Examen final disponible" : "Completa los 8 mundos"}</div>
      </div>`;
    if (state.finalUnlocked) fin.onclick = renderFinal;
    route.appendChild(fin);
    return route;
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
      <div class="mission-icon">${icon(world.icon, { size: 52 })}</div>
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
      <div class="lesson-tag">${icon(world.icon, { size: 15 })} ${world.name} · Lección ${idx + 1}/${world.lessons.length}</div>
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
    const hearts =
      icon("heart", { size: 18, fill: true, cls: "hp-on" }).repeat(s.lives) +
      icon("heart", { size: 18, cls: "hp-off" }).repeat(LIVES_PER_ROUND - s.lives);
    bar.innerHTML = `
      <div class="lives">${hearts}</div>
      <div class="progress"><div class="pfill" style="width:${(s.i / s.questions.length) * 100}%"></div></div>
      <div class="counter">${s.i + 1}/${s.questions.length}</div>`;
    view.appendChild(bar);

    const card = el("div", "qcard");
    card.style.setProperty("--accent", s.world.color);
    if (q.isBoss)
      card.appendChild(el("div", "bossbanner", icon("rocket", { size: 15 }) + " Reto de lanzamiento"));
    const tag = q.isBoss
      ? icon("rocket", { size: 16 }) + " Reto de lanzamiento"
      : s.isFinal
      ? icon("trophy", { size: 16 }) + " Examen final"
      : s.isDaily
      ? icon("calendar", { size: 16 }) + " Desafío diario"
      : `${icon(s.world.icon, { size: 16 })} ${s.world.name}`;
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
      if (q.isBoss && !s.isFinal && !s.isDaily) state.bossWins[s.world.id] = true;
      beep("ok");
      floatXp(card, gain);
      updateXpChip();
    } else {
      s.streak = 0;
      s.lives--;
      s.wrong.push({ q: q.q, explain: q.explain });
      beep("bad");
    }
    saveState();

    const fb = el("div", "feedback " + (correct ? "ok" : "no"));
    fb.innerHTML = `
      <strong>${icon(correct ? "check" : "x", { size: 17 })} ${correct ? "¡Correcto!" : "Casi"}</strong>
      <span>${q.explain}</span>
      ${correct && s.streak >= 2 ? `<em class="streak">${icon("flame", { size: 14 })} Racha x${s.streak} (+${STREAK_BONUS} bonus)</em>` : ""}`;
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
      <div class="boss-flash">${icon("alert", { size: 56 })}</div>
      <div class="mission-tag">Fase final del mundo</div>
      <h2>${icon("rocket", { size: 30 })} Reto de lanzamiento</h2>
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
    box.appendChild(el("h3", null, `${icon("bookmark", { size: 15 })} Repaso de tus ${s.wrong.length} fallo(s)`));
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
    const newAchievements = checkAchievements();
    const view = el("div", "view");
    view.appendChild(header());
    const r = el("div", "result");
    r.innerHTML = `
      <div class="result-emoji sad">${icon("heartBroken", { size: 56 })}</div>
      <h2>Te quedaste sin vidas</h2>
      <p>Llegaste a la pregunta ${s.i + 1} de ${s.questions.length}. Repasa y vuelve a intentarlo.</p>`;
    const mb = mistakesBlock(s);
    if (mb) r.appendChild(mb);
    const again = el("button", "primary wide", icon("refresh", { size: 16 }) + " Reintentar");
    again.onclick = () => retry(s);
    const home = el("button", "ghost wide", "Volver al mapa");
    home.onclick = renderMap;
    r.appendChild(again);
    r.appendChild(home);
    view.appendChild(r);
    render(view);
    if (newAchievements.length) celebrateAchievements(newAchievements);
  }

  function retry(s) {
    if (s.isFinal) return renderFinal();
    if (s.isDaily) return renderDaily();
    return startRound(s.world);
  }

  function renderResult(s) {
    const prevLaunch = launchPct();
    const pct = Math.round((s.correct / s.questions.length) * 100);
    const stars = pct === 100 ? 3 : pct >= 80 ? 2 : pct >= 60 ? 1 : 0;
    const secs = Math.round((Date.now() - s.startTime) / 1000);

    // Bonus por vidas: ronda perfecta (sin fallos) + XP por vida restante.
    const isPerfect = s.wrong.length === 0 && s.lives === LIVES_PER_ROUND;
    const lifeBonus = s.lives * LIFE_BONUS + (isPerfect ? PERFECT_BONUS : 0);
    if (lifeBonus > 0) {
      s.gained += lifeBonus;
      state.xp += lifeBonus;
    }

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
      if (state.dailyDone !== todayStr()) state.dailyCount++;
      state.dailyDone = todayStr();
    } else if (s.isFinal) {
      if (pct >= 80) state.finalPassed = true;
    } else {
      const prev = state.completed[s.world.id];
      if (!prev || pct > prev.best) state.completed[s.world.id] = { best: pct, stars };
      else if (stars > prev.stars) prev.stars = stars;
      if (isPerfect) state.perfectWorlds[s.world.id] = true;
      const idx = GAME_DATA.worlds.findIndex((w) => w.id === s.world.id);
      if (stars >= 1 && idx === state.unlockedIndex) {
        state.unlockedIndex = Math.min(state.unlockedIndex + 1, GAME_DATA.worlds.length - 1);
        unlockedNext = true;
      }
      if (GAME_DATA.worlds.every((w) => state.completed[w.id] && state.completed[w.id].stars >= 1))
        state.finalUnlocked = true;
    }
    saveState();
    const newAchievements = checkAchievements();

    const celebrate = stars >= 2 || (s.isFinal && pct >= 80) || (s.isDaily && pct >= 80);
    if (celebrate) confetti();

    const view = el("div", "view");
    view.appendChild(header());
    const r = el("div", "result");
    const emojiName = stars === 3 ? "trophy" : stars === 2 ? "star" : stars >= 1 ? "thumbUp" : "book";
    const emoji = icon(emojiName, { size: 56, fill: stars === 2 });
    const starStr =
      [0, 1, 2].map((i) => icon("star", { size: 26, fill: i < stars, cls: i < stars ? "st-on" : "st-off" })).join("");
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
      <p><span class="xpgain" id="xpGain">+0 XP</span>${s.isDaily ? " (x2)" : ""} · ⏱ ${fmtTime(secs)}</p>`;

    if (isPerfect)
      r.appendChild(el("div", "perfect", icon("heart", { size: 16, fill: true }) + ` ¡Ronda perfecta! +${PERFECT_BONUS} XP de bonus`));
    else if (lifeBonus > 0)
      r.appendChild(el("div", "perfect soft", icon("heart", { size: 16, fill: true }) + ` +${lifeBonus} XP por vidas restantes`));

    // Outcome narrativo + progreso de lanzamiento (barra animada).
    let launchFill = null;
    if (state.storyMode && !s.isFinal && !s.isDaily && stars >= 1 && s.world.outcome) {
      const out = el("div", "outcome");
      out.innerHTML = `<div class="outcome-line">${s.world.outcome}</div>
        <div class="launch-label">${icon("rocket", { size: 16 })} Progreso de lanzamiento: <span id="launchNum">${prevLaunch}</span>%</div>
        <div class="xpbar"><div class="xpfill" id="launchFill" style="width:${prevLaunch}%"></div></div>`;
      r.appendChild(out);
      launchFill = out;
    }
    if (unlockedNext)
      r.appendChild(el("div", "unlocked", icon("circleCheck", { size: 16 }) + " ¡Nueva capacidad desbloqueada!"));
    if (s.isFinal && pct >= 80)
      r.appendChild(
        el(
          "div",
          "diploma",
          icon("cap", { size: 20 }) +
            " ¡Felicidades! Tu producto está en producción. Has demostrado maestría en los cursos de Claude."
        )
      );

    const mb = mistakesBlock(s);
    if (mb) r.appendChild(mb);

    const home = el("button", "primary wide", "Continuar al mapa ›");
    home.onclick = renderMap;
    r.appendChild(home);

    const share = el("button", "ghost wide", icon("clipboard", { size: 16 }) + " Compartir mi resultado");
    share.onclick = () => doShare(s, pct, stars);
    r.appendChild(share);

    const again = el("button", "ghost wide", icon("refresh", { size: 16 }) + " Reintentar");
    again.onclick = () => retry(s);
    r.appendChild(again);

    view.appendChild(r);
    render(view);

    // Animaciones de recompensa.
    const xpNode = document.querySelector("#xpGain");
    if (xpNode) animateCount(xpNode, 0, s.gained, 900, "+", " XP");
    const newLaunch = launchPct();
    if (launchFill && newLaunch !== prevLaunch) {
      const fill = document.querySelector("#launchFill");
      const num = document.querySelector("#launchNum");
      setTimeout(() => {
        if (fill) fill.style.width = newLaunch + "%";
        if (num) animateCount(num, prevLaunch, newLaunch, 800, "", "");
      }, 350);
    }

    // Celebrar logros recién desbloqueados.
    if (newAchievements.length) {
      if (!celebrate) confetti();
      celebrateAchievements(newAchievements);
    }
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
    box.appendChild(el("h2", null, icon("trophy", { size: 26 }) + " Tu progreso"));

    // Logros.
    const unlockedCount = state.achievements.length;
    box.appendChild(
      el("h3", null, `${icon("award", { size: 15 })} Logros (${unlockedCount}/${ACHIEVEMENTS.length})`)
    );
    const badges = el("div", "badges");
    ACHIEVEMENTS.forEach((a) => {
      const got = state.achievements.includes(a.id);
      const b = el("div", "badge" + (got ? "" : " locked"));
      b.innerHTML = `
        <div class="badge-ic">${icon(got ? a.icon : "lock", { size: 24 })}</div>
        <div class="badge-name">${a.name}</div>
        <div class="badge-desc">${a.desc}</div>`;
      badges.appendChild(b);
    });
    box.appendChild(badges);

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
        <td>${icon(w.icon, { size: 15 })} ${w.name}</td>
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
          <td>${icon(r.icon || "trophy", { size: 15 })} ${r.final ? "<strong>Final</strong>" : r.worldName}</td>
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
    const dailyWorld = { id: "daily", name: "Desafío diario", icon: "calendar", color: "#c15f3c" };
    startRound(dailyWorld, { questions: pool, isDaily: true, xpMult: 2 });
  }

  function renderFinal() {
    let pool = [];
    GAME_DATA.worlds.forEach((w) => {
      shuffle(w.questions).slice(0, 2).forEach((q) => pool.push(q));
    });
    pool = shuffle(pool);
    const fakeWorld = { id: "final", name: "Examen final", icon: "trophy", color: "#d6336c" };
    startRound(fakeWorld, { questions: pool, isFinal: true });
  }

  /* ----------------------------- Init ------------------------------- */

  if (!state.introSeen) renderIntro(0);
  else renderMap();
})();
