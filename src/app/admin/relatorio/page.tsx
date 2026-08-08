import type { ReactNode } from 'react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  FileText,
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
import PrintButton from '@/components/admin/PrintButton';

export const dynamic = 'force-dynamic';

type Accent = 'lime' | 'blue' | 'bronze' | 'red';

const accentMap: Record<Accent, { line: string; icon: string; soft: string }> = {
  lime: { line: 'bg-[#BEE83B]', icon: 'text-[#598200]', soft: 'bg-[#F4F9E4]' },
  blue: { line: 'bg-[#2E74F0]', icon: 'text-[#2E74F0]', soft: 'bg-[#EEF4FF]' },
  bronze: { line: 'bg-[#B67C3C]', icon: 'text-[#9A642F]', soft: 'bg-[#FBF4EC]' },
  red: { line: 'bg-red-500', icon: 'text-red-600', soft: 'bg-red-50' },
};

function Delta({ value, helper = 'vs. semana anterior', invert = false }: { value: number; helper?: string; invert?: boolean }) {
  const good = invert ? value < 0 : value > 0;
  const bad = invert ? value > 0 : value < 0;
  return (
    <div className={`mt-2 flex items-center gap-1 text-[11px] font-bold ${good ? 'text-emerald-700' : bad ? 'text-red-600' : 'text-slate-400'}`}>
      {value > 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : value < 0 ? <ArrowDownRight className="h-3.5 w-3.5" /> : <span className="h-1 w-1 rounded-full bg-slate-400" />}
      {Math.abs(value)} {helper}
    </div>
  );
}

function Kpi({ title, value, delta, helper, icon, accent, invertDelta = false }: { title: string; value: string | number; delta?: number; helper?: string; icon: ReactNode; accent: Accent; invertDelta?: boolean }) {
  const a = accentMap[accent];
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,.05)] print:break-inside-avoid print:shadow-none">
      <div className={`absolute inset-x-0 top-0 h-1 ${a.line}`} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[9px] font-black uppercase tracking-[.17em] text-slate-400">{title}</div>
          <div className="mt-2 text-[28px] font-black leading-none tracking-[-.035em] text-slate-950">{value}</div>
        </div>
        <div className={`grid h-9 w-9 place-items-center rounded-xl ${a.soft} ${a.icon}`}>{icon}</div>
      </div>
      {typeof delta === 'number' && <Delta value={delta} helper={helper} invert={invertDelta} />}
    </div>
  );
}

function ReportHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mb-4">
      <div className="text-[9px] font-black uppercase tracking-[.21em] text-[#2E74F0]">{eyebrow}</div>
      <h2 className="mt-1.5 text-[21px] font-black tracking-[-.025em] text-slate-950">{title}</h2>
      {description && <p className="mt-1.5 max-w-3xl text-xs leading-5 text-slate-500">{description}</p>}
    </div>
  );
}

function humanStatus(status?: string) {
  return status === 'resolved' ? 'Resolvida' : status === 'in_progress' ? 'Em tratamento' : 'Pendente';
}

