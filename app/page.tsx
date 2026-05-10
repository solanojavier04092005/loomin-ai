'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Home, BookOpen, FolderOpen, Sparkles, ChevronLeft, 
  ChevronRight, HelpCircle, SlidersHorizontal, CheckCircle2, 
  Save, Trash2, Calendar, X, CheckCircle, AlertCircle, 
  MessageSquare, Brain, ListChecks, Target, Bookmark, Trophy,
  ChevronDown, Users, Plus, ArrowLeft
} from 'lucide-react';
import MisPizarras from './components/MisPizarras';
import CalendarioClases from './components/CalendarioClases';
// --- INICIALIZAR SUPABASE ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// =============================================
// COMPONENTES ORIGINALES
// =============================================

function TarjetaVocabulario({ palabra }: { palabra: any }) {
  const [revelado, setRevelado] = useState(false);
  return (
    <div onClick={() => setRevelado(!revelado)} className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 min-h-[140px] flex flex-col items-center justify-center text-center shadow-sm hover:shadow-lg ${
      revelado 
        ? 'border-indigo-400 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md scale-105' 
        : 'border-gray-200 bg-white hover:border-indigo-300'
    }`}>
      <h3 className="text-xl font-bold text-[#1e1b4b] mb-2">{palabra.espanol}</h3>
      {revelado ? (
        <div className="animate-fade-in">
          <p className="text-indigo-400 mb-1 font-medium text-sm">{palabra.fonetica}</p>
          <p className="text-2xl text-red-500 font-bold">{palabra.traduccion}</p>
          {palabra.pinyin && <p className="text-sm text-gray-400 mt-1 italic">{palabra.pinyin}</p>}
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl m-1 opacity-0 hover:opacity-100 transition-opacity">
          <span className="text-sm font-medium">Clic para revelar</span>
          <HelpCircle className="w-5 h-5 mt-1 opacity-80" />
        </div>
      )}
    </div>
  );
}

function TextoConTooltips({ texto, diccionario }: { texto: string, diccionario: Record<string, any> }) {
  const textoLimpio = texto.replace(/\*/g, '').replace(/_/g, '');
  
  const palabrasClave = Object.keys(diccionario).sort((a, b) => b.length - a.length);
  if (palabrasClave.length === 0) return <span>{textoLimpio}</span>;

  const pattern = palabrasClave.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regex = new RegExp(`\\b(${pattern})\\b`, 'gi');
  const fragmentos = textoLimpio.split(regex);

  return (
    <span>
      {fragmentos.map((frag, i) => {
        const info = diccionario[frag.toLowerCase()];
        if (info) {
          return (
            <span key={i} className="relative inline-block group cursor-help text-[#4338ca] font-bold border-b-2 border-dashed border-indigo-300 hover:border-[#4338ca] transition-colors mx-0">
              {frag}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-max max-w-sm bg-[#1e1b4b] text-white text-sm rounded-xl py-3 px-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none shadow-xl text-left border border-indigo-900 font-sans normal-case">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-lg text-indigo-300">{frag.toLowerCase()}</span>
                  <span className="bg-indigo-900 text-indigo-200 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">{info.tipo_palabra || 'vocab'}</span>
                </div>
                <div className="text-base font-medium mb-2">{info.traduccion}</div>
                {info.ejemplo_es && (
                  <div className="border-t border-indigo-800 pt-2 mt-2 bg-indigo-950/50 p-2 rounded-lg">
                    <div className="text-indigo-100 italic text-xs mb-1">💬 "{info.ejemplo_es}"</div>
                    <div className="text-indigo-400 text-[11px]">{info.ejemplo_traducido}</div>
                  </div>
                )}
                <svg className="absolute text-[#1e1b4b] h-3 w-full left-0 top-full -mt-1" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
              </span>
            </span>
          );
        }
        return <span key={i}>{frag}</span>;
      })}
    </span>
  );
}

// =============================================
// RENDERIZADORES ORIGINALES
// =============================================

function ResumenDiapositiva({ datos }: { datos: any }) {
  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <Target className="w-10 h-10" />
      </div>
      <h2 className="text-3xl font-bold text-[#1e1b4b] mb-8">{datos.titulo}</h2>
      <div className="space-y-4">
        {datos.puntos?.map((punto: string, i: number) => (
          <div key={i} className="flex items-start gap-4 bg-indigo-50 p-5 rounded-2xl border border-indigo-100">
            <span className="w-8 h-8 bg-[#4338ca] text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">{i + 1}</span>
            <p className="text-lg text-gray-700 font-medium text-left">{punto}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PausaReflexion({ datos }: { datos: any }) {
  return (
    <div className="w-full max-w-xl mx-auto text-center space-y-6">
      <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
        <MessageSquare className="w-12 h-12" />
      </div>
      <h2 className="text-3xl font-bold text-[#1e1b4b]">{datos.titulo}</h2>
      <p className="text-xl text-gray-600">{datos.mensaje}</p>
      <div className="bg-amber-50 p-6 rounded-2xl border-2 border-amber-200">
        <p className="text-2xl font-bold text-amber-800 italic">"{datos.pregunta}"</p>
      </div>
      <p className="text-gray-500">Tómate un momento para pensar antes de continuar...</p>
    </div>
  );
}

function CierreDiapositiva({ datos }: { datos: any }) {
  return (
    <div className="w-full max-w-xl mx-auto text-center space-y-6">
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
        <Trophy className="w-12 h-12" />
      </div>
      <h2 className="text-4xl font-bold text-[#1e1b4b]">{datos.titulo}</h2>
      <p className="text-xl text-gray-600 font-medium">{datos.resumen}</p>
      <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
        <p className="text-lg text-green-800 italic">"{datos.motivacion}"</p>
      </div>
    </div>
  );
}

// =============================================
// GRAMÁTICA (DATOS PUROS)
// =============================================
function GramaticaDiapositiva({ datos }: { datos: any }) {
  const coloresTema: Record<string, string> = {
    'tabla_conjugacion': 'from-indigo-50 to-blue-50 border-indigo-200',
    'tabla_comparativa': 'from-emerald-50 to-teal-50 border-emerald-200',
    'mapa_mental': 'from-purple-50 to-pink-50 border-purple-200',
    'esquema_pasos': 'from-amber-50 to-orange-50 border-amber-200'
  };
  const colorFondo = coloresTema[datos.tipo_visual] || 'from-gray-50 to-slate-50 border-gray-200';

  return (
    <div className="w-full">
      {datos.imagen_url && (
        <div className="mb-6 rounded-2xl overflow-hidden shadow-lg">
          <img src={datos.imagen_url} alt={datos.titulo} className="w-full h-auto" />
        </div>
      )}
      
      <div className={`bg-gradient-to-br ${colorFondo} rounded-2xl p-6 mb-6 border`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1e1b4b]">{datos.titulo}</h2>
            <p className="text-sm text-gray-500">Tema {datos.tema_numero} de {datos.total_temas}</p>
          </div>
        </div>

        {datos.explicacion && (
          <p className="text-gray-700 text-lg leading-relaxed bg-white/60 rounded-xl p-4">{datos.explicacion}</p>
        )}
      </div>

      {datos.ejemplos?.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 rounded-2xl mb-6 text-white shadow-lg">
          <p className="font-bold text-lg mb-3 flex items-center gap-2">💡 Ejemplos prácticos</p>
          <ul className="space-y-2">
            {datos.ejemplos.map((ej: string, i: number) => (
              <li key={i} className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">{ej}</li>
            ))}
          </ul>
        </div>
      )}

      {datos.tipo_visual === 'mapa_mental' && datos.datos_visual?.ramas && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {datos.datos_visual.ramas.map((rama: string, i: number) => (
            <div key={i} className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-xl border-2 border-purple-200 font-medium text-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-purple-500 mr-2 text-lg">●</span> {rama}
            </div>
          ))}
        </div>
      )}

      {datos.datos_visual?.columnas && (
        <div className="overflow-hidden rounded-2xl border-2 border-indigo-200 shadow-lg mb-6">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 to-purple-600">
                {datos.datos_visual.columnas.map((col: string, i: number) => (
                  <th key={i} className="p-4 font-bold text-white text-sm">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {datos.datos_visual.filas?.map((fila: string[], i: number) => (
                <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-indigo-50/50'} hover:bg-indigo-100 transition-colors`}>
                  {fila.map((celda: string, j: number) => (
                    <td key={j} className="p-4 text-gray-700 font-medium">{celda}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {datos.errores_comunes?.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-amber-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">⚠️</span> Errores comunes
          </h3>
          <div className="space-y-3">
            {datos.errores_comunes.map((err: any, i: number) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-amber-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-sm font-bold">{err.error}</span>
                  <span className="text-gray-400 text-lg">→</span>
                  <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-sm font-bold">{err.correccion}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================
// EJERCICIOS (DATOS PUROS)
// =============================================
function EjercicioDiapositiva({ datos }: { datos: any }) {
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});
  const [corregido, setCorregido] = useState(false);

  useEffect(() => {
    setRespuestas({});
    setCorregido(false);
  }, [datos.titulo]);

  const manejarCambio = (index: number, valor: string) => {
    setRespuestas({ ...respuestas, [index]: valor });
  };

      const corregir = () => {
    setCorregido(true);
    
    const total = datos.preguntas?.length || 0;
    let correctos = 0;
    datos.preguntas?.forEach((pregunta: any, i: number) => {
      const respuestaUsuario = (respuestas[i] || '').toLowerCase().trim();
      const respuestaCorrecta = (pregunta.respuesta || '').toLowerCase().trim();
      if (respuestaUsuario === respuestaCorrecta) correctos++;
    });

    try {
      const alumnoGuardado = localStorage.getItem('alumnoSeleccionado');
      if (alumnoGuardado) {
        const alumno = JSON.parse(alumnoGuardado);
        supabase.from('historial_clases').insert([{
          alumno_id: alumno.id,
          tema: `Ejercicio: ${datos.titulo}`,
          nivel: '',
          enfoque: '',
          temas_gramaticales: [],
          ejercicios_completados: total,
          ejercicios_correctos: correctos
        }]).then(({ error }) => {
          if (error) console.error('Error guardando ejercicio:', error);
          else console.log('✅ Ejercicio guardado:', correctos + '/' + total);
        });
      }
    } catch (e) {
      console.error('Error al guardar ejercicio:', e);
    }
  };

  const esMultipleChoice = datos.tipo_ejercicio === 'multiple_choice';
  const esCompletar = datos.tipo_ejercicio === 'completar_huecos';
  const esVF = datos.tipo_ejercicio === 'verdadero_falso';
    const esOrdenar = datos.tipo_ejercicio === 'ordenar_palabras';

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1e1b4b] flex items-center gap-2">
          <ListChecks className="w-6 h-6 text-indigo-600" /> {datos.titulo}
        </h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {datos.ejercicio_numero}/{datos.total_ejercicios}
        </span>
      </div>
      <p className="text-gray-600 mb-6 italic">{datos.instruccion}</p>
      
      <div className="space-y-4">
        {datos.preguntas?.map((pregunta: any, i: number) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-gray-800 font-medium mb-3">{pregunta.frase}</p>
            
            {esMultipleChoice && pregunta.opciones && (
              <div className="flex flex-wrap gap-2">
                {pregunta.opciones.map((op: string, j: number) => {
                  const seleccionada = respuestas[i] === op;
                  const esCorrecta = corregido && op === pregunta.respuesta;
                  const esIncorrecta = corregido && seleccionada && op !== pregunta.respuesta;
                  
                  return (
                    <button
                      key={j}
                      onClick={() => manejarCambio(i, op)}
                      disabled={corregido}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        esCorrecta ? 'bg-green-200 border-green-500 text-green-800 border-2' :
                        esIncorrecta ? 'bg-red-200 border-red-500 text-red-800 border-2' :
                        seleccionada ? 'bg-indigo-100 border-indigo-400 text-indigo-800 border-2' :
                        'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {op}
                    </button>
                  );
                })}
              </div>
            )}

            {esCompletar && (
              <div>
                <input
                  type="text"
                  value={respuestas[i] || ''}
                  onChange={(e) => manejarCambio(i, e.target.value)}
                  disabled={corregido}
                  className={`w-full p-3 border rounded-lg ${
                    corregido 
                      ? (respuestas[i] || '').toLowerCase().trim() === (pregunta.respuesta || '').toLowerCase().trim()
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : 'border-gray-300'
                  }`}
                  placeholder="Escribe tu respuesta..."
                />
                {corregido && (
                  <p className={`text-sm mt-1 ${(respuestas[i] || '').toLowerCase().trim() === (pregunta.respuesta || '').toLowerCase().trim() ? 'text-green-600' : 'text-red-600'}`}>
                    {(respuestas[i] || '').toLowerCase().trim() === (pregunta.respuesta || '').toLowerCase().trim() ? '✅ Correcto' : `❌ Respuesta: ${pregunta.respuesta}`}
                  </p>
                )}
              </div>
            )}

                        {esVF && (
              <div className="flex gap-3">
                {['Verdadero', 'Falso'].map((op, j) => {
                  const seleccionada = respuestas[i] === op;
                  const esCorrecta = corregido && op === pregunta.respuesta;
                  const esIncorrecta = corregido && seleccionada && op !== pregunta.respuesta;
                  
                  return (
                    <button
                      key={j}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); manejarCambio(i, op); }}
                      disabled={corregido}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        esCorrecta ? 'bg-green-200 border-green-500 text-green-800 border-2' :
                        esIncorrecta ? 'bg-red-200 border-red-500 text-red-800 border-2' :
                        seleccionada ? 'bg-indigo-100 border-indigo-400 text-indigo-800 border-2' :
                        'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {op}
                    </button>
                  );
                })}
              </div>
            )}

            {esOrdenar && (
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {pregunta.palabras_desordenadas?.map((palabra: string, j: number) => (
                    <button
                      key={j}
                      onClick={() => {
                        const actual = respuestas[i] || '';
                        setRespuestas({ ...respuestas, [i]: actual + palabra + ' ' });
                      }}
                      disabled={corregido}
                      className="px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-colors"
                    >
                      {palabra}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={respuestas[i] || ''}
                  readOnly
                  className={`w-full p-3 border rounded-lg bg-gray-50 ${corregido ? ((respuestas[i] || '').toLowerCase().trim() === (pregunta.respuesta || '').toLowerCase().trim() ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'}`}
                  placeholder="Haz clic en las palabras para formar la frase..."
                />
                <button onClick={() => setRespuestas({ ...respuestas, [i]: '' })} className="mt-2 text-xs text-gray-500 hover:text-red-500">Limpiar</button>
                {corregido && (
                  <p className={`text-sm mt-1 ${(respuestas[i] || '').toLowerCase().trim() === (pregunta.respuesta || '').toLowerCase().trim() ? 'text-green-600' : 'text-red-600'}`}>
                    {(respuestas[i] || '').toLowerCase().trim() === (pregunta.respuesta || '').toLowerCase().trim() ? '✅ Correcto' : `❌ Respuesta: ${pregunta.respuesta}`}
                  </p>
                )}
              </div>
            )}
          </div>
          
        ))}
      </div>
          
      {!corregido && (
        <button
          onClick={corregir}
          className="mt-6 bg-green-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-green-700 transition-colors shadow-lg"
        >
          Corregir ejercicio
        </button>
      )}
    </div>
  );
}

// =============================================
// PANTALLA PRINCIPAL
// =============================================
export default function PanelLoominAI() {
const [vistaActual, setVistaActual] = useState<'inicio' | 'pizarras' | 'alumnos' | 'registro_alumno' | 'perfil_alumno' | 'calendario' | 'editar_alumno'>('inicio');

  const [tema, setTema] = useState('');
  const [nivel, setNivel] = useState('A1');
  const [idiomaEstudiante, setIdiomaEstudiante] = useState('Chino Mandarín');
  const [enfoque, setEnfoque] = useState('Explicativo');
  const [mostrarAvanzados, setMostrarAvanzados] = useState(false);
  const [temaGramatical, setTemaGramatical] = useState('');
  const [vocabularioEspecifico, setVocabularioEspecifico] = useState('');
  const [cantidadEjercicios, setCantidadEjercicios] = useState(3);
  const [mostrarSelectorEjercicios, setMostrarSelectorEjercicios] = useState(false);
    const [alumnos, setAlumnos] = useState<any[]>([]);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<any>(null);
  const [cargandoAlumnos, setCargandoAlumnos] = useState(false);
  const [guardandoAlumno, setGuardandoAlumno] = useState(false);
  const [formNombre, setFormNombre] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTelefono, setFormTelefono] = useState('');
  const [formNivelActual, setFormNivelActual] = useState('A1');
  const [formNivelObjetivo, setFormNivelObjetivo] = useState('A2');
  const [formIdiomaNativo, setFormIdiomaNativo] = useState('Chino Mandarín');
  const [formModalidad, setFormModalidad] = useState('online');
  const [formTipoClase, setFormTipoClase] = useState('particular');
  const [formClasesPorSemana, setFormClasesPorSemana] = useState(1);
  const [formNecesidades, setFormNecesidades] = useState('');
  const [formIntereses, setFormIntereses] = useState('');
  const [formDebilidades, setFormDebilidades] = useState('');
  const [formFortalezas, setFormFortalezas] = useState('');
  const [formEstiloAprendizaje, setFormEstiloAprendizaje] = useState('visual');

  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [diapositivas, setDiapositivas] = useState<any[]>([]);
  const [slideActual, setSlideActual] = useState(0);
  const [pizarrasGuardadas, setPizarrasGuardadas] = useState<any[]>([]);
  
  const [notificacion, setNotificacion] = useState<{mensaje: string, tipo: 'exito' | 'error'} | null>(null);
const [pantallaCompleta, setPantallaCompleta] = useState(false);

useEffect(() => {
  if (pantallaCompleta) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
  return () => { document.body.style.overflow = ''; };
}, [pantallaCompleta]);
  const mostrarNotificacion = (mensaje: string, tipo: 'exito' | 'error') => {
    setNotificacion({ mensaje, tipo });
    setTimeout(() => setNotificacion(null), 3500); 
  };

    const cargarPizarrasDeNube = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    const { data } = await supabase.from('pizarras').select('*').eq('profesor_id', userId).order('created_at', { ascending: false }); 
    if (data) setPizarrasGuardadas(data);
  };

  useEffect(() => { cargarPizarrasDeNube(); }, []);
  
   const cargarAlumnos = async () => {
    setCargandoAlumnos(true);
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    const { data } = await supabase.from('alumnos').select('*').eq('profesor_id', userId).order('created_at', { ascending: false });
    if (data) setAlumnos(data);
    setCargandoAlumnos(false);
  };

  useEffect(() => {
    if (vistaActual === 'alumnos') cargarAlumnos();
  }, [vistaActual]);

    const guardarAlumno = async () => {
    if (!formNombre) return mostrarNotificacion('El nombre es obligatorio', 'error');
    setGuardandoAlumno(true);
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    const { error } = await supabase.from('alumnos').insert([{
      profesor_id: userId,
      nombre: formNombre, email: formEmail, telefono: formTelefono,
      nivel_actual: formNivelActual, nivel_objetivo: formNivelObjetivo,
      idioma_nativo: formIdiomaNativo, modalidad: formModalidad,
      tipo_clase: formTipoClase, clases_por_semana: formClasesPorSemana,
      necesidades: formNecesidades, intereses: formIntereses,
      debilidades: formDebilidades, fortalezas: formFortalezas,
      estilo_aprendizaje: formEstiloAprendizaje
    }]);
    if (!error) { mostrarNotificacion('Alumno registrado', 'exito'); limpiarFormularioAlumno(); setVistaActual('alumnos'); }
    else { mostrarNotificacion('Error al registrar', 'error'); }
    setGuardandoAlumno(false);
  };

  const limpiarFormularioAlumno = () => {
    setFormNombre(''); setFormEmail(''); setFormTelefono('');
    setFormNivelActual('A1'); setFormNivelObjetivo('A2');
    setFormIdiomaNativo('Chino Mandarín'); setFormModalidad('online');
    setFormTipoClase('particular'); setFormClasesPorSemana(1);
    setFormNecesidades(''); setFormIntereses('');
    setFormDebilidades(''); setFormFortalezas('');
    setFormEstiloAprendizaje('visual');
  };

    const verPerfilAlumno = async (alumno: any) => {
    const { data: metricas } = await supabase
      .from('clases_programadas')
      .select('estado')
      .eq('alumno_id', alumno.id);

    const total = metricas?.length || 0;
    const tomadas = metricas?.filter(m => m.estado === 'tomada').length || 0;
    const canceladas = metricas?.filter(m => m.estado === 'cancelada').length || 0;
    const noTomadas = metricas?.filter(m => m.estado === 'no_tomada').length || 0;
    const porcentajeAsistencia = total > 0 ? Math.round((tomadas / (tomadas + noTomadas)) * 100) || 0 : 0;

    setAlumnoSeleccionado({
      ...alumno,
      metricas: {
        total,
        tomadas,
        canceladas,
        noTomadas,
        porcentajeAsistencia
      }
    });
    setVistaActual('perfil_alumno');
  };
  const cargarDatosEdicion = () => {
    if (alumnoSeleccionado) {
      setFormNombre(alumnoSeleccionado.nombre || '');
      setFormEmail(alumnoSeleccionado.email || '');
      setFormTelefono(alumnoSeleccionado.telefono || '');
      setFormNivelActual(alumnoSeleccionado.nivel_actual || 'A1');
      setFormNivelObjetivo(alumnoSeleccionado.nivel_objetivo || 'A2');
      setFormIdiomaNativo(alumnoSeleccionado.idioma_nativo || 'Chino Mandarín');
      setFormModalidad(alumnoSeleccionado.modalidad || 'online');
      setFormTipoClase(alumnoSeleccionado.tipo_clase || 'particular');
      setFormClasesPorSemana(alumnoSeleccionado.clases_por_semana || 1);
      setFormNecesidades(alumnoSeleccionado.necesidades || '');
      setFormIntereses(alumnoSeleccionado.intereses || '');
      setFormDebilidades(alumnoSeleccionado.debilidades || '');
      setFormFortalezas(alumnoSeleccionado.fortalezas || '');
      setFormEstiloAprendizaje(alumnoSeleccionado.estilo_aprendizaje || 'visual');
      setVistaActual('editar_alumno');
    }
  };

  const guardarEdicionAlumno = async () => {
    if (!formNombre) return mostrarNotificacion('El nombre es obligatorio', 'error');
    setGuardandoAlumno(true);
    const { error } = await supabase.from('alumnos').update({
      nombre: formNombre, email: formEmail, telefono: formTelefono,
      nivel_actual: formNivelActual, nivel_objetivo: formNivelObjetivo,
      idioma_nativo: formIdiomaNativo, modalidad: formModalidad,
      tipo_clase: formTipoClase, clases_por_semana: formClasesPorSemana,
      necesidades: formNecesidades, intereses: formIntereses,
      debilidades: formDebilidades, fortalezas: formFortalezas,
      estilo_aprendizaje: formEstiloAprendizaje
    }).eq('id', alumnoSeleccionado.id);
    if (!error) {
      mostrarNotificacion('Alumno actualizado', 'exito');
      setAlumnoSeleccionado({ ...alumnoSeleccionado, nombre: formNombre, nivel_actual: formNivelActual, nivel_objetivo: formNivelObjetivo, idioma_nativo: formIdiomaNativo, modalidad: formModalidad, tipo_clase: formTipoClase, necesidades: formNecesidades, intereses: formIntereses, debilidades: formDebilidades, fortalezas: formFortalezas, estilo_aprendizaje: formEstiloAprendizaje });
      setVistaActual('perfil_alumno');
    } else {
      mostrarNotificacion('Error al actualizar', 'error');
    }
    setGuardandoAlumno(false);
  };
  const eliminarAlumno = async (id: string) => {
    const { error } = await supabase.from('alumnos').delete().eq('id', id);
    if (!error) { setAlumnos(alumnos.filter(a => a.id !== id)); mostrarNotificacion('Alumno eliminado', 'exito'); }
  };

  const generarPizarraPersonalizada = (alumno: any) => {
    setAlumnoSeleccionado(alumno);
    setTema(''); setNivel(alumno.nivel_actual || 'A1');
    setIdiomaEstudiante(alumno.idioma_nativo || 'Chino Mandarín');
    setEnfoque('Explicativo'); setVocabularioEspecifico('');
    setTemaGramatical(''); setCantidadEjercicios(3);
    setVistaActual('inicio');
    mostrarNotificacion(`Prepara la pizarra para ${alumno.nombre}`, 'exito');
        localStorage.setItem('alumnoSeleccionado', JSON.stringify(alumno));
  };
    

    const guardarPizarra = async () => {
    if (diapositivas.length === 0) return;
    setGuardando(true);
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
        const { data, error } = await supabase.from('pizarras').insert([
      { tema: tema || 'Clase sin título', nivel, fecha: new Date().toLocaleDateString(), diapositivas, profesor_id: userId }
    ]).select();
       if (data) {
      setPizarrasGuardadas([data[0], ...pizarrasGuardadas]);
      mostrarNotificacion('¡Pizarra guardada con éxito!', 'exito');
    } else {
      console.error("Error al guardar pizarra:", error);
      mostrarNotificacion('Error al guardar: ' + (error?.message || 'desconocido'), 'error');
       }
    setGuardando(false);
  };

  const borrarPizarra = async (id: string) => {
    const { error } = await supabase.from('pizarras').delete().eq('id', id);
    if (!error) {
      setPizarrasGuardadas(pizarrasGuardadas.filter(p => p.id !== id));
      mostrarNotificacion('Pizarra eliminada.', 'exito');
    }
  };

  const abrirPizarraGuardada = (pizarra: any) => {
    setTema(pizarra.tema);
    setNivel(pizarra.nivel);
    setDiapositivas(pizarra.diapositivas);
    setSlideActual(0);
    setVistaActual('inicio');
  };

    const manejarGeneracion = async () => {
    if (!tema) return mostrarNotificacion('Ingresa un tema.', 'error');
    setCargando(true);
    setDiapositivas([]);
    
    try {
      const respuesta = await fetch('/api/generar-clase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tema, nivel, idiomaEstudiante, enfoque,
          vocabularioEspecifico, temaGramatical, cantidadEjercicios,
          alumno: alumnoSeleccionado ? {
            id: alumnoSeleccionado.id,
            nombre: alumnoSeleccionado.nombre,
            nivel: alumnoSeleccionado.nivel_actual,
            debilidades: alumnoSeleccionado.debilidades,
            fortalezas: alumnoSeleccionado.fortalezas,
            intereses: alumnoSeleccionado.intereses,
            necesidades: alumnoSeleccionado.necesidades
          } : null
        }),
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json().catch(() => ({}));
        throw new Error(errorData.error || `Error (${respuesta.status})`);
      }

      const datos = await respuesta.json();
      
      if (datos.resultado?.diapositivas?.length > 0) {
        setDiapositivas(datos.resultado.diapositivas);
        setSlideActual(0);
        mostrarNotificacion(`¡Clase generada! ${datos.resultado.diapositivas.length} diapositivas`, 'exito');
                  const diapos = datos.resultado.diapositivas;      
                // Guardar prompts de imagen para la próxima vez
        const promptsPendientes: any[] = [];
        for (let i = 0; i < diapos.length; i++) {
          const d = diapos[i];
          if ((d.tipo === 'tabla_gramatical' || d.tipo === 'mapa_mental') && d.contenido?.imagen_prompt && !d.contenido?.imagen_url) {
            promptsPendientes.push({ prompt: d.contenido.imagen_prompt, slideIndex: i });
          }
        }
        if (promptsPendientes.length > 0) {
          console.log(`🖼️ ${promptsPendientes.length} imágenes pendientes para generar`);
        }
      } else {
        mostrarNotificacion('No se generó contenido. Intenta con otro tema.', 'error');
      }
    } catch (error: any) {
      console.error("❌ Error:", error);
      mostrarNotificacion(error.message || 'Error de conexión', 'error');
    } finally {
      setCargando(false);
    }
  };

  const diccionarioGlobal: Record<string, any> = {};
  diapositivas.forEach(slide => {
    if (slide.tipo === 'vocabulario' && slide.contenido?.palabras) {
      slide.contenido.palabras.forEach((p: any) => {
        if (p?.espanol) {
          diccionarioGlobal[p.espanol.toLowerCase()] = { traduccion: p.traduccion || '', tipo_palabra: 'vocab' };
        }
      });
    }
    if (slide.tipo === 'lectura' && slide.contenido?.glosario_interactivo) {
      slide.contenido.glosario_interactivo.forEach((p: any) => {
        if (p?.palabra_o_frase) {
          diccionarioGlobal[p.palabra_o_frase.toLowerCase()] = {
            traduccion: p.traduccion || '',
            tipo_palabra: p.tipo_palabra || 'vocab',
            ejemplo_es: p.ejemplo_es || '',
            ejemplo_traducido: p.ejemplo_traducido || ''
          };
        }
      });
    }
  });

  return (
    <div className="flex min-h-screen bg-[#f8f9fc] font-sans relative">
      
      {notificacion && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-2xl shadow-xl border animate-in slide-in-from-bottom duration-300 ${
          notificacion.tipo === 'exito' ? 'bg-[#1e1b4b] border-indigo-500 text-white' : 'bg-red-600 border-red-400 text-white'
        }`}>
          {notificacion.tipo === 'exito' ? <CheckCircle className="w-5 h-5 shrink-0 text-green-400" /> : <AlertCircle className="w-5 h-5 shrink-0 text-white" />}
          <p className="font-bold text-sm pr-4">{notificacion.mensaje}</p>
          <button onClick={() => setNotificacion(null)} className="ml-2 p-1 hover:bg-white/20 rounded-full"><X size={14} /></button>
        </div>
      )}

      <aside className="w-56 bg-[#f4f5f8] border-r border-gray-200 hidden md:flex flex-col fixed h-full p-5">
        <div className="flex items-center gap-2 font-bold text-xl text-[#1e1b4b] mb-8">
          <div className="w-7 h-7 bg-[#1e1b4b] rounded flex items-center justify-center text-white text-xs shrink-0 font-bold">L</div>
          Loomin AI
        </div>
        <nav className="space-y-2">
          <button onClick={() => setVistaActual('inicio')} className={`flex items-center gap-3 w-full p-2.5 rounded-md font-semibold transition-colors ${vistaActual === 'inicio' ? 'bg-white text-[#1e1b4b] shadow-sm border border-gray-100' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Home className="w-5 h-5 shrink-0" /> Inicio
          </button>
          <button onClick={() => setVistaActual('pizarras')} className={`flex items-center justify-between w-full p-2.5 rounded-md font-semibold transition-colors ${vistaActual === 'pizarras' ? 'bg-white text-[#1e1b4b] shadow-sm border border-gray-100' : 'text-gray-600 hover:bg-gray-100'}`}>
            <div className="flex items-center gap-3"><BookOpen className="w-5 h-5 shrink-0" /> Mis Pizarras</div>
            {pizarrasGuardadas.length > 0 && <span className="bg-[#4338ca] text-white text-[10px] px-2 py-0.5 rounded-full">{pizarrasGuardadas.length}</span>}
          </button>
                    <button onClick={() => setVistaActual('alumnos')} className={`flex items-center justify-between w-full p-2.5 rounded-md font-semibold transition-colors ${vistaActual === 'alumnos' || vistaActual === 'registro_alumno' || vistaActual === 'perfil_alumno' ? 'bg-white text-[#1e1b4b] shadow-sm border border-gray-100' : 'text-gray-600 hover:bg-gray-100'}`}>
            <div className="flex items-center gap-3"><Users className="w-5 h-5 shrink-0" /> Mis Alumnos</div>
            {alumnos.length > 0 && <span className="bg-[#4338ca] text-white text-[10px] px-2 py-0.5 rounded-full">{alumnos.length}</span>}
          </button>
                    <button onClick={() => setVistaActual('calendario')} className={`flex items-center justify-between w-full p-2.5 rounded-md font-semibold transition-colors ${vistaActual === 'calendario' ? 'bg-white text-[#1e1b4b] shadow-sm border border-gray-100' : 'text-gray-600 hover:bg-gray-100'}`}>
            <div className="flex items-center gap-3"><Calendar className="w-5 h-5 shrink-0" /> Calendario</div>
          </button>
                    <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login'; }} className="flex items-center gap-3 w-full p-2.5 rounded-md font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors mt-4 border-t border-gray-200 pt-4">
            <X className="w-5 h-5 shrink-0" /> Cerrar sesión
          </button>
        </nav>
      </aside>
        
      <main className="ml-0 md:ml-56 flex-1 p-8">
        {/* VISTA DE ALUMNOS */}
                {vistaActual === 'calendario' && <CalendarioClases />}
        {vistaActual === 'alumnos' && (
                    <div className="max-w-5xl mx-auto w-full">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 shrink-0 text-[#4338ca]" />
                <h1 className="text-3xl font-bold text-[#1e1b4b]">Mis Alumnos</h1>
              </div>
              <button onClick={() => setVistaActual('registro_alumno')} className="flex items-center gap-2 bg-[#1e1b4b] text-white font-bold py-2.5 px-5 rounded-xl hover:bg-[#2a2663] transition-colors shadow-lg">
                <Plus className="w-4 h-4" /> Nuevo Alumno
              </button>
            </div>

            {alumnos.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
                <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">No tienes alumnos registrados</h3>
                <p className="text-gray-500 mb-6">Registra a tus estudiantes para generar pizarras personalizadas.</p>
                <button onClick={() => setVistaActual('registro_alumno')} className="bg-[#1e1b4b] text-white font-bold py-2.5 px-6 rounded-xl hover:bg-[#2a2663] transition-colors shadow-lg">
                  Registrar primer alumno
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {alumnos.map((alumno) => (
                  <div key={alumno.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col group">
                    <div className="bg-indigo-50 p-5 border-b border-indigo-100 flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <span className="bg-white text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-md border border-indigo-200">{alumno.nivel_actual || 'Sin nivel'}</span>
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">{alumno.modalidad === 'online' ? '💻 Online' : '🏫 Presencial'}</span>
                      </div>
                      <h3 className="font-bold text-lg text-[#1e1b4b] leading-tight mb-2">{alumno.nombre}</h3>
                      <p className="text-gray-500 text-xs">{alumno.idioma_nativo || 'Sin idioma'} | {alumno.clases_por_semana || 1}x semana</p>
                    </div>
                    <div className="p-4 bg-white flex justify-between items-center">
                      <button onClick={() => verPerfilAlumno(alumno)} className="flex items-center gap-2 text-sm font-bold text-[#4338ca] hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors">
                        <Target className="w-4 h-4" /> Perfil
                      </button>
                      <button onClick={() => eliminarAlumno(alumno.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar alumno">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}


                {/* VISTA DE REGISTRO DE ALUMNO */}
        {vistaActual === 'registro_alumno' && (
                    <div className="max-w-2xl mx-auto w-full">
            <button onClick={() => { limpiarFormularioAlumno(); setVistaActual('alumnos'); }} className="flex items-center gap-2 text-gray-600 font-bold mb-6 hover:text-[#4338ca] transition-colors">
              <ArrowLeft className="w-5 h-5" /> Volver a alumnos
            </button>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h1 className="text-3xl font-bold text-[#1e1b4b] mb-6">Registrar Nuevo Alumno</h1>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1">Nombre completo *</label>
                  <input type="text" value={formNombre} onChange={(e) => setFormNombre(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#4338ca]" placeholder="Nombre del estudiante" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1">Email</label>
                    <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#4338ca]" placeholder="correo@email.com" />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1">Teléfono</label>
                    <input type="text" value={formTelefono} onChange={(e) => setFormTelefono(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#4338ca]" placeholder="+56 9..." />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1">Nivel actual</label>
                    <select value={formNivelActual} onChange={(e) => setFormNivelActual(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#4338ca]">
                      <option value="A1">A1</option><option value="A2">A2</option><option value="B1">B1</option><option value="B2">B2</option><option value="C1">C1</option><option value="C2">C2</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1">Nivel objetivo</label>
                    <select value={formNivelObjetivo} onChange={(e) => setFormNivelObjetivo(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#4338ca]">
                      <option value="A1">A1</option><option value="A2">A2</option><option value="B1">B1</option><option value="B2">B2</option><option value="C1">C1</option><option value="C2">C2</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1">Idioma nativo</label>
                    <select value={formIdiomaNativo} onChange={(e) => setFormIdiomaNativo(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#4338ca]">
                      <option value="Chino Mandarín">Chino Mandarín</option><option value="Inglés">Inglés</option><option value="Español">Español</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1">Modalidad</label>
                    <select value={formModalidad} onChange={(e) => setFormModalidad(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#4338ca]">
                      <option value="online">Online</option><option value="presencial">Presencial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1">Tipo</label>
                    <select value={formTipoClase} onChange={(e) => setFormTipoClase(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#4338ca]">
                      <option value="particular">Particular</option><option value="grupal">Grupal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1">Clases/semana</label>
                    <input type="number" min="1" max="7" value={formClasesPorSemana} onChange={(e) => {
  const val = parseInt(e.target.value);
  setFormClasesPorSemana(isNaN(val) ? 1 : val);
}} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#4338ca]" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-1">Necesidades específicas</label>
                  <textarea value={formNecesidades} onChange={(e) => setFormNecesidades(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#4338ca]" rows={2} placeholder="Ej: Preparar DELE B1, conversación para viajar..." />
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-1">Intereses (temas para personalizar)</label>
                  <input type="text" value={formIntereses} onChange={(e) => setFormIntereses(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#4338ca]" placeholder="Ej: fútbol, tecnología, cocina..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1">Debilidades</label>
                    <textarea value={formDebilidades} onChange={(e) => setFormDebilidades(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#4338ca]" rows={2} placeholder="Ej: confunde ser/estar..." />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1">Fortalezas</label>
                    <textarea value={formFortalezas} onChange={(e) => setFormFortalezas(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#4338ca]" rows={2} placeholder="Ej: buena pronunciación..." />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-1">Estilo de aprendizaje</label>
                  <select value={formEstiloAprendizaje} onChange={(e) => setFormEstiloAprendizaje(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#4338ca]">
                    <option value="visual">Visual</option><option value="auditivo">Auditivo</option><option value="lectoescritor">Lectoescritor</option><option value="kinestésico">Kinestésico</option>
                  </select>
                </div>
                <button onClick={guardarAlumno} disabled={guardandoAlumno} className="w-full flex justify-center items-center gap-2 p-3 rounded-xl font-bold text-white bg-[#1e1b4b] hover:bg-[#2a2663] transition-colors shadow-lg disabled:opacity-50">
                  {guardandoAlumno ? 'Guardando...' : 'Registrar Alumno'} <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
        {/* VISTA DE EDICIÓN DE ALUMNO */}
        {vistaActual === 'editar_alumno' && alumnoSeleccionado && (
          <div className="max-w-2xl mx-auto">
            <button onClick={() => setVistaActual('perfil_alumno')} className="flex items-center gap-2 text-gray-600 font-bold mb-6 hover:text-[#4338ca] transition-colors">
              <ArrowLeft className="w-5 h-5" /> Volver al perfil
            </button>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h1 className="text-3xl font-bold text-[#1e1b4b] mb-6">Editar: {alumnoSeleccionado.nombre}</h1>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1">Nombre completo *</label>
                  <input type="text" value={formNombre} onChange={(e) => setFormNombre(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#4338ca]" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1">Nivel actual</label>
                    <select value={formNivelActual} onChange={(e) => setFormNivelActual(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm">
                      <option value="A1">A1</option><option value="A2">A2</option><option value="B1">B1</option><option value="B2">B2</option><option value="C1">C1</option><option value="C2">C2</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1">Nivel objetivo</label>
                    <select value={formNivelObjetivo} onChange={(e) => setFormNivelObjetivo(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm">
                      <option value="A1">A1</option><option value="A2">A2</option><option value="B1">B1</option><option value="B2">B2</option><option value="C1">C1</option><option value="C2">C2</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1">Idioma nativo</label>
                    <select value={formIdiomaNativo} onChange={(e) => setFormIdiomaNativo(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm">
                      <option value="Chino Mandarín">Chino Mandarín</option><option value="Inglés">Inglés</option><option value="Español">Español</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-1">Debilidades</label>
                  <textarea value={formDebilidades} onChange={(e) => setFormDebilidades(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" rows={2} placeholder="Ej: confunde ser/estar..." />
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-1">Fortalezas</label>
                  <textarea value={formFortalezas} onChange={(e) => setFormFortalezas(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" rows={2} placeholder="Ej: buena pronunciación..." />
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-1">Intereses</label>
                  <input type="text" value={formIntereses} onChange={(e) => setFormIntereses(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" placeholder="Ej: fútbol, cocina..." />
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-1">Necesidades</label>
                  <textarea value={formNecesidades} onChange={(e) => setFormNecesidades(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" rows={2} placeholder="Ej: Preparar DELE B1..." />
                </div>
                <button onClick={guardarEdicionAlumno} disabled={guardandoAlumno} className="w-full flex justify-center items-center gap-2 p-3 rounded-xl font-bold text-white bg-[#1e1b4b] hover:bg-[#2a2663] transition-colors disabled:opacity-50">
                  {guardandoAlumno ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* VISTA DE PERFIL DE ALUMNO */}
        {vistaActual === 'perfil_alumno' && alumnoSeleccionado && (
          <div className="max-w-3xl mx-auto">
            <button onClick={() => setVistaActual('alumnos')} className="flex items-center gap-2 text-gray-600 font-bold mb-6 hover:text-[#4338ca] transition-colors">
              <ArrowLeft className="w-5 h-5" /> Volver a alumnos
            </button>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
              <div className="bg-indigo-50 p-6 border-b border-indigo-100">
                <h1 className="text-3xl font-bold text-[#1e1b4b]">{alumnoSeleccionado.nombre}</h1>
                <div className="flex gap-3 mt-2">
                  <span className="bg-indigo-200 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full">{alumnoSeleccionado.nivel_actual || 'Sin nivel'}</span>
                  <span className="bg-green-200 text-green-800 text-xs font-bold px-3 py-1 rounded-full">{alumnoSeleccionado.idioma_nativo || 'Sin idioma'}</span>
                </div>
                              <button onClick={() => cargarDatosEdicion()} className="mt-3 text-sm text-[#4338ca] font-bold hover:underline">
                ✏️ Editar datos
              </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div><span className="font-bold">Modalidad:</span> {alumnoSeleccionado.modalidad}</div>
                  <div><span className="font-bold">Tipo:</span> {alumnoSeleccionado.tipo_clase}</div>
                  <div><span className="font-bold">Clases/sem:</span> {alumnoSeleccionado.clases_por_semana}</div>
                </div>
                {alumnoSeleccionado.necesidades && <p className="text-gray-700"><span className="font-bold">Necesidades:</span> {alumnoSeleccionado.necesidades}</p>}
                {alumnoSeleccionado.debilidades && <p className="text-orange-700"><span className="font-bold">Debilidades:</span> {alumnoSeleccionado.debilidades}</p>}
                {alumnoSeleccionado.fortalezas && <p className="text-green-700"><span className="font-bold">Fortalezas:</span> {alumnoSeleccionado.fortalezas}</p>}
              </div>
            </div>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8 p-6">
              <h2 className="text-2xl font-bold text-[#1e1b4b] mb-4">📊 Métricas de Asistencia</h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-xl text-center border border-green-200">
                  <p className="text-3xl font-bold text-green-700">{alumnoSeleccionado.metricas?.porcentajeAsistencia || 0}%</p>
                  <p className="text-xs text-green-600 mt-1">Asistencia</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-xl text-center border border-indigo-200">
                  <p className="text-3xl font-bold text-indigo-700">{alumnoSeleccionado.metricas?.totalTomadas || 0}</p>
                  <p className="text-xs text-indigo-600 mt-1">Tomadas</p>
                </div>
                <div className="bg-red-50 p-4 rounded-xl text-center border border-red-200">
                  <p className="text-3xl font-bold text-red-700">{alumnoSeleccionado.metricas?.totalCanceladas || 0}</p>
                  <p className="text-xs text-red-600 mt-1">Canceladas</p>
                </div>
              </div>
            </div>
            <button onClick={() => generarPizarraPersonalizada(alumnoSeleccionado)} className="w-full flex justify-center items-center gap-2 p-4 rounded-xl font-bold text-white bg-[#1e1b4b] hover:bg-[#2a2663] transition-colors shadow-lg">
              <Sparkles className="w-5 h-5" /> Generar Pizarra Personalizada para {alumnoSeleccionado.nombre}
            </button>
          </div>
        )}
        {vistaActual === 'inicio' && (
          <>
            <div className="max-w-3xl mb-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h1 className="text-3xl font-bold text-[#1e1b4b] mb-6">Planificador de Clase</h1>
              <div className="space-y-5">
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Tema Principal de Español</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#4338ca] bg-gray-50 font-medium" placeholder="Ej: Presente simple, Artículos definidos..." value={tema} onChange={(e) => setTema(e.target.value)} />
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <select value={nivel} onChange={(e) => setNivel(e.target.value)} className="border border-gray-300 rounded-lg p-2.5 text-sm outline-none font-medium bg-white">
                    <option value="A1">Nivel A1</option>
                    <option value="A2">Nivel A2</option>
                    <option value="B1">Nivel B1</option>
                    <option value="B2">Nivel B2</option>
                    <option value="C1">Nivel C1</option>
                    <option value="C2">Nivel C2</option>
                  </select>
                  <select value={idiomaEstudiante} onChange={(e) => setIdiomaEstudiante(e.target.value)} className="border border-gray-300 rounded-lg p-2.5 text-sm outline-none font-medium bg-white">
                    <option value="Español">Idioma: Español</option>
                    <option value="Inglés">Idioma: Inglés</option>
                    <option value="Chino Mandarín">Idioma: Chino Mandarín</option>
                  </select>
                  <select value={enfoque} onChange={(e) => setEnfoque(e.target.value)} className="border border-gray-300 rounded-lg p-2.5 text-sm outline-none font-medium bg-white">
                    <option value="Explicativo">Explicativo</option>
                    <option value="Conversacional">Conversacional</option>
                    <option value="Preparación DELE">Preparación DELE</option>
                    <option value="Preparación SIELE">Preparación SIELE</option>
                    <option value="Profesional">Profesional</option>
                  </select>
                </div>
                
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <button onClick={() => setMostrarAvanzados(!mostrarAvanzados)} className="flex items-center gap-2 text-[#4338ca] font-bold text-sm hover:underline">
                    <SlidersHorizontal className="w-4 h-4 shrink-0" /> {mostrarAvanzados ? 'Ocultar ajustes avanzados' : 'Mostrar ajustes avanzados'}
                  </button>
                  
                  {mostrarAvanzados && (
                    <div className="grid grid-cols-1 gap-4 mt-4 bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100">
                      <div>
                        <label className="block text-gray-700 text-xs font-bold mb-1">Tema gramatical</label>
                        <input type="text" value={temaGramatical} onChange={(e) => setTemaGramatical(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none font-medium bg-white" placeholder="Ej: Verbos regulares, Ser vs Estar..." />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-xs font-bold mb-1">Vocabulario (Opcional)</label>
                        <input type="text" value={vocabularioEspecifico} onChange={(e) => setVocabularioEspecifico(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none font-medium bg-white" placeholder="Ej: correr, manzana, profesor..." />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-xs font-bold mb-1">Cantidad de ejercicios por tema</label>
                        <div className="relative">
                          <button 
                            onClick={() => setMostrarSelectorEjercicios(!mostrarSelectorEjercicios)}
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none font-medium bg-white flex items-center justify-between hover:border-[#4338ca] transition-colors"
                          >
                            <span>{cantidadEjercicios} {cantidadEjercicios === 1 ? 'ejercicio' : 'ejercicios'}</span>
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${mostrarSelectorEjercicios ? 'rotate-180' : ''}`} />
                          </button>
                          {mostrarSelectorEjercicios && (
                            <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                              {[1, 2, 3, 4, 5].map(num => (
                                <button
                                  key={num}
                                  onClick={() => { setCantidadEjercicios(num); setMostrarSelectorEjercicios(false); }}
                                  className={`w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 transition-colors ${cantidadEjercicios === num ? 'bg-indigo-100 font-bold text-[#4338ca]' : 'text-gray-700'} ${num === 1 ? 'rounded-t-lg' : ''} ${num === 5 ? 'rounded-b-lg' : ''}`}
                                >
                                  {num} {num === 1 ? 'ejercicio' : 'ejercicios'}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button onClick={manejarGeneracion} disabled={cargando} className={`w-full flex justify-center items-center gap-2 p-4 rounded-xl font-bold text-white transition-all shadow-xl ${cargando ? 'bg-gray-400' : 'bg-[#1e1b4b] hover:bg-[#2a2663]'}`}>
                  {cargando ? 'Generando clase...' : 'Generar Pizarra Interactiva'} <Sparkles className="w-5 h-5 shrink-0 ml-1" />
                </button>
              </div>
            </div>
                        {/* BOTÓN PANTALLA COMPLETA */}
            {diapositivas.length > 0 && !pantallaCompleta && (
              <button onClick={() => setPantallaCompleta(true)} className="fixed top-4 right-4 z-50 bg-[#1e1b4b] text-white px-4 py-2 rounded-xl font-bold shadow-lg hover:bg-[#2a2663] transition-colors">
                ⛶ Pantalla completa
              </button>
            )}
                                 {pantallaCompleta && (
              <div className="fixed inset-0 z-[100] bg-white flex flex-col" style={{ height: '100vh' }}>
                <div className="bg-white shadow-sm px-6 py-3 flex justify-between items-center border-b border-gray-200">
                  <span className="font-bold text-[#1e1b4b]">Modo presentación</span>
                  <button onClick={() => setPantallaCompleta(false)} className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-red-700 transition-colors">
                    ✕ Salir
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto px-4 py-6">
                  <div className="max-w-6xl mx-auto">
                    {diapositivas[slideActual]?.tipo === 'titulo' && (
                      <div className="text-center py-12">
                        <h2 className="text-6xl font-extrabold text-[#1e1b4b] mb-4">{diapositivas[slideActual].contenido.titulo}</h2>
                        <p className="text-2xl text-gray-500 font-medium">{diapositivas[slideActual].contenido.subtitulo}</p>
                      </div>
                    )}
                    {diapositivas[slideActual]?.tipo === 'resumen' && <ResumenDiapositiva datos={diapositivas[slideActual].contenido} />}
                    {diapositivas[slideActual]?.tipo === 'vocabulario' && (
                      <div className="w-full">
                              
                        <h2 className="text-4xl font-bold text-[#1e1b4b] mb-8 flex items-center gap-3">📚 {diapositivas[slideActual].contenido.titulo}</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          {diapositivas[slideActual].contenido.palabras?.map((p: any, i: number) => <TarjetaVocabulario key={i} palabra={p} />)}
                        </div>
                      </div>
                    )}
                    {(diapositivas[slideActual]?.tipo === 'tabla_gramatical' || diapositivas[slideActual]?.tipo === 'mapa_mental') && <GramaticaDiapositiva datos={diapositivas[slideActual].contenido} />}
                    {diapositivas[slideActual]?.tipo === 'pausa_reflexion' && <PausaReflexion datos={diapositivas[slideActual].contenido} />}
                    {diapositivas[slideActual]?.tipo === 'ejercicio' && <EjercicioDiapositiva datos={diapositivas[slideActual].contenido} />}
                    {diapositivas[slideActual]?.tipo === 'lectura' && (
                      <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl font-bold text-[#1e1b4b] mb-6">📖 {diapositivas[slideActual].contenido.titulo}</h2>
                        <div className="bg-orange-50 p-10 rounded-2xl text-2xl text-gray-800 leading-relaxed font-serif mb-8 border border-orange-200 shadow-inner text-justify">
                          <TextoConTooltips texto={diapositivas[slideActual].contenido.texto} diccionario={diccionarioGlobal} />
                        </div>
                      </div>
                    )}
                    {diapositivas[slideActual]?.tipo === 'cierre' && <CierreDiapositiva datos={diapositivas[slideActual].contenido} />}
                  </div>
                </div>

                <div className="bg-gray-100 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                  <button onClick={() => setSlideActual(slideActual - 1)} disabled={slideActual === 0} className="px-6 py-3 bg-white text-gray-700 font-bold disabled:opacity-30 rounded-xl shadow-sm border border-gray-200">
                    <ChevronLeft className="w-5 h-5 inline mr-1" /> Anterior
                  </button>
                  <span className="font-bold text-gray-500 text-lg">{slideActual + 1} / {diapositivas.length}</span>
                  <button onClick={() => setSlideActual(slideActual + 1)} disabled={slideActual === diapositivas.length - 1} className="px-6 py-3 bg-[#4338ca] text-white font-bold disabled:opacity-50 rounded-xl shadow-sm">
                    Siguiente <ChevronRight className="w-5 h-5 inline ml-1" />
                  </button>
                </div>
              </div>
            )}
{/* PIZARRA VIRTUAL */}
                       {diapositivas.length > 0 && !pantallaCompleta && (
              <div className="max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col min-h-[600px] animate-in fade-in duration-500">
                <div className="flex-1 p-10 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 100px)' }}>
                  
                  {diapositivas[slideActual]?.tipo === 'titulo' && (
                    <div className="text-center">
                      <h2 className="text-5xl font-extrabold text-[#1e1b4b] mb-4">{diapositivas[slideActual].contenido.titulo}</h2>
                      <p className="text-xl text-gray-500 font-medium">{diapositivas[slideActual].contenido.subtitulo}</p>
                    </div>
                  )}
                  
                  {diapositivas[slideActual]?.tipo === 'resumen' && (
                    <ResumenDiapositiva datos={diapositivas[slideActual].contenido} />
                  )}
                  
                  {diapositivas[slideActual]?.tipo === 'vocabulario' && (
                    <div className="w-full">
                      <h2 className="text-3xl font-bold text-[#1e1b4b] mb-8 flex items-center gap-3">📚 {diapositivas[slideActual].contenido.titulo}</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {diapositivas[slideActual].contenido.palabras?.map((p: any, i: number) => <TarjetaVocabulario key={i} palabra={p} />)}
                      </div>
                    </div>
                  )}

                  {(diapositivas[slideActual]?.tipo === 'tabla_gramatical' || diapositivas[slideActual]?.tipo === 'mapa_mental') && (
                    <GramaticaDiapositiva datos={diapositivas[slideActual].contenido} />
                  )}

                  {diapositivas[slideActual]?.tipo === 'pausa_reflexion' && (
                    <PausaReflexion datos={diapositivas[slideActual].contenido} />
                  )}

                  {diapositivas[slideActual]?.tipo === 'ejercicio' && (
                    <EjercicioDiapositiva datos={diapositivas[slideActual].contenido} />
                  )}
                  
                  {diapositivas[slideActual]?.tipo === 'lectura' && (
                    <div className="max-w-3xl mx-auto">
                      <h2 className="text-3xl font-bold text-[#1e1b4b] mb-6">📖 {diapositivas[slideActual].contenido.titulo}</h2>
                      <div className="bg-orange-50 p-8 rounded-2xl text-xl text-gray-800 leading-relaxed font-serif mb-8 border border-orange-200 shadow-inner whitespace-pre-line text-justify">
                        <TextoConTooltips texto={diapositivas[slideActual].contenido.texto} diccionario={diccionarioGlobal} />
                      </div>
                      <h3 className="font-bold text-gray-700 mb-3 text-lg">Preguntas de comprensión:</h3>
                      <ul className="list-disc pl-5 space-y-2 text-gray-600 font-medium">
                        {diapositivas[slideActual].contenido.preguntas?.map((q: string, i: number) => (
                          <li key={i}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {diapositivas[slideActual]?.tipo === 'cierre' && (
                    <CierreDiapositiva datos={diapositivas[slideActual].contenido} />
                  )}

                </div>
                
                <div className="bg-gray-50 p-4 rounded-b-3xl border-t border-gray-100 flex justify-between items-center">
                  <button onClick={() => setSlideActual(slideActual - 1)} disabled={slideActual === 0} className="px-5 py-2 text-gray-600 font-bold disabled:opacity-30 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition-colors">
                    <ChevronLeft className="w-5 h-5 shrink-0"/> Anterior
                  </button>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-400 text-sm tracking-widest uppercase">
                      {slideActual + 1} / {diapositivas.length}
                    </span>
                    <button onClick={guardarPizarra} disabled={guardando} className="flex items-center gap-2 text-[#4338ca] font-bold hover:bg-indigo-50 px-4 py-2 rounded-xl transition-colors border border-indigo-200 bg-white disabled:opacity-50">
                      <Save className="w-4 h-4 shrink-0" /> {guardando ? 'Guardando...' : 'Guardar Clase'}
                    </button>
                  </div>
                  <button onClick={() => setSlideActual(slideActual + 1)} disabled={slideActual === diapositivas.length - 1} className="px-5 py-2 bg-[#4338ca] text-white font-bold disabled:opacity-50 hover:bg-[#3730a3] rounded-lg flex items-center gap-2 shadow-md transition-colors">
                    Siguiente <ChevronRight className="w-5 h-5 shrink-0"/>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
    
        {vistaActual === 'pizarras' && (
  <MisPizarras
    pizarrasGuardadas={pizarrasGuardadas}
    abrirPizarraGuardada={abrirPizarraGuardada}
    borrarPizarra={borrarPizarra}
    setVistaActual={setVistaActual}
  />
)}
      </main>
    </div>
  );
}