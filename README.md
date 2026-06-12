# 🎓 Claude Academy

Un juego educativo para **aprender todos los cursos de Claude jugando**. Avanzas
por "mundos" temáticos, lees lecciones breves y respondes preguntas para ganar
XP, subir de nivel y desbloquear el examen final.

Contenido basado en el catálogo oficial de
[cursos de Claude](https://claude.com/resources/courses).

## 🕹️ Cómo jugar

No necesita instalación ni dependencias. Abre el juego de una de estas formas:

```bash
# Opción A: abrir el archivo directamente
xdg-open index.html      # Linux
open index.html          # macOS

# Opción B: servidor local (recomendado)
python3 -m http.server 8000
# luego visita http://localhost:8000
```

## 🗺️ Mundos (cubren todo el catálogo de cursos)

| # | Mundo | Cursos que cubre |
|---|-------|------------------|
| 1 | 🌱 Fundamentos de Claude | Claude 101 · AI Capabilities and Limitations |
| 2 | 🧭 AI Fluency: el marco 4D | AI Fluency (Framework, Students, Educators, Business, Nonprofits) |
| 3 | 🔌 Construir con la Claude API | Building with the Claude API · Claude Platform 101 |
| 4 | ⌨️ Claude Code en acción | Claude Code 101 · Claude Code in Action · Subagents · Agent Skills |
| 5 | 🔗 Model Context Protocol | Introduction to MCP · MCP Advanced Topics |
| 6 | ☁️ Despliegue y Cowork | Claude with Amazon Bedrock · Vertex AI · Claude Cowork |
| 🏆 | Examen final | Preguntas mezcladas de todos los mundos |

## ⚙️ Mecánicas

- **Lecciones → preguntas**: cada mundo enseña antes de evaluar.
- **XP y niveles**: +10 XP por acierto, con **bonus por racha** 🔥.
- **Vidas**: 3 corazones por ronda; si los pierdes, repites el mundo.
- **Estrellas**: 1★ (≥60%), 2★ (≥80%), 3★ (100%). Con 1★ desbloqueas el siguiente mundo.
- **Progreso guardado** automáticamente en `localStorage` del navegador.
- **Examen final**: se desbloquea al completar los 6 mundos.

## 📁 Estructura

```
index.html      # punto de entrada
styles.css      # estilos (tema oscuro, responsive)
js/
  data.js       # contenido educativo: lecciones y preguntas por mundo
  game.js       # motor del juego (estado, navegación, puntuación)
```

## ➕ Añadir o editar contenido

Todo el contenido vive en `js/data.js`. Para añadir una pregunta a un mundo,
agrega un objeto a su array `questions`:

```js
{
  q: "Tu pregunta",
  options: ["Correcta", "Distractor 1", "Distractor 2", "Distractor 3"],
  answer: 0,                 // índice de la opción correcta
  explain: "Por qué es correcta (se muestra tras responder)."
}
```

Las opciones se barajan automáticamente, así que el índice `answer` siempre
apunta a la opción correcta original.

---

*Proyecto educativo no oficial con fines de aprendizaje.*
