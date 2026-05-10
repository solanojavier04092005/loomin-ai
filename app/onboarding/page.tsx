'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Sparkles, ChevronRight } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function OnboardingPage() {
  const [paso, setPaso] = useState(1);
  const [materia, setMateria] = useState('');
  const [idiomas, setIdiomas] = useState('');
  const [nivelExpertise, setNivelExpertise] = useState('intermedio');

  const guardar = async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      await supabase.from('perfiles_profesor').upsert({
        id: data.user.id,
        materia,
        idiomas: idiomas.split(',').map(i => i.trim()),
        nivel_expertise: nivelExpertise
      });
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1b4b] to-[#4338ca] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full">
        <div className="text-center mb-8">
          <Sparkles className="w-12 h-12 text-[#4338ca] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#1e1b4b]">Personaliza tu experiencia</h1>
          <p className="text-gray-500 mt-2">Paso {paso} de 3</p>
        </div>

        {paso === 1 && (
          <div className="space-y-4">
            <label className="block text-sm font-bold">¿Qué materia enseñas?</label>
            <input type="text" value={materia} onChange={(e) => setMateria(e.target.value)} className="w-full border rounded-lg p-3" placeholder="Ej: Español, Matemáticas, Historia..." />
            <button onClick={() => setPaso(2)} disabled={!materia} className="w-full bg-[#1e1b4b] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {paso === 2 && (
          <div className="space-y-4">
            <label className="block text-sm font-bold">¿Qué idiomas dominas?</label>
            <input type="text" value={idiomas} onChange={(e) => setIdiomas(e.target.value)} className="w-full border rounded-lg p-3" placeholder="Ej: Español, Inglés, Chino..." />
            <p className="text-xs text-gray-400">Sepáralos por comas</p>
            <button onClick={() => setPaso(3)} disabled={!idiomas} className="w-full bg-[#1e1b4b] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {paso === 3 && (
          <div className="space-y-4">
            <label className="block text-sm font-bold">Nivel de expertise en tu materia</label>
            <select value={nivelExpertise} onChange={(e) => setNivelExpertise(e.target.value)} className="w-full border rounded-lg p-3">
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
              <option value="experto">Experto</option>
            </select>
            <button onClick={guardar} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl">
              Comenzar a usar Loomin
            </button>
          </div>
        )}
      </div>
    </div>
  );
}