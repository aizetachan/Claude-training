# 🎓 Claude Academy

Un juego educativo para **aprender todos los cursos de Claude jugando**. Avanzas
por "mundos" temáticos, lees lecciones breves y respondes preguntas para ganar
XP, subir de nivel, batir récords y desbloquear el examen final.

El contenido sigue los **temarios reales** del catálogo oficial de
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

## 🗺️ Mundos (cubren los 19 cursos del catálogo)

| # | Mundo | Cursos que cubre | Temas clave |
|---|-------|------------------|-------------|
| 1 | 🌱 Fundamentos de Claude | Claude 101 · AI Capabilities and Limitations | Next token prediction, conocimiento y fecha de corte, memoria de trabajo, steerability, proyectos, artifacts, Research |
| 2 | 🧭 AI Fluency: el marco 4D | Framework & Foundations · Students · Educators · Small Businesses · Nonprofits · Teaching AI Fluency | Las 4D, bucles Description-Discernment y Delegation-Diligence, humano en el bucle, privacidad |
| 3 | 🔌 La Claude API: fundamentos | Building with the Claude API · Claude Platform 101 | Messages API, multi-turno stateless, system prompts, tokens, temperature, streaming, prefill, visión/PDF, citations, extended thinking, prompt caching |
| 4 | ✍️ Prompting, evals y RAG | Building with the Claude API (secciones de prompting, evaluación y RAG) | Claridad, XML tags, few-shot, workflow de evals, grading por código/modelo, chunking, embeddings, BM25, reranking |
| 5 | 🤖 Tool use y agentes | Building with the Claude API · Claude Platform 101 (agentes) | JSON Schema, tool_use/tool_result, agent loop, chaining/routing/parallelization, workflows vs agentes, computer use |
| 6 | ⌨️ Claude Code en acción | Claude Code 101 · Claude Code in Action · Intro to Subagents · Intro to Agent Skills | explore→plan→code→commit, CLAUDE.md, /clear y /compact, slash commands, subagentes, SKILL.md, hooks, SDK |
| 7 | 🔗 Model Context Protocol | Introduction to MCP · MCP Advanced Topics | Host/cliente/servidor, tools/resources/prompts, Inspector, JSON-RPC, stdio vs StreamableHTTP, sampling, roots, escalado |
| 8 | ☁️ Despliegue cloud y Cowork | Claude with Amazon Bedrock · Claude with Vertex AI · Intro to Claude Cowork | boto3 e IAM, Vertex AI, qué cambia entre plataformas, Cowork: skills, plugins, Chrome/M365, seguridad |
| 🏆 | Examen final | Preguntas mezcladas de los 8 mundos | — |

**64 lecciones · 87 preguntas**, todas con explicación tras responder.

## ⚙️ Mecánicas

- **Lecciones → preguntas**: cada mundo enseña antes de evaluar.
- **XP y niveles**: +10 XP por acierto, con **bonus por racha** 🔥.
- **Vidas**: 3 corazones por ronda; si los pierdes, repites el mundo.
- **Estrellas**: 1★ (≥60%), 2★ (≥80%), 3★ (100%). Con 1★ desbloqueas el siguiente mundo.
- **🏅 Puntuaciones**: tabla de récords con nombre de jugador, % de acierto,
  XP y **cronómetro por ronda** (a igual %, gana el más rápido). Incluye las
  mejores marcas por mundo y destaca las rondas del examen final.
- **Progreso guardado** automáticamente en `localStorage` del navegador.
- **Examen final**: se desbloquea al completar los 8 mundos.

## 📁 Estructura

```
index.html      # punto de entrada
styles.css      # estilos (tema oscuro, responsive)
js/
  data.js       # contenido educativo: lecciones y preguntas por mundo
  game.js       # motor del juego (estado, navegación, puntuación, récords)
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

Las opciones se barajan automáticamente al jugar, así que por convención la
correcta se escribe siempre en el índice 0.

Para validar el contenido tras editar:

```bash
node --check js/data.js
```

---

*Proyecto educativo no oficial con fines de aprendizaje.*
