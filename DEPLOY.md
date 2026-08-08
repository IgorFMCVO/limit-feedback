# Deploy — Sua Voz LIMIT

Projeto Next.js completo com desktop V7 Refinado integrado.

## Vercel CLI
1. Entre nesta pasta.
2. Confirme com `pwd`.
3. Rode `npm install` se necessário.
4. Rode `npm run build` para teste local.
5. Rode `vercel --prod`.

O script `vercel-build` já existe no package.json para compatibilidade com o Build Command do projeto Vercel.

As variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` devem permanecer configuradas no projeto Vercel.


## Painel administrativo

Acesso oculto em `/admin`.

Variáveis obrigatórias adicionais:
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`

Páginas criadas:
- `/admin` → dashboard geral semanal
- `/admin/relatorio` → relatório semanal imprimível
- `/admin/login` → acesso por senha
