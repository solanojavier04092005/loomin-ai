import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 300;

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY!;
const DEEPSEEK_URL = 'https://api.deepseek.com/v1/chat/completions';

// =============================================
// LLAMADA A DEEPSEEK
// =============================================
async function llamarDeepSeek(prompt: string): Promise<any> {
  const respuesta = await fetch(DEEPSEEK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'system', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 8000
    })
  });

  const data = await respuesta.json();
  const contenido = data.choices?.[0]?.message?.content || '{}';
  const limpio = contenido.replace(/[\u0000-\u001F]/g, ' ').trim();
  
  try { return JSON.parse(limpio); }
  catch {
    const match = limpio.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('No se pudo parsear la respuesta');
  }
}

// =============================================
// NORMALIZADOR DE TIPOS DE EJERCICIO
// =============================================
function normalizarTipoEjercicio(tipo: string): string {
  const tipoLower = tipo.toLowerCase().trim();
  if (tipoLower.includes('multiple') || tipoLower.includes('seleccion') || tipoLower.includes('opción')) return 'multiple_choice';
  if (tipoLower.includes('hueco') || tipoLower.includes('completar') || tipoLower.includes('fill')) return 'completar_huecos';
  if (tipoLower.includes('orden') || tipoLower.includes('order')) return 'ordenar_palabras';
  if (tipoLower.includes('verdad') || tipoLower.includes('fals') || tipoLower.includes('true') || tipoLower.includes('vf')) return 'verdadero_falso';
  return 'multiple_choice';
}

// =============================================
// ENSAMBLADOR
// =============================================
function agenteEnsamblador(plan: any) {
  const diapositivas: any[] = [];
  diapositivas.push({ tipo: "titulo", contenido: plan.portada || { titulo: "Clase", subtitulo: "" } });
  diapositivas.push({ tipo: "resumen", contenido: { titulo: "Lo que aprenderemos", puntos: plan.resumen?.puntos || [] } });

  const palabras = (plan.vocabulario?.palabras || []).map((p: any) => ({
    espanol: p.espanol,
    fonetica: p.fonetica || p.espanol?.toLowerCase().replace(/([aeiouáéíóú])/g, '-$1-').split('-').filter(Boolean).join('-') || '',
    traduccion: p.traduccion || "[Traducción]",
    pinyin: p.pinyin || ""
  }));
  diapositivas.push({ tipo: "vocabulario", contenido: { titulo: "Vocabulario clave", palabras } });

  for (let i = 0; i < (plan.temas_gramaticales || []).length; i++) {
    const tema = plan.temas_gramaticales[i];
    diapositivas.push({
      tipo: tema.tipo_visual === 'mapa_mental' ? 'mapa_mental' : 'tabla_gramatical',
      contenido: {
        titulo: tema.tema, tema_numero: i + 1, total_temas: plan.temas_gramaticales.length,
        explicacion: tema.explicacion, ejemplos: tema.ejemplos,
        tipo_visual: tema.tipo_visual, datos_visual: tema.datos_visual,
             errores_comunes: tema.errores_comunes,
        imagen_url: tema.imagen_url || null,
        imagen_prompt: tema.imagen_prompt || `Spanish grammar illustration: ${tema.tema}, educational style, clean design, colorful`
      }
    });
    diapositivas.push({ tipo: "pausa_reflexion", contenido: { titulo: "Momento de reflexión", mensaje: `¿Dudas sobre "${tema.tema}"?`, pregunta: "¿Todo claro?" } });

    for (let j = 0; j < (tema.ejercicios || []).length; j++) {
      diapositivas.push({
        tipo: "ejercicio",
        contenido: {
          titulo: `Práctica: ${tema.tema} (${j + 1}/${tema.ejercicios.length})`,
          tipo_ejercicio: normalizarTipoEjercicio(tema.ejercicios[j].tipo),
          instruccion: tema.ejercicios[j].instruccion,
          preguntas: tema.ejercicios[j].preguntas,
          ejercicio_numero: j + 1, total_ejercicios: tema.ejercicios.length
        }
      });
    }
  }

  if (plan.texto?.contenido) {
    diapositivas.push({
      tipo: "lectura",
      contenido: {
        titulo: plan.texto.titulo, texto: plan.texto.contenido,
        preguntas: plan.texto.preguntas || [],
        glosario_interactivo: (plan.texto.glosario || []).map((g: any) => ({
          palabra_o_frase: g.palabra, traduccion: g.traduccion,
          tipo_palabra: g.tipo, ejemplo_es: g.ejemplo_es || "", ejemplo_traducido: g.ejemplo_traducido || ""
        }))
      }
    });
  }

  diapositivas.push({ tipo: "cierre", contenido: plan.cierre || { resumen: "", motivacion: "" } });
  return diapositivas;
}

