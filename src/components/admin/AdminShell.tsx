
import type { ReactNode } from 'react';
import { ACADEMY_INFO } from '@/lib/constants';

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[.22em] text-slate-500">Painel administrativo oculto</div>
            <h1 className="mt-1 text-2xl font-black">{ACADEMY_INFO.name} · Sua Voz</h1>
            <p className="text-sm text-slate-500">Dashboard geral + relatório semanal imprimível.</p>
          </div>
          <div className="flex gap-2">
            <a href="/admin" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Dashboard</a>
            <a href="/admin/relatorio" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Relatório semanal</a>
            <form action="/api/admin/logout" method="post">
              <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Sair</button>
            </form>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
