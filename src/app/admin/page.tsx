
import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getAdminDashboardData } from '@/lib/supabase-admin';
import AdminShell from '@/components/admin/AdminShell';

function MetricCard({ title, value, delta, helper }: { title: string; value: string | number; delta?: number; helper?: string }) {
  const positive = typeof delta === 'number' && delta > 0;
  const negative = typeof delta === 'number' && delta < 0;
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-xs uppercase tracking-[.18em] text-slate-400">{title}</div>
      <div className="mt-3 text-3xl font-black text-slate-900">{value}</div>
      {typeof delta === 'number' && (
        <div className={`mt-2 text-sm font-semibold ${positive ? 'text-emerald-600' : negative ? 'text-red-600' : 'text-slate-500'}`}>
          {delta > 0 ? '▲' : delta < 0 ? '▼' : '•'} {Math.abs(delta)} {helper || 'vs semana anterior'}
        </div>
      )}
    </div>
  );
}

function countEntries(map: Record<string, number>) {
  return Object.entries(map).sort((a,b)=>b[1]-a[1]);
}

export default async function AdminDashboardPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect('/admin/login');
  const data = await getAdminDashboardData(7);
  const complaintCats = countEntries(data.complaintCategories);
  const suggestionCats = countEntries(data.suggestionCategories);

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white shadow-xl">
          <div className="text-xs uppercase tracking-[.22em] text-slate-300">Resumo semanal</div>
          <h2 className="mt-2 text-3xl font-black">Período {data.summary.periodLabel}</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-200">Um panorama consolidado de avaliações, pesquisas, sugestões e reclamações da última semana.</p>
          {data.summary.highlights.length > 0 && (
            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              {data.summary.highlights.map((item, idx) => (
                <div key={idx} className={`rounded-2xl px-4 py-3 text-sm ${item.level === 'high' ? 'bg-red-500/15 text-red-100' : item.level === 'medium' ? 'bg-amber-500/15 text-amber-100' : 'bg-emerald-500/15 text-emerald-100'}`}>{item.text}</div>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Participações" value={data.summary.totals.participations} delta={data.summary.compare.participations} />
          <MetricCard title="Avaliações" value={data.summary.totals.ratings} delta={data.summary.compare.ratings} />
          <MetricCard title="Sugestões" value={data.summary.totals.suggestions} delta={data.summary.compare.suggestions} />
          <MetricCard title="Reclamações" value={data.summary.totals.complaints} delta={data.summary.compare.complaints} />
          <MetricCard title="Nota média" value={data.summary.totals.averageRating} delta={data.summary.compare.averageRating} helper="pontos" />
          <MetricCard title="Satisfação" value={`${data.summary.totals.satisfactionRate}%`} delta={data.summary.compare.satisfactionRate} helper="p.p." />
          <MetricCard title="NPS" value={data.summary.totals.nps} delta={data.summary.compare.nps} helper="pontos" />
          <MetricCard title="Pendentes" value={data.summary.totals.pendingComplaints} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between"><h3 className="text-xl font-black">Ranking de professores</h3><span className="text-sm text-slate-500">Últimos 7 dias</span></div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead><tr className="border-b border-slate-200 text-left text-slate-500"><th className="py-3 pr-3">Professor</th><th className="py-3 pr-3">Média</th><th className="py-3 pr-3">Qtde</th></tr></thead>
                <tbody>
                  {data.professorRanking.length ? data.professorRanking.map((row) => (
                    <tr key={row.name} className="border-b border-slate-100"><td className="py-3 pr-3 font-semibold">{row.name}</td><td className="py-3 pr-3">{row.average}</td><td className="py-3 pr-3">{row.count}</td></tr>
                  )) : <tr><td className="py-4 text-slate-500" colSpan={3}>Nenhuma avaliação na semana.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-xl font-black">Status das reclamações</h3>
              <div className="mt-4 grid gap-3">
                {['pending','in_progress','resolved'].map((status) => {
                  const labels: Record<string,string> = { pending:'Pendentes', in_progress:'Em tratamento', resolved:'Resolvidas' };
                  return <div key={status} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"><span>{labels[status]}</span><strong>{data.complaintStatus[status] || 0}</strong></div>
                })}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-xl font-black">Categorias em destaque</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <div className="mb-2 text-sm font-semibold text-slate-500">Reclamações</div>
                  <div className="flex flex-wrap gap-2">{complaintCats.length ? complaintCats.map(([k,v]) => <span key={k} className="rounded-full bg-red-50 px-3 py-1 text-sm text-red-700">{k} · {v}</span>) : <span className="text-sm text-slate-500">Sem reclamações.</span>}</div>
                </div>
                <div>
                  <div className="mb-2 text-sm font-semibold text-slate-500">Sugestões</div>
                  <div className="flex flex-wrap gap-2">{suggestionCats.length ? suggestionCats.map(([k,v]) => <span key={k} className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700">{k} · {v}</span>) : <span className="text-sm text-slate-500">Sem sugestões.</span>}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between"><h3 className="text-xl font-black">Reclamações e sugestões recentes</h3><span className="text-sm text-slate-500">até 12 itens</span></div>
            <div className="space-y-3">
              {data.feedbacks.slice(0,12).map((item:any) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${item.type === 'complaint' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{item.type === 'complaint' ? 'Reclamação' : 'Sugestão'}</span><span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{item.category}</span></div><span className="text-xs text-slate-400">{new Date(item.created_at).toLocaleString('pt-BR')}</span></div>
                  <p className="mt-3 text-sm text-slate-700">{item.message}</p>
                  <div className="mt-2 text-xs text-slate-500">{item.is_anonymous ? 'Anônimo' : (item.user_name || 'Sem nome')} · status: {item.status}</div>
                </div>
              ))}
              {!data.feedbacks.length && <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">Nenhum feedback nesta semana.</div>}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between"><h3 className="text-xl font-black">Comentários e pesquisas recentes</h3><span className="text-sm text-slate-500">até 12 itens</span></div>
            <div className="space-y-3">
              {data.ratings.filter((r:any)=>r.comment).slice(0,6).map((item:any) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-2"><div className="font-semibold text-slate-800">{item.professor_name} · {item.rating}★</div><span className="text-xs text-slate-400">{new Date(item.created_at).toLocaleString('pt-BR')}</span></div>
                  <p className="mt-2 text-sm text-slate-700">{item.comment}</p>
                  <div className="mt-2 text-xs text-slate-500">{item.user_name || 'Sem nome'}</div>
                </div>
              ))}
              {data.surveys.slice(0,6).map((item:any) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-2"><div className="font-semibold text-slate-800">Pesquisa · {item.user_name}</div><span className="text-xs text-slate-400">{new Date(item.created_at).toLocaleString('pt-BR')}</span></div>
                  <p className="mt-2 text-sm text-slate-700">NPS: {typeof item.nps_score === 'number' ? item.nps_score : '—'} · Contato: {item.user_phone}</p>
                  {item.answers?.['7'] && <div className="mt-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">“{String(item.answers['7'])}”</div>}
                </div>
              ))}
              {!data.ratings.filter((r:any)=>r.comment).length && !data.surveys.length && <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">Sem comentários ou pesquisas nesta semana.</div>}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
