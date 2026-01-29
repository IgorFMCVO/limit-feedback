// Tipos para o sistema de feedback LIMIT FITNESS

export interface Professor {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  rating: number;
  reviews_count: number;
  created_at?: string;
}

export interface Rating {
  id?: string;
  professor_id: string;
  rating: number;
  comment?: string;
  user_name?: string;
  user_phone?: string;
  created_at?: string;
}

export interface SurveyResponse {
  id?: string;
  user_name: string;
  user_phone: string;
  user_email?: string;
  answers: SurveyAnswers;
  nps_score?: number;
  accept_marketing: boolean;
  created_at?: string;
}

export interface SurveyAnswers {
  [questionId: string]: number | string;
}

export interface Feedback {
  id?: string;
  type: 'suggestion' | 'complaint';
  category: string;
  message: string;
  user_name?: string;
  user_phone?: string;
  is_anonymous: boolean;
  status: 'pending' | 'in_progress' | 'resolved';
  created_at?: string;
}

export interface SurveyQuestion {
  id: number;
  question: string;
  type: 'rating' | 'yesno' | 'nps' | 'text';
}

export interface Category {
  id: string;
  label: string;
  icon: string;
}

// Stats
export interface Stats {
  average_rating: number;
  total_feedbacks: number;
  satisfaction_rate: number;
}
