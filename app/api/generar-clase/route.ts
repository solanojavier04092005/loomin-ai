import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';
export const maxDuration = 300;

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

// =============================================
// SANITIZADOR SIMPLE (no rompe JSON válido)
// =============================================
function sanitizarJSON(texto: string): string {
  return texto
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .replace(/\n(?=.*")/g, '\\n')
    .trim();
}

// =============================================
// LLAMADA SEGURA A DEEPSEEK
// =============================================
async function llamarDeepSeek(prompt: string): Promise<any> {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt }],
    model: "deepseek-chat",
    response_format: { type: "json_object" }
  });

  const contenido = completion.choices[0].message.content || "{}";
  const sanitizado = sanitizarJSON(contenido);
  
  try {
    return JSON.parse(sanitizado);
  } catch (e) {
    console.error("❌ Error parseo JSON. Reintentando con regex...");
    const match = sanitizado.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch {}
    }
    return {};
  }
}

// =============================================
// AGENTE 1: DIRECTOR
// =============================================
async function agenteDirector(inputs: any) {
  const { tema, nivel, idiomaEstudiante, temaGramatical, vocabularioEspecifico, cantidadEjercicios } = inputs;

  const prompt = `Eres un DIRECTOR ACADÉMICO DE ÉLITE en ELE. Planifica una clase explicativa de español.
ESCRIBE TODO EN ESPAÑOL, incluidos los nombres de los temas gramaticales.

DATOS:
- Tema: "${tema}"
- Nivel: ${nivel}
- Idioma del estudiante: ${idiomaEstudiante}
- Temas gramaticales: "${temaGramatical || 'Tú decides (máximo 2)'}"
- Vocabulario: "${vocabularioEspecifico || 'Tú decides (5-8 palabras)'}"
- Ejercicios por tema: ${cantidadEjercicios || 3}

ESTRUCTURA FIJA DE LA CLASE:
1. Portada (título + subtítulo)
2. Resumen (3 puntos de "lo que aprenderemos")
3. Vocabulario (tarjetas con palabras clave)
4. Gramática Tema 1 (explicación visual)
5. Pausa de reflexión
6. Ejercicios del Tema 1
7. Si hay Tema 2: repetir 4-5-6 para Tema 2
8. Si solo hay 1 tema: Lectura interactiva aquí
9. Si hay 2 temas: Lectura al final integrando ambos
10. Cierre (resumen + motivación)

PARA CADA TEMA GRAMATICAL, DECIDE:
- metodo_visual: "tabla_conjugacion", "tabla_comparativa", "mapa_mental" o "esquema_pasos"
- estructura_visual: columnas, filas, qué resaltar
- 2-3 errores comunes de hablantes de ${idiomaEstudiante}
- ${cantidadEjercicios} tipos de ejercicios diferentes (elige entre: multiple_choice, completar_huecos, ordenar_palabras, verdadero_falso)

Devuelve SOLO este JSON (sin comentarios):
{
  "portada": { "titulo": "TÍTULO EN ESPAÑOL", "subtitulo": "Nivel ${nivel}" },
  "resumen": { "puntos": ["PUNTO 1", "PUNTO 2", "PUNTO 3"] },
  "vocabulario": { "palabras": ["PALABRA1", "PALABRA2", "PALABRA3", "PALABRA4", "PALABRA5"] },
  "temas_gramaticales": [
    {
      "tema": "NOMBRE DEL TEMA EN ESPAÑOL",
      "metodo_visual": "tabla_conjugacion",
      "estructura_visual": { "tipo": "tabla", "columnas": ["COL1", "COL2", "COL3"], "instruccion_filas": "QUÉ PONER", "resaltar": "QUÉ RESALTAR" },
      "explicacion": "EXPLICACIÓN BREVE EN ESPAÑOL",
      "ejemplos": ["EJEMPLO 1", "EJEMPLO 2", "EJEMPLO 3"],
      "errores_comunes": [
        { "error": "ERROR COMÚN", "correccion": "FORMA CORRECTA", "explicacion": "POR QUÉ OCURRE" }
      ],
      "ejercicios": [
        { "tipo": "completar_huecos", "instruccion": "QUÉ PRACTICAR" },
        { "tipo": "multiple_choice", "instruccion": "QUÉ PRACTICAR" }
      ]
    }
  ],
  "texto": { "tipo": "historia", "tono": "infantil", "estructuras_a_incluir": ["ESTRUCTURA1"], "preguntas_comprension": ["¿PREGUNTA 1?", "¿PREGUNTA 2?"] },
  "cierre": { "resumen": "RESUMEN FINAL EN ESPAÑOL", "motivacion": "FRASE MOTIVADORA EN ESPAÑOL" }
}`;

  return llamarDeepSeek(prompt);
}

