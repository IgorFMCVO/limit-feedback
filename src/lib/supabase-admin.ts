
import 'server-only';
import { createClient } from '@supabase/supabase-js';

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY nas variáveis de ambiente.');
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

type CountMap = Record<string, number>;

function startOfDay(dt: Date) {
  const d = new Date(dt);
  d.setHours(0,0,0,0);
  return d;
}
function addDays(dt: Date, days: number) {
  const d = new Date(dt);
  d.setDate(d.getDate() + days);
  return d;
}
function fmtIso(dt: Date) {
  return dt.toISOString();
}
function safeAvg(arr: number[]) {
  return arr.length ? Number((arr.reduce((a,b)=>a+b,0) / arr.length).toFixed(1)) : 0;
}
function groupCount<T>(items: T[], getter: (item:T)=>string) {
  return items.reduce((acc: CountMap, item) => {
    const key = getter(item) || 'Sem categoria';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as CountMap);
}

export async function getAdminDashboardData(days = 7) {
  const supabase = getClient();
  const now = new Date();
  const start = startOfDay(addDays(now, -(days-1)));
  const previousStart = startOfDay(addDays(start, -days));
  const previousEnd = new Date(start.getTime()-1);

  const [{ data: professors }, { data: ratings }, { data: feedbacks }, { data: surveys }] = await Promise.all([
    supabase.from('professors').select('id,name').order('name'),
    supabase.from('ratings').select('id, professor_id, rating, comment, user_name, user_phone, created_at').gte('created_at', fmtIso(previousStart)).order('created_at', { ascending: false }),
    supabase.from('feedbacks').select('id, type, category, message, user_name, user_phone, is_anonymous, status, admin_notes, created_at, resolved_at').gte('created_at', fmtIso(previousStart)).order('created_at', { ascending: false }),
    supabase.from('survey_responses').select('id, user_name, user_phone, user_email, answers, nps_score, accept_marketing, created_at').gte('created_at', fmtIso(previousStart)).order('created_at', { ascending: false }),
  ]);

  const professorMap = Object.fromEntries((professors || []).map((p:any)=>[p.id, p.name]));
  const inCurrent = (iso?: string) => !!iso && new Date(iso) >= start && new Date(iso) <= now;
  const inPrevious = (iso?: string) => !!iso && new Date(iso) >= previousStart && new Date(iso) <= previousEnd;

  const currentRatings = (ratings || []).filter((r:any)=>inCurrent(r.created_at));
  const prevRatings = (ratings || []).filter((r:any)=>inPrevious(r.created_at));
  const currentFeedbacks = (feedbacks || []).filter((f:any)=>inCurrent(f.created_at));
  const prevFeedbacks = (feedbacks || []).filter((f:any)=>inPrevious(f.created_at));
  const currentSurveys = (surveys || []).filter((s:any)=>inCurrent(s.created_at));
  const prevSurveys = (surveys || []).filter((s:any)=>inPrevious(s.created_at));

  const suggestions = currentFeedbacks.filter((f:any)=>f.type === 'suggestion');
  const complaints = currentFeedbacks.filter((f:any)=>f.type === 'complaint');
  const ratingsAvg = safeAvg(currentRatings.map((r:any)=>Number(r.rating || 0)).filter(Boolean));
  const prevRatingsAvg = safeAvg(prevRatings.map((r:any)=>Number(r.rating || 0)).filter(Boolean));
  const satisfactionRate = currentRatings.length ? Math.round((currentRatings.filter((r:any)=>Number(r.rating) >= 4).length / currentRatings.length) * 100) : 0;
  const prevSatisfactionRate = prevRatings.length ? Math.round((prevRatings.filter((r:any)=>Number(r.rating) >= 4).length / prevRatings.length) * 100) : 0;
  const npsScores = currentSurveys.map((s:any)=>typeof s.nps_score === 'number' ? s.nps_score : null).filter((v:any)=>v !== null);
  const prevNpsScores = prevSurveys.map((s:any)=>typeof s.nps_score === 'number' ? s.nps_score : null).filter((v:any)=>v !== null);
  const calcNps = (scores:number[]) => {
    if (!scores.length) return 0;
    const promoters = scores.filter((n:number)=>n >= 9).length;
    const detractors = scores.filter((n:number)=>n <= 6).length;
    return Math.round(((promoters / scores.length) - (detractors / scores.length)) * 100);
  };
  const nps = calcNps(npsScores as number[]);
  const prevNps = calcNps(prevNpsScores as number[]);

  const professorRanking = Object.entries(groupCount(currentRatings as any[], (r:any)=>professorMap[r.professor_id] || 'Sem professor')).map(([name, count]) => {
    const entries = currentRatings.filter((r:any)=>(professorMap[r.professor_id] || 'Sem professor') === name);
    return { name, count, average: safeAvg(entries.map((e:any)=>Number(e.rating || 0))) };
  }).sort((a,b)=>b.average-a.average || b.count-a.count);

  const complaintStatus = groupCount(complaints as any[], (f:any)=>f.status || 'pending');
  const complaintCategories = groupCount(complaints as any[], (f:any)=>f.category || 'Sem categoria');
  const suggestionCategories = groupCount(suggestions as any[], (f:any)=>f.category || 'Sem categoria');

  const highlights: { level:'high'|'medium'|'positive', text:string }[] = [];
  if ((complaintStatus.pending || 0) > 0) highlights.push({ level:'high', text:`${complaintStatus.pending} reclamação(ões) pendente(s) nesta semana.` });
  const topComplaint = Object.entries(complaintCategories).sort((a,b)=>b[1]-a[1])[0];
  if (topComplaint && topComplaint[1] >= 2) highlights.push({ level:'medium', text:`A categoria "${topComplaint[0]}" apareceu ${topComplaint[1]} vezes nas reclamações.` });
  if (nps > prevNps) highlights.push({ level:'positive', text:`O NPS subiu de ${prevNps} para ${nps} pontos.` });
  if (ratingsAvg >= 4.5 && currentRatings.length) highlights.push({ level:'positive', text:`A nota média das avaliações ficou em ${ratingsAvg}.` });

  const summary = {
    periodLabel: `${start.toLocaleDateString('pt-BR')} a ${now.toLocaleDateString('pt-BR')}`,
    totals: {
      participations: currentRatings.length + currentFeedbacks.length + currentSurveys.length,
      ratings: currentRatings.length,
      surveys: currentSurveys.length,
      suggestions: suggestions.length,
      complaints: complaints.length,
      pendingComplaints: complaintStatus.pending || 0,
      resolvedComplaints: complaintStatus.resolved || 0,
      averageRating: ratingsAvg,
      satisfactionRate,
      nps,
    },
    compare: {
      participations: (currentRatings.length + currentFeedbacks.length + currentSurveys.length) - (prevRatings.length + prevFeedbacks.length + prevSurveys.length),
      ratings: currentRatings.length - prevRatings.length,
      suggestions: suggestions.length - prevFeedbacks.filter((f:any)=>f.type==='suggestion').length,
      complaints: complaints.length - prevFeedbacks.filter((f:any)=>f.type==='complaint').length,
      averageRating: Number((ratingsAvg - prevRatingsAvg).toFixed(1)),
      satisfactionRate: satisfactionRate - prevSatisfactionRate,
      nps: nps - prevNps,
    },
    highlights,
  };

  return {
    summary,
    ratings: currentRatings.map((r:any)=>({ ...r, professor_name: professorMap[r.professor_id] || 'Sem professor' })),
    feedbacks: currentFeedbacks,
    surveys: currentSurveys,
    professorRanking,
    complaintStatus,
    complaintCategories,
    suggestionCategories,
  };
}
