import { supabase } from '../../../lib/supabase';
import { notFound } from 'next/navigation';

export default async function ViewLink({ params }: { params: { id: string } }) {
  const { id } = await params;

  // 1. Track Views
  await supabase.rpc('increment_views', { target_id: id });

  // 2. Fetch Link Data
  const { data: link, error } = await supabase
    .from('links')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !link) return notFound();

  // 3. Expiry Check
  const now = new Date();
  const expiry = new Date(link.expires_at);
  if (now > expiry) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-white text-center">
        <h1 className="text-6xl mb-4">⌛</h1>
        <h1 className="text-2xl font-bold text-slate-800">Link Expired</h1>
        <a href="/" className="mt-8 text-blue-600 font-bold underline">Create New</a>
      </main>
    );
  }

  // 4. SMART AD COMPONENT (Detects PRO Status)
  const AdSlot = ({ type = "horizontal" }: { type?: "horizontal" | "overlay" }) => {
    // If link is PRO, do not render anything
    if (link.is_pro) return null;

    return (
      <div className={`my-6 w-full p-4 bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center animate-in fade-in duration-700 ${type === 'overlay' ? 'bg-white/10 backdrop-blur-md border-white/20' : ''}`}>
        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 font-sans">Sponsored</p>
        <div className="h-20 flex items-center justify-center text-slate-400 italic text-sm font-serif">
          Advertisement Space
        </div>
      </div>
    );
  };

  // Sold Stamp Component
  const SoldStamp = () => (
    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
      <div className="border-8 border-red-600 px-6 py-2 text-red-600 text-5xl font-black uppercase tracking-tighter rotate-[-12deg] bg-white/90 shadow-2xl">
        SOLD
      </div>
    </div>
  );

  const renderTemplate = () => {
    switch (link.template_type) {
      case 'minimal': 
        return (
          <div className="bg-white min-h-screen py-20 px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-4xl font-extralight tracking-widest uppercase mb-2 text-slate-900">{link.title}</h1>
              
              <AdSlot /> 

              <div className="space-y-24 mt-16 relative">
                {link.image_urls.map((url: string, i: number) => (
                  <div key={i} className="relative group">
                    <img src={url} alt="" className={`w-full transition-all duration-700 ${link.is_sold ? 'grayscale brightness-75' : 'grayscale hover:grayscale-0'}`} />
                    {link.is_sold && i === 0 && <SoldStamp />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'story': 
        return (
          <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black">
            {link.image_urls.map((url: string, i: number) => (
              <div key={i} className="h-screen w-full snap-start relative flex items-center justify-center">
                <img src={url} alt="" className={`h-full w-full object-cover ${link.is_sold ? 'grayscale' : ''}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {link.is_sold && <SoldStamp />}
                
                {/* Show Overlay Ad on 2nd slide only for FREE users */}
                {i === 1 && !link.is_pro && (
                  <div className="absolute top-20 left-0 w-full px-6">
                    <AdSlot type="overlay" />
                  </div>
                )}

                <div className="absolute bottom-28 left-8 text-white">
                  <h1 className="text-4xl font-black mb-1">{link.title}</h1>
                </div>
              </div>
            ))}
          </div>
        );

      default: 
        return (
          <div className="bg-slate-50 min-h-screen pb-40">
            <div className="max-w-md mx-auto relative">
              {/* Hero Image */}
              <div className="aspect-[4/5] w-full relative overflow-hidden">
                <img src={link.image_urls[0]} alt="" className={`w-full h-full object-cover transition-all ${link.is_sold ? 'grayscale brightness-50' : ''}`} />
                
                {link.is_sold && <SoldStamp />}

                {link.price && (
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-5 py-2 rounded-full shadow-2xl border border-slate-100">
                    <span className="font-black text-blue-600 text-lg tracking-tighter">{link.price}</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-8 space-y-6 bg-white rounded-t-[3rem] -mt-10 relative z-20 shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.1)]">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 leading-tight">{link.title}</h1>
                    {link.is_pro && (
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-1">
                        💎 Premium Verified
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase tracking-widest shrink-0">
                    👁️ {link.views || 0}
                  </span>
                </div>

                <AdSlot />

                <div className="grid grid-cols-2 gap-4 mt-8">
                  {link.image_urls.slice(1).map((url: string, i: number) => (
                    <img key={i} src={url} alt="" className={`rounded-3xl aspect-square object-cover shadow-xl border-4 border-white ${link.is_sold ? 'grayscale' : ''}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <main className="relative">
      {renderTemplate()}

      {/* WhatsApp Button */}
      {!link.is_sold && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xs px-4 z-50">
          <a 
            href={`https://wa.me/?text=Hi! I am interested in "${link.title}"`}
            className="flex items-center justify-center gap-3 bg-[#25D366] text-white py-4 rounded-full font-black shadow-2xl hover:scale-105 transition-transform active:scale-95"
          >
            <span className="text-xl">💬</span> Message Seller
          </a>
        </div>
      )}
    </main>
  );
}