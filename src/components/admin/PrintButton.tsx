'use client';

import { Printer } from 'lucide-react';

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#BEE83B] px-5 text-sm font-black text-[#0C1400] shadow-[0_12px_36px_rgba(190,232,59,.16)] transition hover:-translate-y-0.5 hover:bg-[#C9F24D] hover:shadow-[0_16px_42px_rgba(190,232,59,.24)] active:translate-y-0"
    >
      <Printer className="h-4 w-4" />
      Imprimir / Salvar PDF
    </button>
  );
}
