/*
 * data.js — Contenido educativo del juego "Claude Academy".
 *
 * Cada "mundo" cubre uno o varios cursos oficiales de Claude
 * (https://claude.com/resources/courses). El contenido sigue los temarios
 * reales de los cursos:
 *
 *  Mundo 1 ← Claude 101 · AI Capabilities and Limitations
 *  Mundo 2 ← AI Fluency: Framework & Foundations · for Students/Educators/
 *            Small Businesses/Nonprofits · Teaching AI Fluency
 *  Mundo 3 ← Building with the Claude API (API básica y features) ·
 *            Claude Platform 101
 *  Mundo 4 ← Building with the Claude API (prompt engineering, evals, RAG)
 *  Mundo 5 ← Building with the Claude API / Platform 101 (tool use, agentes,
 *            workflows, computer use)
 *  Mundo 6 ← Claude Code 101 · Claude Code in Action · Introduction to
 *            Subagents · Introduction to Agent Skills
 *  Mundo 7 ← Introduction to MCP · MCP: Advanced Topics
 *  Mundo 8 ← Claude with Amazon Bedrock · Claude with Vertex AI ·
 *            Introduction to Claude Cowork
 *
 * Estructura: lessons[] (tarjetas de teoría) + questions[] (opción múltiple,
 * la opción correcta siempre se escribe en el índice 0 y se baraja al jugar).
 */

