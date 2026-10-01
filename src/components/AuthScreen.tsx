import React, { useState } from 'react';
import { LogIn, UserPlus, Loader2, GraduationCap } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const AuthScreen: React.FC = () => {
  const [mode, setMode] = useState<'masuk' | 'daftar'>('masuk');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    if (password.length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      return;
    }
    setBusy(true);
    try {
      if (mode === 'masuk') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (!data.session) {
          setInfo('Pendaftaran berhasil. Cek email Anda untuk konfirmasi, lalu masuk.');
          setMode('masuk');
        }
      }
    } catch (err: any) {
      setError(err?.message ?? 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-11 h-11 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mb-2">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-lg font-bold text-slate-800">Asisten Komunikasi Guru &amp; Orang Tua</h1>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'masuk' ? 'Masuk untuk membuka data Anda' : 'Buat akun guru baru'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Kata sandi</label>
            <input
              type="password"
              required
              autoComplete={mode === 'masuk' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md p-2">{error}</p>}
          {info && <p className="text-xs text-teal-700 bg-teal-50 border border-teal-100 rounded-md p-2">{info}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-60 rounded-md cursor-pointer"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === 'masuk' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            {mode === 'masuk' ? 'Masuk' : 'Daftar'}
          </button>
        </form>

        <button
          onClick={() => { setMode(mode === 'masuk' ? 'daftar' : 'masuk'); setError(''); setInfo(''); }}
          className="w-full mt-4 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
        >
          {mode === 'masuk' ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
        </button>
      </div>
    </div>
  );
};
