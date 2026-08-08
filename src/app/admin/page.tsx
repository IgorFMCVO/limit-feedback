import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Activity,
  Lightbulb,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getAdminDashboardData } from '@/lib/supabase-admin';
import AdminShell from '@/components/admin/AdminShell';

export const dynamic = 'force-dynamic';

type MetricProps = {
  title: string;
  value: string | number;
  delta?: number;
  helper?: string;
  icon: ReactNode;
  accent: 'lime' | 'blue' | 'bronze' | 'red';
};

const accentMap = {
  lime: { bg: 'bg-[#BEE83B]/10', border: 'border-[#BEE83B]/20', icon: 'text-[#BEE83B]', glow: 'shadow-[inset_0_1px_0_rgba(190,232,59,.08)]' },
  blue: { bg: 'bg-[#2E74F0]/10', border: 'border-[#2E74F0]/20', icon: 'text-[#6EA3FF]', glow: 'shadow-[inset_0_1px_0_rgba(46,116,240,.08)]' },
  bronze: { bg: 'bg-[#B67C3C]/10', border: 'border-[#B67C3C]/20', icon: 'text-[#D69B5B]', glow: 'shadow-[inset_0_1px_0_rgba(182,124,60,.08)]' },
  red: { bg: 'bg-red-500/10', border: 'border-red-400/20', icon: 'text-red-300', glow: 'shadow-[inset_0_1px_0_rgba(239,68,68,.08)]' },
};

