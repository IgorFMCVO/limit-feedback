import { SurveyQuestion, Category } from '@/types';

// Perguntas da pesquisa mensal
export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  { id: 1, question: 'Como você avalia a limpeza e higiene da academia?', type: 'rating' },
  { id: 2, question: 'Os equipamentos estão em bom estado de conservação?', type: 'rating' },
  { id: 3, question: 'A climatização (ar-condicionado/ventilação) é adequada?', type: 'rating' },
  { id: 4, question: 'O horário de funcionamento atende suas necessidades?', type: 'yesno' },
  { id: 5, question: 'Você está satisfeito com o atendimento dos professores?', type: 'rating' },
  { id: 6, question: 'De 0 a 10, qual a probabilidade de indicar a LIMIT para um amigo?', type: 'nps' },
  { id: 7, question: 'O que podemos melhorar para você?', type: 'text' },
];

// Categorias de feedback
export const FEEDBACK_CATEGORIES: Category[] = [
  { id: 'equipamentos', label: 'Equipamentos', icon: '🏋️' },
  { id: 'limpeza', label: 'Limpeza', icon: '🧹' },
  { id: 'atendimento', label: 'Atendimento', icon: '👥' },
  { id: 'horarios', label: 'Horários', icon: '🕐' },
  { id: 'aulas', label: 'Aulas', icon: '📋' },
  { id: 'estrutura', label: 'Estrutura', icon: '🏢' },
  { id: 'outros', label: 'Outros', icon: '📝' },
];

// Informações da academia
export const ACADEMY_INFO = {
  name: 'LIMIT FITNESS',
  slogan: 'Treine até o seu limite!',
  address: 'Av. Othon Bezerra de Melo, 2025 - Centro, Curvelo-MG',
  phone: '(38) 9 9738-3905',
  whatsapp: '5538997383905',
  instagram: 'academialimitfitness',
  email: 'limitcurvelo@gmail.com',
};

// Cores da marca
export const BRAND_COLORS = {
  blue: '#004aad',
  blueLight: '#0a72eb',
  blueDark: '#003080',
  gold: '#c4915c',
  goldDark: '#8b5a2b',
};

// Labels de avaliação
export const RATING_LABELS = ['', '😞 Péssimo', '😕 Ruim', '😐 Regular', '😊 Bom', '🤩 Excelente'];
