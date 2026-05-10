import React from 'react';
import { BookOpen, FolderOpen, Calendar, Bookmark, Trash2 } from 'lucide-react';

interface MisPizarrasProps {
  pizarrasGuardadas: any[];
  abrirPizarraGuardada: (pizarra: any) => void;
  borrarPizarra: (id: string) => void;
  setVistaActual: (vista: any) => void;
}

export default function MisPizarras({ pizarrasGuardadas, abrirPizarraGuardada, borrarPizarra, setVistaActual }: MisPizarrasProps) {
  return (
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
  );
}