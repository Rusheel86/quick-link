import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Script from 'next/script'

export const dynamic = 'force-dynamic';

async function getLinkData(id: string) {
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data
}

export default async function ViewLink({ params }: { params: Promise<{ id: string }> }) {
  // NEXT.JS 15 FIX: Await the params
  const resolvedParams = await params;
  const data = await getLinkData(resolvedParams.id)

  if (!data) notFound()

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
            {data.is_sold ? 'Sold Out' : 'Active Listing'}
          </span>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        {/* 2. Product Images (Using your 'image_urls' field) */}
        <div className="space-y-4">
          {data.image_urls && data.image_urls.map((url: string, index: number) => (
            // Only show if it's actually an image (filtering out the .docx/.txt files Cloudinary uploaded)
            (url.match(/\.(jpeg|jpg|gif|png|webp)$/i)) && (
              <div key={index} className="rounded-3xl overflow-hidden shadow-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <img 
                  src={url} 
                  alt={`${data.title} - view ${index + 1}`} 
                  className="w-full h-auto object-cover"
                />
              </div>
            )
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
          {data.description && (
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-wrap pt-2">
              {data.description}
            </p>
          )}
        </div>

        {/* 4. AD UNIT (Shows if is_pro is false) */}
        {!data.is_pro && (
          <div className="py-6 border-y border-slate-200 dark:border-slate-800 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Advertisement</p>
            <div className="min-h-[100px] flex items-center justify-center bg-slate-100 dark:bg-slate-900/50 rounded-xl overflow-hidden">
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

        {/* 5. Seller Details */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center font-bold text-blue-500">
            {data.seller_name?.[0] || 'S'}
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Seller</p>
            <p className="font-bold">{data.seller_name || "Verified Seller"}</p>
          </div>
        </div>
      </main>

      {/* 6. Sticky Contact Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 z-50">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <div className="flex-1">
            <p className="text-[10px] uppercase font-bold text-slate-500">Price</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">₹{data.price}</p>
          </div>
          <a 
            href={`https://wa.me/${data.phone || ''}?text=${encodeURIComponent(`Hi, I'm interested in "${data.title}" on Quick-Link.`)}`}
            className="flex-[2] bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl text-center shadow-lg shadow-green-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Contact Seller
          </a>
        </div>
      </div>
    </div>
  )
}