const GAME_DATA = {
  meta: {
    title: "Claude Academy",
    subtitle: "Aprende todos los cursos de Claude jugando",
    version: "2.0.0",
  },

  worlds: [
    /* ================================================================ */
    /* MUNDO 1 — Fundamentos: Claude 101 + AI Capabilities & Limitations */
    /* ================================================================ */
    {
      id: "fundamentals",
      name: "Fundamentos de Claude",
      icon: "seedling",
      color: "#7c5cff",
      blurb:
        "Qué es Claude y cómo 'piensa' un modelo generativo: predicción de tokens, conocimiento, memoria de trabajo y steerability. Más proyectos, artifacts y Research en Claude.ai.",
      lessons: [
        {
          title: "¿Qué es Claude?",
          body:
            "Claude es una familia de modelos de lenguaje grande (LLM) creada por Anthropic y entrenada para ser útil, honesta e inofensiva (helpful, honest, harmless). La familia ofrece equilibrios distintos: Opus es el más capaz, Sonnet equilibra inteligencia y velocidad, y Haiku es el más rápido y económico.",
        },
        {
          title: "Cómo la IA obtiene su 'carácter'",
          body:
            "El comportamiento de un modelo no es magia: surge de su entrenamiento con grandes cantidades de texto, del ajuste fino con retroalimentación humana y de las instrucciones (system prompts) que recibe. Por eso dos asistentes sobre el mismo modelo pueden comportarse muy distinto.",
        },
        {
          title: "Propiedad 1: Predicción del siguiente token",
          body:
            "En el fondo, un modelo generativo predice el siguiente fragmento de texto (token) más probable dado todo lo anterior, una y otra vez. Esto explica su fluidez… y también que pueda producir texto plausible pero incorrecto.",
        },
        {
          title: "Propiedad 2: Conocimiento",
          body:
            "El conocimiento del modelo viene de sus datos de entrenamiento y tiene una FECHA DE CORTE: no sabe lo ocurrido después, salvo que se le den herramientas (búsqueda web) o contexto. Cuando 'rellena huecos' con datos inventados pero verosímiles, hablamos de alucinaciones.",
        },
        {
          title: "Propiedad 3: Memoria de trabajo",
          body:
            "La 'memoria' del modelo es su VENTANA DE CONTEXTO: todo lo que cabe en la conversación actual. No recuerda conversaciones anteriores por sí solo, y en sesiones muy largas la información puede quedar fuera de la ventana.",
        },
        {
          title: "Propiedad 4: Steerability (dirigibilidad)",
          body:
            "El modelo es muy sensible a cómo se le instruye: rol, tono, formato y restricciones cambian la salida. Esto es un superpoder (puedes dirigirlo con precisión) y un riesgo (instrucciones vagas dan resultados vagos). Cuando estas propiedades chocan entre sí surgen los comportamientos 'inesperados'.",
        },
        {
          title: "Claude.ai en la práctica",
          body:
            "En la app de Claude puedes organizar el trabajo con PROYECTOS (espacios con instrucciones y conocimiento persistentes), crear ARTIFACTS (documentos, código o mini-apps en un panel aparte), usar SKILLS, conectar herramientas externas y lanzar RESEARCH para investigaciones profundas con fuentes.",
        },
      ],
      questions: [
        {
          q: "¿Cuál es el mecanismo fundamental con el que un modelo generativo produce texto?",
          options: [
            "Predecir el siguiente token más probable, repetidamente",
            "Buscar frases exactas en una base de datos",
            "Copiar respuestas de Internet en tiempo real",
            "Ejecutar reglas gramaticales programadas a mano",
          ],
          answer: 0,
          explain:
            "Los LLM generan texto prediciendo el siguiente token dado el contexto. Eso explica tanto su fluidez como sus errores plausibles.",
        },
        {
          q: "¿Qué implica la 'fecha de corte de conocimiento' de un modelo?",
          options: [
            "No conoce eventos posteriores a su entrenamiento salvo que se le dé contexto o herramientas",
            "Deja de funcionar después de esa fecha",
            "Solo responde preguntas históricas",
            "Olvida todo cada 24 horas",
          ],
          answer: 0,
          explain:
            "El conocimiento viene de los datos de entrenamiento. Para información posterior necesita búsqueda web o contexto aportado por ti.",
        },
        {
          q: "La 'memoria de trabajo' de Claude equivale a:",
          options: [
            "Su ventana de contexto: lo que cabe en la conversación actual",
            "Un disco duro donde guarda todas tus charlas",
            "La memoria RAM de tu ordenador",
            "Una libreta física en Anthropic",
          ],
          answer: 0,
          explain:
            "Todo lo que el modelo 'recuerda' debe estar en la ventana de contexto. Entre conversaciones independientes no hay memoria automática.",
        },
        {
          q: "¿Qué es la 'steerability' (dirigibilidad) de un modelo?",
          options: [
            "Su sensibilidad a las instrucciones: rol, tono y formato moldean la salida",
            "Su capacidad de conducir vehículos",
            "La velocidad a la que responde",
            "El número de idiomas que habla",
          ],
          answer: 0,
          explain:
            "Las instrucciones dirigen al modelo con precisión: por eso prompts claros producen resultados mucho mejores que prompts vagos.",
        },
        {
          q: "Una 'alucinación' en IA generativa es:",
          options: [
            "Información inventada que suena plausible pero es falsa",
            "Un error de hardware en el servidor",
            "Cuando el modelo se niega a responder",
            "Una imagen generada borrosa",
          ],
          answer: 0,
          explain:
            "Como el modelo predice texto plausible, puede 'rellenar huecos' con datos falsos pero convincentes. Verifica siempre lo crítico.",
        },
        {
          q: "El 'carácter' de un asistente de IA surge principalmente de:",
          options: [
            "Su entrenamiento, el ajuste con retroalimentación humana y sus instrucciones de sistema",
            "El estado de ánimo del servidor",
            "La marca del ordenador del usuario",
            "Un sorteo aleatorio diario",
          ],
          answer: 0,
          explain:
            "Datos de entrenamiento + ajuste fino + system prompts definen cómo se comporta un asistente sobre un mismo modelo base.",
        },
        {
          q: "Ordena la familia de modelos de MÁS capaz a más rápido/económico:",
          options: [
            "Opus › Sonnet › Haiku",
            "Haiku › Sonnet › Opus",
            "Sonnet › Opus › Haiku",
            "Todos son idénticos en capacidad y precio",
          ],
          answer: 0,
          explain:
            "Opus maximiza capacidad, Sonnet equilibra inteligencia/velocidad y Haiku prioriza rapidez y coste. Elegir modelo es un tradeoff coste-latencia-capacidad.",
        },
        {
          q: "En Claude.ai, un 'artifact' es:",
          options: [
            "Contenido autónomo (documento, código, mini-app) creado en un panel aparte",
            "Un error del sistema",
            "Una copia de seguridad automática",
            "Un emoji personalizado",
          ],
          answer: 0,
          explain:
            "Los artifacts permiten crear y editar contenido sustancial (código, documentos, apps interactivas) separado de la conversación.",
        },
        {
          q: "¿Para qué sirven los PROYECTOS en Claude.ai?",
          options: [
            "Agrupar chats con instrucciones y conocimiento persistentes compartidos",
            "Comprar espacio de almacenamiento extra",
            "Programar publicaciones en redes sociales",
            "Crear copias de seguridad del navegador",
          ],
          answer: 0,
          explain:
            "Un proyecto da contexto persistente (instrucciones + documentos) a todas las conversaciones que contiene.",
        },
        {
          q: "El modo 'Research' de Claude sirve para:",
          options: [
            "Investigaciones profundas con búsqueda en múltiples fuentes y citas",
            "Acelerar la generación de emojis",
            "Entrenar tu propio modelo",
            "Editar vídeo profesional",
          ],
          answer: 0,
          explain:
            "Research realiza investigación en profundidad consultando fuentes y devolviendo un informe con referencias.",
        },
      ],
    },

    /* ================================================================ */
    /* MUNDO 2 — AI Fluency: marco 4D y sus bucles                       */
    /* ================================================================ */
    {
      id: "fluency",
      name: "AI Fluency: el marco 4D",
      icon: "compass",
      color: "#00b3a4",
      blurb:
        "Delegation, Description, Discernment y Diligence; los bucles Description-Discernment y Delegation-Diligence; ser 'el humano en el bucle'. Cubre toda la familia AI Fluency.",
      lessons: [
        {
          title: "¿Qué es la AI Fluency?",
          body:
            "Es la capacidad de colaborar con IA de forma EFICAZ, EFICIENTE, ÉTICA y SEGURA. Anthropic la estructura en cuatro competencias: Delegation, Description, Discernment y Diligence (el marco 4D).",
        },
        {
          title: "1ª D — Delegation (Delegación)",
          body:
            "Decidir QUÉ trabajo hacer con IA y cuál conservar. Implica conocer tu problema (problem awareness), saber qué pueden hacer las plataformas (platform awareness) y repartir tareas entre humano y máquina (task delegation).",
        },
        {
          title: "2ª D — Description (Descripción)",
          body:
            "Comunicar con claridad: describir el PRODUCTO que quieres, el PROCESO que debe seguir la IA y el RENDIMIENTO/comportamiento que esperas de ella. Aquí vive el prompting eficaz.",
        },
        {
          title: "3ª D — Discernment (Discernimiento)",
          body:
            "Evaluar críticamente lo que la IA devuelve, en espejo con la Descripción: ¿el producto es correcto y adecuado?, ¿el proceso de razonamiento fue sólido?, ¿el comportamiento fue apropiado? Nunca aceptar salidas a ciegas.",
        },
        {
          title: "4ª D — Diligence (Diligencia)",
          body:
            "Usar la IA de forma responsable: elegir bien las herramientas y datos (creation diligence), ser transparente sobre el uso de IA (transparency diligence) y responsabilizarte de lo que despliegas o publicas (deployment diligence).",
        },
        {
          title: "El bucle Description-Discernment",
          body:
            "Trabajar con IA es iterativo: describes lo que quieres → evalúas el resultado → refinas tu descripción → vuelves a evaluar. Este bucle de refinamiento es el corazón de la colaboración día a día.",
        },
        {
          title: "El bucle Delegation-Diligence",
          body:
            "El otro bucle es estratégico: decides qué delegar y mantienes la responsabilidad sobre el resultado final. Delegar nunca significa desentenderse: tú respondes por lo que entregas.",
        },
        {
          title: "El humano en el bucle",
          body:
            "El marco aplica a estudiantes (IA como compañera de aprendizaje), docentes (diseño de cursos y evaluación), empresas y ONG (privacidad de datos, análisis, flujos de trabajo). En todos los casos, la persona supervisa, decide y responde: es 'el humano en el bucle'.",
        },
      ],
      questions: [
        {
          q: "¿Cuáles son las cuatro 'D' del marco de AI Fluency?",
          options: [
            "Delegation, Description, Discernment, Diligence",
            "Data, Design, Deploy, Debug",
            "Define, Draft, Deliver, Done",
            "Detect, Defend, Deny, Document",
          ],
          answer: 0,
          explain:
            "El marco 4D de Anthropic: Delegación, Descripción, Discernimiento y Diligencia.",
        },
        {
          q: "La AI Fluency se define como colaborar con IA de forma…",
          options: [
            "Eficaz, eficiente, ética y segura",
            "Rápida y barata únicamente",
            "Totalmente automática y sin supervisión",
            "Exclusiva para programadores",
          ],
          answer: 0,
          explain:
            "Las cuatro cualidades (effective, efficient, ethical, safe) definen la fluidez en IA.",
        },
        {
          q: "Decidir qué tareas dar a la IA, conociendo tu problema y las capacidades de la plataforma, es:",
          options: ["Delegation", "Diligence", "Description", "Discernment"],
          answer: 0,
          explain:
            "La Delegación combina conciencia del problema, de la plataforma y reparto de tareas humano-máquina.",
        },
        {
          q: "Según el marco, una buena DESCRIPCIÓN cubre tres cosas:",
          options: [
            "El producto deseado, el proceso a seguir y el comportamiento esperado",
            "El precio, el plazo y la garantía",
            "El hardware, el software y la red",
            "El pasado, el presente y el futuro",
          ],
          answer: 0,
          explain:
            "Product, process y performance description: qué quieres, cómo abordarlo y cómo debe comportarse la IA.",
        },
        {
          q: "Evaluar críticamente si la salida de la IA es correcta y su razonamiento sólido es:",
          options: ["Discernment", "Delegation", "Description", "Diligence"],
          answer: 0,
          explain:
            "El Discernimiento evalúa producto, proceso y comportamiento — el espejo crítico de la Descripción.",
        },
        {
          q: "Ser transparente sobre el uso de IA y asumir la responsabilidad de lo que publicas pertenece a:",
          options: ["Diligence", "Description", "Delegation", "Discernment"],
          answer: 0,
          explain:
            "La Diligencia incluye creation, transparency y deployment diligence: uso responsable de principio a fin.",
        },
        {
          q: "El bucle Description-Discernment consiste en:",
          options: [
            "Describir → evaluar el resultado → refinar la descripción → repetir",
            "Descargar → instalar → ejecutar → desinstalar",
            "Preguntar una sola vez y aceptar la respuesta",
            "Copiar y pegar sin leer",
          ],
          answer: 0,
          explain:
            "La colaboración con IA es iterativa: cada evaluación alimenta una descripción mejor.",
        },
        {
          q: "'Delegar a la IA nunca significa desentenderse del resultado.' Esto resume el bucle:",
          options: [
            "Delegation-Diligence",
            "Description-Discernment",
            "Debug-Deploy",
            "Drag-and-Drop",
          ],
          answer: 0,
          explain:
            "Decides qué delegar (Delegation) pero mantienes la responsabilidad final (Diligence).",
        },
        {
          q: "Una ONG quiere analizar datos de donantes con IA. Según el curso de nonprofits, ¿qué debe considerar PRIMERO?",
          options: [
            "La privacidad y el tratamiento adecuado de los datos sensibles",
            "Qué tipografía usar en el informe",
            "Comprar más ordenadores",
            "Nada: subir todo cuanto antes",
          ],
          answer: 0,
          explain:
            "El bucle Delegation-Diligence pone la privacidad y el manejo de datos al frente antes de delegar análisis a la IA.",
        },
        {
          q: "Ser 'el humano en el bucle' significa:",
          options: [
            "Supervisar, decidir y responder por el trabajo hecho con IA",
            "Dejar que la IA tome todas las decisiones",
            "Trabajar sin ninguna herramienta digital",
            "Repetir literalmente lo que dice la IA",
          ],
          answer: 0,
          explain:
            "La persona mantiene el juicio y la responsabilidad final: la IA amplifica, no sustituye, tu criterio.",
        },
        {
          q: "Para EVALUAR la AI Fluency de estudiantes, el curso 'Teaching AI Fluency' propone:",
          options: [
            "Diseñar tareas que evalúen las 4D y sus bucles, no prohibir la IA sin más",
            "Eliminar todos los exámenes",
            "Evaluar solo la velocidad de tecleo",
            "Usar detectores de IA como única medida",
          ],
          answer: 0,
          explain:
            "El curso enseña a diseñar assignments que evidencien delegación, descripción, discernimiento y diligencia en cada disciplina.",
        },
      ],
    },

    /* ================================================================ */
    /* MUNDO 3 — La Claude API: fundamentos y features                   */
    /* ================================================================ */
    {
      id: "api",
      name: "La Claude API: fundamentos",
      icon: "plug",
      color: "#ff7a45",
      blurb:
        "La Messages API: peticiones, multi-turno, system prompts, tokens, temperature, streaming, datos estructurados, visión, PDF, citations, extended thinking y prompt caching.",
      lessons: [
        {
          title: "Tu primera petición",
          body:
            "Para usar la API necesitas una API key. Cada petición indica el modelo, un máximo de tokens y una lista de 'messages' con roles 'user' y 'assistant' que se alternan. La respuesta es un nuevo mensaje del asistente.",
        },
        {
          title: "La API no tiene memoria",
          body:
            "La API es STATELESS: no recuerda peticiones anteriores. Para una conversación multi-turno debes reenviar el historial completo de mensajes en cada llamada. Tu aplicación es la dueña de la memoria.",
        },
        {
          title: "System prompts",
          body:
            "El parámetro 'system' fija rol, tono y reglas globales del asistente, separado de la lista de mensajes. Es la herramienta más potente para dar identidad y límites consistentes a tu aplicación.",
        },
        {
          title: "Tokens y costes",
          body:
            "El texto se trocea en tokens (fragmentos de palabra). Se factura por tokens de ENTRADA y de SALIDA, y 'max_tokens' limita la longitud de la respuesta. Controlar tokens es controlar coste y latencia.",
        },
        {
          title: "Temperature y streaming",
          body:
            "'temperature' regula la aleatoriedad: baja (≈0) para tareas factuales y consistentes, alta para creatividad. Con STREAMING recibes la respuesta token a token (eventos SSE), mejorando la experiencia percibida.",
        },
        {
          title: "Datos estructurados",
          body:
            "Para obtener JSON fiable: pide el formato explícitamente y usa el 'prefill' — empezar tú el turno del asistente (p. ej. con '{') para forzar que continúe en ese formato, o usa herramientas con schema.",
        },
        {
          title: "Multimodal: imágenes, PDF y citations",
          body:
            "Claude acepta imágenes y PDF como entrada para analizarlos. La función de CITATIONS permite que las respuestas referencien los fragmentos exactos de los documentos fuente, ideal para resultados verificables.",
        },
        {
          title: "Extended thinking",
          body:
            "Con el razonamiento extendido, el modelo 'piensa' paso a paso antes de responder, usando un presupuesto de tokens de razonamiento. Mejora problemas complejos (matemáticas, lógica, planificación) a cambio de más tokens.",
        },
        {
          title: "Prompt caching",
          body:
            "El prompt caching reutiliza prefijos largos y estables (instrucciones, documentos) entre llamadas, reduciendo coste y latencia. Regla clave: el contenido cacheado va AL PRINCIPIO y debe ser idéntico entre llamadas; cualquier cambio invalida la caché desde ese punto.",
        },
      ],
      questions: [
        {
          q: "La Claude API es 'stateless'. ¿Qué significa para una conversación multi-turno?",
          options: [
            "Debes reenviar el historial completo de mensajes en cada petición",
            "La API recuerda todo automáticamente",
            "Solo se permite una pregunta por día",
            "Las conversaciones se guardan en tu disco duro",
          ],
          answer: 0,
          explain:
            "La API no guarda estado entre llamadas: tu aplicación gestiona y reenvía el historial.",
        },
        {
          q: "¿Para qué sirve el parámetro 'system'?",
          options: [
            "Fijar rol, tono y reglas globales del asistente",
            "Elegir el sistema operativo del servidor",
            "Definir la contraseña de la API",
            "Activar el modo oscuro",
          ],
          answer: 0,
          explain:
            "El system prompt da identidad y límites consistentes a toda la conversación, separado de los mensajes.",
        },
        {
          q: "¿Cómo se factura el uso de la API?",
          options: [
            "Por tokens de entrada y de salida procesados",
            "Por minutos de conexión",
            "Por número de letras mayúsculas",
            "Tarifa plana ilimitada siempre",
          ],
          answer: 0,
          explain:
            "Se paga por tokens de entrada + salida; por eso gestionar el contexto y max_tokens controla el coste.",
        },
        {
          q: "Para una tarea factual que requiere salidas consistentes, conviene una temperature…",
          options: ["Baja, cercana a 0", "Muy alta", "Negativa", "Aleatoria en cada llamada"],
          answer: 0,
          explain:
            "Temperature baja = menos aleatoriedad = respuestas más deterministas. Alta para creatividad.",
        },
        {
          q: "¿Qué aporta el STREAMING de respuestas?",
          options: [
            "Recibir la respuesta token a token, mejorando la latencia percibida",
            "Respuestas con vídeo en alta definición",
            "Eliminar el coste de la petición",
            "Duplicar la inteligencia del modelo",
          ],
          answer: 0,
          explain:
            "Con server-sent events el usuario ve el texto aparecer en tiempo real en lugar de esperar la respuesta completa.",
        },
        {
          q: "Un truco eficaz para forzar que Claude responda en JSON es:",
          options: [
            "'Prefill': empezar tú el turno del asistente con '{'",
            "Escribir el prompt en mayúsculas",
            "Subir la temperature al máximo",
            "Repetir la pregunta tres veces",
          ],
          answer: 0,
          explain:
            "Si pre-rellenas el inicio de la respuesta del asistente, el modelo continúa desde ahí, garantizando el arranque del formato.",
        },
        {
          q: "El 'extended thinking' (razonamiento extendido) consiste en:",
          options: [
            "Dejar que el modelo razone paso a paso con un presupuesto de tokens antes de responder",
            "Alargar la respuesta con relleno",
            "Pensar en voz alta del desarrollador",
            "Una pausa de 10 minutos del servidor",
          ],
          answer: 0,
          explain:
            "El modelo dedica tokens de razonamiento a problemas complejos (lógica, matemáticas, planificación) antes de dar la respuesta final.",
        },
        {
          q: "Regla clave del PROMPT CACHING:",
          options: [
            "El contenido estable va al principio y debe ser idéntico entre llamadas",
            "Solo funciona con prompts de una palabra",
            "La caché dura un año",
            "Hay que pagar el doble para activarla",
          ],
          answer: 0,
          explain:
            "Se cachea un prefijo: cualquier cambio en él invalida la caché desde ese punto. Por eso lo estable va primero.",
        },
        {
          q: "La función de CITATIONS sirve para:",
          options: [
            "Que las respuestas referencien los fragmentos exactos de los documentos fuente",
            "Multar al usuario por mal uso",
            "Traducir citas célebres",
            "Generar bibliografías inventadas",
          ],
          answer: 0,
          explain:
            "Citations ancla las afirmaciones del modelo a pasajes concretos de tus documentos: respuestas verificables.",
        },
        {
          q: "¿Qué tipos de archivo puede analizar Claude directamente como entrada?",
          options: [
            "Imágenes y PDF, además de texto",
            "Solo archivos .txt",
            "Únicamente hojas de cálculo",
            "Solo audio y vídeo",
          ],
          answer: 0,
          explain:
            "Claude es multimodal: procesa imágenes y documentos PDF, lo que habilita análisis visual y de documentos.",
        },
        {
          q: "Según Claude Platform 101, elegir entre Opus, Sonnet y Haiku es un equilibrio entre:",
          options: [
            "Capacidad, latencia y coste",
            "Color, tamaño y peso",
            "HTML, CSS y JavaScript",
            "Norte, sur y este",
          ],
          answer: 0,
          explain:
            "Cada modelo ofrece un tradeoff distinto: más capacidad suele implicar más coste y latencia. Elige según la tarea.",
        },
      ],
    },

    /* ================================================================ */
    /* MUNDO 4 — Prompt engineering, evals y RAG                         */
    /* ================================================================ */
    {
      id: "prompting",
      name: "Prompting, evals y RAG",
      icon: "pencil",
      color: "#e64980",
      blurb:
        "Técnicas de prompt engineering (claridad, XML tags, ejemplos), evaluación sistemática de prompts y Retrieval Augmented Generation: chunking, embeddings, BM25 y reranking.",
      lessons: [
        {
          title: "Claro, directo y específico",
          body:
            "La regla nº1 del prompting: di exactamente lo que quieres. Especifica audiencia, longitud, formato y criterios de éxito. Trata a Claude como a un colaborador brillante pero nuevo en tu equipo: necesita contexto.",
        },
        {
          title: "Estructura con XML tags",
          body:
            "Usa etiquetas tipo <documento>, <instrucciones> o <ejemplo> para separar instrucciones de datos. Claude está entrenado para respetar esa estructura, y así evitas que confunda tus datos con tus órdenes.",
        },
        {
          title: "Ejemplos (few-shot / multishot)",
          body:
            "Mostrar 2-3 ejemplos de entrada→salida deseada es de las técnicas más potentes: el modelo imita el patrón, el tono y el formato de tus ejemplos con mucha más fiabilidad que con descripciones abstractas.",
        },
        {
          title: "¿Por qué evaluar prompts?",
          body:
            "Cambiar un prompt 'a ojo' es arriesgado: puede mejorar un caso y romper diez. Una EVAL es un conjunto de casos de prueba que puntúa el rendimiento del prompt de forma sistemática y repetible.",
        },
        {
          title: "El workflow de evaluación",
          body:
            "Flujo típico: 1) generar un dataset de casos de prueba, 2) ejecutar el prompt sobre cada caso, 3) calificar las salidas, 4) iterar el prompt y repetir. Así las mejoras se miden, no se intuyen.",
        },
        {
          title: "Calificación por código vs. por modelo",
          body:
            "CODE-BASED grading: comprobaciones objetivas y programables (¿es JSON válido?, ¿contiene la cifra correcta?). MODEL-BASED grading: otro modelo juzga cualidades subjetivas (tono, utilidad, calidad). Suelen combinarse.",
        },
        {
          title: "RAG: dar a Claude tus datos",
          body:
            "Retrieval Augmented Generation: en lugar de meter TODO en el prompt, recuperas solo los fragmentos relevantes de tu base de conocimiento y los añades al contexto. Primero se trocean los documentos (CHUNKING).",
        },
        {
          title: "Embeddings y búsqueda semántica",
          body:
            "Un embedding convierte texto en un vector numérico que captura su significado: textos con significado parecido quedan cerca en el espacio vectorial. Así se recupera por SIGNIFICADO, no solo por palabras exactas.",
        },
        {
          title: "BM25, búsqueda híbrida y reranking",
          body:
            "BM25 es búsqueda LÉXICA (palabras clave exactas): complementa a la semántica, que puede fallar con términos técnicos o códigos. Los pipelines combinan ambas (búsqueda híbrida) y RERANKEAN los resultados para quedarse con lo mejor.",
        },
      ],
      questions: [
        {
          q: "Tu prompt 'escribe algo sobre ventas' da malos resultados. ¿Cuál es la PRIMERA mejora según el curso?",
          options: [
            "Ser claro y específico: audiencia, formato, longitud y objetivo",
            "Subir la temperature",
            "Repetir la petición cinco veces",
            "Cambiar de idioma",
          ],
          answer: 0,
          explain:
            "'Being clear and direct' y 'being specific' son las primeras técnicas: la ambigüedad es la causa nº1 de malos resultados.",
        },
        {
          q: "¿Para qué se usan las etiquetas XML en un prompt?",
          options: [
            "Separar instrucciones de datos para que no se confundan",
            "Hacer el prompt más bonito",
            "Comprimir el texto",
            "Activar funciones secretas",
          ],
          answer: 0,
          explain:
            "Etiquetas como <documento> o <instrucciones> delimitan secciones; Claude respeta esa estructura.",
        },
        {
          q: "La técnica de dar 2-3 ejemplos de entrada→salida en el prompt se llama:",
          options: [
            "Few-shot / multishot prompting",
            "Overclocking",
            "Tokenización",
            "Hard-coding",
          ],
          answer: 0,
          explain:
            "Los ejemplos enseñan el patrón deseado: el modelo imita formato y tono con gran fiabilidad.",
        },
        {
          q: "¿Cuál es el orden correcto del workflow de evaluación de prompts?",
          options: [
            "Generar dataset → ejecutar el prompt → calificar salidas → iterar",
            "Publicar → rezar → esperar quejas → arreglar",
            "Calificar → ejecutar → borrar → empezar",
            "Iterar → iterar → iterar sin medir nada",
          ],
          answer: 0,
          explain:
            "Las evals hacen del prompting una disciplina medible: dataset, ejecución, calificación e iteración.",
        },
        {
          q: "Verificar con un script que la salida es JSON válido y contiene los campos correctos es:",
          options: [
            "Code-based grading (calificación por código)",
            "Model-based grading",
            "Vibe-based grading",
            "Streaming",
          ],
          answer: 0,
          explain:
            "Las comprobaciones objetivas y programables son code-based; las subjetivas (tono, calidad) son model-based.",
        },
        {
          q: "¿Cuándo conviene el MODEL-based grading?",
          options: [
            "Para juzgar cualidades subjetivas como tono, claridad o utilidad",
            "Para comprobar si un número es par",
            "Para validar sintaxis JSON",
            "Nunca: está prohibido",
          ],
          answer: 0,
          explain:
            "Un modelo juez evalúa bien lo que no se puede expresar como regla de código: calidad, tono, adecuación.",
        },
        {
          q: "¿Qué es RAG (Retrieval Augmented Generation)?",
          options: [
            "Recuperar los fragmentos relevantes de tus datos y añadirlos al prompt",
            "Entrenar el modelo desde cero con tus datos",
            "Un formato de imagen comprimida",
            "Un tipo de virus informático",
          ],
          answer: 0,
          explain:
            "RAG conecta al modelo con tu conocimiento: se recupera solo lo relevante y se inyecta como contexto.",
        },
        {
          q: "El 'chunking' en un pipeline RAG es:",
          options: [
            "Trocear los documentos en fragmentos manejables para indexarlos",
            "Borrar documentos antiguos",
            "Cifrar la base de datos",
            "Comprimir imágenes",
          ],
          answer: 0,
          explain:
            "Los documentos se dividen en chunks; la estrategia de troceado afecta mucho a la calidad de la recuperación.",
        },
        {
          q: "Un EMBEDDING es:",
          options: [
            "Un vector numérico que captura el significado de un texto",
            "Un archivo adjunto de correo",
            "Una etiqueta HTML",
            "Una contraseña cifrada",
          ],
          answer: 0,
          explain:
            "Textos con significado similar producen vectores cercanos: es la base de la búsqueda semántica.",
        },
        {
          q: "¿Por qué combinar BM25 con búsqueda semántica (búsqueda híbrida)?",
          options: [
            "BM25 acierta con términos exactos y códigos donde la semántica puede fallar",
            "Porque BM25 es más bonito",
            "Para gastar más dinero",
            "No tiene sentido combinarlas",
          ],
          answer: 0,
          explain:
            "La búsqueda léxica (palabras clave) y la semántica (significado) se complementan; el reranking elige lo mejor de ambas.",
        },
        {
          q: "El paso de 'reranking' en un pipeline RAG multi-índice sirve para:",
          options: [
            "Reordenar los resultados combinados y quedarse con los más relevantes",
            "Renombrar los archivos del proyecto",
            "Reiniciar el servidor",
            "Aumentar la temperatura del modelo",
          ],
          answer: 0,
          explain:
            "Tras combinar resultados de varias búsquedas, un reranker los puntúa de nuevo para maximizar la relevancia del contexto final.",
        },
      ],
    },

    /* ================================================================ */
    /* MUNDO 5 — Tool use, agentes y workflows                           */
    /* ================================================================ */
    {
      id: "agents",
      name: "Tool use y agentes",
      icon: "robot",
      color: "#f59f00",
      blurb:
        "Cómo Claude usa herramientas (JSON Schema, tool_use/tool_result), el agent loop, workflows vs. agentes (chaining, routing, parallelization), herramientas integradas y computer use.",
      lessons: [
        {
          title: "Definir herramientas",
          body:
            "Una herramienta se define con nombre, descripción y un JSON SCHEMA de sus parámetros. La descripción es crucial: es lo que Claude lee para decidir CUÁNDO y CÓMO usar cada herramienta.",
        },
        {
          title: "El ciclo tool_use → tool_result",
          body:
            "Claude no ejecuta nada: cuando decide usar una herramienta devuelve un bloque 'tool_use' con los argumentos. TU código la ejecuta y responde con un bloque 'tool_result'. Claude continúa razonando con ese resultado.",
        },
        {
          title: "El agent loop",
          body:
            "Un agente es un bucle: el modelo observa el estado → decide la siguiente acción (herramienta) → recibe el resultado → repite hasta completar el objetivo. La inteligencia está en que el MODELO decide cada paso.",
        },
        {
          title: "Workflows: chaining, routing, parallelization",
          body:
            "Los WORKFLOWS orquestan LLMs con pasos predefinidos por código: CHAINING (salida de un paso alimenta al siguiente), ROUTING (clasificar la entrada y derivarla al manejador adecuado) y PARALLELIZATION (subtareas simultáneas que luego se combinan).",
        },
        {
          title: "¿Workflow o agente?",
          body:
            "Regla práctica: si la tarea es predecible y bien definida, usa un workflow (más barato, fiable y depurable). Si requiere flexibilidad y decisiones dinámicas según resultados intermedios, usa un agente.",
        },
        {
          title: "Herramientas integradas",
          body:
            "La plataforma ofrece herramientas listas para usar: búsqueda web (información actual), ejecución de código en sandbox, web fetch, y el text editor tool para modificar archivos. Las Skills empaquetan procedimientos reutilizables.",
        },
        {
          title: "Computer use",
          body:
            "Con computer use, Claude maneja un ordenador como una persona: observa capturas de pantalla y emite acciones de ratón y teclado. Útil para automatizar interfaces sin API, siempre dentro de un entorno controlado.",
        },
      ],
      questions: [
        {
          q: "¿Cómo se define una herramienta para Claude?",
          options: [
            "Nombre, descripción y un JSON Schema de sus parámetros",
            "Un archivo de imagen con capturas",
            "Una hoja de cálculo",
            "No se pueden definir herramientas",
          ],
          answer: 0,
          explain:
            "El JSON Schema describe los parámetros; la descripción le dice a Claude cuándo conviene usarla.",
        },
        {
          q: "Claude emite un bloque 'tool_use'. ¿Quién ejecuta realmente la herramienta?",
          options: [
            "Tu código: la ejecuta y devuelve un 'tool_result'",
            "Claude la ejecuta internamente en sus servidores",
            "El navegador del usuario automáticamente",
            "Nadie: es decorativo",
          ],
          answer: 0,
          explain:
            "Claude solo PIDE la acción con argumentos; tu aplicación la ejecuta y le devuelve el resultado para que continúe.",
        },
        {
          q: "El 'agent loop' consiste en:",
          options: [
            "Observar → decidir acción → ejecutar herramienta → ver resultado → repetir hasta lograr el objetivo",
            "Repetir el mismo prompt para siempre",
            "Un bucle infinito de errores",
            "Reiniciar el modelo cada minuto",
          ],
          answer: 0,
          explain:
            "La esencia de un agente: el modelo decide dinámicamente cada paso en función de los resultados anteriores.",
        },
        {
          q: "En un workflow, clasificar la petición entrante y enviarla al manejador adecuado se llama:",
          options: ["Routing", "Chaining", "Caching", "Chunking"],
          answer: 0,
          explain:
            "Routing deriva cada entrada al prompt o flujo especializado que mejor la atiende.",
        },
        {
          q: "Encadenar pasos donde la salida de uno alimenta al siguiente es:",
          options: ["Chaining", "Routing", "Parallelization", "Reranking"],
          answer: 0,
          explain:
            "Prompt chaining descompone la tarea en pasos secuenciales, cada uno más simple y verificable.",
        },
        {
          q: "Dividir una tarea en subtareas simultáneas y combinar sus resultados es:",
          options: ["Parallelization", "Chaining", "Routing", "Streaming"],
          answer: 0,
          explain:
            "La paralelización acelera tareas independientes (p. ej. evaluar varios documentos a la vez) y agrega los resultados.",
        },
        {
          q: "¿Cuándo conviene un WORKFLOW en lugar de un agente?",
          options: [
            "Cuando la tarea es predecible y bien definida",
            "Cuando no sabes en absoluto qué pasos harán falta",
            "Cuando quieres gastar más tokens",
            "Nunca: los agentes siempre son mejores",
          ],
          answer: 0,
          explain:
            "Workflows con pasos fijos son más baratos, fiables y depurables; los agentes brillan cuando hace falta decidir dinámicamente.",
        },
        {
          q: "'Computer use' permite a Claude:",
          options: [
            "Manejar un ordenador viendo capturas y emitiendo acciones de ratón/teclado",
            "Comprar ordenadores online",
            "Reparar hardware físicamente",
            "Aumentar la RAM del servidor",
          ],
          answer: 0,
          explain:
            "Claude observa la pantalla y actúa como un usuario: útil para automatizar interfaces sin API, en entornos controlados.",
        },
        {
          q: "¿Qué herramienta integrada usarías para que Claude conozca información posterior a su fecha de corte?",
          options: [
            "La búsqueda web (web search)",
            "El text editor tool",
            "El prompt caching",
            "La temperature",
          ],
          answer: 0,
          explain:
            "Web search da acceso a información actual, compensando la fecha de corte del entrenamiento.",
        },
        {
          q: "Si defines varias herramientas, ¿cómo elige Claude cuál usar?",
          options: [
            "Leyendo sus descripciones y eligiendo la que encaja con la tarea",
            "Siempre usa la primera de la lista",
            "Las usa todas a la vez sin criterio",
            "Por orden alfabético",
          ],
          answer: 0,
          explain:
            "Por eso las descripciones claras y específicas de cada herramienta son la clave de un buen tool use.",
        },
      ],
    },

    /* ================================================================ */
    /* MUNDO 6 — Claude Code, subagentes y skills                        */
    /* ================================================================ */
    {
      id: "claudecode",
      name: "Claude Code en acción",
      icon: "terminal",
      color: "#2f9e44",
      blurb:
        "El agente de programación: explore→plan→code→commit, gestión de contexto, CLAUDE.md, comandos personalizados, subagentes, skills, hooks, MCP, GitHub y el SDK.",
      lessons: [
        {
          title: "¿Qué es Claude Code?",
          body:
            "Un agente de codificación que vive en tu terminal (también IDE, escritorio y web). Funciona con el bucle agéntico: lee tu repo, edita archivos y ejecuta comandos mediante herramientas, siempre bajo un sistema de PERMISOS que tú controlas.",
        },
        {
          title: "El workflow explore → plan → code → commit",
          body:
            "El patrón recomendado: primero EXPLORAR el código relevante, luego PLANIFICAR el enfoque (y revisarlo), después IMPLEMENTAR, y finalmente COMMITEAR. Saltarse la exploración y el plan es la receta para resultados mediocres.",
        },
        {
          title: "Gestión del contexto",
          body:
            "La ventana de contexto es finita: usa /clear para empezar de cero entre tareas y /compact para resumir la conversación conservando lo esencial. Mantener el contexto limpio y relevante mejora directamente la calidad.",
        },
        {
          title: "CLAUDE.md: memoria del proyecto",
          body:
            "Un archivo CLAUDE.md en el repo da contexto persistente: convenciones, comandos de build/test y arquitectura. Claude lo lee en cada sesión: es la 'memoria del proyecto' que evita repetir instrucciones.",
        },
        {
          title: "Comandos personalizados",
          body:
            "Los custom slash commands son prompts reutilizables guardados como archivos markdown (en .claude/commands). Escribes /mi-comando y se ejecuta el flujo completo: ideal para tareas repetitivas del equipo.",
        },
        {
          title: "Subagentes",
          body:
            "Un subagente es un asistente AISLADO con su propia ventana de contexto: hace su tarea y devuelve solo un resumen, manteniendo limpia la conversación principal. Se crean con el comando /agents. Diseño fiable: salida estructurada, reporte de errores y acceso restringido a herramientas.",
        },
        {
          title: "Agent Skills",
          body:
            "Una Skill es una carpeta con un SKILL.md: instrucciones reutilizables que Claude carga AUTOMÁTICAMENTE cuando la tarea coincide con su descripción (frontmatter). 'Enseña una vez, aplica siempre'. Pueden incluir más archivos y scripts, y se comparten vía repos o plugins.",
        },
        {
          title: "Hooks: control determinista",
          body:
            "Los hooks ejecutan scripts en eventos del ciclo de vida (antes/después de una herramienta, al terminar…). A diferencia de pedir cosas en el prompt, los hooks son DETERMINISTAS: el formateo tras cada edición o una notificación SIEMPRE ocurren.",
        },
        {
          title: "MCP, GitHub y el SDK",
          body:
            "Claude Code se amplía con servidores MCP (datos y herramientas externas), se integra con GitHub (responder issues, arreglar CI, revisar PRs) y ofrece un SDK para construir tus propios agentes sobre su infraestructura.",
        },
      ],
      questions: [
        {
          q: "¿Cuál es el workflow diario recomendado en Claude Code 101?",
          options: [
            "Explore → Plan → Code → Commit",
            "Copy → Paste → Pray → Panic",
            "Commit → Code → Plan → Explore",
            "Build → Break → Blame → Bail",
          ],
          answer: 0,
          explain:
            "Explorar el código, planificar el enfoque, implementar y commitear: saltarse el plan degrada los resultados.",
        },
        {
          q: "¿Para qué sirve el archivo CLAUDE.md?",
          options: [
            "Memoria persistente del proyecto: convenciones, comandos y arquitectura",
            "Guardar contraseñas del equipo",
            "Sustituir al control de versiones",
            "Configurar el color del terminal",
          ],
          answer: 0,
          explain:
            "Claude lo lee en cada sesión; evita repetir las mismas instrucciones una y otra vez.",
        },
        {
          q: "Terminaste una tarea y empiezas otra sin relación. ¿Qué conviene hacer con el contexto?",
          options: [
            "Usar /clear para empezar con contexto limpio",
            "Seguir en la misma conversación para siempre",
            "Reinstalar Claude Code",
            "Borrar el repositorio",
          ],
          answer: 0,
          explain:
            "Contexto irrelevante degrada la calidad. /clear reinicia; /compact resume conservando lo esencial.",
        },
        {
          q: "La gran ventaja de un SUBAGENTE es que:",
          options: [
            "Trabaja en un contexto aislado y devuelve solo un resumen",
            "Borra archivos más rápido",
            "No necesita permisos para nada",
            "Sustituye al control de versiones",
          ],
          answer: 0,
          explain:
            "El subagente consume su propio contexto y reporta la conclusión, manteniendo limpia la conversación principal.",
        },
        {
          q: "¿Con qué comando creas y gestionas subagentes personalizados?",
          options: ["/agents", "/delete-all", "/sudo", "/magic"],
          answer: 0,
          explain:
            "El comando /agents permite crear subagentes especializados (revisor de código, documentador…).",
        },
        {
          q: "Según el curso, un subagente FIABLE se diseña con:",
          options: [
            "Salida estructurada, reporte de errores y herramientas restringidas",
            "Acceso total a todo y sin formato de salida",
            "El máximo de tareas posibles a la vez",
            "Instrucciones lo más vagas posible",
          ],
          answer: 0,
          explain:
            "Restringir herramientas y exigir salidas estructuradas con errores explícitos hace a los subagentes predecibles.",
        },
        {
          q: "¿Qué es una Agent Skill?",
          options: [
            "Una carpeta con SKILL.md que Claude carga automáticamente cuando la tarea coincide",
            "Un certificado oficial de programación",
            "Un atajo de teclado",
            "Un plan de pago premium",
          ],
          answer: 0,
          explain:
            "Las Skills son instrucciones reutilizables en markdown; el frontmatter con su descripción actúa de disparador.",
        },
        {
          q: "¿Qué diferencia clave hay entre una Skill y CLAUDE.md?",
          options: [
            "La Skill se carga solo cuando la tarea coincide; CLAUDE.md se lee siempre",
            "CLAUDE.md es de pago y las Skills no",
            "Las Skills solo funcionan en Windows",
            "Ninguna: son el mismo archivo",
          ],
          answer: 0,
          explain:
            "Las Skills son eficientes en contexto: solo ocupan espacio cuando son relevantes. CLAUDE.md es contexto permanente del proyecto.",
        },
        {
          q: "Quieres que el código se formatee SIEMPRE tras cada edición, sin depender de que Claude se acuerde. Usas:",
          options: [
            "Un hook (script automático en el evento de edición)",
            "Pedirlo amablemente en cada prompt",
            "Un post-it en el monitor",
            "Subir la temperature",
          ],
          answer: 0,
          explain:
            "Los hooks dan control determinista: se ejecutan siempre en su evento, a diferencia de las instrucciones en lenguaje natural.",
        },
        {
          q: "Un custom slash command es:",
          options: [
            "Un prompt reutilizable guardado como markdown que invocas con /nombre",
            "Un virus de terminal",
            "Una tecla rota",
            "Un tipo de commit de git",
          ],
          answer: 0,
          explain:
            "Se guardan en .claude/commands y empaquetan flujos repetitivos del equipo en un solo comando.",
        },
        {
          q: "¿Cómo se comparten las Skills con tu equipo?",
          options: [
            "Vía repositorios, plugins o configuración gestionada de empresa",
            "Solo imprimiéndolas en papel",
            "No se pueden compartir",
            "Por mensaje de texto SMS",
          ],
          answer: 0,
          explain:
            "El curso de Agent Skills cubre distribución por repos, plugins y enterprise-managed settings para estandarizar equipos.",
        },
        {
          q: "El SDK de Claude Code (Agent SDK) sirve para:",
          options: [
            "Construir tus propios agentes sobre la infraestructura de Claude Code",
            "Minar criptomonedas",
            "Cambiar el fondo de pantalla",
            "Comprimir archivos ZIP",
          ],
          answer: 0,
          explain:
            "El SDK expone el bucle agéntico, las herramientas y los permisos para que construyas agentes a medida.",
        },
      ],
    },

    /* ================================================================ */
    /* MUNDO 7 — MCP: intro + temas avanzados                            */
    /* ================================================================ */
    {
      id: "mcp",
      name: "Model Context Protocol",
      icon: "link",
      color: "#1971c2",
      blurb:
        "El estándar abierto que conecta IA con herramientas y datos: tools, resources y prompts; JSON-RPC; transportes stdio y StreamableHTTP; sampling, notificaciones y roots.",
      lessons: [
        {
          title: "¿Qué problema resuelve MCP?",
          body:
            "Antes, conectar M aplicaciones de IA con N herramientas exigía M×N integraciones a medida. MCP es un estándar abierto que lo reduce a un protocolo común: se le llama 'el USB-C de las apps de IA'.",
        },
        {
          title: "Host, cliente y servidor",
          body:
            "Un HOST (Claude Desktop, Claude Code…) contiene CLIENTES MCP, y cada cliente mantiene una conexión con un SERVIDOR MCP. El servidor expone capacidades; el cliente las consume en nombre del modelo.",
        },
        {
          title: "Las tres primitivas",
          body:
            "TOOLS: funciones que el MODELO decide invocar (model-controlled). RESOURCES: datos de solo lectura identificados por URI que la APLICACIÓN adjunta como contexto (app-controlled). PROMPTS: plantillas que el USUARIO invoca explícitamente (user-controlled).",
        },
        {
          title: "Probar servidores: el Inspector",
          body:
            "El MCP Inspector es una herramienta de desarrollo en el navegador para conectar con tu servidor, listar sus tools/resources/prompts y probarlos sin necesidad de un cliente completo. Imprescindible al desarrollar.",
        },
        {
          title: "Mensajes JSON-RPC",
          body:
            "MCP habla JSON-RPC 2.0. Hay dos familias de mensajes: REQUESTS, que esperan un RESULT (o error) de vuelta, y NOTIFICATIONS, que se envían sin esperar respuesta (p. ej. avisos de progreso).",
        },
        {
          title: "Transportes: stdio y StreamableHTTP",
          body:
            "STDIO conecta con un servidor que corre como proceso local (entrada/salida estándar): simple y seguro para herramientas locales. StreamableHTTP sirve para servidores REMOTOS, usando HTTP y Server-Sent Events para streaming.",
        },
        {
          title: "Avanzado: sampling, notificaciones y roots",
          body:
            "SAMPLING: el servidor puede pedir al CLIENTE que haga una llamada al LLM por él (así el servidor no necesita su propia API key). NOTIFICACIONES de log/progreso informan en tiempo real. ROOTS declaran qué directorios puede tocar el servidor: límites de seguridad.",
        },
        {
          title: "Escalar en producción",
          body:
            "Un servidor StreamableHTTP SIN estado (stateless) puede replicarse horizontalmente detrás de un load balancer: cualquier instancia atiende cualquier petición. Si mantienes estado por sesión, el escalado se complica.",
        },
      ],
      questions: [
        {
          q: "¿Qué problema resuelve MCP?",
          options: [
            "Evitar M×N integraciones a medida con un protocolo estándar común",
            "Hacer los modelos más grandes",
            "Comprimir vídeos",
            "Sustituir a Internet",
          ],
          answer: 0,
          explain:
            "Un protocolo común: cualquier servidor MCP sirve a cualquier host compatible, como el USB-C.",
        },
        {
          q: "En MCP, ¿qué contiene un HOST como Claude Desktop?",
          options: [
            "Clientes MCP que se conectan a servidores",
            "Los pesos del modelo de lenguaje",
            "Una copia de GitHub",
            "El sistema operativo completo",
          ],
          answer: 0,
          explain:
            "Arquitectura: Host → contiene clientes → cada cliente se conecta a un servidor MCP.",
        },
        {
          q: "¿Cuáles son las tres primitivas que expone un servidor MCP?",
          options: [
            "Tools, Resources y Prompts",
            "HTML, CSS y JavaScript",
            "GET, POST y DELETE",
            "Entrada, Proceso y Salida",
          ],
          answer: 0,
          explain:
            "Tools (acciones), Resources (datos por URI) y Prompts (plantillas reutilizables).",
        },
        {
          q: "¿Quién decide cuándo invocar una TOOL de MCP?",
          options: [
            "El modelo (son model-controlled)",
            "El usuario con un menú",
            "El servidor unilateralmente",
            "Nadie: se ejecutan al azar",
          ],
          answer: 0,
          explain:
            "Tools = model-controlled; Resources = app-controlled; Prompts = user-controlled. Cada primitiva tiene su 'dueño'.",
        },
        {
          q: "Los RESOURCES de un servidor MCP son:",
          options: [
            "Datos de solo lectura identificados por un URI que se adjuntan como contexto",
            "Funciones que modifican la base de datos",
            "Monedas virtuales del protocolo",
            "Servidores de respaldo",
          ],
          answer: 0,
          explain:
            "Un resource expone datos (documentos, registros…) vía URI para que la aplicación los inyecte como contexto.",
        },
        {
          q: "Para probar tu servidor MCP recién creado sin escribir un cliente, usas:",
          options: [
            "El MCP Inspector en el navegador",
            "Una impresora",
            "El administrador de tareas",
            "Un editor de imágenes",
          ],
          answer: 0,
          explain:
            "El Inspector lista y ejecuta tools/resources/prompts de tu servidor: la herramienta de desarrollo estándar.",
        },
        {
          q: "¿Sobre qué especificación de mensajes se construye MCP?",
          options: ["JSON-RPC 2.0", "SOAP", "FTP", "Morse"],
          answer: 0,
          explain:
            "Todos los mensajes MCP son JSON-RPC 2.0 sobre un transporte (stdio o StreamableHTTP).",
        },
        {
          q: "¿Qué diferencia un REQUEST de una NOTIFICATION en MCP?",
          options: [
            "El request espera un result; la notification no espera respuesta",
            "El request es más corto",
            "La notification cuesta dinero",
            "Son exactamente lo mismo",
          ],
          answer: 0,
          explain:
            "Requests forman pares petición-respuesta; las notifications (p. ej. progreso) se emiten sin esperar contestación.",
        },
        {
          q: "¿Qué transporte usarías para un servidor MCP REMOTO en producción?",
          options: [
            "StreamableHTTP (HTTP + Server-Sent Events)",
            "stdio",
            "Bluetooth",
            "Paloma mensajera",
          ],
          answer: 0,
          explain:
            "stdio es para procesos locales; StreamableHTTP es el transporte para servidores remotos con streaming.",
        },
        {
          q: "El 'sampling' en MCP permite que:",
          options: [
            "El servidor pida al cliente hacer una llamada al LLM en su nombre",
            "El servidor reproduzca música",
            "El cliente borre el servidor",
            "El modelo se entrene solo",
          ],
          answer: 0,
          explain:
            "Con sampling el servidor delega la llamada al modelo en el cliente: no necesita su propia API key ni configuración.",
        },
        {
          q: "Los ROOTS en MCP sirven para:",
          options: [
            "Declarar qué directorios puede acceder el servidor: un límite de seguridad",
            "Plantar árboles digitales",
            "Acelerar la red",
            "Cambiar la raíz cuadrada",
          ],
          answer: 0,
          explain:
            "Roots comunica al servidor los límites del sistema de archivos en los que puede operar.",
        },
        {
          q: "Para escalar un servidor MCP horizontalmente tras un load balancer conviene que sea:",
          options: [
            "Stateless (sin estado por sesión) con StreamableHTTP",
            "Stateful con memoria en cada instancia",
            "Un proceso stdio en tu portátil",
            "Imposible de replicar",
          ],
          answer: 0,
          explain:
            "Sin estado por sesión, cualquier réplica atiende cualquier petición: el patrón de escalado horizontal clásico.",
        },
      ],
    },

    /* ================================================================ */
    /* MUNDO 8 — Bedrock, Vertex AI y Claude Cowork                      */
    /* ================================================================ */
    {
      id: "deploy",
      name: "Despliegue cloud y Cowork",
      icon: "cloud",
      color: "#e8590c",
      blurb:
        "Claude en Amazon Bedrock (boto3, IAM) y Google Cloud Vertex AI; qué cambia y qué no entre plataformas; y Claude Cowork: tareas delegadas, skills, plugins y seguridad.",
      lessons: [
        {
          title: "¿Por qué usar Claude vía un cloud?",
          body:
            "Empresas que ya operan en AWS o Google Cloud pueden usar Claude manteniendo datos, facturación, seguridad y gobernanza dentro de su nube: cumplen requisitos de residencia de datos y aprovechan acuerdos existentes.",
        },
        {
          title: "Claude en Amazon Bedrock",
          body:
            "Bedrock es el servicio gestionado de modelos fundacionales de AWS. Desde Python se invoca con el SDK boto3, y los permisos se controlan con IAM (roles y políticas). Los modelos se identifican con model IDs propios de Bedrock.",
        },
        {
          title: "Claude en Vertex AI",
          body:
            "Vertex AI es la plataforma de ML de Google Cloud: ofrece Claude como modelo gestionado con la autenticación de Google Cloud, selección de región y la integración MLOps de GCP. Mismo patrón, otra nube.",
        },
        {
          title: "Lo que NO cambia",
          body:
            "Clave de ambos cursos: las TÉCNICAS son las mismas en cualquier plataforma. Prompting, system prompts, tool use, RAG, evals, caching, extended thinking y MCP funcionan igual: solo cambian la autenticación, el SDK y los identificadores de modelo.",
        },
        {
          title: "Claude Cowork",
          body:
            "Cowork es el espacio de trabajo agéntico de Claude: DESCRIBES la tarea, Claude PLANIFICA y la EJECUTA en pasos, y tú DIRIGES por el camino. Pensado para trabajo real multi-paso: informes, análisis, documentos.",
        },
        {
          title: "Personalizar Cowork",
          body:
            "Para mejores resultados: instrucciones globales y proyectos (contexto permanente), SKILLS que enseñan tu manera de trabajar, y PLUGINS que encapsulan la experiencia del equipo. Claude también se integra en Chrome y Microsoft 365.",
        },
        {
          title: "Seguridad al compartir",
          body:
            "Antes de compartir lo que construyes: valida las skills de los plugins, revisa qué datos puede tocar Claude y aplica las buenas prácticas de trabajo seguro. Compartir multiplica el valor… y también los riesgos si no se revisa.",
        },
      ],
      questions: [
        {
          q: "Amazon Bedrock es:",
          options: [
            "El servicio gestionado de AWS para invocar modelos fundacionales como Claude",
            "Un lenguaje de programación de Amazon",
            "Una base de datos relacional",
            "Un servicio de mensajería",
          ],
          answer: 0,
          explain:
            "Bedrock da acceso gestionado a Claude con la infraestructura y seguridad de AWS.",
        },
        {
          q: "¿Qué SDK de Python se usa típicamente para llamar a Claude en Bedrock?",
          options: ["boto3", "numpy", "matplotlib", "flask"],
          answer: 0,
          explain:
            "boto3 es el SDK oficial de AWS para Python; con él se invocan los modelos de Bedrock.",
        },
        {
          q: "Los permisos de acceso a Bedrock se gestionan con:",
          options: [
            "AWS IAM (roles y políticas)",
            "Un archivo de Excel compartido",
            "Contraseñas por correo",
            "No necesita permisos",
          ],
          answer: 0,
          explain:
            "IAM controla quién puede invocar qué modelos: el sistema de permisos estándar de AWS.",
        },
        {
          q: "Vertex AI es la plataforma de ML de:",
          options: ["Google Cloud", "Amazon", "Microsoft", "Oracle"],
          answer: 0,
          explain:
            "Vertex AI (GCP) ofrece Claude como modelo gestionado con la autenticación y regiones de Google Cloud.",
        },
        {
          q: "Al pasar de la API directa a Bedrock o Vertex, ¿qué SE MANTIENE igual?",
          options: [
            "Las técnicas: prompting, tool use, RAG, evals, caching…",
            "Absolutamente nada",
            "Solo el color del logo",
            "El precio exacto por token",
          ],
          answer: 0,
          explain:
            "Cambian autenticación, SDK y model IDs; las técnicas de construcción son idénticas en las tres vías.",
        },
        {
          q: "La razón principal de una empresa para usar Claude vía su proveedor cloud es:",
          options: [
            "Mantener datos, gobernanza y facturación dentro de su nube existente",
            "Que el modelo es más inteligente ahí",
            "Que es la única forma de usar Claude",
            "Evitar escribir prompts",
          ],
          answer: 0,
          explain:
            "Residencia de datos, seguridad y acuerdos existentes: el modelo y las técnicas son los mismos.",
        },
        {
          q: "El modelo de trabajo de Claude Cowork es:",
          options: [
            "Describes la tarea, Claude planifica y ejecuta, tú diriges por el camino",
            "Claude decide solo qué tareas hacer sin consultarte",
            "Tú escribes el código y Claude mira",
            "Todo se hace por videollamada",
          ],
          answer: 0,
          explain:
            "Cowork es trabajo agéntico supervisado: delegación con dirección humana continua.",
        },
        {
          q: "En Cowork, los PLUGINS sirven para:",
          options: [
            "Encapsular la experiencia y formas de trabajar de tu equipo",
            "Reproducir música de fondo",
            "Cambiar el idioma del teclado",
            "Acelerar el WiFi",
          ],
          answer: 0,
          explain:
            "Los plugins empaquetan skills y conocimiento del equipo para reutilizarlos y compartirlos.",
        },
        {
          q: "Además de la app, ¿dónde más puedes usar Claude según el curso de Cowork?",
          options: [
            "En Chrome y en Microsoft 365",
            "Solo en máquinas de escribir",
            "Únicamente en consolas de videojuegos",
            "En ningún otro sitio",
          ],
          answer: 0,
          explain:
            "Claude se integra en el navegador (Chrome) y en Microsoft 365 para trabajar donde ya trabajas.",
        },
        {
          q: "Antes de compartir un plugin con tu equipo, la buena práctica es:",
          options: [
            "Validar sus skills y revisar qué datos puede tocar",
            "Compartirlo sin mirar: la velocidad es lo primero",
            "Borrarlo por si acaso",
            "Imprimirlo y archivarlo",
          ],
          answer: 0,
          explain:
            "El curso dedica una sección a sharing & safety: validar skills y trabajar con datos de forma segura antes de distribuir.",
        },
      ],
    },
  ],
};

