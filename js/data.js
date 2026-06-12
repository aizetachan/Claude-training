/*
 * data.js — Contenido educativo del juego "Claude Academy".
 *
 * Cada "mundo" (world) corresponde a una categoría de los cursos oficiales
 * de Claude (https://claude.com/resources/courses). Dentro de cada mundo hay:
 *   - lessons[]   : tarjetas de enseñanza breves que se muestran antes de jugar.
 *   - questions[] : preguntas de opción múltiple con explicación.
 *
 * El contenido está pensado para aprender los conceptos clave de los cursos
 * jugando. Las explicaciones refuerzan la respuesta correcta.
 */

const GAME_DATA = {
  meta: {
    title: "Claude Academy",
    subtitle: "Aprende todos los cursos de Claude jugando",
    version: "1.0.0",
  },

  worlds: [
    /* ----------------------------------------------------------------- */
    /* MUNDO 1 — Claude 101 + Capacidades y Límites                       */
    /* ----------------------------------------------------------------- */
    {
      id: "fundamentals",
      name: "Fundamentos de Claude",
      icon: "🌱",
      color: "#7c5cff",
      blurb:
        "Qué es Claude, cómo es un buen prompt y qué puede (y no puede) hacer un modelo de lenguaje. Basado en 'Claude 101' y 'AI Capabilities and Limitations'.",
      lessons: [
        {
          title: "¿Qué es Claude?",
          body:
            "Claude es una familia de modelos de lenguaje grande (LLM) creada por Anthropic. Predice texto a partir de un contexto y se entrena con técnicas de seguridad para ser útil, honesto e inofensivo (helpful, honest, harmless).",
        },
        {
          title: "La familia de modelos",
          body:
            "Anthropic ofrece variantes optimizadas para distintos equilibrios entre capacidad, velocidad y coste. Opus es el más capaz, Sonnet equilibra inteligencia y velocidad, y Haiku es el más rápido y económico.",
        },
        {
          title: "Anatomía de un buen prompt",
          body:
            "Un prompt eficaz suele incluir: un rol o contexto, una tarea clara, datos de entrada delimitados, y el formato de salida deseado. Ser específico reduce la ambigüedad y mejora el resultado.",
        },
        {
          title: "Capacidades vs. límites",
          body:
            "Claude razona, resume, traduce, programa y analiza. Pero tiene una fecha de corte de conocimiento, puede 'alucinar' datos, no accede a Internet por defecto y no tiene estado entre conversaciones independientes.",
        },
      ],
      questions: [
        {
          q: "¿Qué tipo de sistema es Claude en esencia?",
          options: [
            "Un modelo de lenguaje grande que predice texto",
            "Una base de datos de búsqueda en Internet",
            "Una hoja de cálculo automatizada",
            "Un sistema operativo",
          ],
          answer: 0,
          explain:
            "Claude es un LLM: genera texto prediciendo la continuación más probable dado el contexto recibido.",
        },
        {
          q: "Ordena de MÁS capaz a más rápido/económico los tamaños de modelo:",
          options: [
            "Opus › Sonnet › Haiku",
            "Haiku › Sonnet › Opus",
            "Sonnet › Opus › Haiku",
            "Todos son idénticos",
          ],
          answer: 0,
          explain:
            "Opus es el más capaz, Sonnet equilibra inteligencia/velocidad y Haiku es el más rápido y barato.",
        },
        {
          q: "¿Cuál de estas es una LIMITACIÓN real de un LLM como Claude?",
          options: [
            "Puede inventar datos que suenan plausibles (alucinaciones)",
            "Es incapaz de escribir código",
            "No puede resumir texto",
            "No entiende español",
          ],
          answer: 0,
          explain:
            "Las alucinaciones son un límite conocido: el modelo puede generar afirmaciones falsas con tono seguro. Por eso conviene verificar datos críticos.",
        },
        {
          q: "¿Qué elemento NO suele ser parte de un buen prompt?",
          options: [
            "El número de serie de tu CPU",
            "Una tarea clara",
            "El formato de salida deseado",
            "Contexto o rol",
          ],
          answer: 0,
          explain:
            "Un buen prompt aporta contexto, tarea y formato; detalles de hardware irrelevantes solo añaden ruido.",
        },
        {
          q: "Por defecto, ¿qué ocurre entre dos conversaciones independientes con Claude?",
          options: [
            "No comparte memoria; cada conversación parte de cero",
            "Recuerda todo de forma permanente",
            "Guarda tus datos en una cuenta bancaria",
            "Se conecta con otras personas",
          ],
          answer: 0,
          explain:
            "El modelo no tiene estado entre conversaciones separadas: todo el contexto debe incluirse en el prompt.",
        },
        {
          q: "El acrónimo de los principios de Anthropic 'HHH' significa:",
          options: [
            "Helpful, Honest, Harmless (útil, honesto, inofensivo)",
            "High, Heavy, Hard",
            "Hello, Hi, Hey",
            "Hardware, Hosting, HTTP",
          ],
          answer: 0,
          explain:
            "Anthropic entrena a Claude para ser útil, honesto e inofensivo, un marco central de su enfoque de seguridad.",
        },
      ],
    },

    /* ----------------------------------------------------------------- */
    /* MUNDO 2 — AI Fluency (marco 4D)                                    */
    /* ----------------------------------------------------------------- */
    {
      id: "fluency",
      name: "AI Fluency: el marco 4D",
      icon: "🧭",
      color: "#00b3a4",
      blurb:
        "El marco de Anthropic para colaborar con IA de forma eficaz, eficiente, ética y segura: Delegation, Description, Discernment y Diligence.",
      lessons: [
        {
          title: "¿Qué es la AI Fluency?",
          body:
            "Es la capacidad de colaborar con sistemas de IA de manera eficaz, eficiente, ética y segura. No va solo de saber usar herramientas, sino de hacerlo con criterio.",
        },
        {
          title: "1ª D — Delegation (Delegación)",
          body:
            "Decidir QUÉ tareas dar a la IA y cuáles conservar tú. Implica conocer tus objetivos, las capacidades del sistema y cómo repartir el trabajo entre humano y máquina.",
        },
        {
          title: "2ª D — Description (Descripción)",
          body:
            "Comunicarte con la IA con claridad: explicar el producto que quieres, el proceso a seguir y el rendimiento esperado. Aquí entra el arte del prompting.",
        },
        {
          title: "3ª D — Discernment (Discernimiento)",
          body:
            "Evaluar de forma crítica las respuestas de la IA: ¿es correcto el producto?, ¿fue buen el proceso?, ¿el comportamiento es apropiado? No aceptar las salidas a ciegas.",
        },
        {
          title: "4ª D — Diligence (Diligencia)",
          body:
            "Actuar de forma responsable y transparente: ser honesto sobre el uso de IA, proteger datos, y asumir la responsabilidad final de los resultados.",
        },
      ],
      questions: [
        {
          q: "¿Cuáles son las cuatro 'D' del marco de AI Fluency?",
          options: [
            "Delegation, Description, Discernment, Diligence",
            "Data, Design, Deploy, Debug",
            "Define, Draft, Deliver, Done",
            "Detect, Defend, Deny, Destroy",
          ],
          answer: 0,
          explain:
            "El marco 4D de Anthropic: Delegación, Descripción, Discernimiento y Diligencia.",
        },
        {
          q: "Decidir qué tarea hace la IA y cuál haces tú corresponde a la D de:",
          options: ["Delegation", "Diligence", "Description", "Discernment"],
          answer: 0,
          explain:
            "La Delegación trata de repartir el trabajo entre humano y sistema según objetivos y capacidades.",
        },
        {
          q: "Evaluar críticamente si la respuesta de la IA es correcta es la D de:",
          options: ["Discernment", "Delegation", "Description", "Diligence"],
          answer: 0,
          explain:
            "El Discernimiento es el juicio crítico sobre producto, proceso y comportamiento de la IA.",
        },
        {
          q: "Ser transparente sobre el uso de IA y proteger los datos pertenece a:",
          options: ["Diligence", "Description", "Delegation", "Discernment"],
          answer: 0,
          explain:
            "La Diligencia abarca la responsabilidad ética: transparencia, privacidad y rendición de cuentas.",
        },
        {
          q: "Redactar un prompt claro que explique el formato deseado es sobre todo:",
          options: ["Description", "Delegation", "Diligence", "Discernment"],
          answer: 0,
          explain:
            "La Descripción es comunicar con claridad producto, proceso y rendimiento esperados.",
        },
        {
          q: "La AI Fluency se define como colaborar con IA de forma...",
          options: [
            "Eficaz, eficiente, ética y segura",
            "Rápida y barata únicamente",
            "Sin intervención humana",
            "Solo para programadores",
          ],
          answer: 0,
          explain:
            "Es la habilidad de trabajar con IA de manera eficaz, eficiente, ética y segura.",
        },
      ],
    },

    /* ----------------------------------------------------------------- */
    /* MUNDO 3 — Building with the Claude API                             */
    /* ----------------------------------------------------------------- */
    {
      id: "api",
      name: "Construir con la Claude API",
      icon: "🔌",
      color: "#ff7a45",
      blurb:
        "La Messages API: mensajes, roles, system prompt, tokens, temperatura, tool use, streaming, visión y prompt caching.",
      lessons: [
        {
          title: "La Messages API",
          body:
            "Las peticiones envían una lista de 'messages' con roles 'user' y 'assistant' que se alternan. El modelo responde con un nuevo mensaje del rol 'assistant'.",
        },
        {
          title: "System prompt",
          body:
            "El parámetro 'system' fija el rol, el tono y las reglas globales del asistente. Va aparte de la lista de mensajes y guía todo el comportamiento de la conversación.",
        },
        {
          title: "Tokens y max_tokens",
          body:
            "El texto se descompone en tokens (fragmentos de palabra). Se factura por tokens de entrada y de salida. 'max_tokens' limita cuántos tokens puede generar la respuesta.",
        },
        {
          title: "Temperature",
          body:
            "Controla la aleatoriedad: cerca de 0 = respuestas deterministas y enfocadas; valores más altos = más variadas y creativas. Para tareas factuales se suele bajar.",
        },
        {
          title: "Tool use (function calling)",
          body:
            "Defines herramientas con un JSON schema. Claude puede devolver un 'tool_use' pidiendo ejecutar una; tu código la ejecuta y devuelve un 'tool_result' para que Claude continúe.",
        },
        {
          title: "Streaming, visión y caching",
          body:
            "Con streaming recibes la respuesta token a token (SSE). Claude es multimodal: acepta imágenes además de texto. El 'prompt caching' reutiliza prefijos largos para abaratar y acelerar llamadas repetidas.",
        },
      ],
      questions: [
        {
          q: "En la Messages API, ¿qué dos roles se alternan en la lista 'messages'?",
          options: [
            "'user' y 'assistant'",
            "'admin' y 'guest'",
            "'client' y 'server'",
            "'human' y 'robot'",
          ],
          answer: 0,
          explain:
            "Los mensajes alternan roles 'user' y 'assistant'; el rol 'system' va en un parámetro aparte.",
        },
        {
          q: "¿Para qué sirve el parámetro 'system'?",
          options: [
            "Fijar rol, tono y reglas globales del asistente",
            "Almacenar la respuesta final",
            "Definir el color de la interfaz",
            "Conectar con la base de datos",
          ],
          answer: 0,
          explain:
            "El system prompt establece instrucciones de alto nivel que guían toda la conversación.",
        },
        {
          q: "¿Qué hace 'max_tokens' en una petición?",
          options: [
            "Limita cuántos tokens puede generar la respuesta",
            "Define la temperatura del modelo",
            "Indica el idioma de salida",
            "Cuenta las palabras del system prompt",
          ],
          answer: 0,
          explain:
            "'max_tokens' acota la longitud máxima de la salida generada por el modelo.",
        },
        {
          q: "Para una tarea factual donde quieres salidas consistentes, deberías usar una temperature...",
          options: [
            "Baja (cercana a 0)",
            "Muy alta",
            "Negativa",
            "Igual a max_tokens",
          ],
          answer: 0,
          explain:
            "Temperatura baja reduce la aleatoriedad y produce respuestas más deterministas y enfocadas.",
        },
        {
          q: "En tool use, ¿qué devuelve TU código tras ejecutar la herramienta que pidió Claude?",
          options: [
            "Un bloque 'tool_result' con la salida",
            "Un nuevo system prompt",
            "Un error 404 obligatorio",
            "Nada; Claude lo ejecuta solo",
          ],
          answer: 0,
          explain:
            "Claude emite 'tool_use'; tu aplicación ejecuta la función y responde con 'tool_result' para que Claude prosiga.",
        },
        {
          q: "¿Cómo se definen las herramientas que Claude puede invocar?",
          options: [
            "Con un JSON schema que describe nombre, descripción y parámetros",
            "Con un archivo de imagen",
            "Escribiéndolas en el system prompt en prosa libre",
            "No se pueden definir herramientas",
          ],
          answer: 0,
          explain:
            "Cada herramienta se describe con un esquema (nombre, descripción y JSON schema de entradas) para que Claude sepa cuándo y cómo usarla.",
        },
        {
          q: "El 'prompt caching' sirve principalmente para:",
          options: [
            "Reutilizar prefijos largos y abaratar/acelerar llamadas repetidas",
            "Cifrar la respuesta",
            "Traducir automáticamente",
            "Aumentar la temperatura",
          ],
          answer: 0,
          explain:
            "Cachear un prefijo grande (p. ej. instrucciones o documentos) evita reprocesarlo en cada llamada, reduciendo coste y latencia.",
        },
        {
          q: "Que Claude sea 'multimodal' significa que puede recibir:",
          options: [
            "Texto e imágenes como entrada",
            "Solo números",
            "Solo audio",
            "Únicamente código",
          ],
          answer: 0,
          explain:
            "Los modelos multimodales aceptan imágenes además de texto, permitiendo análisis visual.",
        },
      ],
    },

    /* ----------------------------------------------------------------- */
    /* MUNDO 4 — Claude Code, subagents y agent skills                    */
    /* ----------------------------------------------------------------- */
    {
      id: "claudecode",
      name: "Claude Code en acción",
      icon: "⌨️",
      color: "#2f9e44",
      blurb:
        "El asistente de programación en la terminal: contexto del repo, subagentes, agent skills, slash commands y hooks.",
      lessons: [
        {
          title: "¿Qué es Claude Code?",
          body:
            "Es un agente de codificación que vive en la terminal (y en IDE/web). Lee tu repositorio, edita archivos, ejecuta comandos y trabaja en tareas de ingeniería de forma autónoma con tu permiso.",
        },
        {
          title: "CLAUDE.md y contexto",
          body:
            "Un archivo CLAUDE.md en el repo da contexto persistente: convenciones, comandos de build/test y arquitectura. Claude lo lee para alinear su trabajo con tu proyecto.",
        },
        {
          title: "Subagentes",
          body:
            "Un subagente es una instancia auxiliar con su propio contexto y permisos, ideal para tareas paralelas o de búsqueda amplia. El agente principal delega y recibe solo la conclusión, ahorrando contexto.",
        },
        {
          title: "Agent Skills",
          body:
            "Las Skills empaquetan instrucciones y recursos reutilizables (una carpeta con un SKILL.md) que Claude carga cuando la tarea coincide. Encapsulan conocimiento experto de forma modular.",
        },
        {
          title: "Slash commands y hooks",
          body:
            "Los slash commands (/comando) lanzan flujos predefinidos. Los hooks ejecutan scripts automáticamente en ciertos eventos (p. ej. antes de una herramienta o al terminar), configurados en settings.json.",
        },
      ],
      questions: [
        {
          q: "¿Dónde se ejecuta principalmente Claude Code?",
          options: [
            "En la terminal/CLI (también IDE y web)",
            "Solo dentro de un navegador móvil",
            "En una consola de videojuegos",
            "Únicamente en la nube sin interfaz",
          ],
          answer: 0,
          explain:
            "Claude Code es un agente de línea de comandos, disponible además en IDE, app de escritorio y web.",
        },
        {
          q: "¿Para qué sirve el archivo CLAUDE.md de un repositorio?",
          options: [
            "Dar contexto persistente: convenciones, comandos y arquitectura",
            "Guardar contraseñas en texto plano",
            "Compilar el proyecto",
            "Sustituir al README para usuarios finales",
          ],
          answer: 0,
          explain:
            "CLAUDE.md documenta el proyecto para que el agente trabaje alineado con tus convenciones.",
        },
        {
          q: "Una ventaja clave de usar un SUBAGENTE es:",
          options: [
            "Aísla contexto y devuelve solo la conclusión, ahorrando el contexto principal",
            "Borra el repositorio automáticamente",
            "Elimina la necesidad de permisos",
            "Hace que el modelo olvide la tarea",
          ],
          answer: 0,
          explain:
            "Los subagentes tienen su propio contexto; útiles para búsquedas amplias o trabajo paralelo sin saturar la conversación principal.",
        },
        {
          q: "Una Agent Skill se empaqueta principalmente como:",
          options: [
            "Una carpeta con un archivo SKILL.md más recursos",
            "Un único archivo .exe",
            "Una imagen PNG",
            "Una fila de base de datos",
          ],
          answer: 0,
          explain:
            "Las Skills son carpetas con instrucciones (SKILL.md) y recursos que Claude carga cuando la tarea lo amerita.",
        },
        {
          q: "Los HOOKS en Claude Code permiten:",
          options: [
            "Ejecutar scripts automáticamente en ciertos eventos",
            "Cambiar el modelo a GPT",
            "Desactivar la terminal",
            "Eliminar el historial de git",
          ],
          answer: 0,
          explain:
            "Los hooks disparan comandos en eventos del ciclo de vida (antes/después de herramientas, al terminar, etc.), definidos en settings.json.",
        },
        {
          q: "Un usuario escribe '/review'. ¿Qué es eso?",
          options: [
            "Un slash command que lanza un flujo predefinido",
            "Un error de sintaxis",
            "Un nombre de variable",
            "Un commit de git",
          ],
          answer: 0,
          explain:
            "Los slash commands invocan acciones o skills predefinidas dentro de Claude Code.",
        },
      ],
    },

    /* ----------------------------------------------------------------- */
    /* MUNDO 5 — Model Context Protocol (MCP)                             */
    /* ----------------------------------------------------------------- */
    {
      id: "mcp",
      name: "Model Context Protocol",
      icon: "🔗",
      color: "#1971c2",
      blurb:
        "El estándar abierto para conectar modelos con herramientas y datos: arquitectura cliente-servidor, tools, resources, prompts y transportes.",
      lessons: [
        {
          title: "¿Qué es MCP?",
          body:
            "El Model Context Protocol es un estándar abierto que estandariza cómo las aplicaciones de IA se conectan a herramientas y fuentes de datos externas. Se le llama 'el USB-C de las apps de IA'.",
        },
        {
          title: "Arquitectura cliente-servidor",
          body:
            "Un HOST (p. ej. Claude Desktop) contiene CLIENTES MCP que se conectan a SERVIDORES MCP. Cada servidor expone capacidades concretas; el cliente las consume en nombre del modelo.",
        },
        {
          title: "Las tres primitivas del servidor",
          body:
            "Un servidor MCP puede ofrecer: TOOLS (funciones que el modelo invoca), RESOURCES (datos/contexto que se leen) y PROMPTS (plantillas reutilizables que el usuario puede invocar).",
        },
        {
          title: "Transportes",
          body:
            "MCP define transportes como stdio (proceso local) y HTTP/SSE (remoto). El protocolo de mensajes se basa en JSON-RPC 2.0.",
        },
        {
          title: "Por qué importa",
          body:
            "Antes, cada integración modelo↔herramienta era a medida (problema MxN). MCP ofrece un protocolo común, así un servidor sirve a cualquier host compatible y viceversa.",
        },
      ],
      questions: [
        {
          q: "¿Qué problema resuelve principalmente MCP?",
          options: [
            "Estandarizar cómo la IA se conecta a herramientas y datos externos",
            "Entrenar modelos desde cero",
            "Comprimir imágenes",
            "Reemplazar al sistema operativo",
          ],
          answer: 0,
          explain:
            "MCP es un protocolo abierto que estandariza las conexiones entre modelos y sistemas externos, evitando integraciones a medida.",
        },
        {
          q: "En la arquitectura MCP, el componente que aloja los clientes (como Claude Desktop) se llama:",
          options: ["Host", "Compilador", "Kernel", "Router"],
          answer: 0,
          explain:
            "El host contiene uno o varios clientes MCP que se conectan a servidores. Host → Cliente → Servidor.",
        },
        {
          q: "¿Cuáles son las tres primitivas principales que expone un servidor MCP?",
          options: [
            "Tools, Resources y Prompts",
            "HTML, CSS y JS",
            "GET, POST y PUT",
            "Train, Test y Deploy",
          ],
          answer: 0,
          explain:
            "Un servidor MCP ofrece tools (acciones), resources (datos de contexto) y prompts (plantillas reutilizables).",
        },
        {
          q: "Una analogía popular describe a MCP como:",
          options: [
            "El 'USB-C' de las aplicaciones de IA",
            "El 'motor V8' de los navegadores",
            "El 'disco duro' de la nube",
            "El 'firewall' de los modelos",
          ],
          answer: 0,
          explain:
            "Igual que USB-C conecta dispositivos con un estándar común, MCP conecta modelos con herramientas de forma uniforme.",
        },
        {
          q: "¿Sobre qué formato de mensajes se construye MCP?",
          options: ["JSON-RPC 2.0", "SOAP", "GraphQL", "FTP"],
          answer: 0,
          explain:
            "MCP intercambia mensajes usando JSON-RPC 2.0 sobre transportes como stdio o HTTP/SSE.",
        },
        {
          q: "Un transporte típico para un servidor MCP LOCAL es:",
          options: ["stdio", "Bluetooth", "NFC", "SMTP"],
          answer: 0,
          explain:
            "stdio conecta con un servidor que corre como proceso local; para remotos se usa HTTP/SSE.",
        },
        {
          q: "Si quieres exponer un conjunto de FUNCIONES que el modelo pueda ejecutar, usarías la primitiva:",
          options: ["Tools", "Resources", "Prompts", "Hosts"],
          answer: 0,
          explain:
            "Las Tools son funciones invocables; Resources aportan datos legibles y Prompts son plantillas.",
        },
      ],
    },

    /* ----------------------------------------------------------------- */
    /* MUNDO 6 — Despliegue: Bedrock & Vertex AI + Cowork                 */
    /* ----------------------------------------------------------------- */
    {
      id: "deploy",
      name: "Despliegue en la nube y Cowork",
      icon: "☁️",
      color: "#e8590c",
      blurb:
        "Usar Claude a través de Amazon Bedrock y Google Cloud Vertex AI, y colaborar con Claude Cowork.",
      lessons: [
        {
          title: "Claude en Amazon Bedrock",
          body:
            "Bedrock es el servicio gestionado de modelos fundacionales de AWS. Permite invocar Claude con la infraestructura, seguridad (IAM) y región de AWS, sin gestionar servidores.",
        },
        {
          title: "Claude en Google Cloud Vertex AI",
          body:
            "Vertex AI es la plataforma de ML de Google Cloud. Ofrece Claude como modelo gestionado, integrado con la autenticación, facturación y herramientas MLOps de GCP.",
        },
        {
          title: "¿Por qué un proveedor cloud?",
          body:
            "Empresas ya en AWS o GCP pueden mantener datos y gobernanza dentro de su nube, aprovechar acuerdos existentes y cumplir requisitos de residencia de datos y seguridad.",
        },
        {
          title: "Claude Cowork",
          body:
            "Cowork apunta a la colaboración: trabajar junto a Claude en tareas y proyectos compartidos, ampliando el uso individual hacia flujos de equipo.",
        },
      ],
      questions: [
        {
          q: "Amazon Bedrock es, ante todo:",
          options: [
            "Un servicio gestionado de AWS para invocar modelos fundacionales como Claude",
            "Un lenguaje de programación",
            "Una base de datos NoSQL",
            "Un editor de vídeo",
          ],
          answer: 0,
          explain:
            "Bedrock da acceso gestionado a modelos (incluido Claude) con la seguridad e infraestructura de AWS.",
        },
        {
          q: "Vertex AI pertenece a qué proveedor de nube:",
          options: ["Google Cloud", "Amazon Web Services", "Microsoft Azure", "Oracle Cloud"],
          answer: 0,
          explain:
            "Vertex AI es la plataforma de machine learning de Google Cloud, que ofrece Claude como modelo gestionado.",
        },
        {
          q: "¿Qué control de acceso usarías típicamente para Claude en Bedrock?",
          options: [
            "AWS IAM (roles y políticas)",
            "Un archivo .htaccess",
            "Claves físicas USB",
            "No requiere autenticación",
          ],
          answer: 0,
          explain:
            "En AWS, IAM gestiona permisos mediante roles y políticas, también para invocar modelos en Bedrock.",
        },
        {
          q: "Una razón empresarial para usar Claude vía Bedrock o Vertex en lugar de la API directa es:",
          options: [
            "Mantener datos y gobernanza dentro de su nube existente",
            "Que el modelo sea más inteligente que en otros canales",
            "Eliminar por completo los costes",
            "Evitar tener que escribir prompts",
          ],
          answer: 0,
          explain:
            "El atractivo es la integración con la seguridad, facturación y residencia de datos de la nube ya adoptada por la empresa.",
        },
        {
          q: "Claude Cowork está orientado sobre todo a:",
          options: [
            "La colaboración en tareas y proyectos compartidos",
            "Renderizar videojuegos 3D",
            "Minar criptomonedas",
            "Sustituir a la terminal de Linux",
          ],
          answer: 0,
          explain:
            "Cowork lleva a Claude hacia flujos de trabajo colaborativos de equipo más allá del uso individual.",
        },
      ],
    },
  ],
};

// Exponer en navegador.
if (typeof window !== "undefined") {
  window.GAME_DATA = GAME_DATA;
}
