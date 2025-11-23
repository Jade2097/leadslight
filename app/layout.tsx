import './globals.css';

export const metadata = { title: 'LeadsLight', description: 'Mini outil de suivi de leads' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      {/* Utilise les variables du thème plutôt que des couleurs “hardcodées” */}
      <body className="min-h-screen bg-bg text-fg">
        <header className="container">
          <a href="/">LeadsLight</a> · <a href="/leads">Leads</a>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
