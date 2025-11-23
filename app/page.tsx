import Link from 'next/link';

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 space-y-6">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold">LeadsLight</h1>
        <p className="text-slate-600">Ajoutez, triez et exportez vos prospects.</p>
      </header>

      <Link
        href="/leads"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800"
      >
        Accéder aux leads
      </Link>
    </main>
  );
}
