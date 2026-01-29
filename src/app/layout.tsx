import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LIMIT FITNESS - Feedback',
  description: 'Sistema de feedback da Academia LIMIT FITNESS - Curvelo/MG. Avalie nossos professores, participe de pesquisas e concorra a prêmios!',
  keywords: ['academia', 'feedback', 'limit fitness', 'curvelo', 'avaliação', 'musculação'],
  authors: [{ name: 'LIMIT FITNESS' }],
  openGraph: {
    title: 'LIMIT FITNESS - Feedback',
    description: 'Sua opinião transforma! Avalie e concorra a prêmios.',
    type: 'website',
    locale: 'pt_BR',
  },
  robots: 'index, follow',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#004aad',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-slate-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
