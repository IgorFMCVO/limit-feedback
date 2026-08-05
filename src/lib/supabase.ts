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
  // Média do professor recalculada por trigger no banco (setup_supabase.sql)
  return data;
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

// Buscar estatísticas agregadas (RPC segura — sem expor avaliações individuais)
export async function getStats() {
  const { data, error } = await supabase.rpc('get_public_stats');
  if (error) throw error;
  return {
    average_rating: Number(data?.average_rating ?? 0),
    total_feedbacks: Number(data?.total_feedbacks ?? 0),
    satisfaction_rate: Number(data?.satisfaction_rate ?? 0),
  };
}