// =============================================
// AGENTE 2: GRAMÁTICA
// =============================================
async function agenteGramatica(planDirector: any, inputs: any) {
  const { nivel } = inputs;
  const resultados = [];

  for (const tema of planDirector.temas_gramaticales || []) {
    const prompt = `Genera HTML visual para enseñar "${tema.tema}" (nivel ${nivel}).
Usa Tailwind CSS. Colores: indigo #4338ca, verde #10b981, rojo #ef4444, amarillo #f59e0b.
Método: ${tema.metodo_visual}. Estructura: ${JSON.stringify(tema.estructura_visual)}.
Ejemplos: ${JSON.stringify(tema.ejemplos)}.
Incluye sección de "Errores comunes" al final.
NO uses etiquetas <html>, <head>, <body>. Solo el div contenedor.
ESCRIBE TODO EL TEXTO EN ESPAÑOL.
Devuelve JSON: { "html": "CÓDIGO AQUÍ" }`;

    const resultado = await llamarDeepSeek(prompt);
    resultados.push({ tema: tema.tema, html: resultado.html || "" });
  }
  return resultados;
}

// =============================================
// AGENTE 3: EJERCICIOS
// =============================================
async function agenteEjercicios(planDirector: any, inputs: any) {
  const { nivel, idiomaEstudiante } = inputs;
  const resultados = [];

  for (const tema of planDirector.temas_gramaticales || []) {
    const ejerciciosTema = [];
    for (const ej of tema.ejercicios || []) {
      const prompt = `Crea un ejercicio interactivo tipo "${ej.tipo}" sobre "${tema.tema}" para nivel ${nivel}.
HTML+Tailwind CSS+JavaScript vanilla. Autocontenido. Sin <html>, <head>, <body>.
Colores: correcto=verde, incorrecto=rojo. Animaciones suaves. Botón de corregir.
ESCRIBE TODO EN ESPAÑOL, excepto traducciones que van en ${idiomaEstudiante}.
Devuelve JSON: { "html": "CÓDIGO AQUÍ" }`;

      const resultado = await llamarDeepSeek(prompt);
      ejerciciosTema.push({ tipo: ej.tipo, html: resultado.html || "" });
    }
    resultados.push({ tema: tema.tema, ejercicios: ejerciciosTema });
  }
  return resultados;
}

// =============================================
// AGENTE 4: TEXTO
// =============================================
async function agenteTexto(planDirector: any, inputs: any) {
  const { nivel, idiomaEstudiante } = inputs;
  const tp = planDirector.texto || {};

  const prompt = `Escribe un texto en español nivel ${nivel}. Tipo: ${tp.tipo || 'historia'}. Tono: ${tp.tono || 'infantil'}.
Gramática a incluir: ${JSON.stringify(tp.estructuras_a_incluir || [])}.
Vocabulario a usar: ${JSON.stringify(planDirector.vocabulario?.palabras || [])}.
SIN ASTERISCOS. Solo texto plano.
Incluye glosario_interactivo con TODAS las palabras clave. Cada entrada: palabra_o_frase, tipo_palabra (sustantivo/verbo/adjetivo/conector), traduccion (en ${idiomaEstudiante}, usa CARACTERES NO PINYIN), ejemplo_es, ejemplo_traducido.
Incluye las preguntas: ${JSON.stringify(tp.preguntas_comprension || [])}.
Devuelve JSON: { "titulo": "...", "texto": "...", "preguntas": [...], "glosario_interactivo": [...] }`;

  return llamarDeepSeek(prompt);
}