/* ===================================================================
   CAPA NARRATIVA — "Construye y lanza tu producto con IA"
   La historia es el envoltorio; la documentación de Claude es la carga.
   Cada mundo = una capacidad que necesitas para lanzar tu asistente.
   =================================================================== */

const GAME_STORY = {
  fundamentals: {
    mission:
      "Antes de construir nada, tienes que conocer tu materia prima: cómo 'piensa' el modelo con el que vas a trabajar. Hoy estudias sus cuatro propiedades y las herramientas de Claude.ai. Sin esto, todo lo demás se construye sobre arena.",
    outcome: "Ya entiendes con qué trabajas. Tu cuaderno de builder está abierto.",
  },
  fluency: {
    mission:
      "Un buen producto no nace de pedirle cosas a la IA al azar. Aprende el marco 4D para colaborar con criterio —delegar, describir, discernir y ser diligente— y no a ciegas.",
    outcome: "Tienes un método para colaborar con IA con criterio y responsabilidad.",
  },
  api: {
    mission:
      "Hora de dar vida a tu producto: que HABLE. Conecta con la Claude API y aprende a controlar sus respuestas (mensajes, system prompt, temperature, streaming, caching).",
    outcome: "🗣️ Tu asistente ya responde por API. ¡Está vivo!",
  },
  prompting: {
    mission:
      "Tu asistente habla, pero a veces inventa. Aprende prompting, evaluación y RAG para que responda con precisión usando los documentos reales de tu empresa.",
    outcome: "🎯 Tu asistente cita fuentes y lo mides con evals. Adiós a las alucinaciones.",
  },
  agents: {
    mission:
      "Un asistente que solo habla se queda corto. Dale herramientas para que ACTÚE: busque, calcule, ejecute. Aprende tool use, el agent loop y cuándo usar workflows o agentes.",
    outcome: "🛠️ Tu asistente usa herramientas y decide pasos. Ya es un agente.",
  },
  claudecode: {
    mission:
      "Construir a mano es lento. Incorpora a Claude Code a tu equipo para programar más rápido y con mejores prácticas: workflow, subagentes, skills y hooks.",
    outcome: "⚡ Tu velocidad de desarrollo se dispara con Claude Code.",
  },
  mcp: {
    mission:
      "Tu producto necesita conectarse al mundo real: bases de datos, APIs, archivos. Aprende MCP, el estándar abierto que conecta tu IA con herramientas y datos externos.",
    outcome: "🔌 Tu asistente se conecta a sistemas externos vía MCP.",
  },
  deploy: {
    mission:
      "Último paso: llevar tu producto a producción y compartirlo con tu equipo. Despliega en Amazon Bedrock o Google Vertex AI y colabora en Claude Cowork.",
    outcome: "🚀 ¡LANZAMIENTO! Tu producto de IA está en producción.",
  },
};