export default async function AdminReportPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect('/admin/login');

  const data = await getAdminDashboardData(7);
  const generatedAt = new Date();
  const current = data.summary.totals;
  const compare = data.summary.compare;
  const reportComments = data.ratings.filter((r: any) => r.comment).slice(0, 6);
  const recentFeedbacks = data.feedbacks.slice(0, 10);
  const recentSurveys = data.surveys.slice(0, 6);

  const executiveSentence = current.participations === 0
    ? 'Não houve participação registrada no período. O relatório permanece disponível como referência operacional, mas ainda não há base suficiente para leitura de tendência.'
    : `A semana reuniu ${current.participations} participação(ões), com nota média de ${current.averageRating.toFixed(1)}, satisfação de ${current.satisfactionRate}% e NPS ${current.nps}. Foram registradas ${current.complaints} reclamação(ões), sendo ${current.pendingComplaints} pendente(s).`;

  return (
    <AdminShell>
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end print:hidden">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.22em] text-[#BEE83B]">
            <FileText className="h-3.5 w-3.5" /> Relatório executivo
          </div>
          <h1 className="mt-2 text-3xl font-black tracking-[-.035em] text-white sm:text-[38px]">Sua Voz · LIMIT FITNESS</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">Documento semanal consolidado para reunião de gestão, acompanhamento de atendimento e tomada de decisão.</p>
        </div>
        <PrintButton />
      </div>

      <article className="admin-print-report mx-auto overflow-hidden rounded-[30px] bg-[#F7F8FA] text-slate-900 shadow-[0_30px_100px_rgba(0,0,0,.28)] print:rounded-none print:bg-white print:shadow-none">
        <div className="h-1.5 w-full bg-[linear-gradient(90deg,#BEE83B_0%,#BEE83B_38%,#2E74F0_38%,#2E74F0_80%,#B67C3C_80%,#B67C3C_100%)] print:h-1" />

        <div className="p-5 sm:p-8 lg:p-10 print:p-0">
          <header className="report-cover flex flex-col gap-6 border-b border-slate-200 pb-7 sm:flex-row sm:items-start sm:justify-between print:break-inside-avoid print:pb-5">
            <div className="flex items-start gap-5">
              <div className="flex h-[86px] w-[190px] shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 shadow-sm print:h-[72px] print:w-[165px] print:shadow-none">
                <Image src="/logoLimitAtual.png" alt="LIMIT FITNESS" width={500} height={500} className="h-auto w-[150px] object-contain" priority />
              </div>
              <div className="pt-1">
                <div className="text-[9px] font-black uppercase tracking-[.22em] text-[#2E74F0]">Sua Voz · Inteligência de experiência</div>
                <h1 className="mt-2 text-[30px] font-black leading-none tracking-[-.04em] text-slate-950 print:text-[26px]">Relatório Semanal</h1>
                <p className="mt-2 text-sm font-semibold text-slate-500">LIMIT FITNESS · Curvelo/MG</p>
              </div>
            </div>

            <div className="grid min-w-[240px] grid-cols-2 gap-2 text-xs sm:text-right">
              <div className="rounded-xl bg-white p-3 sm:col-span-2 print:border print:border-slate-200">
                <div className="text-[8px] font-black uppercase tracking-[.18em] text-slate-400">Período</div>
                <div className="mt-1 font-black text-slate-800">{data.summary.periodLabel}</div>
              </div>
              <div className="rounded-xl bg-white p-3 print:border print:border-slate-200">
                <div className="text-[8px] font-black uppercase tracking-[.18em] text-slate-400">Gerado em</div>
                <div className="mt-1 font-bold text-slate-700">{generatedAt.toLocaleDateString('pt-BR')}</div>
              </div>
              <div className="rounded-xl bg-white p-3 print:border print:border-slate-200">
                <div className="text-[8px] font-black uppercase tracking-[.18em] text-slate-400">Janela</div>
                <div className="mt-1 font-bold text-slate-700">7 dias</div>
              </div>
            </div>
          </header>

          <section className="mt-7 print:mt-5 print:break-inside-avoid">
            <div className="relative overflow-hidden rounded-[22px] bg-[#0D1117] p-6 text-white print:border print:border-slate-200 print:bg-white print:text-slate-900">
              <div className="absolute -right-20 -top-28 h-60 w-60 rounded-full bg-[#2E74F0]/20 blur-3xl print:hidden" />
              <div className="absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-[#BEE83B]/10 blur-3xl print:hidden" />
              <div className="relative grid gap-5 lg:grid-cols-[1.25fr_.75fr] lg:items-center">
                <div>
                  <div className="text-[9px] font-black uppercase tracking-[.21em] text-[#BEE83B] print:text-[#598200]">Resumo executivo</div>
                  <h2 className="mt-2 text-[24px] font-black tracking-[-.03em]">Leitura rápida da semana</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65 print:text-slate-600">{executiveSentence}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 print:border-slate-200 print:bg-slate-50">
                    <div className="text-[9px] font-bold uppercase tracking-[.16em] text-white/35 print:text-slate-400">Satisfação</div>
                    <div className="mt-2 text-3xl font-black text-[#BEE83B] print:text-[#598200]">{current.satisfactionRate}%</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 print:border-slate-200 print:bg-slate-50">
                    <div className="text-[9px] font-bold uppercase tracking-[.16em] text-white/35 print:text-slate-400">NPS</div>
                    <div className="mt-2 text-3xl font-black text-[#6EA3FF] print:text-[#2E74F0]">{current.nps}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 print:mt-5">
            <ReportHeading eyebrow="01 · Indicadores" title="Painel da semana" description="Resultados consolidados e variação frente aos sete dias imediatamente anteriores." />
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 print:grid-cols-4 print:gap-2">
              <Kpi title="Participações" value={current.participations} delta={compare.participations} icon={<Users className="h-4 w-4" />} accent="blue" />
              <Kpi title="Avaliações" value={current.ratings} delta={compare.ratings} icon={<Star className="h-4 w-4" />} accent="lime" />
              <Kpi title="Sugestões" value={current.suggestions} delta={compare.suggestions} icon={<Lightbulb className="h-4 w-4" />} accent="bronze" />
              <Kpi title="Reclamações" value={current.complaints} delta={compare.complaints} invertDelta icon={<MessageSquare className="h-4 w-4" />} accent="red" />
              <Kpi title="Nota média" value={current.averageRating.toFixed(1)} delta={compare.averageRating} helper="ponto(s)" icon={<Activity className="h-4 w-4" />} accent="blue" />
              <Kpi title="Satisfação" value={`${current.satisfactionRate}%`} delta={compare.satisfactionRate} helper="p.p." icon={<CheckCircle2 className="h-4 w-4" />} accent="lime" />
              <Kpi title="NPS" value={current.nps} delta={compare.nps} helper="ponto(s)" icon={<Sparkles className="h-4 w-4" />} accent="bronze" />
              <Kpi title="Pendentes" value={current.pendingComplaints} icon={<AlertTriangle className="h-4 w-4" />} accent="red" />
            </div>
          </section>

          <section className="mt-8 print:mt-6 print:break-inside-avoid">
            <ReportHeading eyebrow="02 · Diagnóstico" title="Pontos que merecem decisão" description="Sinais automáticos para orientar a pauta da reunião semanal." />
            <div className="grid gap-3 lg:grid-cols-3 print:grid-cols-3">
              {data.summary.highlights.length ? data.summary.highlights.map((item, index) => {
                const styles = item.level === 'high'
                  ? { box: 'border-red-200 bg-red-50', label: 'text-red-700', icon: <AlertTriangle className="h-4 w-4" /> }
                  : item.level === 'medium'
                    ? { box: 'border-amber-200 bg-amber-50', label: 'text-amber-700', icon: <AlertTriangle className="h-4 w-4" /> }
                    : { box: 'border-lime-200 bg-[#F4F9E4]', label: 'text-[#598200]', icon: <CheckCircle2 className="h-4 w-4" /> };
                return (
                  <div key={index} className={`rounded-2xl border p-4 print:break-inside-avoid ${styles.box}`}>
                    <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-[.16em] ${styles.label}`}>{styles.icon} {item.level === 'positive' ? 'Sinal positivo' : 'Atenção'}</div>
                    <p className="mt-3 text-xs font-semibold leading-5 text-slate-700">{item.text}</p>
                  </div>
                );
              }) : (
                <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">Não há volume suficiente para gerar destaques automáticos nesta semana.</div>
              )}
            </div>
          </section>

          <section className="report-section mt-8 print:mt-6 print:break-inside-avoid">
            <ReportHeading eyebrow="03 · Atendimento" title="Desempenho por professor" description="Ranking com média das avaliações e volume recebido no período." />
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <table className="w-full table-auto text-left text-xs">
                <thead className="bg-[#0D1117] text-white print:bg-slate-100 print:text-slate-700">
                  <tr>
                    <th className="w-14 px-4 py-3 text-[9px] font-black uppercase tracking-[.14em]">Pos.</th>
                    <th className="px-4 py-3 text-[9px] font-black uppercase tracking-[.14em]">Professor</th>
                    <th className="px-4 py-3 text-[9px] font-black uppercase tracking-[.14em]">Média</th>
                    <th className="px-4 py-3 text-[9px] font-black uppercase tracking-[.14em]">Avaliações</th>
                  </tr>
                </thead>
                <tbody>
                  {data.professorRanking.length ? data.professorRanking.map((row, index) => (
                    <tr key={row.name} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-black text-slate-400">{String(index + 1).padStart(2, '0')}</td>
                      <td className="px-4 py-3 font-bold text-slate-800">{row.name}</td>
                      <td className="px-4 py-3"><span className="inline-flex items-center gap-1 font-black text-[#2E74F0]"><Star className="h-3.5 w-3.5 fill-[#BEE83B] text-[#BEE83B]" />{row.average.toFixed(1)}</span></td>
                      <td className="px-4 py-3 font-semibold text-slate-500">{row.count}</td>
                    </tr>
                  )) : <tr><td colSpan={4} className="px-4 py-5 text-center text-slate-400">Nenhuma avaliação no período.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-8 grid gap-5 lg:grid-cols-2 print:mt-6 print:grid-cols-2 print:break-inside-avoid">
            <div>
              <ReportHeading eyebrow="04 · Reclamações" title="Status de tratamento" />
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center">
                  <div className="text-2xl font-black text-red-600">{data.complaintStatus.pending || 0}</div><div className="mt-1 text-[9px] font-black uppercase tracking-[.12em] text-red-500">Pendentes</div>
                </div>
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center">
                  <div className="text-2xl font-black text-amber-700">{data.complaintStatus.in_progress || 0}</div><div className="mt-1 text-[9px] font-black uppercase tracking-[.12em] text-amber-600">Tratamento</div>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                  <div className="text-2xl font-black text-emerald-700">{data.complaintStatus.resolved || 0}</div><div className="mt-1 text-[9px] font-black uppercase tracking-[.12em] text-emerald-600">Resolvidas</div>
                </div>
              </div>
            </div>

            <div>
              <ReportHeading eyebrow="05 · Governança" title="Leitura da gestão" />
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#EEF4FF] text-[#2E74F0]"><ShieldCheck className="h-4 w-4" /></div>
                  <div>
                    <div className="text-xs font-black text-slate-800">Acompanhamento semanal recomendado</div>
                    <p className="mt-1.5 text-xs leading-5 text-slate-500">Priorize pendências abertas, temas recorrentes e quedas relevantes nos indicadores. Use comentários individuais como contexto, não como única base de decisão.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="report-page-break mt-8 print:mt-6">
            <ReportHeading eyebrow="06 · Feedback aberto" title="Reclamações e sugestões recentes" description="Registros mais recentes do período, apresentados para leitura de contexto." />
            <div className="space-y-2.5">
              {recentFeedbacks.length ? recentFeedbacks.map((item: any) => (
                <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 print:break-inside-avoid">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[.11em] ${item.type === 'complaint' ? 'bg-red-50 text-red-600' : 'bg-[#FBF4EC] text-[#9A642F]'}`}>{item.type === 'complaint' ? 'Reclamação' : 'Sugestão'}</span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold text-slate-500">{item.category}</span>
                      <span className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${item.status === 'resolved' ? 'bg-emerald-50 text-emerald-700' : item.status === 'in_progress' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'}`}>{humanStatus(item.status)}</span>
                    </div>
                    <time className="text-[9px] text-slate-400">{new Date(item.created_at).toLocaleString('pt-BR')}</time>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-slate-700">{item.message}</p>
                  <div className="mt-2 text-[10px] text-slate-400">{item.is_anonymous ? 'Registro anônimo' : item.user_name || 'Sem identificação'}</div>
                </article>
              )) : <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-center text-xs text-slate-400">Nenhum feedback aberto registrado nesta semana.</div>}
            </div>
          </section>

          <section className="mt-8 print:mt-6">
            <ReportHeading eyebrow="07 · Contexto qualitativo" title="Comentários de avaliações" />
            <div className="grid gap-3 lg:grid-cols-2 print:grid-cols-2">
              {reportComments.length ? reportComments.map((item: any) => (
                <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 print:break-inside-avoid">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-black text-slate-800">{item.professor_name}</div>
                    <div className="inline-flex items-center gap-1 text-xs font-black text-[#2E74F0]"><Star className="h-3.5 w-3.5 fill-[#BEE83B] text-[#BEE83B]" />{item.rating}</div>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-600">“{item.comment}”</p>
                  <div className="mt-2 text-[9px] text-slate-400">{item.user_name || 'Sem identificação'} · {new Date(item.created_at).toLocaleDateString('pt-BR')}</div>
                </article>
              )) : <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-center text-xs text-slate-400">Sem comentários textuais no período.</div>}
            </div>
          </section>

          <section className="mt-8 print:mt-6">
            <ReportHeading eyebrow="08 · Pesquisa" title="Respostas recentes e NPS" />
            <div className="grid gap-3 lg:grid-cols-2 print:grid-cols-2">
              {recentSurveys.length ? recentSurveys.map((item: any) => (
                <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 print:break-inside-avoid">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs font-black text-slate-800">{item.user_name}</div>
                    <div className="rounded-lg bg-[#EEF4FF] px-2.5 py-1 text-[10px] font-black text-[#2E74F0]">NPS {typeof item.nps_score === 'number' ? item.nps_score : '—'}</div>
                  </div>
                  {item.answers?.['7'] ? <p className="mt-3 text-xs leading-5 text-slate-600">“{String(item.answers['7'])}”</p> : <p className="mt-3 text-xs text-slate-400">Sem comentário aberto.</p>}
                  <div className="mt-2 text-[9px] text-slate-400">{new Date(item.created_at).toLocaleDateString('pt-BR')}</div>
                </article>
              )) : <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-center text-xs text-slate-400">Nenhuma pesquisa no período.</div>}
            </div>
          </section>

          <footer className="mt-9 flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between print:mt-6 print:break-inside-avoid">
            <div className="flex items-center gap-3">
              <Image src="/logoLimitAtual.png" alt="LIMIT FITNESS" width={500} height={500} className="h-auto w-[90px] object-contain" />
              <div>
                <div className="text-[9px] font-black uppercase tracking-[.18em] text-slate-500">Sua Voz · LIMIT FITNESS</div>
                <div className="mt-1 text-[10px] text-slate-400">Documento interno de apoio à gestão.</div>
              </div>
            </div>
            <div className="text-[9px] leading-4 text-slate-400 sm:text-right">
              Gerado automaticamente em {generatedAt.toLocaleString('pt-BR')}<br />
              Dados do período: {data.summary.periodLabel}
            </div>
          </footer>
        </div>
      </article>
    </AdminShell>
  );
}
