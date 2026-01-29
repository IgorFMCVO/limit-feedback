-- =====================================================
-- LIMIT FITNESS - Sistema de Feedback
-- Script de criação das tabelas no Supabase
-- =====================================================

-- Tabela de Professores
CREATE TABLE IF NOT EXISTS professors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialty VARCHAR(255) NOT NULL,
  avatar VARCHAR(10) DEFAULT '👤',
  rating DECIMAL(2,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Avaliações
CREATE TABLE IF NOT EXISTS ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  professor_id UUID REFERENCES professors(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  user_name VARCHAR(255),
  user_phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Respostas da Pesquisa
CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name VARCHAR(255) NOT NULL,
  user_phone VARCHAR(20) NOT NULL,
  user_email VARCHAR(255),
  answers JSONB NOT NULL,
  nps_score INTEGER CHECK (nps_score >= 0 AND nps_score <= 10),
  accept_marketing BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Feedbacks (Sugestões e Reclamações)
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(20) NOT NULL CHECK (type IN ('suggestion', 'complaint')),
  category VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  user_name VARCHAR(255),
  user_phone VARCHAR(20),
  is_anonymous BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved')),
  admin_notes TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_ratings_professor ON ratings(professor_id);
CREATE INDEX IF NOT EXISTS idx_ratings_created ON ratings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_survey_created ON survey_responses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedbacks_type ON feedbacks(type);
CREATE INDEX IF NOT EXISTS idx_feedbacks_status ON feedbacks(status);
CREATE INDEX IF NOT EXISTS idx_feedbacks_created ON feedbacks(created_at DESC);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_professors_updated_at
  BEFORE UPDATE ON professors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DADOS INICIAIS - Professores
-- =====================================================

INSERT INTO professors (name, specialty, avatar, rating, reviews_count) VALUES
  ('Prof. Carlos Silva', 'Musculação', '💪', 4.8, 124),
  ('Prof. Ana Santos', 'Funcional', '🏃‍♀️', 4.9, 98),
  ('Prof. Ricardo Lima', 'Personal Trainer', '🎯', 4.7, 156),
  ('Prof. Marina Costa', 'Spinning', '🚴', 4.9, 87),
  ('Prof. João Pedro', 'Crossfit', '🔥', 4.6, 72),
  ('Recepção', 'Atendimento Geral', '👋', 4.8, 203)
ON CONFLICT DO NOTHING;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS
ALTER TABLE professors ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- Políticas para leitura pública
CREATE POLICY "Professores são públicos" ON professors
  FOR SELECT USING (true);

-- Políticas para inserção pública (anônimos podem enviar feedback)
CREATE POLICY "Qualquer um pode enviar avaliação" ON ratings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Qualquer um pode enviar pesquisa" ON survey_responses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Qualquer um pode enviar feedback" ON feedbacks
  FOR INSERT WITH CHECK (true);

-- Políticas de leitura para estatísticas
CREATE POLICY "Avaliações são públicas para leitura" ON ratings
  FOR SELECT USING (true);

-- =====================================================
-- VIEW para estatísticas
-- =====================================================

CREATE OR REPLACE VIEW stats_view AS
SELECT 
  COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0) as average_rating,
  (
    SELECT COUNT(*) FROM ratings
  ) + (
    SELECT COUNT(*) FROM survey_responses
  ) + (
    SELECT COUNT(*) FROM feedbacks
  ) as total_feedbacks,
  CASE 
    WHEN COUNT(r.*) > 0 
    THEN ROUND((COUNT(r.*) FILTER (WHERE r.rating >= 4)::numeric / COUNT(r.*)::numeric) * 100)
    ELSE 0 
  END as satisfaction_rate
FROM ratings r;
