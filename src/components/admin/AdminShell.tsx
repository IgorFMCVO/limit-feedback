import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BarChart3, FileText, LogOut, ShieldCheck, Sparkles } from 'lucide-react';

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#07090B] text-white selection:bg-[#BEE83B] selection:text-[#071006] print:bg-white print:text-black">
      <div className="pointer-events-none fixed inset-0 overflow-hidden print:hidden">
        <div className="absolute -left-24 -top-32 h-[430px] w-[430px] rounded-full bg-[#2E74F0]/10 blur-[120px]" />
        <div className="absolute -right-28 top-40 h-[360px] w-[360px] rounded-full bg-[#BEE83B]/[0.07] blur-[110px]" />
        <div className="absolute bottom-0 left-1/3 h-[340px] w-[340px] rounded-full bg-[#B67C3C]/[0.06] blur-[120px]" />
      </div>

      <header className="admin-shell-header sticky top-0 z-40 border-b border-white/[0.08] bg-[#07090B]/90 backdrop-blur-xl print:hidden">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-5 px-5 py-3 lg:px-8">
          <Link href="/admin" className="group flex min-w-0 items-center gap-4">
            <div className="flex h-14 w-[152px] shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 transition-colors group-hover:border-[#BEE83B]/30">
              <Image
                src="/logoLimitPremium.png"
                alt="LIMIT FITNESS"
                width={210}
                height={84}
                className="h-auto w-[126px] object-contain"
                priority
              />
            </div>
            <div className="hidden min-w-0 sm:block">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.23em] text-[#BEE83B]">
                <ShieldCheck className="h-3.5 w-3.5" /> Área restrita
              </div>
              <div className="mt-1 truncate text-sm font-semibold text-white/90">Sua Voz · Inteligência de experiência</div>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <Link href="/admin" className="group flex h-10 items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.04] px-3 text-xs font-semibold text-white/75 transition hover:border-[#2E74F0]/50 hover:bg-[#2E74F0]/10 hover:text-white sm:px-4 sm:text-sm">
              <BarChart3 className="h-4 w-4 text-[#2E74F0]" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link href="/admin/relatorio" className="group flex h-10 items-center gap-2 rounded-xl border border-[#BEE83B]/25 bg-[#BEE83B]/[0.08] px-3 text-xs font-semibold text-[#DDF7A1] transition hover:bg-[#BEE83B]/15 sm:px-4 sm:text-sm">
              <FileText className="h-4 w-4 text-[#BEE83B]" />
              <span className="hidden sm:inline">Relatório</span>
            </Link>
            <form action="/api/admin/logout" method="post">
              <button aria-label="Sair" className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.04] text-white/55 transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300">
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1440px] px-4 py-6 sm:px-5 lg:px-8 lg:py-9 print:max-w-none print:p-0">
        <div className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.24em] text-white/35 print:hidden">
          <Sparkles className="h-3.5 w-3.5 text-[#B67C3C]" />
          LIMIT FITNESS · Curvelo/MG
        </div>
        {children}
      </main>
    </div>
  );
}
