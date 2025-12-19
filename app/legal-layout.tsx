export function LegalLayout({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#0a0f1a] text-white p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <a href="/" className="text-blue-400 text-sm mb-8 inline-block hover:underline">← Back to Home</a>
        <h1 className="text-3xl font-black italic tracking-tighter mb-8 uppercase">{title}</h1>
        <div className="space-y-6 text-slate-300 leading-relaxed text-sm">
          {children}
        </div>
      </div>
    </main>
  );
}