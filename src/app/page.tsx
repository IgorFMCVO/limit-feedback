'use client';

import { useState, useEffect } from 'react';
import { supabase, submitRating, submitSurvey, submitFeedback, getStats } from '@/lib/supabase';
import { SURVEY_QUESTIONS, FEEDBACK_CATEGORIES, ACADEMY_INFO, RATING_LABELS } from '@/lib/constants';
import type { Professor, Stats } from '@/types';

type View = 'home' | 'rate' | 'survey' | 'feedback' | 'thanks';

export default function FeedbackApp() {
  // States
  const [currentView, setCurrentView] = useState<View>('home');
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [stats, setStats] = useState<Stats>({ average_rating: 4.6, total_feedbacks: 465, satisfaction_rate: 98 });
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [feedback, setFeedback] = useState('');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, number | string>>({});
  const [feedbackType, setFeedbackType] = useState<'suggestion' | 'complaint'>('suggestion');
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        // Buscar professores
        const { data: profs } = await supabase
          .from('professors')
          .select('*')
          .eq('active', true)
          .order('name');
        
        if (profs) setProfessors(profs);
        
        // Buscar estatísticas
        const statsData = await getStats();
        setStats(statsData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        // Usar dados padrão em caso de erro
        setProfessors([
          { id: '1', name: 'Prof. Carlos Silva', specialty: 'Musculação', avatar: '💪', rating: 4.8, reviews_count: 124 },
          { id: '2', name: 'Prof. Ana Santos', specialty: 'Funcional', avatar: '🏃‍♀️', rating: 4.9, reviews_count: 98 },
          { id: '3', name: 'Prof. Ricardo Lima', specialty: 'Personal Trainer', avatar: '🎯', rating: 4.7, reviews_count: 156 },
          { id: '4', name: 'Prof. Marina Costa', specialty: 'Spinning', avatar: '🚴', rating: 4.9, reviews_count: 87 },
          { id: '5', name: 'Prof. João Pedro', specialty: 'Crossfit', avatar: '🔥', rating: 4.6, reviews_count: 72 },
          { id: '6', name: 'Recepção', specialty: 'Atendimento Geral', avatar: '👋', rating: 4.8, reviews_count: 203 },
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Handlers
  const handleSubmitRating = async () => {
    if (!selectedProfessor || rating === 0) return;
    
    setSubmitted(true);
    try {
      await submitRating({
        professor_id: selectedProfessor.id,
        rating,
        comment: feedback || undefined,
        user_name: userName || undefined,
      });
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
    }
    
    setTimeout(() => setCurrentView('thanks'), 1500);
  };

  const handleSubmitSurvey = async () => {
    if (!userName || !userPhone) return;
    
    try {
      const npsScore = typeof surveyAnswers[6] === 'number' ? surveyAnswers[6] : undefined;
      
      await submitSurvey({
        user_name: userName,
        user_phone: userPhone,
        user_email: userEmail || undefined,
        answers: surveyAnswers,
        nps_score: npsScore,
        accept_marketing: acceptTerms,
      });
    } catch (error) {
      console.error('Erro ao enviar pesquisa:', error);
    }
    
    setCurrentView('thanks');
  };

  const handleSubmitFeedback = async () => {
    if (!feedback || !selectedCategory) return;
    
    try {
      await submitFeedback({
        type: feedbackType,
        category: selectedCategory,
        message: feedback,
        user_name: isAnonymous ? undefined : userName || undefined,
        user_phone: isAnonymous ? undefined : userPhone || undefined,
        is_anonymous: isAnonymous,
      });
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
    }
    
    setCurrentView('thanks');
  };

  const resetForm = () => {
    setCurrentView('home');
    setRating(0);
    setSelectedProfessor(null);
    setSelectedCategory('');
    setFeedback('');
    setUserName('');
    setUserPhone('');
    setUserEmail('');
    setIsAnonymous(false);
    setSubmitted(false);
    setSurveyAnswers({});
    setAcceptTerms(false);
  };

  // Star Rating Component
  const StarRating = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
    <div className="flex justify-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHoveredStar(star)}
          onMouseLeave={() => setHoveredStar(0)}
          className="text-4xl transition-all duration-200 transform hover:scale-125 active:scale-110"
          style={{ 
            color: star <= (hoveredStar || value) ? '#c4915c' : '#334155',
            textShadow: star <= (hoveredStar || value) ? '0 0 10px rgba(196, 145, 92, 0.5)' : 'none'
          }}
        >
          ★
        </button>
      ))}
    </div>
  );

  // ============ VIEWS ============

  // Home View
  const HomeView = () => (
    <div className="space-y-5 animate-fadeIn">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl p-6 text-center bg-limit-gradient">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-2xl"></div>
        </div>
        <div className="relative z-10">
          {/* Logo Oficial */}
          <img 
            src="/logoLimitAtual.png" 
            alt="LIMIT FITNESS" 
            className="w-44 h-auto mx-auto mb-1 drop-shadow-2xl"
          />
          <h1 className="text-2xl font-black text-white mb-1 tracking-tight">
            SUA VOZ<br/>
            <span className="text-limit-gold">TRANSFORMA</span>
          </h1>
          <p className="text-blue-100 text-sm opacity-90">
            Ajude-nos a construir a melhor experiência fitness
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setCurrentView('rate')}
          className="group relative overflow-hidden bg-white rounded-2xl p-5 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl border-2 border-transparent hover:border-blue-100"
        >
          <span className="text-3xl mb-3 block">⭐</span>
          <h3 className="font-bold text-lg text-limit-blue">Avaliar</h3>
          <p className="text-gray-500 text-xs mt-1">Professor ou atendimento</p>
        </button>

        <button
          onClick={() => setCurrentView('survey')}
          className="group relative overflow-hidden bg-white rounded-2xl p-5 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl border-2 border-transparent hover:border-emerald-100"
        >
          <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">PRÊMIOS</div>
          <span className="text-3xl mb-3 block">🎁</span>
          <h3 className="text-emerald-600 font-bold text-lg">Pesquisa</h3>
          <p className="text-gray-500 text-xs mt-1">Concorra a prêmios!</p>
        </button>

        <button
          onClick={() => { setFeedbackType('suggestion'); setCurrentView('feedback'); }}
          className="group relative overflow-hidden bg-white rounded-2xl p-5 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl border-2 border-transparent hover:border-amber-100"
        >
          <span className="text-3xl mb-3 block">💡</span>
          <h3 className="font-bold text-lg text-limit-gold-dark">Sugestão</h3>
          <p className="text-gray-500 text-xs mt-1">Envie suas ideias</p>
        </button>

        <button
          onClick={() => { setFeedbackType('complaint'); setCurrentView('feedback'); }}
          className="group relative overflow-hidden bg-white rounded-2xl p-5 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl border-2 border-transparent hover:border-red-100"
        >
          <span className="text-3xl mb-3 block">🔔</span>
          <h3 className="text-red-600 font-bold text-lg">Reclamação</h3>
          <p className="text-gray-500 text-xs mt-1">Reporte problemas</p>
        </button>
      </div>

      {/* Promo Banner */}
      <div className="relative overflow-hidden rounded-2xl p-5 bg-limit-gradient-light">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-2xl">🏆</div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg">Responda e Ganhe!</h3>
            <p className="text-blue-100 text-sm">Complete a pesquisa e concorra a <strong className="text-white">1 mês grátis</strong></p>
          </div>
          <button 
            onClick={() => setCurrentView('survey')}
            className="bg-white text-limit-blue font-bold px-4 py-2 rounded-xl text-sm hover:bg-blue-50 transition-colors"
          >
            Participar
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-4 text-center shadow-md">
          <div className="text-2xl font-black text-limit-blue">{stats.average_rating}</div>
          <div className="flex justify-center mt-1">
            {[1,2,3,4,5].map(i => (
              <span key={i} className="text-xs" style={{ color: i <= Math.round(stats.average_rating) ? '#c4915c' : '#cbd5e1' }}>★</span>
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-1">Avaliação</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-md">
          <div className="text-2xl font-black text-gray-800">{stats.total_feedbacks}</div>
          <div className="text-xs text-gray-500 mt-2">Feedbacks</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-md">
          <div className="text-2xl font-black text-emerald-500">{stats.satisfaction_rate}%</div>
          <div className="text-xs text-gray-500 mt-2">Satisfação</div>
        </div>
      </div>

      {/* Social */}
      <div className="bg-white rounded-2xl p-5 shadow-md">
        <p className="text-gray-400 text-xs uppercase tracking-widest text-center mb-4 font-semibold">Siga a LIMIT</p>
        <div className="flex justify-center gap-4">
          <a href={`https://instagram.com/${ACADEMY_INFO.instagram}`} target="_blank" rel="noopener noreferrer" 
            className="w-12 h-12 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 rounded-xl flex items-center justify-center text-white text-xl hover:scale-110 transition-transform shadow-lg">
            📸
          </a>
          <a href={`https://wa.me/${ACADEMY_INFO.whatsapp}`} target="_blank" rel="noopener noreferrer"
            className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-xl hover:scale-110 transition-transform shadow-lg">
            📱
          </a>
          <a href="#" className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white text-xl hover:scale-110 transition-transform shadow-lg">
            👍
          </a>
        </div>
        <p className="text-center text-gray-400 text-xs mt-3">@{ACADEMY_INFO.instagram}</p>
      </div>
    </div>
  );

  // Rate View
  const RateView = () => (
    <div className="space-y-5 animate-fadeIn">
      <div className="flex items-center gap-4">
        <button onClick={() => setCurrentView('home')} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <span className="text-gray-600">←</span>
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Avaliar Atendimento</h2>
          <p className="text-gray-500 text-sm">Sua avaliação premia nossos profissionais</p>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-gray-600 text-sm font-semibold">Quem você deseja avaliar?</label>
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {professors.map((prof) => (
            <button
              key={prof.id}
              onClick={() => setSelectedProfessor(prof)}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                selectedProfessor?.id === prof.id
                  ? 'border-limit-blue bg-blue-50 shadow-md'
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${
                selectedProfessor?.id === prof.id ? 'bg-limit-gradient-light' : 'bg-gray-100'
              }`}>
                {prof.avatar}
              </div>
              <div className="flex-1">
                <h4 className="text-gray-800 font-semibold">{prof.name}</h4>
                <p className="text-gray-400 text-sm">{prof.specialty}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <span className="text-limit-gold">★</span>
                  <span className="font-bold text-gray-700">{prof.rating}</span>
                </div>
                <div className="text-gray-400 text-xs">{prof.reviews_count} avaliações</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedProfessor && (
        <div className="bg-white rounded-2xl p-6 shadow-lg space-y-5 border border-gray-100">
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Como foi seu atendimento com</p>
            <p className="font-bold text-lg text-limit-blue">{selectedProfessor.name}?</p>
          </div>
          <StarRating value={rating} onChange={setRating} />
          {rating > 0 && (
            <div className="flex justify-center">
              <span className={`text-sm px-5 py-2 rounded-full font-semibold ${
                rating <= 2 ? 'bg-red-100 text-red-600' :
                rating === 3 ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-600'
              }`}>
                {RATING_LABELS[rating]}
              </span>
            </div>
          )}
        </div>
      )}

      {rating > 0 && (
        <div className="space-y-4">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Conte mais sobre sua experiência... (opcional)"
            className="w-full bg-white border-2 border-gray-100 rounded-xl p-4 text-gray-800 placeholder-gray-400 resize-none h-28 focus:border-limit-blue focus:outline-none"
          />
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Seu nome (opcional)"
            className="w-full bg-white border-2 border-gray-100 rounded-xl p-4 text-gray-800 placeholder-gray-400 focus:border-limit-blue focus:outline-none"
          />
          <button
            onClick={handleSubmitRating}
            disabled={submitted}
            className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all ${
              submitted ? 'bg-green-500' : 'bg-limit-gradient-light hover:shadow-xl'
            }`}
          >
            {submitted ? '✓ Avaliação Enviada!' : 'Enviar Avaliação'}
          </button>
        </div>
      )}
    </div>
  );

  // Survey View
  const SurveyView = () => {
    const answeredCount = Object.keys(surveyAnswers).length;
    const progress = (answeredCount / SURVEY_QUESTIONS.length) * 100;

    return (
      <div className="space-y-5 animate-fadeIn">
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentView('home')} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
            <span className="text-gray-600">←</span>
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">Pesquisa Mensal</h2>
            <p className="text-gray-500 text-sm">Complete e concorra a prêmios!</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Progresso</span>
            <span className="font-bold text-limit-blue">{answeredCount}/{SURVEY_QUESTIONS.length}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500 bg-limit-gradient-light" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl p-4 text-center bg-limit-gradient">
          <span className="text-3xl">🎁</span>
          <p className="text-white font-bold mt-2">Concorra a 1 Mês Grátis!</p>
          <p className="text-blue-200 text-xs">+ Brindes exclusivos para participantes</p>
        </div>

        <div className="space-y-4">
          {SURVEY_QUESTIONS.map((q, index) => (
            <div key={q.id} className="bg-white rounded-xl p-5 shadow-md">
              <p className="text-gray-800 font-medium mb-4">
                <span className="inline-block w-6 h-6 rounded-full text-xs text-white mr-2 text-center leading-6 bg-limit-blue">{index + 1}</span>
                {q.question}
              </p>
              
              {q.type === 'rating' && (
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      onClick={() => setSurveyAnswers({ ...surveyAnswers, [q.id]: val })}
                      className={`w-12 h-12 rounded-xl font-bold transition-all ${
                        surveyAnswers[q.id] === val ? 'text-white scale-110 shadow-lg bg-limit-gradient-light' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              )}
              
              {q.type === 'yesno' && (
                <div className="flex gap-2">
                  {['Sim', 'Não', 'Parcialmente'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSurveyAnswers({ ...surveyAnswers, [q.id]: opt })}
                      className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                        surveyAnswers[q.id] === opt ? 'text-white shadow-md bg-limit-blue' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
              
              {q.type === 'nps' && (
                <div className="space-y-2">
                  <div className="flex flex-wrap justify-center gap-2">
                    {[...Array(11)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSurveyAnswers({ ...surveyAnswers, [q.id]: i })}
                        className={`w-9 h-9 rounded-lg font-medium text-sm transition-all ${
                          surveyAnswers[q.id] === i ? 'text-white scale-110 shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        style={surveyAnswers[q.id] === i ? { background: i <= 6 ? '#ef4444' : i <= 8 ? '#eab308' : '#22c55e' } : {}}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 px-2">
                    <span>Pouco provável</span>
                    <span>Muito provável</span>
                  </div>
                </div>
              )}
              
              {q.type === 'text' && (
                <textarea
                  value={(surveyAnswers[q.id] as string) || ''}
                  onChange={(e) => setSurveyAnswers({ ...surveyAnswers, [q.id]: e.target.value })}
                  placeholder="Sua resposta..."
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-3 text-gray-800 placeholder-gray-400 resize-none h-24 focus:border-limit-blue focus:outline-none"
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md space-y-3">
          <p className="text-gray-700 font-semibold flex items-center gap-2">📞 Seus dados para o sorteio</p>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Nome completo *"
            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-3 text-gray-800 placeholder-gray-400 focus:border-limit-blue focus:outline-none"
          />
          <input
            type="tel"
            value={userPhone}
            onChange={(e) => setUserPhone(e.target.value)}
            placeholder="WhatsApp (38) 99999-9999 *"
            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-3 text-gray-800 placeholder-gray-400 focus:border-limit-blue focus:outline-none"
          />
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="E-mail (opcional)"
            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-3 text-gray-800 placeholder-gray-400 focus:border-limit-blue focus:outline-none"
          />
        </div>

        <label className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="w-5 h-5 mt-0.5 rounded accent-limit-blue"
          />
          <span className="text-gray-600 text-sm">Concordo em participar do sorteio e autorizo o contato via WhatsApp.</span>
        </label>

        <button
          onClick={handleSubmitSurvey}
          disabled={!userName || !userPhone || !acceptTerms}
          className="w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all disabled:opacity-50 bg-limit-gradient-light hover:shadow-xl"
        >
          Enviar e Participar do Sorteio 🎉
        </button>
      </div>
    );
  };

  // Feedback View
  const FeedbackView = () => (
    <div className="space-y-5 animate-fadeIn">
      <div className="flex items-center gap-4">
        <button onClick={() => setCurrentView('home')} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
          <span className="text-gray-600">←</span>
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {feedbackType === 'suggestion' ? 'Enviar Sugestão' : 'Registrar Reclamação'}
          </h2>
          <p className="text-gray-500 text-sm">
            {feedbackType === 'suggestion' ? 'Suas ideias nos ajudam a evoluir' : 'Tratamos com prioridade máxima'}
          </p>
        </div>
      </div>

      {feedbackType === 'complaint' && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <span className="text-xl">🔒</span>
          <div>
            <p className="text-amber-800 font-semibold text-sm">Tratamento Confidencial</p>
            <p className="text-amber-700 text-xs mt-1">Sua reclamação será analisada pela gerência em até 48h úteis.</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <label className="text-gray-600 text-sm font-semibold">Categoria</label>
        <div className="grid grid-cols-4 gap-2">
          {FEEDBACK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`py-3 px-2 rounded-xl text-center transition-all ${
                selectedCategory === cat.id ? 'bg-blue-50 border-2 border-limit-blue shadow-sm' : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
              }`}
            >
              <span className="text-xl block mb-1">{cat.icon}</span>
              <span className={`text-xs font-medium ${selectedCategory === cat.id ? 'text-limit-blue' : 'text-gray-600'}`}>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder={feedbackType === 'suggestion' ? 'Descreva sua sugestão...' : 'Descreva o problema...'}
        className="w-full bg-white border-2 border-gray-100 rounded-xl p-4 text-gray-800 placeholder-gray-400 resize-none h-36 focus:border-limit-blue focus:outline-none shadow-sm"
      />

      <div className="space-y-3">
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Nome completo"
          className="w-full bg-white border-2 border-gray-100 rounded-xl p-4 text-gray-800 placeholder-gray-400 focus:border-limit-blue focus:outline-none"
        />
        <input
          type="tel"
          value={userPhone}
          onChange={(e) => setUserPhone(e.target.value)}
          placeholder="WhatsApp para retorno"
          className="w-full bg-white border-2 border-gray-100 rounded-xl p-4 text-gray-800 placeholder-gray-400 focus:border-limit-blue focus:outline-none"
        />
      </div>

      {feedbackType === 'complaint' && (
        <label className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl cursor-pointer">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="w-5 h-5 rounded accent-limit-blue"
          />
          <span className="text-gray-600 text-sm">Desejo permanecer anônimo</span>
        </label>
      )}

      <button
        onClick={handleSubmitFeedback}
        disabled={!feedback || !selectedCategory}
        className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all disabled:opacity-50 hover:shadow-xl ${
          feedbackType === 'suggestion' ? 'bg-gold-gradient' : 'bg-gradient-to-r from-red-500 to-orange-500'
        }`}
      >
        Enviar {feedbackType === 'suggestion' ? 'Sugestão' : 'Reclamação'}
      </button>
    </div>
  );

  // Thanks View
  const ThanksView = () => (
    <div className="flex flex-col items-center justify-center min-h-[75vh] text-center space-y-6 px-4 animate-fadeIn">
      <div className="relative">
        <div className="w-28 h-28 rounded-full flex items-center justify-center shadow-2xl bg-gradient-to-br from-green-400 to-emerald-500">
          <span className="text-5xl text-white">✓</span>
        </div>
        <div className="absolute -inset-2 rounded-full animate-ping opacity-20 bg-green-500"></div>
      </div>
      
      <div>
        <h2 className="text-3xl font-black mb-2 text-limit-blue">Obrigado!</h2>
        <p className="text-gray-500 max-w-xs leading-relaxed">
          Sua participação é fundamental para construirmos juntos a <strong className="text-gray-700">melhor experiência fitness</strong> de Curvelo!
        </p>
      </div>
      
      <div className="rounded-2xl p-5 max-w-xs w-full bg-blue-50 border-2 border-blue-100">
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl">🏆</span>
          <div className="text-left">
            <p className="font-bold text-limit-blue">+15 Pontos</p>
            <p className="text-gray-500 text-xs">Programa #teamLIMIT</p>
          </div>
        </div>
      </div>

      <p className="text-gray-400 text-sm italic">
        "Treine até o seu <strong className="text-limit-gold-dark">LIMITE</strong>!" 💪
      </p>

      <div className="flex gap-3 w-full max-w-xs">
        <button onClick={resetForm} className="flex-1 px-6 py-3 rounded-xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all">
          Voltar
        </button>
        <a href={`https://wa.me/${ACADEMY_INFO.whatsapp}`} className="flex-1 px-6 py-3 rounded-xl font-bold text-white text-center bg-gradient-to-r from-green-500 to-green-600">
          WhatsApp
        </a>
      </div>
    </div>
  );

  // ============ RENDER ============

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <img 
            src="/logoLimitAtual.png" 
            alt="LIMIT FITNESS" 
            className="w-24 h-auto mx-auto mb-4"
          />
          <p className="text-gray-500 animate-pulse">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl bg-limit-blue/[0.03]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl bg-limit-gold/[0.03]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-md mx-auto px-4 py-6 pb-28">
        {/* Header */}
        {currentView !== 'thanks' && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {/* Logo no Header */}
              <img 
                src="/logoLimitAtual.png" 
                alt="LIMIT FITNESS" 
                className="w-14 h-14 object-contain"
              />
              <p className="text-gray-500 text-sm">Treine até o seu limite!</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <span className="text-limit-gold">★</span>
                <span className="font-bold text-gray-700">{stats.average_rating}</span>
              </div>
              <p className="text-gray-400 text-xs">Curvelo-MG</p>
            </div>
          </div>
        )}

        {/* Views */}
        {currentView === 'home' && <HomeView />}
        {currentView === 'rate' && <RateView />}
        {currentView === 'survey' && <SurveyView />}
        {currentView === 'feedback' && <FeedbackView />}
        {currentView === 'thanks' && <ThanksView />}
      </div>

      {/* Bottom Nav */}
      {currentView !== 'thanks' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 px-4 py-3 shadow-2xl z-50">
          <div className="max-w-md mx-auto flex justify-around">
            <button
              onClick={() => setCurrentView('home')}
              className={`flex flex-col items-center gap-1 py-2 px-5 rounded-xl transition-all ${currentView === 'home' ? 'bg-blue-50' : ''}`}
            >
              <span className="text-xl">🏠</span>
              <span className={`text-xs font-medium ${currentView === 'home' ? 'text-limit-blue' : 'text-gray-400'}`}>Início</span>
            </button>
            <button
              onClick={() => setCurrentView('rate')}
              className={`flex flex-col items-center gap-1 py-2 px-5 rounded-xl transition-all ${currentView === 'rate' ? 'bg-blue-50' : ''}`}
            >
              <span className="text-xl">⭐</span>
              <span className={`text-xs font-medium ${currentView === 'rate' ? 'text-limit-blue' : 'text-gray-400'}`}>Avaliar</span>
            </button>
            <button
              onClick={() => setCurrentView('survey')}
              className={`flex flex-col items-center gap-1 py-2 px-5 rounded-xl transition-all ${currentView === 'survey' ? 'bg-blue-50' : ''}`}
            >
              <span className="text-xl">🎁</span>
              <span className={`text-xs font-medium ${currentView === 'survey' ? 'text-limit-blue' : 'text-gray-400'}`}>Pesquisa</span>
            </button>
            <a
              href="https://wa.me/5538998665666"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 py-2 px-5 rounded-xl"
            >
              <span className="text-xl">📱</span>
              <span className="text-xs font-medium text-green-500">WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
