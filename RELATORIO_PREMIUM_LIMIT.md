# Sua Voz · LIMIT FITNESS — Relatórios Premium

## Rotas
- `/admin/login` — login administrativo com identidade LIMIT.
- `/admin` — dashboard executivo semanal.
- `/admin/relatorio` — relatório semanal pronto para impressão/PDF.

## Identidade visual
- Fundo administrativo: `#07090B` / `#101318`.
- Verde-limão LIMIT: `#BEE83B`.
- Azul elétrico: `#2E74F0`.
- Bronze da logo: `#B67C3C`.
- Logo para fundo escuro: `public/logoLimitPremium.png`.
- Logo para papel/fundo claro: `public/logoLimitAtual.png`.

## Melhorias da versão
- Cabeçalho administrativo premium com logo e navegação.
- Login totalmente redesenhado.
- Dashboard com hero executivo, KPIs, ranking, status de reclamações, categorias e feedback qualitativo.
- Relatório A4 com capa, resumo executivo, indicadores, destaques, ranking, status de reclamações, feedbacks, comentários e pesquisas.
- Modo de impressão/PDF com fundo branco, page-breaks e alta legibilidade.
- Rotas admin marcadas como `force-dynamic` para evitar consulta ao Supabase durante build estático.

## Variáveis Vercel necessárias
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (Sensitive)
- `ADMIN_PASSWORD` (Sensitive)

Não expor `SUPABASE_SERVICE_ROLE_KEY` no cliente e nunca prefixá-la com `NEXT_PUBLIC_`.
