/*
 * icons.js — Set de iconos SVG inline, estilo "línea redondeada suave"
 * (inspirado en Tabler Icons, MIT). Sin dependencias: el SVG se inyecta
 * en el HTML. Todos heredan el color del texto (currentColor) y usan
 * trazo de extremos/uniones redondeadas.
 *
 * Uso:  icon("rocket", { size: 20 })  ->  "<svg …></svg>"
 */

(function () {
  "use strict";

  const P = {
    // — UI / chrome —
    cap: '<path d="M22 9 12 5 2 9l10 4 10-4Z"/><path d="M6 10.6V16c0 1.1 2.7 2 6 2s6-.9 6-2v-5.4"/><path d="M22 9v5"/>',
    flame:
      '<path d="M12 12c2-2.96 0-7-1-8c0 3.04-1.77 4.74-3 6c-1.23 1.26-2 3.24-2 5a6 6 0 1 0 12 0c0-1.53-1.06-3.94-2-5c-1.79 3-2.79 3-4 2z"/>',
    star: '<path d="M12 17.75 5.83 21l1.18-6.87-5-4.87 6.9-1L12 2.5l3.09 6.26 6.9 1-5 4.87L18.17 21z"/>',
    volume:
      '<path d="M15 8a5 5 0 0 1 0 8"/><path d="M17.7 5a9 9 0 0 1 0 14"/><path d="M6 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2l3.5-4.5a.8.8 0 0 1 1.5.5v14a.8.8 0 0 1-1.5.5z"/>',
    volumeOff:
      '<path d="M6 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2l3.5-4.5a.8.8 0 0 1 1.5.5v6"/><path d="M11 11v8.5a.8.8 0 0 1-1.5.5L6 15"/><path d="M16 10a5 5 0 0 1 .5 6"/><path d="M3 3l18 18"/>',
    book:
      '<path d="M3 6a9 9 0 0 1 9 0 9 9 0 0 1 9 0"/><path d="M3 6v13"/><path d="M12 6v13"/><path d="M21 6v13"/><path d="M3 19a9 9 0 0 1 9 0 9 9 0 0 1 9 0"/>',
    bookOff:
      '<path d="M3 6a9 9 0 0 1 7 0"/><path d="M3 6v13a9 9 0 0 1 7 0"/><path d="M14 5.5a9 9 0 0 1 7-.5v13"/><path d="M3 3l18 18"/>',
    trophy:
      '<path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v6a5 5 0 0 1-10 0z"/><path d="M7 6H4a1 1 0 0 0-1 1c0 2 1 3 4 3"/><path d="M17 6h3a1 1 0 0 1 1 1c0 2-1 3-4 3"/>',
    rocket:
      '<path d="M4 13a8 8 0 0 1 7 7 6 6 0 0 0 3-5 9 9 0 0 0 6-8 3 3 0 0 0-3-3 9 9 0 0 0-8 6 6 6 0 0 0-5 3"/><path d="M7 14a6 6 0 0 0-3 6 6 6 0 0 0 6-3"/><circle cx="15" cy="9" r="1"/>',
    calendar:
      '<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/><path d="M4 11h16"/>',
    circleCheck: '<circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/>',
    alert:
      '<path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 4.3 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z"/>',
    check: '<path d="M5 12l5 5L20 7"/>',
    x: '<path d="M6 6l12 12"/><path d="M18 6 6 18"/>',
    bookmark: '<path d="M6 4h12a1 1 0 0 1 1 1v16l-7-4-7 4V5a1 1 0 0 1 1-1Z"/>',
    play: '<path d="M7 4v16l13-8z"/>',
    movie:
      '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 4v16"/><path d="M16 4v16"/><path d="M4 8h4"/><path d="M4 16h4"/><path d="M16 8h4"/><path d="M16 16h4"/>',
    refresh: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 4v4h4"/>',
    clipboard:
      '<rect x="8" y="4" width="8" height="4" rx="1"/><path d="M8 6H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2"/>',
    lock:
      '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',

    // — Mundos —
    seedling:
      '<path d="M12 10v11"/><path d="M12 14a6 6 0 0 0-6-6H4a6 6 0 0 0 6 6z"/><path d="M12 11a5 5 0 0 1 5-5h2a5 5 0 0 1-5 5z"/>',
    compass:
      '<circle cx="12" cy="12" r="9"/><path d="M14.5 9.5 11 11l-1.5 3.5L13 13z"/><path d="M12 3v1.5"/><path d="M12 19.5V21"/><path d="M3 12h1.5"/><path d="M19.5 12H21"/>',
    plug:
      '<path d="M9 3v5"/><path d="M15 3v5"/><path d="M7 8h10v3a5 5 0 0 1-10 0z"/><path d="M12 16v5"/>',
    pencil:
      '<path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17z"/><path d="M13.5 6.5l3 3"/>',
    robot:
      '<rect x="5" y="8" width="14" height="11" rx="2"/><path d="M12 5v3"/><circle cx="12" cy="4" r="1"/><path d="M9 13h.01"/><path d="M15 13h.01"/><path d="M9.5 16h5"/><path d="M3 13v3"/><path d="M21 13v3"/>',
    terminal:
      '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3"/><path d="M13 15h4"/>',
    link:
      '<path d="M9 15l6-6"/><path d="M11 6l.5-.5a4 4 0 0 1 5.7 5.7l-1.5 1.5"/><path d="M13 18l-.5.5a4 4 0 0 1-5.7-5.7l1.5-1.5"/>',
    cloud:
      '<path d="M7 18a4 4 0 1 1 .5-8a5 5 0 0 1 9.7 1.5A3.5 3.5 0 0 1 17 18z"/><path d="M12 16v-5"/><path d="M9.5 13.5 12 11l2.5 2.5"/>',

    // — Intro / resultados —
    building:
      '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 8h.01"/><path d="M12 8h.01"/><path d="M15 8h.01"/><path d="M9 12h.01"/><path d="M12 12h.01"/><path d="M15 12h.01"/><path d="M10 21v-4h4v4"/>',
    bulb:
      '<path d="M9 18h6"/><path d="M10 21h4"/><path d="M8.5 14a5 5 0 1 1 7 0c-.7.6-1.5 1.2-1.5 2.5h-4c0-1.3-.8-1.9-1.5-2.5Z"/>',
    map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14"/><path d="M15 6v14"/>',
    heartBroken:
      '<path d="M12 20l-7-7a4 4 0 0 1 6-5l1 1 1-1a4 4 0 0 1 6 5z"/><path d="M12 8l-2 3h4l-2 3"/>',
    thumbUp:
      '<path d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z"/><path d="M7 11l4-7a2 2 0 0 1 2 2v3h5a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 18 20H7"/>',
  };

  function icon(name, opts) {
    opts = opts || {};
    const size = opts.size || 20;
    const sw = opts.sw || 2;
    const fill = opts.fill ? "currentColor" : "none";
    const cls = "ic" + (opts.cls ? " " + opts.cls : "");
    const body = P[name] || "";
    return (
      `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" ` +
      `fill="${fill}" stroke="currentColor" stroke-width="${sw}" ` +
      `stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`
    );
  }

  if (typeof window !== "undefined") {
    window.icon = icon;
    window.ICON_NAMES = Object.keys(P);
  }
})();
