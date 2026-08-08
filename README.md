# 🏋️ LIMIT FITNESS - Sistema de Feedback

Sistema de feedback completo para a Academia LIMIT FITNESS, desenvolvido com Next.js 14, Tailwind CSS e Supabase.

## ✨ Funcionalidades

- ⭐ **Avaliação de Professores** - Sistema de estrelas com comentários
- 🎁 **Pesquisa Mensal** - Com NPS e sorteio de prêmios
- 💡 **Sugestões** - Canal para ideias dos alunos
- 🔔 **Reclamações** - Sistema confidencial
- 📊 **Estatísticas** - Dashboard com métricas em tempo real

## 🚀 Início Rápido

### 1. Instalar Dependências

```bash
cd limit-feedback-app
npm install
```

### 2. Configurar Supabase

#### 2.1. Criar projeto no Supabase
1. Acesse [supabase.com](https://supabase.com) e faça login
2. Clique em "New project"
3. Escolha um nome e senha para o banco

#### 2.2. Criar as tabelas
1. No dashboard do Supabase, vá em **SQL Editor**
2. Cole o conteúdo do arquivo `supabase-schema.sql`
3. Clique em **Run**

#### 2.3. Obter credenciais
1. Vá em **Settings** > **API**
2. Copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Configurar variáveis de ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

### 4. Rodar localmente

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 🌐 Deploy na Vercel

### Opção 1: Via CLI

```bash
npm i -g vercel
vercel
```

### Opção 2: Via GitHub

1. Suba o projeto para o GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Clique em "Import Project"
4. Selecione seu repositório
5. Adicione as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Clique em "Deploy"

## 📁 Estrutura do Projeto

```
limit-feedback-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Layout principal
│   │   ├── page.tsx        # Página principal (todo o app)
│   │   └── globals.css     # Estilos globais
│   ├── components/         # Componentes reutilizáveis
│   ├── lib/
│   │   ├── supabase.ts     # Cliente e funções do Supabase
│   │   └── constants.ts    # Constantes (perguntas, categorias)
│   └── types/
│       └── index.ts        # Tipos TypeScript
├── public/                 # Arquivos estáticos
├── supabase-schema.sql     # Script SQL para criar tabelas
├── .env.example            # Exemplo de variáveis de ambiente
└── package.json
```

## 🎨 Personalização

### Cores da Marca
Edite `tailwind.config.js`:

```js
colors: {
  limit: {
    blue: '#004aad',
    'blue-light': '#0a72eb',
    gold: '#c4915c',
    'gold-dark': '#8b5a2b',
  }
}
```

### Informações da Academia
Edite `src/lib/constants.ts`:

```ts
export const ACADEMY_INFO = {
  name: 'LIMIT FITNESS',
  phone: '(38) 99866-5666',
  whatsapp: '5538998665666',
  instagram: 'academialimitfitness',
  // ...
};
```

### Professores
Adicione/edite diretamente no Supabase (tabela `professors`) ou via SQL.

### Perguntas da Pesquisa
Edite `SURVEY_QUESTIONS` em `src/lib/constants.ts`.

## 📱 QR Code

Após o deploy, gere um QR Code para o link do seu app:
- [qr-code-generator.com](https://www.qr-code-generator.com)
- Use o link: `https://seu-app.vercel.app`

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm start

# Verificar lint
npm run lint
```

## 📊 Dashboard Admin (Futuro)

Para visualizar os feedbacks, você pode:
1. Usar o **Table Editor** do Supabase
2. Criar uma página `/admin` protegida
3. Integrar com ferramentas como Retool ou Metabase

## 🤝 Suporte

- **WhatsApp**: (38) 99866-5666
- **Instagram**: @academialimitfitness
- **E-mail**: limitcurvelo@gmail.com

---

Desenvolvido com ❤️ para **LIMIT FITNESS** - Curvelo/MG

*"Treine até o seu LIMITE!"* 💪


## Painel administrativo

Acesso oculto em `/admin`.

Variáveis obrigatórias adicionais:
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`

Páginas criadas:
- `/admin` → dashboard geral semanal
- `/admin/relatorio` → relatório semanal imprimível
- `/admin/login` → acesso por senha
