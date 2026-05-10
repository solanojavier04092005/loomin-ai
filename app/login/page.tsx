'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Sparkles } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [modo, setModo] = useState<'login' | 'registro'>('login');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleLogin = async () => {
    setError('');
    setCargando(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else window.location.href = '/';
    setCargando(false);
  };

  const handleRegistro = async () => {
    setError('');
    setCargando(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      await supabase.from('perfiles_profesor').insert([{ id: (await supabase.auth.getUser()).data.user?.id, nombre }]);
            window.location.href = '/onboarding';
    }
    setCargando(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1b4b] to-[#4338ca] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1e1b4b] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#1e1b4b]">Loomin</h1>
          <p className="text-gray-500 mt-1">{modo === 'login' ? 'Inicia sesión' : 'Crea tu cuenta'}</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</div>
        )}

        <div className="space-y-4">
          {modo === 'registro' && (
            <div>
              <label className="block text-sm font-bold mb-1">Nombre</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full border rounded-lg p-2.5 text-sm" placeholder="Tu nombre" />
            </div>
          )}
          <div>
            <label className="block text-sm font-bold mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-lg p-2.5 text-sm" placeholder="correo@email.com" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-lg p-2.5 text-sm" placeholder="Mínimo 6 caracteres" />
          </div>

          <button onClick={modo === 'login' ? handleLogin : handleRegistro} disabled={cargando} className="w-full bg-[#1e1b4b] text-white font-bold py-3 rounded-xl hover:bg-[#2a2663] transition-colors">
            {cargando ? 'Cargando...' : modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          {modo === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <button onClick={() => setModo(modo === 'login' ? 'registro' : 'login')} className="text-[#4338ca] font-bold hover:underline">
            {modo === 'login' ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </p>
      </div>
    </div>
  );
}