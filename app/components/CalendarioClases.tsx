import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Calendar, Clock, Plus, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const HORAS = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00'];

export default function CalendarioClases() {
  const [clases, setClases] = useState<any[]>([]);
  const [emailProfesor, setEmailProfesor] = useState('solanojavier.04092005@gmail.com');
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [duracion, setDuracion] = useState(60);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [mostrarEstado, setMostrarEstado] = useState<string | null>(null);
  const [alumnoId, setAlumnoId] = useState('');
  const [dia, setDia] = useState('lunes');
  const [hora, setHora] = useState('08:00');
  const [notaEstado, setNotaEstado] = useState('');
  const [claseSeleccionada, setClaseSeleccionada] = useState<any>(null);
  const [notificacion, setNotificacion] = useState('');
  const [offsetSemana, setOffsetSemana] = useState(0);
  const [fechaSemana, setFechaSemana] = useState('');

  useEffect(() => {
    const hoy = new Date();
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay() + 1 + offsetSemana * 7);
    setFechaSemana(inicioSemana.toISOString().split('T')[0]);
  }, [offsetSemana]);

  const obtenerFechasSemana = () => {
    if (!fechaSemana) return [];
    const inicio = new Date(fechaSemana + 'T00:00:00');
    return DIAS.map((_, i) => {
      const fecha = new Date(inicio);
      fecha.setDate(inicio.getDate() + i);
      return fecha.toISOString().split('T')[0];
    });
  };

  useEffect(() => {
    cargarClases();
    cargarAlumnos();
  }, [offsetSemana]);

  const cargarClases = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    const { data } = await supabase.from('clases_programadas').select('*, alumnos!inner(nombre, modalidad)').eq('alumnos.profesor_id', userId).order('hora_inicio');
    if (data) setClases(data);
  };

  const cargarAlumnos = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    const { data } = await supabase.from('alumnos').select('id, nombre').eq('profesor_id', userId);
    if (data) setAlumnos(data);
  };

  const agregarClase = async () => {
    if (!alumnoId) return;

    const [hInicio, mInicio] = hora.split(':').map(Number);
    const inicioMinutos = hInicio * 60 + mInicio;
    const finMinutos = inicioMinutos + duracion;

    const clasesMismoDia = clases.filter(c => c.dia_semana === dia);
    
    for (const clase of clasesMismoDia) {
      const [hExistente, mExistente] = (clase.hora_inicio || '').slice(0, 5).split(':').map(Number);
      const inicioExistente = hExistente * 60 + mExistente;
      const finExistente = inicioExistente + (clase.duracion_minutos || 60);

      if (inicioMinutos < finExistente && finMinutos > inicioExistente) {
        setNotificacion(`⚠️ Conflicto horario: Ya tienes una clase con ${clase.alumnos?.nombre || 'otro alumno'} de ${clase.hora_inicio?.slice(0,5)} a ${calcularHoraFin(clase.hora_inicio?.slice(0,5), clase.duracion_minutos || 60)}`);
        setTimeout(() => setNotificacion(''), 4000);
        return;
      }
    }

    const fechas = obtenerFechasSemana();
    const indexDia = DIAS.indexOf(dia);
    const fechaClase = fechas[indexDia] || new Date().toISOString().split('T')[0];

    await supabase.from('clases_programadas').insert([{
      alumno_id: alumnoId, dia_semana: dia, hora_inicio: hora,
      duracion_minutos: duracion, estado: 'pendiente', clase_fija: true,
      fecha_real: fechaClase
    }]);
    setMostrarForm(false);
    setAlumnoId('');
    cargarClases();
  };

  const cambiarEstado = async (id: string, estado: string) => {
    const clase = clases.find(c => c.id === id);
    if (!clase) return;

    if (clase.clase_fija && estado === 'tomada') {
      await supabase.from('clases_programadas').insert([{
        alumno_id: clase.alumno_id,
        dia_semana: clase.dia_semana,
        hora_inicio: clase.hora_inicio,
        duracion_minutos: clase.duracion_minutos,
        estado: 'tomada',
        clase_fija: false,
        fecha_real: new Date().toISOString().split('T')[0],
        notas: notaEstado || undefined
      }]);
    } else {
      await supabase.from('clases_programadas').update({
        estado,
        fecha_real: new Date().toISOString().split('T')[0],
        notas: notaEstado || undefined
      }).eq('id', id);
    }

    setMostrarEstado(null);
    setNotaEstado('');
    setClaseSeleccionada(null);
    cargarClases();
    enviarNotificacion(clase.alumnos?.nombre, clase.dia_semana, clase.hora_inicio?.slice(0,5), 'estado_cambiado');
    
    if (notaEstado) {
      const ultimaClaseId = localStorage.getItem('ultimaClaseId');
      await supabase.from('feedback_pizarras').insert([{
        alumno_id: clase.alumno_id,
        clase_id: ultimaClaseId || null,
        tema: clase.alumnos?.nombre + ' - ' + clase.dia_semana,
        calificacion: notaEstado.includes('👍') ? 'gusto' : notaEstado.includes('👎') ? 'no_gusto' : 'gusto',
        comentario: notaEstado
      }]);
    }
  };

  const eliminarClase = async (id: string) => {
    await supabase.from('clases_programadas').delete().eq('id', id);
    cargarClases();
  };

  const abrirPanelEstado = (clase: any) => {
    setClaseSeleccionada(clase);
    setMostrarEstado(clase.id);
    setNotaEstado(clase.notas || '');
  };

  const clasesPorDiaYHora = (diaSemana: string, horaStr: string) => {
    return clases.filter(c => c.dia_semana === diaSemana && c.hora_inicio?.startsWith(horaStr));
  };

  const calcularHoraFin = (inicio: string, duracionMin: number) => {
    const [h, m] = inicio.split(':').map(Number);
    const totalMin = h * 60 + m + duracionMin;
    const hFin = Math.floor(totalMin / 60) % 24;
    const mFin = totalMin % 60;
    return `${String(hFin).padStart(2, '0')}:${String(mFin).padStart(2, '0')}`;
  };

  const enviarNotificacion = async (alumno: string, dia: string, hora: string, tipo: string) => {
    try {
      await fetch('/api/notificaciones', {
        method: 'POST',
        body: JSON.stringify({ email: emailProfesor, alumno, dia, hora, tipo }),
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error enviando notificación:', error);
    }
  };

  const colorEstado = (estado: string) => {
    switch (estado) {
      case 'tomada': return 'bg-green-100 text-green-800 border-green-300';
      case 'no_tomada': return 'bg-red-100 text-red-800 border-red-300';
      case 'cancelada': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {notificacion && (
        <div className="fixed top-4 right-4 z-50 bg-red-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg animate-in slide-in-from-right duration-300">
          {notificacion}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8 text-[#4338ca]" />
          <h1 className="text-3xl font-bold text-[#1e1b4b]">Planificador Semanal</h1>
          <div className="flex items-center gap-2 ml-4">
            <button onClick={() => setOffsetSemana(offsetSemana - 1)} className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300">←</button>
            <button onClick={() => setOffsetSemana(0)} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-bold">Hoy</button>
            <button onClick={() => setOffsetSemana(offsetSemana + 1)} className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300">→</button>
          </div>
        </div>
        <button onClick={() => setMostrarForm(true)} className="flex items-center gap-2 bg-[#1e1b4b] text-white font-bold py-2.5 px-5 rounded-xl hover:bg-[#2a2663] transition-colors">
          <Plus className="w-4 h-4" /> Nueva Clase
        </button>
      </div>

      {mostrarForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">Alumno</label>
              <select value={alumnoId} onChange={(e) => setAlumnoId(e.target.value)} className="w-full border rounded-lg p-2 text-sm">
                <option value="">Seleccionar...</option>
                {alumnos.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Día</label>
              <select value={dia} onChange={(e) => setDia(e.target.value)} className="w-full border rounded-lg p-2 text-sm capitalize">
                {DIAS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Hora inicio</label>
              <select value={hora} onChange={(e) => setHora(e.target.value)} className="w-full border rounded-lg p-2 text-sm">
                {HORAS.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Duración</label>
              <select value={duracion} onChange={(e) => setDuracion(parseInt(e.target.value))} className="w-full border rounded-lg p-2 text-sm">
                <option value={30}>30 min</option>
                <option value={60}>1 hora</option>
                <option value={90}>1:30 horas</option>
                <option value={120}>2 horas</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={agregarClase} className="bg-[#4338ca] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#3730a3] transition-colors">Guardar</button>
            <button onClick={() => setMostrarForm(false)} className="text-gray-600 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors">Cancelar</button>
          </div>
        </div>
      )}

      {mostrarEstado && claseSeleccionada && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
          <h3 className="font-bold text-lg mb-3">
            Cambiar estado: {claseSeleccionada.alumnos?.nombre} - {claseSeleccionada.dia_semana} {claseSeleccionada.hora_inicio?.slice(0,5)} a {calcularHoraFin(claseSeleccionada.hora_inicio?.slice(0,5), claseSeleccionada.duracion_minutos || 60)}
          </h3>
          <textarea value={notaEstado} onChange={(e) => setNotaEstado(e.target.value)} className="w-full border rounded-lg p-2 text-sm mb-4" rows={2} placeholder="Nota opcional..." />
          <div className="mb-4">
            <label className="block text-xs font-bold mb-2">¿Te gustó la pizarra generada?</label>
            <div className="flex gap-3">
              <button onClick={() => setNotaEstado(notaEstado + ' [👍 Gustó]')} className="text-2xl hover:scale-125 transition-transform">👍</button>
              <button onClick={() => setNotaEstado(notaEstado + ' [👎 No gustó]')} className="text-2xl hover:scale-125 transition-transform">👎</button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-bold mb-1">Avances del alumno</label>
            <input type="text" className="w-full border rounded-lg p-2 text-sm" placeholder="Ej: Mejoró en pronunciación..."
              onChange={(e) => setNotaEstado(notaEstado + ' [Avances: ' + e.target.value + ']')} />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-bold mb-1">Dificultades observadas</label>
            <input type="text" className="w-full border rounded-lg p-2 text-sm" placeholder="Ej: Le costó el subjuntivo..."
              onChange={(e) => setNotaEstado(notaEstado + ' [Dificultades: ' + e.target.value + ']')} />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-bold mb-1">Progreso percibido (1-5)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setNotaEstado(notaEstado + ' [Progreso: ' + n + ']')} className={`w-10 h-10 rounded-full font-bold ${notaEstado.includes('[Progreso: ' + n + ']') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>{n}</button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => cambiarEstado(claseSeleccionada.id, 'tomada')} className="flex items-center gap-2 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              <CheckCircle className="w-4 h-4" /> Tomada
            </button>
            <button onClick={() => cambiarEstado(claseSeleccionada.id, 'no_tomada')} className="flex items-center gap-2 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
              <XCircle className="w-4 h-4" /> No tomada
            </button>
            <button onClick={() => cambiarEstado(claseSeleccionada.id, 'cancelada')} className="flex items-center gap-2 bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors">
              <AlertTriangle className="w-4 h-4" /> Cancelada
            </button>
            <button onClick={() => { setMostrarEstado(null); setNotaEstado(''); }} className="text-gray-600 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors">Cerrar</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-indigo-50">
              <th className="p-3 text-left text-xs font-bold text-gray-500 uppercase w-20">Hora</th>
              {obtenerFechasSemana().map((fechaStr, i) => {
                const fecha = new Date(fechaStr + 'T00:00:00');
                return (
                  <th key={i} className="p-3 text-center text-xs font-bold text-gray-500 uppercase">
                    <span className="capitalize">{DIAS[i]}</span>
                    <br />
                    <span className="text-[10px]">{fecha.getDate()}/{fecha.getMonth() + 1}</span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {HORAS.map(horaStr => (
              <tr key={horaStr} className="border-b border-gray-100">
                <td className="p-3 text-sm font-bold text-gray-500"><Clock className="w-3 h-3 inline mr-1" />{horaStr}</td>
                {DIAS.map(diaSemana => {
                  const clasesEnSlot = clasesPorDiaYHora(diaSemana, horaStr);
                  return (
                    <td key={diaSemana} className="p-2 text-center align-top min-h-[60px]">
                      {clasesEnSlot.map(clase => (
                        <div key={clase.id} onClick={() => abrirPanelEstado(clase)}
                          className={`rounded-lg p-2 text-xs mb-1 cursor-pointer border-2 transition-all hover:shadow-md ${colorEstado(clase.estado)}`}>
                          <p className="font-bold">{clase.alumnos?.nombre || 'Alumno'}</p>
                          <p className="text-[11px]">
                            {clase.alumnos?.modalidad === 'online' ? '💻' : '🏫'} {clase.hora_inicio?.slice(0,5)} - {calcularHoraFin(clase.hora_inicio?.slice(0,5), clase.duracion_minutos || 60)}
                          </p>
                          {clase.estado !== 'pendiente' && (
                            <p className="text-[10px] mt-1 opacity-70">
                              {clase.estado === 'tomada' ? '✅' : clase.estado === 'cancelada' ? '⚠️' : '❌'} {clase.fecha_real}
                            </p>
                          )}
                          {clase.estado !== 'tomada' ? (
                            <button 
                              onClick={(e) => { e.stopPropagation(); eliminarClase(clase.id); }}
                              className="mt-1 text-[10px] text-red-500 hover:text-red-700 hover:underline"
                              title="Eliminar clase">
                              🗑️ Eliminar
                            </button>
                          ) : (
                            <span className="text-[10px] text-gray-400">🔒 Registrada</span>
                          )}
                        </div>
                      ))}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 mt-4 text-sm text-gray-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-indigo-200 inline-block"></span> Pendiente</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-200 inline-block"></span> Tomada</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-200 inline-block"></span> No tomada</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-200 inline-block"></span> Cancelada</span>
      </div>
    </div>
  );
}