// =============================================
// API PRINCIPAL
// =============================================
export async function POST(request: Request) {
  try {
    const cuerpo = await request.json();
    const { tema, nivel, idiomaEstudiante, vocabularioEspecifico, temaGramatical, cantidadEjercicios, alumno } = cuerpo;

    if (!tema || !nivel) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    // Historial del alumno
    let datosAlumno = alumno || null;
    let historial = '';
    if (datosAlumno?.id) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      const { data: clases } = await supabaseAdmin
        .from('historial_clases')
        .select('tema, ejercicios_correctos, ejercicios_totales, created_at')
        .eq('alumno_id', datosAlumno.id).order('created_at', { ascending: false }).limit(5);

      if (clases && clases.length > 0) {
        const totalCorrectos = clases.reduce((sum: number, c: any) => sum + (c.ejercicios_correctos || 0), 0);
        const totalEjercicios = clases.reduce((sum: number, c: any) => sum + (c.ejercicios_totales || 0), 0);
        const porcentaje = totalEjercicios > 0 ? Math.round((totalCorrectos / totalEjercicios) * 100) : 0;
        historial = `HISTORIAL: Últimas clases: ${clases.map((c: any) => c.tema).filter((t: string) => !t?.startsWith('Ejercicio:')).join(', ') || 'Ninguna'}. Ejercicios: ${totalCorrectos}/${totalEjercicios} (${porcentaje}%).`;
      }
    }

    console.log("🚀 Generando plan...");

    const prompt = `Planifica una clase de español nivel ${nivel} sobre "${tema}". Idioma del estudiante: ${idiomaEstudiante}. Gramática: "${temaGramatical}". Separa los temas por coma y CREA UN OBJETO POR CADA TEMA en "temas_gramaticales". Si no se especifica, elige 1-2 temas relevantes. Vocabulario: "${vocabularioEspecifico || 'elige 6-8 palabras clave'}". Ejercicios por tema: ${cantidadEjercicios || 2}.

Responde SOLO con este JSON exacto (sin texto fuera del JSON):
{
  "portada": { "titulo": "...", "subtitulo": "Nivel ${nivel}" },
  "resumen": { "puntos": ["...", "...", "..."] },
  "vocabulario": { "palabras": [{"espanol": "...", "traduccion": "CARACTER EN ${idiomaEstudiante}", "pinyin": "pinyin si es chino", "fonetica": "separación silábica"}] },
  "temas_gramaticales": [{
    "tema": "...", "explicacion": "...", "ejemplos": ["...", "..."],
    "tipo_visual": "tabla_conjugacion",
    "datos_visual": { "columnas": ["...", "..."], "filas": [["...", "..."]] },
    "errores_comunes": [{"error": "...", "correccion": "..."}],
          "imagen_prompt": "MANDATORY: English description for educational illustration, 10-15 words, clean colorful style. You MUST include this field for EVERY tema_gramatical.",
    "imagen_prompt": "English description for educational illustration, 10-15 words, clean style",
    "ejercicios": [{
      "tipo": "multiple_choice", "instruccion": "...",
      "preguntas": [{"frase": "Yo ___ español", "respuesta": "hablo", "opciones": ["hablo", "hablas", "habla", "hablan"]}]
    }]
  }],
  "texto": { "titulo": "...", "contenido": "TEXTO SIN ASTERISCOS", "preguntas": ["¿?"], "glosario": [{"palabra": "...", "traduccion": "TRADUCCIÓN REAL", "tipo": "sustantivo", "ejemplo_es": "Frase en español", "ejemplo_traducido": "Traducción"}] },
  "cierre": { "resumen": "...", "motivacion": "..." }
}

REGLAS:
- Vocabulario: CADA palabra con su traducción REAL al ${idiomaEstudiante} (si es chino: caracteres + pinyin).
- Texto: NO uses asteriscos ni markdown. Solo texto plano.
- Glosario: mínimo 12-15 palabras del texto. Cada una con ejemplo_es y ejemplo_traducido reales.
- Errores comunes: 2 por tema.
- GENERA EXACTAMENTE ${cantidadEjercicios} ejercicios por cada tema gramatical. NI UNO MÁS, NI UNO MENOS.
- Para nivel A1: textos con 3-4 oraciones simples conectadas por un tema común.
- CAMPO OBLIGATORIO: cada tema gramatical DEBE incluir "imagen_prompt" con una descripción en inglés de 10-15 palabras para una ilustración educativa.
${datosAlumno ? `DATOS DEL ALUMNO: ${datosAlumno.nombre}, nivel ${datosAlumno.nivel}. Debilidades: ${datosAlumno.debilidades || 'Ninguna'}. Fortalezas: ${datosAlumno.fortalezas || 'Ninguna'}. Intereses: ${datosAlumno.intereses || 'No especificados'}. ${historial} USA sus intereses en ejemplos. REFUERZA sus debilidades.` : ''}`;

    const plan = await llamarDeepSeek(prompt);
    const diapositivas = agenteEnsamblador(plan);

    console.log(`✅ ${diapositivas.length} diapositivas generadas`);

    return NextResponse.json({ resultado: { diapositivas } });

  } catch (error: any) {
    console.error("❌ Error:", error);
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
  }
}