import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Script from 'next/script'

// Fetch data from Supabase
async function getLinkData(id: string) {
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data
}

export default async function ViewLink({ params }: { params: { id: string } }) {
  const data = await getLinkData(params.id)

  if (!data) notFound()

  // SEO Description
  const shortDesc = data.description?.slice(0, 150) || "Check out this listing on Quick-Link"

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-32">
      {/* 1. Header */}
      <nav className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">Q</div>
            <h1 className="font-bold text-lg tracking-tight">Quick-Link</h1>
          </div>
          <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-bold px-2 py-1 rounded-full uppercase">
            Active Listing
          </span>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        {/* 2. Product Images */}
        <div className="space-y-4">
          {data.images && data.images.map((url: string, index: number) => (
            <div key={index} className="rounded-3xl overflow-hidden shadow-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <img 
                src={url} 
                alt={`${data.title} - view ${index + 1}`} 
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>

        {/* 3. Pricing and Title Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h2 className="text-2xl font-extrabold tracking-tight leading-tight">
            {data.title || "Untitled Product"}
          </h2>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-600 dark:text-blue-400">
              ₹{data.price}
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
            {data.description || "No description provided."}
          </p>
        </div>

        {/* 4. AD UNIT (Only for Free Tier) */}
        {data.tier === 'free' && (
          <div className="py-6 border-y border-slate-200 dark:border-slate-800 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Advertisement</p>
            
            <div className="min-h-[100px] flex items-center justify-center bg-slate-100 dark:bg-slate-900/50 rounded-xl overflow-hidden">
               {/* Your Horizontal Ad Unit */}
               <ins className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client="ca-pub-9215034208801607"
                    data-ad-slot="6421609477"
                    data-ad-format="auto"
                    data-full-width-responsive="true"></ins>
               <Script 
                 id="adsense-unit-push"
                 strategy="afterInteractive"
                 dangerouslySetInnerHTML={{ 
                   __html: '(window.adsbygoogle = window.adsbygoogle || []).push({});' 
                 }} 
               />
            </div>
          </div>
        )}

        {/* 5. Seller & Safety Info */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center font-bold text-blue-500">
              {data.seller_name?.[0] || 'S'}
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Seller</p>
              <p className="font-bold">{data.seller_name || "Private Seller"}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30">
            <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
              💡 <strong>Safety Tip:</strong> Always meet in public places and inspect the item before paying the seller.
            </p>
          </div>
        </div>

        {/* 6. Footer Links */}
        <footer className="pt-8 pb-4 text-center space-y-4">
          <p className="text-xs text-slate-500">Powered by Quick-Link &bull; Verified 2025</p>
          <div className="flex justify-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <a href="/privacy-policy">Privacy</a>
            <span>&bull;</span>
            <a href="/terms">Terms</a>
            <span>&bull;</span>
            <button className="text-red-400">Report Listing</button>
          </div>
        </footer>
      </main>

      {/* 7. Sticky Contact Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 z-50">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <div className="hidden sm:block">
            <p className="text-xs text-slate-500 font-bold uppercase">Price</p>
            <p className="text-xl font-black">₹{data.price}</p>
          </div>
          <a 
            href={`https://wa.me/${data.phone}?text=${encodeURIComponent(`Hi, I saw your listing "${data.title}" on Quick-Link. Is it still available?`)}`}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl text-center shadow-lg shadow-green-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            Contact Seller
          </a>
        </div>
      </div>
    </div>
  )
}