/* Reto de lanzamiento (jefe) por mundo: escenario APLICADO, no definición. */
const GAME_BOSS = {
  fundamentals: {
    q: "Un usuario dice que Claude 'mintió' sobre una noticia de la semana pasada. ¿Cuál es la explicación más probable y la mejor solución?",
    options: [
      "Es posterior a su fecha de corte; dale búsqueda web o el contexto del hecho",
      "El modelo está roto; hay que reinstalarlo",
      "Claude nunca se equivoca; miente el usuario",
      "Subir la temperature lo arreglará",
    ],
    answer: 0,
    explain:
      "Sin acceso a información actual, el modelo rellena el hueco con texto plausible (alucinación). La solución es aportarle el dato: búsqueda web o contexto.",
  },
  fluency: {
    q: "Vas a redactar la memoria anual de tu ONG con IA usando datos de donantes. ¿Qué aplicas PRIMERO según el marco 4D?",
    options: [
      "Diligence (privacidad de datos) al delegar, y Discernment para verificar lo escrito",
      "Solo Description: con un buen prompt basta",
      "Delegar todo y publicar sin revisar",
      "Nada: las 4D no aplican a textos",
    ],
    answer: 0,
    explain:
      "Con datos sensibles, la Diligencia (privacidad) gobierna la delegación y el Discernimiento verifica el resultado antes de publicar.",
  },
  api: {
    q: "Tu chatbot debe recordar lo dicho hace 3 mensajes, pero 'se olvida'. ¿Qué falla en tu integración?",
    options: [
      "No reenvías el historial completo; la API es stateless",
      "La temperature está demasiado baja",
      "Falta activar el streaming",
      "El modelo tiene poca memoria RAM",
    ],
    answer: 0,
    explain:
      "La API no guarda estado: cada llamada debe incluir todo el historial. Tu aplicación es la dueña de la memoria.",
  },
  prompting: {
    q: "Cliente: 'el asistente debe responder SOLO con datos de nuestros manuales y citar de dónde'. ¿Qué montas?",
    options: [
      "RAG para recuperar fragmentos de los manuales + citations para referenciarlos",
      "Subir max_tokens al máximo",
      "Reentrenar el modelo desde cero con los manuales",
      "Pedirlo en el system prompt y confiar",
    ],
    answer: 0,
    explain:
      "RAG inyecta solo los fragmentos relevantes y las citations anclan cada afirmación a su fuente: respuestas fundamentadas y verificables.",
  },
  agents: {
    q: "Tu agente debe consultar el tiempo y reservar una sala. La tarea es predecible y siempre igual. ¿Agente o workflow?",
    options: [
      "Workflow: pasos fijos, más barato, fiable y depurable",
      "Un agente complejo con 20 herramientas",
      "Computer use obligatoriamente",
      "Ninguno: es imposible de automatizar",
    ],
    answer: 0,
    explain:
      "Si los pasos son predecibles, un workflow es más adecuado. Reserva los agentes para cuando haga falta decidir dinámicamente.",
  },
  claudecode: {
    q: "Quieres que TODO el equipo formatee el código igual tras cada edición, sin depender de recordarlo. ¿Qué usas?",
    options: [
      "Un hook en el evento de edición (control determinista)",
      "Un recordatorio en el system prompt",
      "Un subagente nuevo por cada archivo",
      "Pedirlo amablemente cada vez",
    ],
    answer: 0,
    explain:
      "Los hooks se ejecutan siempre en su evento: control determinista, ideal para formateo, lint o notificaciones consistentes.",
  },
  mcp: {
    q: "Construyes un servidor MCP remoto para miles de usuarios que debe escalar tras un load balancer. ¿Cómo lo diseñas?",
    options: [
      "Stateless con StreamableHTTP, para replicarlo horizontalmente",
      "Con estado por sesión en la memoria de cada instancia",
      "Con transporte stdio en tu portátil",
      "Sin protocolo: HTTP plano a mano",
    ],
    answer: 0,
    explain:
      "Sin estado por sesión, cualquier réplica atiende cualquier petición: el patrón de escalado horizontal con StreamableHTTP.",
  },
  deploy: {
    q: "Tu empresa ya opera en AWS con requisitos de residencia de datos. ¿Cómo despliegas Claude conservando tu prompting y tool use?",
    options: [
      "Vía Amazon Bedrock (boto3 + IAM); las técnicas no cambian",
      "Reescribiendo todo desde cero para Bedrock",
      "Solo con la API directa, ignorando AWS",
      "Es imposible usar Claude dentro de AWS",
    ],
    answer: 0,
    explain:
      "Bedrock mantiene datos y gobernanza en AWS; cambian autenticación, SDK y model IDs, pero prompting, tool use, RAG y caching son idénticos.",
  },
};

