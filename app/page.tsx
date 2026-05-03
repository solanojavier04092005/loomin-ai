'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Home, BookOpen, FolderOpen, Sparkles, ChevronLeft, 
  ChevronRight, HelpCircle, SlidersHorizontal, CheckCircle2, 
  Save, Trash2, Calendar, X, CheckCircle, AlertCircle, 
  MessageSquare, Brain, ListChecks, Target, Bookmark, Trophy,
  ChevronDown
} from 'lucide-react';

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
    <div onClick={() => setRevelado(!revelado)} className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 min-h-[160px] flex flex-col items-center justify-center text-center ${revelado ? 'border-[#4338ca] bg-indigo-50 shadow-md' : 'border-gray-200 bg-white hover:border-indigo-300'}`}>
      <h3 className="text-xl font-bold text-[#1e1b4b] mb-2">{palabra.espanol}</h3>
      {revelado ? (
        <div className="animate-fade-in">
          <p className="text-gray-500 mb-1 font-medium">{palabra.fonetica}</p>
          <p className="text-2xl text-red-600 font-bold">{palabra.traduccion}</p>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#4338ca] text-white rounded-xl m-1 opacity-0 hover:opacity-100 transition-opacity">
          <span className="text-sm font-medium">Clic para revelar...</span>
          <HelpCircle className="w-4 h-4 mt-1 opacity-70 shrink-0" />
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
// NUEVOS RENDERIZADORES PARA AGENTES
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
// PANTALLA PRINCIPAL
// =============================================
export default function PanelLoominAI() {
  const [vistaActual, setVistaActual] = useState<'inicio' | 'pizarras'>('inicio');

  // Estados de Formulario ACTUALIZADOS
  const [tema, setTema] = useState('');
  const [nivel, setNivel] = useState('A1');
  const [idiomaEstudiante, setIdiomaEstudiante] = useState('Chino Mandarín');
  const [enfoque, setEnfoque] = useState('Explicativo');
  const [mostrarAvanzados, setMostrarAvanzados] = useState(false);
  const [temaGramatical, setTemaGramatical] = useState('');
  const [vocabularioEspecifico, setVocabularioEspecifico] = useState('');
  const [cantidadEjercicios, setCantidadEjercicios] = useState(3);
  const [mostrarSelectorEjercicios, setMostrarSelectorEjercicios] = useState(false);

  // Estados de Pizarra
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [diapositivas, setDiapositivas] = useState<any[]>([]);
  const [slideActual, setSlideActual] = useState(0);
  const [pizarrasGuardadas, setPizarrasGuardadas] = useState<any[]>([]);
  
  // Notificación del sistema
  const [notificacion, setNotificacion] = useState<{mensaje: string, tipo: 'exito' | 'error'} | null>(null);

  const mostrarNotificacion = (mensaje: string, tipo: 'exito' | 'error') => {
    setNotificacion({ mensaje, tipo });
    setTimeout(() => setNotificacion(null), 3500); 
  };

  const cargarPizarrasDeNube = async () => {
    const { data } = await supabase.from('pizarras').select('*').order('created_at', { ascending: false }); 
    if (data) setPizarrasGuardadas(data);
  };

  useEffect(() => { cargarPizarrasDeNube(); }, []);

  const guardarPizarra = async () => {
    if (diapositivas.length === 0) return;
    setGuardando(true);
    const { data } = await supabase.from('pizarras').insert([
      { tema: tema || 'Clase sin título', nivel, fecha: new Date().toLocaleDateString(), diapositivas }
    ]).select();
    if (data) {
      setPizarrasGuardadas([data[0], ...pizarrasGuardadas]);
      mostrarNotificacion('¡Pizarra guardada con éxito!', 'exito');
    } else {
      mostrarNotificacion('Error al guardar.', 'error');
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
          vocabularioEspecifico, temaGramatical, cantidadEjercicios
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

  // Compilador de Diccionario para tooltips (PROTEGIDO)
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
    <div className="flex min-h-screen bg-[#f8f9fc] font-sans relative overflow-x-hidden">
      
      {/* NOTIFICACIÓN */}
      {notificacion && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-2xl shadow-xl border animate-in slide-in-from-bottom duration-300 ${
          notificacion.tipo === 'exito' ? 'bg-[#1e1b4b] border-indigo-500 text-white' : 'bg-red-600 border-red-400 text-white'
        }`}>
          {notificacion.tipo === 'exito' ? <CheckCircle className="w-5 h-5 shrink-0 text-green-400" /> : <AlertCircle className="w-5 h-5 shrink-0 text-white" />}
          <p className="font-bold text-sm pr-4">{notificacion.mensaje}</p>
          <button onClick={() => setNotificacion(null)} className="ml-2 p-1 hover:bg-white/20 rounded-full"><X size={14} /></button>
        </div>
      )}

      {/* SIDEBAR */}
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
        </nav>
      </aside>

      {/* MAIN */}
      <main className="ml-0 md:ml-56 flex-1 p-8">
        
        {vistaActual === 'inicio' && (
          <>
            {/* FORMULARIO */}
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
                
                {/* PANEL AVANZADO */}
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
                      
                      {/* SELECTOR DE CANTIDAD DE EJERCICIOS */}
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

            {/* PIZARRA VIRTUAL */}
            {diapositivas.length > 0 && (
              <div className="max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col min-h-[600px] animate-in fade-in duration-500">
                <div className="flex-1 p-10 flex flex-col justify-center overflow-y-auto">
                  
                  {/* PORTADA */}
                  {diapositivas[slideActual]?.tipo === 'titulo' && (
                    <div className="text-center">
                      <h2 className="text-5xl font-extrabold text-[#1e1b4b] mb-4">{diapositivas[slideActual].contenido.titulo}</h2>
                      <p className="text-xl text-gray-500 font-medium">{diapositivas[slideActual].contenido.subtitulo}</p>
                    </div>
                  )}
                  
                  {/* RESUMEN */}
                  {diapositivas[slideActual]?.tipo === 'resumen' && (
                    <ResumenDiapositiva datos={diapositivas[slideActual].contenido} />
                  )}
                  
                  {/* VOCABULARIO */}
                  {diapositivas[slideActual]?.tipo === 'vocabulario' && (
                    <div className="w-full">
                      <h2 className="text-3xl font-bold text-[#1e1b4b] mb-8 flex items-center gap-3">📚 {diapositivas[slideActual].contenido.titulo}</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {diapositivas[slideActual].contenido.palabras?.map((p: any, i: number) => <TarjetaVocabulario key={i} palabra={p} />)}
                      </div>
                    </div>
                  )}

                  {/* GRAMÁTICA HTML */}
                  {diapositivas[slideActual]?.tipo === 'gramatica_html' && (
                    <div className="w-full">
                      <div className="flex items-center gap-3 mb-6">
                        <Brain className="w-7 h-7 text-purple-600 shrink-0" />
                        <div>
                          <h2 className="text-3xl font-bold text-[#1e1b4b]">{diapositivas[slideActual].contenido.titulo}</h2>
                          <p className="text-sm text-gray-500">Tema {diapositivas[slideActual].contenido.tema_numero} de {diapositivas[slideActual].contenido.total_temas}</p>
                        </div>
                      </div>
                      <div className="gramatica-html-wrapper" dangerouslySetInnerHTML={{ __html: diapositivas[slideActual].contenido.html }} />
                      
                      {/* Errores comunes */}
                      {diapositivas[slideActual].contenido.errores_comunes?.length > 0 && (
                        <div className="mt-8 bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
                          <h3 className="text-xl font-bold text-amber-800 mb-4 flex items-center gap-2">
                            <AlertCircle className="w-6 h-6 shrink-0" /> Errores comunes
                          </h3>
                          <div className="space-y-3">
                            {diapositivas[slideActual].contenido.errores_comunes.map((err: any, i: number) => (
                              <div key={i} className="bg-white rounded-xl p-4 border border-amber-100">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm font-bold line-through">{err.error}</span>
                                  <span className="text-gray-400">→</span>
                                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-bold">{err.correccion}</span>
                                </div>
                                <p className="text-sm text-gray-600">💡 {err.explicacion}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* PAUSA REFLEXIÓN */}
                  {diapositivas[slideActual]?.tipo === 'pausa_reflexion' && (
                    <PausaReflexion datos={diapositivas[slideActual].contenido} />
                  )}

                  {/* EJERCICIO HTML */}
                  {diapositivas[slideActual]?.tipo === 'ejercicio_html' && (
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-[#1e1b4b] flex items-center gap-2">
                          <ListChecks className="w-6 h-6 text-indigo-600" /> {diapositivas[slideActual].contenido.titulo}
                        </h2>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {diapositivas[slideActual].contenido.ejercicio_numero}/{diapositivas[slideActual].contenido.total_ejercicios}
                        </span>
                      </div>
                      <div className="ejercicio-html-wrapper" dangerouslySetInnerHTML={{ __html: diapositivas[slideActual].contenido.html }} />
                    </div>
                  )}
                  
                  {/* LECTURA */}
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

                  {/* CIERRE */}
                  {diapositivas[slideActual]?.tipo === 'cierre' && (
                    <CierreDiapositiva datos={diapositivas[slideActual].contenido} />
                  )}

                </div>
                
                {/* CONTROLES */}
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

        {/* VISTA DE MIS PIZARRAS */}
        {vistaActual === 'pizarras' && (
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className="w-8 h-8 shrink-0 text-[#4338ca]" />
              <h1 className="text-3xl font-bold text-[#1e1b4b]">Mis Pizarras Guardadas</h1>
            </div>
            
            {pizarrasGuardadas.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
                <FolderOpen className="w-12 h-12 mx-auto text-gray-300 mb-4 shrink-0" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">No hay clases guardadas</h3>
                <button onClick={() => setVistaActual('inicio')} className="bg-[#1e1b4b] text-white font-bold py-2.5 px-6 rounded-xl hover:bg-[#2a2663] transition-colors shadow-lg">
                  Crear una clase ahora
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pizarrasGuardadas.map((p) => (
                  <div key={p.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col group">
                    <div className="bg-indigo-50 p-5 border-b border-indigo-100 flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <span className="bg-white text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-md border border-indigo-200">{p.nivel}</span>
                        <div className="flex items-center text-gray-400 text-xs font-bold gap-1">
                          <Calendar className="w-3 h-3 shrink-0" /> {p.fecha}
                        </div>
                      </div>
                      <h3 className="font-bold text-lg text-[#1e1b4b] leading-tight mb-2 line-clamp-2">{p.tema}</h3>
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">{p.diapositivas?.length || 0} Diapositivas</p>
                    </div>
                    <div className="p-4 bg-white flex justify-between items-center">
                      <button onClick={() => abrirPizarraGuardada(p)} className="flex items-center gap-2 text-sm font-bold text-[#4338ca] hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors">
                        <Bookmark className="w-4 h-4 shrink-0" /> Abrir Pizarra
                      </button>
                      <button onClick={() => borrarPizarra(p.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar clase">
                        <Trash2 className="w-4 h-4 shrink-0" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}