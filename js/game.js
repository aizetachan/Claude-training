/*
 * game.js — Motor del juego "Claude Academy".
 *
 * Mecánicas:
 *  - Cada mundo se juega como: tarjetas de lección → ronda de preguntas.
 *  - Aciertos otorgan XP; las rachas (streaks) dan bonus.
 *  - Tienes 3 vidas (corazones) por ronda; al quedarte sin vidas, repites.
 *  - Completar un mundo desbloquea el siguiente y otorga un badge.
 *  - El progreso se guarda en localStorage.
 *  - Al terminar todos los mundos se desbloquea el "Examen final" mezclado.
 */

(function () {
  "use strict";

  const STORAGE_KEY = "claude-academy-save-v1";
  const LIVES_PER_ROUND = 3;
  const XP_PER_CORRECT = 10;
  const STREAK_BONUS = 5; // bonus extra a partir de 2 aciertos seguidos.

  /* ----------------------------- Estado ----------------------------- */

  const defaultState = () => ({
    xp: 0,
    completed: {}, // worldId -> { best: %, stars: n }
    unlockedIndex: 0, // índice del mundo más alto desbloueado
    finalUnlocked: false,
  });

  let state = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return Object.assign(defaultState(), JSON.parse(raw));
    } catch (e) {
      /* ignore */
    }
    return defaultState();
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* ignore */
    }
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

  function level(xp) {
    // Nivel crece cada 100 XP, con títulos temáticos.
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
    const title = titles[Math.min(lvl - 1, titles.length - 1)];
    return { lvl, title, into: xp % 100 };
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
    h.innerHTML = `
      <div class="brand" id="homeBtn">🎓 <span>Claude Academy</span></div>
      <div class="stats">
        <div class="chip" title="Experiencia">⭐ ${state.xp} XP</div>
        <div class="chip" title="Nivel">Lv.${lv.lvl} · ${lv.title}</div>
      </div>`;
    h.querySelector("#homeBtn").onclick = renderMap;
    return h;
  }

  /* ----------------------------- Mapa / Home ------------------------ */

  function renderMap() {
    const view = el("div", "view");
    view.appendChild(header());

    const lv = level(state.xp);
    const hero = el("div", "hero");
    hero.innerHTML = `
      <h1>${GAME_DATA.meta.title}</h1>
      <p>${GAME_DATA.meta.subtitle}</p>
      <div class="xpbar"><div class="xpfill" style="width:${lv.into}%"></div></div>
      <small>${lv.into}/100 XP hacia el siguiente nivel</small>`;
    view.appendChild(hero);

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
      if (unlocked) card.onclick = () => renderLessons(w);
      grid.appendChild(card);
    });
    view.appendChild(grid);

    // Examen final.
    const finalCard = el(
      "div",
      "card final" + (state.finalUnlocked ? "" : " locked")
    );
    finalCard.style.setProperty("--accent", "#d6336c");
    finalCard.innerHTML = `
      <div class="card-icon">${state.finalUnlocked ? "🏆" : "🔒"}</div>
      <div class="card-body">
        <h3>Examen final: Maestría Claude</h3>
        <p>${state.finalUnlocked ? "Preguntas mezcladas de todos los mundos. ¡Demuestra tu maestría!" : "Completa todos los mundos para desbloquearlo."}</p>
      </div>`;
    if (state.finalUnlocked) finalCard.onclick = renderFinal;
    view.appendChild(finalCard);

    const reset = el("button", "reset", "↺ Reiniciar progreso");
    reset.onclick = () => {
      if (confirm("¿Borrar todo tu progreso?")) {
        state = defaultState();
        saveState();
        renderMap();
      }
    };
    view.appendChild(reset);

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
    back.onclick = () => (idx === 0 ? renderMap() : renderLessons(world, idx - 1));
    const next = el(
      "button",
      "primary",
      idx === world.lessons.length - 1 ? "¡A jugar! ▶" : "Siguiente ›"
    );
    next.onclick = () =>
      idx === world.lessons.length - 1
        ? startRound(world)
        : renderLessons(world, idx + 1);
    nav.appendChild(back);
    nav.appendChild(next);
    wrap.appendChild(nav);

    // Dots de progreso.
    const dots = el("div", "dots");
    world.lessons.forEach((_, i) => {
      const d = el("span", "dot" + (i === idx ? " on" : ""));
      dots.appendChild(d);
    });
    wrap.appendChild(dots);

    view.appendChild(wrap);
    render(view);
  }

  /* ----------------------------- Ronda de preguntas ----------------- */

  function startRound(world, opts) {
    opts = opts || {};
    const questions = shuffle(opts.questions || world.questions);
    const session = {
      world,
      questions,
      i: 0,
      lives: LIVES_PER_ROUND,
      correct: 0,
      streak: 0,
      gained: 0,
      isFinal: !!opts.isFinal,
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
    card.appendChild(el("div", "qtag", `${s.world.icon} ${s.isFinal ? "Examen final" : s.world.name}`));
    card.appendChild(el("h2", "qtext", q.q));

    const opts = el("div", "options");
    // Barajamos las opciones manteniendo el índice correcto.
    const order = shuffle(q.options.map((_, i) => i));
    order.forEach((origIdx) => {
      const btn = el("button", "option", q.options[origIdx]);
      btn.onclick = () => answer(s, q, origIdx, btn, opts, card);
      opts.appendChild(btn);
    });
    card.appendChild(opts);
    view.appendChild(card);
    render(view);
  }

  function answer(s, q, chosen, btn, optsWrap, card) {
    // Bloquear más clics.
    [...optsWrap.children].forEach((b, i) => {
      b.disabled = true;
      b.onclick = null;
    });
    const correct = chosen === q.answer;

    // Marcar visualmente.
    [...optsWrap.children].forEach((b) => {
      if (b.textContent === q.options[q.answer]) b.classList.add("correct");
    });
    if (!correct) btn.classList.add("wrong");

    if (correct) {
      s.correct++;
      s.streak++;
      let gain = XP_PER_CORRECT + (s.streak >= 2 ? STREAK_BONUS : 0);
      s.gained += gain;
      state.xp += gain;
    } else {
      s.streak = 0;
      s.lives--;
    }
    saveState();

    // Explicación.
    const fb = el(
      "div",
      "feedback " + (correct ? "ok" : "no")
    );
    fb.innerHTML = `
      <strong>${correct ? "✔ ¡Correcto!" : "✘ Casi"}</strong>
      <span>${q.explain}</span>
      ${s.streak >= 2 && correct ? `<em class="streak">🔥 Racha x${s.streak} (+${STREAK_BONUS} bonus)</em>` : ""}`;
    card.appendChild(fb);

    const cont = el("button", "primary wide", "Continuar ›");
    cont.onclick = () => {
      if (s.lives <= 0) return renderFail(s);
      s.i++;
      if (s.i >= s.questions.length) return renderResult(s);
      renderQuestion(s);
    };
    card.appendChild(cont);
  }

  /* ----------------------------- Resultados ------------------------- */

  function renderFail(s) {
    const view = el("div", "view");
    view.appendChild(header());
    const r = el("div", "result");
    r.innerHTML = `
      <div class="result-emoji">💔</div>
      <h2>Te quedaste sin vidas</h2>
      <p>Llegaste a la pregunta ${s.i + 1} de ${s.questions.length}. ¡Repasa las lecciones y vuelve a intentarlo!</p>`;
    const again = el("button", "primary wide", "↺ Reintentar");
    again.onclick = () => (s.isFinal ? renderFinal() : startRound(s.world));
    const home = el("button", "ghost wide", "Volver al mapa");
    home.onclick = renderMap;
    r.appendChild(again);
    r.appendChild(home);
    view.appendChild(r);
    render(view);
  }

  function renderResult(s) {
    const pct = Math.round((s.correct / s.questions.length) * 100);
    const stars = pct === 100 ? 3 : pct >= 80 ? 2 : pct >= 60 ? 1 : 0;

    if (!s.isFinal) {
      // Guardar mejor resultado y desbloquear siguiente.
      const prev = state.completed[s.world.id];
      if (!prev || pct > prev.best) {
        state.completed[s.world.id] = { best: pct, stars };
      } else if (stars > prev.stars) {
        prev.stars = stars;
      }
      const idx = GAME_DATA.worlds.findIndex((w) => w.id === s.world.id);
      if (stars >= 1 && idx === state.unlockedIndex) {
        state.unlockedIndex = Math.min(
          state.unlockedIndex + 1,
          GAME_DATA.worlds.length - 1
        );
      }
      // ¿Todos completados con al menos 1 estrella?
      const allDone = GAME_DATA.worlds.every(
        (w) => state.completed[w.id] && state.completed[w.id].stars >= 1
      );
      if (allDone) state.finalUnlocked = true;
      saveState();
    }

    const view = el("div", "view");
    view.appendChild(header());
    const r = el("div", "result");
    const emoji = stars === 3 ? "🏆" : stars === 2 ? "🎉" : stars >= 1 ? "👍" : "📚";
    const starStr = "★★★".slice(0, stars) + "☆☆☆".slice(0, 3 - stars);
    r.innerHTML = `
      <div class="result-emoji">${emoji}</div>
      <h2>${s.isFinal ? "Examen final completado" : "¡Mundo completado!"}</h2>
      <div class="result-stars">${starStr}</div>
      <p class="big">${s.correct}/${s.questions.length} aciertos · ${pct}%</p>
      <p>+${s.gained} XP ganados${stars >= 1 && !s.isFinal ? " · siguiente mundo desbloqueado 🔓" : ""}</p>`;

    if (s.isFinal && pct >= 80) {
      r.appendChild(
        el(
          "div",
          "diploma",
          "🎓 ¡Felicidades! Has demostrado maestría en los cursos de Claude."
        )
      );
    }

    const again = el("button", "ghost wide", "↺ Reintentar");
    again.onclick = () => (s.isFinal ? renderFinal() : startRound(s.world));
    const home = el("button", "primary wide", "Continuar al mapa ›");
    home.onclick = renderMap;
    r.appendChild(home);
    r.appendChild(again);
    view.appendChild(r);
    render(view);
  }

  /* ----------------------------- Examen final ----------------------- */

  function renderFinal() {
    // Toma 2 preguntas al azar de cada mundo.
    let pool = [];
    GAME_DATA.worlds.forEach((w) => {
      const picks = shuffle(w.questions).slice(0, 2);
      picks.forEach((q) => pool.push(Object.assign({}, q)));
      // Adjuntar referencia al mundo para mostrar icono/color.
    });
    pool = shuffle(pool);
    const fakeWorld = {
      id: "final",
      name: "Examen final",
      icon: "🏆",
      color: "#d6336c",
    };
    startRound(fakeWorld, { questions: pool, isFinal: true });
  }

  /* ----------------------------- Init ------------------------------- */

  renderMap();
})();