/* Preguntas de FORMATO VARIADO (tf = verdadero/falso, order = ordenar,
   match = emparejar) que se suman al banco de cada mundo. */
const GAME_EXTRA = {
  fundamentals: [
    {
      type: "tf",
      q: "Dentro de una misma conversación, Claude 'recuerda' lo dicho antes porque cabe en su ventana de contexto.",
      answer: true,
      explain:
        "La memoria de trabajo es la ventana de contexto: lo que cabe en la conversación actual. Entre conversaciones separadas no hay memoria automática.",
    },
    {
      type: "match",
      q: "Empareja cada propiedad del modelo con su descripción:",
      pairs: [
        ["Predicción de tokens", "Genera el siguiente fragmento más probable"],
        ["Conocimiento", "Limitado por la fecha de corte"],
        ["Memoria de trabajo", "Es la ventana de contexto"],
        ["Steerability", "Sensibilidad a las instrucciones"],
      ],
      explain: "Las cuatro propiedades del curso 'AI Capabilities and Limitations'.",
    },
  ],
  fluency: [
    {
      type: "match",
      q: "Empareja cada 'D' del marco con su esencia:",
      pairs: [
        ["Delegation", "Qué tarea dar a la IA y cuál no"],
        ["Description", "Comunicar con claridad lo que quieres"],
        ["Discernment", "Evaluar críticamente la salida"],
        ["Diligence", "Uso responsable y transparente"],
      ],
      explain: "El marco 4D: Delegación, Descripción, Discernimiento y Diligencia.",
    },
    {
      type: "tf",
      q: "Delegar una tarea a la IA te exime de la responsabilidad sobre el resultado.",
      answer: false,
      explain:
        "Falso: el bucle Delegation-Diligence mantiene SIEMPRE tu responsabilidad final. Delegar no es desentenderse.",
    },
  ],
  api: [
    {
      type: "order",
      q: "Ordena el flujo de una conversación multi-turno por API:",
      steps: [
        "Envías 'messages' con el historial",
        "Claude responde con un mensaje del asistente",
        "Añades esa respuesta a tu historial",
        "Reenvías el historial completo en la siguiente llamada",
      ],
      explain:
        "La API es stateless: tu app acumula y reenvía todo el historial en cada turno.",
    },
    {
      type: "tf",
      q: "Una temperature baja (≈0) produce respuestas más deterministas y consistentes.",
      answer: true,
      explain:
        "Correcto: menos aleatoriedad. Sube la temperature solo cuando busques variedad o creatividad.",
    },
  ],
  prompting: [
    {
      type: "order",
      q: "Ordena el workflow de evaluación de prompts:",
      steps: [
        "Generar un dataset de casos de prueba",
        "Ejecutar el prompt sobre cada caso",
        "Calificar las salidas (por código o por modelo)",
        "Iterar el prompt y repetir",
      ],
      explain: "Las evals hacen del prompting una disciplina medible, no intuición.",
    },
    {
      type: "match",
      q: "Empareja cada pieza de un pipeline RAG con lo que aporta:",
      pairs: [
        ["Embeddings", "Búsqueda por significado"],
        ["BM25", "Coincidencia de palabras exactas"],
        ["Reranking", "Reordena por relevancia"],
        ["Chunking", "Trocea los documentos"],
      ],
      explain:
        "RAG combina búsqueda semántica y léxica, con troceado previo y reranking final.",
    },
  ],
  agents: [
    {
      type: "order",
      q: "Ordena el agent loop:",
      steps: [
        "El modelo observa el estado",
        "Decide la siguiente acción (una herramienta)",
        "Tu código la ejecuta y devuelve el resultado",
        "El modelo continúa hasta lograr el objetivo",
      ],
      explain:
        "La inteligencia del agente está en que el MODELO decide cada paso según los resultados.",
    },
    {
      type: "match",
      q: "Empareja cada patrón de workflow con su idea:",
      pairs: [
        ["Chaining", "Encadenar pasos secuenciales"],
        ["Routing", "Clasificar y derivar la entrada"],
        ["Parallelization", "Subtareas simultáneas"],
      ],
      explain: "Los workflows orquestan LLMs con pasos predefinidos por código.",
    },
  ],
  claudecode: [
    {
      type: "order",
      q: "Ordena el workflow diario recomendado en Claude Code:",
      steps: [
        "Explore (explorar el código relevante)",
        "Plan (planificar el enfoque)",
        "Code (implementar)",
        "Commit (guardar los cambios)",
      ],
      explain:
        "Explore → Plan → Code → Commit: saltarse la exploración y el plan degrada el resultado.",
    },
    {
      type: "tf",
      q: "Una Skill se carga siempre en el contexto, igual que CLAUDE.md.",
      answer: false,
      explain:
        "Falso: la Skill se carga solo cuando la tarea coincide con su descripción; CLAUDE.md es contexto permanente del proyecto.",
    },
  ],
  mcp: [
    {
      type: "match",
      q: "Empareja cada primitiva MCP con quién la controla:",
      pairs: [
        ["Tools", "El modelo"],
        ["Resources", "La aplicación"],
        ["Prompts", "El usuario"],
      ],
      explain:
        "Tools = model-controlled, Resources = app-controlled, Prompts = user-controlled.",
    },
    {
      type: "tf",
      q: "El transporte stdio se usa para servidores MCP remotos en producción.",
      answer: false,
      explain:
        "Falso: stdio es para procesos locales. Para remotos se usa StreamableHTTP (HTTP + SSE).",
    },
  ],
  deploy: [
    {
      type: "tf",
      q: "Al pasar a Bedrock o Vertex AI, tus técnicas de prompting y tool use cambian por completo.",
      answer: false,
      explain:
        "Falso: cambian autenticación, SDK y model IDs. Prompting, tool use, RAG y caching son idénticos.",
    },
    {
      type: "match",
      q: "Empareja cada plataforma con lo que es:",
      pairs: [
        ["Amazon Bedrock", "Modelos gestionados en AWS"],
        ["Vertex AI", "Modelos gestionados en Google Cloud"],
        ["Claude Cowork", "Espacio de trabajo agéntico"],
      ],
      explain:
        "Bedrock (AWS) y Vertex AI (GCP) ofrecen Claude gestionado; Cowork es el espacio colaborativo.",
    },
  ],
};

/* Fusionar narrativa, jefes y preguntas extra en cada mundo. */
GAME_DATA.worlds.forEach(function (w) {
  const st = GAME_STORY[w.id];
  if (st) {
    w.mission = st.mission;
    w.outcome = st.outcome;
  }
  if (GAME_BOSS[w.id]) w.boss = GAME_BOSS[w.id];
  if (GAME_EXTRA[w.id]) w.questions = w.questions.concat(GAME_EXTRA[w.id]);
});

// Exponer en navegador.
if (typeof window !== "undefined") {
  window.GAME_DATA = GAME_DATA;
}

// Exponer en Node para validación.
if (typeof module !== "undefined" && module.exports) {
  module.exports = GAME_DATA;
}