// =============================================
// ENSAMBLADOR (ESTRUCTURA CORRECTA DE 8 PASOS)
// =============================================
function ensamblarClase(plan: any, gramatica: any[], ejercicios: any[], texto: any, inputs: any) {
  const { nivel } = inputs;
  const diapositivas: any[] = [];

  // 1. PORTADA
  diapositivas.push({
    tipo: "titulo",
    contenido: {
      titulo: plan.portada?.titulo || "Clase de Español",
      subtitulo: plan.portada?.subtitulo || `Nivel ${nivel}`
    }
  });

  // 2. RESUMEN
  diapositivas.push({
    tipo: "resumen",
    contenido: {
      titulo: "Lo que aprenderemos hoy",
      puntos: plan.resumen?.puntos?.length ? plan.resumen.puntos : ["Tema 1", "Tema 2", "Práctica"]
    }
  });

  // 3. VOCABULARIO
  const palabras = (plan.vocabulario?.palabras || ["ejemplo", "palabra", "español"]).map((p: string) => ({
    espanol: p,
    fonetica: p.toLowerCase().replace(/([aeiouáéíóú])/g, '-$1-').split('-').filter(Boolean).join('-'),
    traduccion: "[Traducción]"
  }));
  diapositivas.push({
    tipo: "vocabulario",
    contenido: { titulo: "Vocabulario clave", palabras }
  });

  // 4-6. Por cada tema gramatical: GRAMÁTICA → PAUSA → EJERCICIOS
  const temas = plan.temas_gramaticales || [];
  
  for (let i = 0; i < temas.length; i++) {
    // 4. GRAMÁTICA
    diapositivas.push({
      tipo: "gramatica_html",
      contenido: {
        titulo: temas[i].tema || `Tema ${i + 1}`,
        tema_numero: i + 1,
        total_temas: temas.length,
        html: gramatica[i]?.html || "<div class='p-8 text-center text-gray-500'>Contenido en preparación</div>",
        errores_comunes: temas[i].errores_comunes || []
      }
    });

    // 5. PAUSA
    diapositivas.push({
      tipo: "pausa_reflexion",
      contenido: {
        titulo: "Momento de reflexión",
        mensaje: `¿Tienes alguna duda sobre "${temas[i].tema}"?`,
        pregunta: "¿Todo claro hasta aquí?"
      }
    });

    // 6. EJERCICIOS
    const ejerciciosTema = ejercicios[i]?.ejercicios || [];
    if (ejerciciosTema.length > 0) {
      ejerciciosTema.forEach((ej: any, j: number) => {
        diapositivas.push({
          tipo: "ejercicio_html",
          contenido: {
            titulo: `Práctica: ${temas[i].tema} (${j + 1}/${ejerciciosTema.length})`,
            ejercicio_numero: j + 1,
            total_ejercicios: ejerciciosTema.length,
            html: ej.html || "<div class='p-8 text-center text-gray-500'>Ejercicio en preparación</div>"
          }
        });
      });
    } else {
      diapositivas.push({
        tipo: "ejercicio_html",
        contenido: {
          titulo: `Práctica: ${temas[i].tema} (1/1)`,
          ejercicio_numero: 1,
          total_ejercicios: 1,
          html: "<div class='p-8 text-center text-gray-500'>Completa los espacios con la forma correcta.</div>"
        }
      });
    }
  }

  // 7. LECTURA
  if (texto?.texto) {
    diapositivas.push({
      tipo: "lectura",
      contenido: {
        titulo: texto.titulo || "Lectura",
        texto: texto.texto || "Texto no disponible.",
        preguntas: texto.preguntas || ["¿Qué has aprendido?"],
        glosario_interactivo: texto.glosario_interactivo || []
      }
    });
  }

  // 8. CIERRE
  diapositivas.push({
    tipo: "cierre",
    contenido: {
      titulo: "¡Excelente trabajo!",
      resumen: plan.cierre?.resumen || "Hoy has aprendido nuevos conceptos de español.",
      motivacion: plan.cierre?.motivacion || "¡Sigue practicando!"
    }
  });

  return diapositivas;
}

// =============================================
// API PRINCIPAL
// =============================================
export async function POST(request: Request) {
  try {
    const cuerpo = await request.json();
    const { tema, nivel, idiomaEstudiante, vocabularioEspecifico, temaGramatical, cantidadEjercicios } = cuerpo;

    if (!tema || !nivel) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    const inputs = {
      tema, nivel,
      idiomaEstudiante: idiomaEstudiante || 'Chino Mandarín',
      temaGramatical: temaGramatical || '',
      vocabularioEspecifico: vocabularioEspecifico || '',
      cantidadEjercicios: cantidadEjercicios || 3
    };

    console.log("🚀 Agente 1: Director...");
    const plan = await agenteDirector(inputs);
    console.log("✅ Plan:", JSON.stringify(plan.temas_gramaticales?.map((t: any) => t.tema)));

    console.log("🚀 Agentes 2, 3, 4 en paralelo...");
    const [g, e, t] = await Promise.allSettled([
      agenteGramatica(plan, inputs),
      agenteEjercicios(plan, inputs),
      agenteTexto(plan, inputs)
    ]);

    const gramatica = g.status === 'fulfilled' ? g.value : [];
    const ejercicios = e.status === 'fulfilled' ? e.value : [];
    const texto = t.status === 'fulfilled' ? t.value : {};

    console.log("🚀 Ensamblando clase...");
    const diapositivas = ensamblarClase(plan, gramatica, ejercicios, texto, inputs);
    console.log(`✅ ${diapositivas.length} diapositivas`);

    return NextResponse.json({
      resultado: { diapositivas },
      metadata: { total: diapositivas.length }
    });

  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}