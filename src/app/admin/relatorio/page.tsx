
import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getAdminDashboardData } from '@/lib/supabase-admin';
import AdminShell from '@/components/admin/AdminShell';
import PrintButton from '@/components/admin/PrintButton';

function MetricCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm print:shadow-none">
      <div className="text-xs uppercase tracking-[.18em] text-slate-400">{title}</div>
      <div className="mt-3 text-3xl font-black text-slate-900">{value}</div>
    </div>
  );
}

export default async function AdminReportPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect('/admin/login');
  const data = await getAdminDashboardData(7);
  return (
    <AdminShell>
      <div className="space-y-6 print:space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div>
            <div className="text-xs uppercase tracking-[.22em] text-slate-500">Relatório semanal imprimível</div>
            <h2 className="text-3xl font-black">Resultados gerais</h2>
          </div>
          <PrintButton />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm print:rounded-none print:border-0 print:p-0 print:shadow-none">
          <div className="border-b border-slate-200 pb-4">
            <div className="text-xs uppercase tracking-[.22em] text-slate-500">Relatório semanal — Sua Voz</div>
            <h1 className="mt-1 text-3xl font-black">{data.summary.periodLabel}</h1>
            <p className="mt-2 text-sm text-slate-500">Resumo executivo das interações da semana: avaliações, sugestões, reclamações e pesquisas.</p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard title="Participações" value={data.summary.totals.participations} />
            <MetricCard title="Avaliações" value={data.summary.totals.ratings} />
            <MetricCard title="Sugestões" value={data.summary.totals.suggestions} />
            <MetricCard title="Reclamações" value={data.summary.totals.complaints} />
            <MetricCard title="Nota média" value={data.summary.totals.averageRating} />
            <MetricCard title="Satisfação" value={`${data.summary.totals.satisfactionRate}%`} />
            <MetricCard title="NPS" value={data.summary.totals.nps} />
            <MetricCard title="Pendentes" value={data.summary.totals.pendingComplaints} />
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            <div>
              <h3 className="text-xl font-black">Pontos de atenção</h3>
              <div className="mt-3 space-y-3">
                {data.summary.highlights.length ? data.summary.highlights.map((item:any, idx:number) => <div key={idx} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">• {item.text}</div>) : <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">Nenhum destaque automático nesta semana.</div>}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black">Ranking de professores</h3>
              <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50"><tr className="text-left text-slate-500"><th className="px-4 py-3">Professor</th><th className="px-4 py-3">Média</th><th className="px-4 py-3">Qtd.</th></tr></thead>
                  <tbody>{data.professorRanking.length ? data.professorRanking.map((row:any)=><tr key={row.name} className="border-t border-slate-100"><td className="px-4 py-3 font-semibold">{row.name}</td><td className="px-4 py-3">{row.average}</td><td className="px-4 py-3">{row.count}</td></tr>) : <tr><td className="px-4 py-3 text-slate-500" colSpan={3}>Sem avaliações.</td></tr>}</tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            <div>
              <h3 className="text-xl font-black">Reclamações / Sugestões</h3>
              <div className="mt-3 space-y-3">{data.feedbacks.slice(0,10).map((item:any)=><div key={item.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex justify-between gap-2"><div className="font-semibold">{item.type === 'complaint' ? 'Reclamação' : 'Sugestão'} · {item.category}</div><div className="text-xs text-slate-400">{new Date(item.created_at).toLocaleDateString('pt-BR')}</div></div><p className="mt-2 text-sm text-slate-700">{item.message}</p><div className="mt-2 text-xs text-slate-500">{item.is_anonymous ? 'Anônimo' : item.user_name || 'Sem nome'} · status: {item.status}</div></div>)}{!data.feedbacks.length && <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">Sem registros na semana.</div>}</div>
            </div>
            <div>
              <h3 className="text-xl font-black">Comentários / Pesquisas</h3>
              <div className="mt-3 space-y-3">{data.ratings.filter((r:any)=>r.comment).slice(0,5).map((item:any)=><div key={item.id} className="rounded-2xl border border-slate-200 p-4"><div className="font-semibold">{item.professor_name} · {item.rating}★</div><p className="mt-2 text-sm text-slate-700">{item.comment}</p></div>)}{data.surveys.slice(0,5).map((item:any)=><div key={item.id} className="rounded-2xl border border-slate-200 p-4"><div className="font-semibold">Pesquisa · {item.user_name}</div><div className="mt-1 text-sm text-slate-700">NPS: {typeof item.nps_score === 'number' ? item.nps_score : '—'}</div>{item.answers?.['7'] && <p className="mt-2 text-sm text-slate-700">{String(item.answers['7'])}</p>}</div>)}{!data.ratings.filter((r:any)=>r.comment).length && !data.surveys.length && <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">Sem comentários ou pesquisas na semana.</div>}</div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