function MetricCard({ title, value, delta, helper, icon, accent }: MetricProps) {
  const a = accentMap[accent];
  return (
    <div className={`group relative overflow-hidden rounded-[22px] border ${a.border} bg-[#101318] p-5 ${a.glow} transition duration-300 hover:-translate-y-0.5 hover:border-white/20`}>
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/[0.025] blur-2xl" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[.21em] text-white/38">{title}</div>
          <div className="mt-3 text-[32px] font-black leading-none tracking-[-.035em] text-white">{value}</div>
        </div>
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${a.bg} ${a.icon}`}>{icon}</div>
      </div>
      {typeof delta === 'number' && (
        <div className={`relative mt-4 flex items-center gap-1.5 text-xs font-semibold ${delta > 0 ? 'text-emerald-300' : delta < 0 ? 'text-red-300' : 'text-white/38'}`}>
          {delta > 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : delta < 0 ? <ArrowDownRight className="h-3.5 w-3.5" /> : <span className="h-1 w-1 rounded-full bg-white/35" />}
          {Math.abs(delta)} {helper || 'vs. semana anterior'}
        </div>
      )}
    </div>
  );
}

function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-[.23em] text-[#BEE83B]">{eyebrow}</div>
      <h2 className="mt-2 text-2xl font-black tracking-[-.025em] text-white lg:text-[28px]">{title}</h2>
      {text && <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">{text}</p>}
    </div>
  );
}

function countEntries(map: Record<string, number>) {
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

export default async function AdminDashboardPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect('/admin/login');

  const data = await getAdminDashboardData(7);
  const complaintCats = countEntries(data.complaintCategories);
  const suggestionCats = countEntries(data.suggestionCategories);
  const maxProfessorAverage = Math.max(...data.professorRanking.map((r) => r.average), 5);

  return (
    <AdminShell>
      <div className="space-y-7 lg:space-y-9">
        <section className="relative overflow-hidden rounded-[30px] border border-white/[0.09] bg-[#0E1217] p-6 shadow-[0_26px_80px_rgba(0,0,0,.26)] sm:p-8 lg:p-10">
          <div className="absolute right-[-8%] top-[-55%] h-[420px] w-[420px] rounded-full bg-[#2E74F0]/15 blur-[95px]" />
          <div className="absolute bottom-[-80%] left-[20%] h-[360px] w-[360px] rounded-full bg-[#BEE83B]/[0.08] blur-[95px]" />
          <div className="relative grid gap-7 lg:grid-cols-[1.4fr_.6fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#BEE83B]/20 bg-[#BEE83B]/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.2em] text-[#DDF7A1]">
                <BarChart3 className="h-3.5 w-3.5 text-[#BEE83B]" /> Sua Voz · Gestão
              </div>
              <h1 className="mt-5 max-w-3xl text-[34px] font-black leading-[1.03] tracking-[-.04em] text-white sm:text-[42px] lg:text-[50px]">
                O que os alunos estão dizendo <span className="text-[#BEE83B]">agora.</span>
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/50 sm:text-base">
                Visão executiva da última semana: atendimento, pesquisas, satisfação, reclamações e sinais que merecem decisão da gestão.
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-5 backdrop-blur-sm">
              <div className="text-[10px] font-bold uppercase tracking-[.2em] text-white/35">Período analisado</div>
              <div className="mt-2 text-lg font-black text-white">{data.summary.periodLabel}</div>
              <div className="mt-4 flex items-center gap-2 text-xs text-white/45">
                <ShieldCheck className="h-4 w-4 text-[#2E74F0]" /> Dados consolidados do Sua Voz
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-5 flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
            <SectionTitle eyebrow="Pulso da semana" title="Indicadores principais" text="Compare o comportamento desta semana com o período imediatamente anterior." />
            <div className="text-xs text-white/35">Últimos 7 dias</div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard title="Participações" value={data.summary.totals.participations} delta={data.summary.compare.participations} icon={<Users className="h-5 w-5" />} accent="blue" />
            <MetricCard title="Avaliações" value={data.summary.totals.ratings} delta={data.summary.compare.ratings} icon={<Star className="h-5 w-5" />} accent="lime" />
            <MetricCard title="Sugestões" value={data.summary.totals.suggestions} delta={data.summary.compare.suggestions} icon={<Lightbulb className="h-5 w-5" />} accent="bronze" />
            <MetricCard title="Reclamações" value={data.summary.totals.complaints} delta={data.summary.compare.complaints} icon={<MessageSquare className="h-5 w-5" />} accent="red" />
            <MetricCard title="Nota média" value={data.summary.totals.averageRating.toFixed(1)} delta={data.summary.compare.averageRating} helper="ponto(s)" icon={<Activity className="h-5 w-5" />} accent="blue" />
            <MetricCard title="Satisfação" value={`${data.summary.totals.satisfactionRate}%`} delta={data.summary.compare.satisfactionRate} helper="p.p." icon={<CheckCircle2 className="h-5 w-5" />} accent="lime" />
            <MetricCard title="NPS" value={data.summary.totals.nps} delta={data.summary.compare.nps} helper="ponto(s)" icon={<Sparkles className="h-5 w-5" />} accent="bronze" />
            <MetricCard title="Pendentes" value={data.summary.totals.pendingComplaints} icon={<AlertTriangle className="h-5 w-5" />} accent="red" />
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
          <div className="rounded-[26px] border border-white/[0.08] bg-[#101318] p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <SectionTitle eyebrow="Atendimento" title="Ranking de professores" text="Média recebida e quantidade de avaliações no período." />
              <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-white/35">7 dias</span>
            </div>

            <div className="mt-6 space-y-3">
              {data.professorRanking.length ? data.professorRanking.map((row, index) => (
                <div key={row.name} className="grid gap-3 rounded-2xl border border-white/[0.07] bg-black/15 p-4 sm:grid-cols-[38px_1fr_160px_70px] sm:items-center">
                  <div className={`grid h-9 w-9 place-items-center rounded-xl text-sm font-black ${index === 0 ? 'bg-[#BEE83B] text-[#0C1400]' : 'bg-white/[0.05] text-white/55'}`}>{index + 1}</div>
                  <div>
                    <div className="font-bold text-white">{row.name}</div>
                    <div className="mt-1 text-xs text-white/35">{row.count} avaliação(ões)</div>
                  </div>
                  <div className="hidden sm:block">
                    <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#2E74F0] to-[#BEE83B]" style={{ width: `${Math.min(100, (row.average / maxProfessorAverage) * 100)}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-lg font-black text-white"><Star className="h-4 w-4 fill-[#BEE83B] text-[#BEE83B]" /> {row.average.toFixed(1)}</div>
                </div>
              )) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-7 text-center text-sm text-white/35">Nenhuma avaliação registrada nesta semana.</div>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[26px] border border-red-400/15 bg-[#101318] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[.22em] text-red-300">Prioridade</div>
                  <h3 className="mt-2 text-xl font-black text-white">Reclamações</h3>
                </div>
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-red-500/10 text-red-300"><MessageSquare className="h-5 w-5" /></div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                {[
                  ['Pendentes', data.complaintStatus.pending || 0, 'text-red-300'],
                  ['Tratamento', data.complaintStatus.in_progress || 0, 'text-amber-300'],
                  ['Resolvidas', data.complaintStatus.resolved || 0, 'text-emerald-300'],
                ].map(([label, value, color]) => (
                  <div key={String(label)} className="rounded-2xl border border-white/[0.07] bg-black/15 p-3 text-center">
                    <div className={`text-2xl font-black ${color}`}>{value}</div>
                    <div className="mt-1 text-[10px] font-semibold text-white/35">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[26px] border border-white/[0.08] bg-[#101318] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[.22em] text-[#B67C3C]">Temas recorrentes</div>
                  <h3 className="mt-2 text-xl font-black text-white">Categorias</h3>
                </div>
                <ClipboardList className="h-5 w-5 text-white/35" />
              </div>
              <div className="mt-5 space-y-4">
                <div>
                  <div className="mb-2 text-xs font-semibold text-white/40">Reclamações</div>
                  <div className="flex flex-wrap gap-2">
                    {complaintCats.length ? complaintCats.slice(0, 5).map(([k, v]) => <span key={k} className="rounded-full border border-red-400/15 bg-red-500/[0.07] px-3 py-1.5 text-xs font-semibold text-red-200">{k} · {v}</span>) : <span className="text-xs text-white/30">Sem registros.</span>}
                  </div>
                </div>
                <div className="h-px bg-white/[0.06]" />
                <div>
                  <div className="mb-2 text-xs font-semibold text-white/40">Sugestões</div>
                  <div className="flex flex-wrap gap-2">
                    {suggestionCats.length ? suggestionCats.slice(0, 5).map(([k, v]) => <span key={k} className="rounded-full border border-[#B67C3C]/20 bg-[#B67C3C]/[0.08] px-3 py-1.5 text-xs font-semibold text-[#E3B077]">{k} · {v}</span>) : <span className="text-xs text-white/30">Sem registros.</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <SectionTitle eyebrow="Leitura gerencial" title="Sinais que merecem atenção" text="Destaques automáticos baseados no comportamento da semana." />
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {data.summary.highlights.length ? data.summary.highlights.map((item, index) => {
              const style = item.level === 'high'
                ? 'border-red-400/20 bg-red-500/[0.06] text-red-100'
                : item.level === 'medium'
                  ? 'border-amber-400/20 bg-amber-500/[0.06] text-amber-100'
                  : 'border-[#BEE83B]/20 bg-[#BEE83B]/[0.06] text-[#E6F9B8]';
              return <div key={index} className={`rounded-2xl border p-5 text-sm font-medium leading-6 ${style}`}>{item.text}</div>;
            }) : (
              <div className="rounded-2xl border border-white/[0.08] bg-[#101318] p-5 text-sm text-white/40 lg:col-span-3">Ainda não há volume suficiente para gerar destaques automáticos nesta semana.</div>
            )}
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <div className="rounded-[26px] border border-white/[0.08] bg-[#101318] p-5 sm:p-6">
            <SectionTitle eyebrow="Voz aberta" title="Reclamações e sugestões recentes" />
            <div className="mt-5 space-y-3">
              {data.feedbacks.slice(0, 10).map((item: any) => (
                <article key={item.id} className="rounded-2xl border border-white/[0.07] bg-black/15 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[.12em] ${item.type === 'complaint' ? 'bg-red-500/10 text-red-300' : 'bg-[#B67C3C]/10 text-[#E3B077]'}`}>{item.type === 'complaint' ? 'Reclamação' : 'Sugestão'}</span>
                      <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[10px] font-semibold text-white/45">{item.category}</span>
                    </div>
                    <time className="text-[10px] text-white/25">{new Date(item.created_at).toLocaleString('pt-BR')}</time>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/70">{item.message}</p>
                  <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-white/30">
                    <span>{item.is_anonymous ? 'Anônimo' : item.user_name || 'Sem identificação'}</span>
                    <span>Status: {item.status}</span>
                  </div>
                </article>
              ))}
              {!data.feedbacks.length && <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-white/35">Nenhum feedback aberto nesta semana.</div>}
            </div>
          </div>

          <div className="rounded-[26px] border border-white/[0.08] bg-[#101318] p-5 sm:p-6">
            <SectionTitle eyebrow="Contexto" title="Comentários e pesquisas recentes" />
            <div className="mt-5 space-y-3">
              {data.ratings.filter((r: any) => r.comment).slice(0, 5).map((item: any) => (
                <article key={item.id} className="rounded-2xl border border-[#2E74F0]/15 bg-[#2E74F0]/[0.04] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-bold text-white">{item.professor_name} <span className="ml-1 text-[#BEE83B]">{item.rating}★</span></div>
                    <time className="text-[10px] text-white/25">{new Date(item.created_at).toLocaleString('pt-BR')}</time>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/70">{item.comment}</p>
                  <div className="mt-2 text-[11px] text-white/30">{item.user_name || 'Sem identificação'}</div>
                </article>
              ))}

              {data.surveys.slice(0, 5).map((item: any) => (
                <article key={item.id} className="rounded-2xl border border-[#BEE83B]/15 bg-[#BEE83B]/[0.035] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-bold text-white">Pesquisa · {item.user_name}</div>
                    <time className="text-[10px] text-white/25">{new Date(item.created_at).toLocaleString('pt-BR')}</time>
                  </div>
                  <div className="mt-3 text-xs font-semibold text-white/45">NPS <span className="ml-1 text-base font-black text-[#BEE83B]">{typeof item.nps_score === 'number' ? item.nps_score : '—'}</span></div>
                  {item.answers?.['7'] && <blockquote className="mt-3 rounded-xl border-l-2 border-[#BEE83B]/50 bg-black/15 px-4 py-3 text-sm leading-6 text-white/65">“{String(item.answers['7'])}”</blockquote>}
                </article>
              ))}

              {!data.ratings.filter((r: any) => r.comment).length && !data.surveys.length && <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-white/35">Sem comentários ou pesquisas nesta semana.</div>}
            </div>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
