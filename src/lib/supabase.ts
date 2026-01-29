import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Funções auxiliares para o sistema de feedback

// Buscar professores
export async function getProfessors() {
  const { data, error } = await supabase
    .from('professors')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
}

// Enviar avaliação de professor
export async function submitRating(rating: {
  professor_id: string;
  rating: number;
  comment?: string;
  user_name?: string;
}) {
  const { data, error } = await supabase
    .from('ratings')
    .insert([rating])
    .select();
  
  if (error) throw error;
  
  // Atualizar média do professor
  await updateProfessorRating(rating.professor_id);
  
  return data;
}

// Atualizar média de avaliação do professor
async function updateProfessorRating(professorId: string) {
  const { data: ratings } = await supabase
    .from('ratings')
    .select('rating')
    .eq('professor_id', professorId);
  
  if (ratings && ratings.length > 0) {
    const average = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    
    await supabase
      .from('professors')
      .update({ 
        rating: Math.round(average * 10) / 10,
        reviews_count: ratings.length 
      })
      .eq('id', professorId);
  }
}

// Enviar pesquisa mensal
export async function submitSurvey(survey: {
  user_name: string;
  user_phone: string;
  user_email?: string;
  answers: Record<string, number | string>;
  nps_score?: number;
  accept_marketing: boolean;
}) {
  const { data, error } = await supabase
    .from('survey_responses')
    .insert([survey])
    .select();
  
  if (error) throw error;
  return data;
}

// Enviar sugestão ou reclamação
export async function submitFeedback(feedback: {
  type: 'suggestion' | 'complaint';
  category: string;
  message: string;
  user_name?: string;
  user_phone?: string;
  is_anonymous: boolean;
}) {
  const { data, error } = await supabase
    .from('feedbacks')
    .insert([{
      ...feedback,
      status: 'pending'
    }])
    .select();
  
  if (error) throw error;
  return data;
}

// Buscar estatísticas
export async function getStats() {
  // Média geral de avaliações
  const { data: ratings } = await supabase
    .from('ratings')
    .select('rating');
  
  const avgRating = ratings && ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    : 0;

  // Total de feedbacks (avaliações + pesquisas + sugestões/reclamações)
  const { count: ratingsCount } = await supabase
    .from('ratings')
    .select('*', { count: 'exact', head: true });
  
  const { count: surveysCount } = await supabase
    .from('survey_responses')
    .select('*', { count: 'exact', head: true });
  
  const { count: feedbacksCount } = await supabase
    .from('feedbacks')
    .select('*', { count: 'exact', head: true });

  const totalFeedbacks = (ratingsCount || 0) + (surveysCount || 0) + (feedbacksCount || 0);

  // Taxa de satisfação (avaliações 4 e 5)
  const goodRatings = ratings?.filter(r => r.rating >= 4).length || 0;
  const satisfactionRate = ratings && ratings.length > 0
    ? Math.round((goodRatings / ratings.length) * 100)
    : 0;

  return {
    average_rating: Math.round(avgRating * 10) / 10,
    total_feedbacks: totalFeedbacks,
    satisfaction_rate: satisfactionRate
  };
}
