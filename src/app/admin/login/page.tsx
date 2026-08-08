
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ACADEMY_INFO } from '@/lib/constants';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    const data = await response.json().catch(() => ({ ok:false, error:'Erro ao entrar.' }));
    setLoading(false);
    if (!response.ok) { setError(data.error || 'Senha inválida.'); return; }
    router.push('/admin');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="text-xs uppercase tracking-[.22em] text-slate-500">Acesso restrito</div>
        <h1 className="mt-2 text-3xl font-black text-slate-900">Painel da gestão</h1>
        <p className="mt-2 text-sm text-slate-500">Entre com a senha administrativa para acessar os resultados gerais do Sua Voz · {ACADEMY_INFO.name}.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Senha</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none ring-0 focus:border-slate-900" placeholder="Digite a senha" />
          </div>
          {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
          <button disabled={loading} className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white disabled:opacity-60">{loading ? 'Entrando...' : 'Entrar no painel'}</button>
        </form>
      </div>
    </div>
  );
}
