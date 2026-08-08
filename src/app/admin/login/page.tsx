'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react';
import { ACADEMY_INFO } from '@/lib/constants';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await response.json().catch(() => ({ ok: false, error: 'Erro ao entrar.' }));
    setLoading(false);
    if (!response.ok) {
      setError(data.error || 'Senha inválida.');
      return;
    }
    router.push('/admin');
    router.refresh();
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07090B] px-4 py-10 text-white">
      <div className="pointer-events-none absolute -left-32 -top-32 h-[460px] w-[460px] rounded-full bg-[#2E74F0]/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-28 bottom-[-120px] h-[420px] w-[420px] rounded-full bg-[#BEE83B]/10 blur-[120px]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-white/[0.09] bg-[#0E1217] shadow-[0_30px_100px_rgba(0,0,0,.4)] lg:grid-cols-[.9fr_1.1fr]">
          <div className="relative hidden overflow-hidden border-r border-white/[0.08] bg-black/20 p-10 lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(46,116,240,.16),transparent_36%),radial-gradient(circle_at_80%_80%,rgba(190,232,59,.08),transparent_32%)]" />
            <div className="relative">
              <Image src="/logoLimitPremium.png" alt="LIMIT FITNESS" width={1000} height={450} className="h-auto w-[220px] object-contain" priority />
            </div>
            <div className="relative">
              <div className="text-[10px] font-black uppercase tracking-[.24em] text-[#BEE83B]">Sua Voz · Gestão</div>
              <h1 className="mt-4 text-[40px] font-black leading-[1.03] tracking-[-.04em]">Dados que viram<br /><span className="text-[#BEE83B]">decisão.</span></h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-white/45">Acompanhe a experiência dos alunos, identifique falhas e transforme feedback em melhoria operacional.</p>
            </div>
          </div>

          <div className="p-6 sm:p-10 lg:p-12">
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <Image src="/logoLimitPremium.png" alt="LIMIT FITNESS" width={1000} height={450} className="h-auto w-[160px] object-contain" priority />
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#BEE83B]/10 text-[#BEE83B]"><ShieldCheck className="h-5 w-5" /></div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.18em] text-white/45">
              <LockKeyhole className="h-3.5 w-3.5 text-[#2E74F0]" /> Acesso restrito
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-[-.035em] sm:text-[38px]">Painel da gestão</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/45">Entre com a senha administrativa para acessar os resultados gerais do Sua Voz · {ACADEMY_INFO.name}.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-[.17em] text-white/40">Senha administrativa</label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-[52px] w-full rounded-2xl border border-white/[0.09] bg-black/20 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#2E74F0]/65 focus:bg-[#2E74F0]/[0.04]"
                    placeholder="Digite sua senha"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {error && <p className="rounded-xl border border-red-400/15 bg-red-500/[0.08] px-3 py-2.5 text-sm text-red-300">{error}</p>}

              <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#BEE83B] px-4 py-3.5 text-sm font-black text-[#0C1400] transition hover:-translate-y-0.5 hover:bg-[#C9F24D] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-55">
                {loading ? 'Entrando...' : 'Entrar no painel'}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <div className="mt-7 flex items-center gap-2 text-[11px] text-white/28">
              <ShieldCheck className="h-4 w-4 text-[#B67C3C]" /> Ambiente interno protegido por sessão administrativa.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
