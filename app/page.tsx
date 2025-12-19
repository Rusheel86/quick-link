"use client";
import Script from 'next/script';
import { CldUploadWidget } from 'next-cloudinary';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { QRCodeSVG } from 'qrcode.react';

export default function Home() {
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [template, setTemplate] = useState("marketplace");
  const [tier, setTier] = useState("free"); // 'free' or 'pro'
  const [linkId, setLinkId] = useState<string | null>(null);
  const [isSold, setIsSold] = useState(false);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  
  const qrRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const downloadQR = () => {
    const svg = qrRef.current;
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QR-${title || 'link'}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleAction = async () => {
    if (images.length === 0 || !title) return alert("Please add at least one photo and a title!");
    if (tier === 'pro') {
      await handleProPayment();
    } else {
      await handleFreeSave();
    }
  };

  const handleFreeSave = async () => {
    setLoading(true);
    const finalPrice = template === 'marketplace' ? price : "";
    const { data, error } = await supabase
      .from('links')
      .insert([{ 
        title, 
        price: finalPrice, 
        image_urls: images, 
        template_type: template,
        is_pro: false 
      }])
      .select().single();

    setLoading(false);
    if (!error) setLinkId(data.id);
    else alert("Error creating free link.");
  };

  const handleProPayment = async () => {
    if (!(window as any).Razorpay) {
      return alert("Payment gateway is loading...");
    }

    setLoading(true);

    const finalPrice = template === 'marketplace' ? price : "";
    const { data: link, error } = await supabase
      .from('links')
      .insert([{ 
        title, 
        price: finalPrice, 
        image_urls: images, 
        template_type: template,
        is_pro: false 
      }])
      .select().single();

    if (error) {
      setLoading(false);
      return alert("Failed to initialize link.");
    }

    const options = {
      key: "rzp_test_PASTE_YOUR_KEY_HERE", // Replace this after deploying & getting verified
      amount: 49900, 
      currency: "INR",
      name: "Quick-Link Pro",
      description: "Ad-free Portfolio + 10 Photos",
      handler: async function (response: any) {
        const { error: updateError } = await supabase
          .from('links')
          .update({ is_pro: true })
          .eq('id', link.id);

        if (!updateError) {
          setLinkId(link.id);
          alert("Payment Successful! Your link is now PRO.");
        }
      },
      prefill: { name: "User", email: "user@example.com" },
      theme: { color: "#6366f1" },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
    setLoading(false);
  };

  const toggleSoldStatus = async () => {
    const newStatus = !isSold;
    const { error } = await supabase
      .from('links')
      .update({ is_sold: newStatus })
      .eq('id', linkId);
    if (!error) setIsSold(newStatus);
  };

  const fullUrl = typeof window !== 'undefined' && linkId ? `${window.location.origin}/view/${linkId}` : "";

  return (
    <main className={`min-h-screen w-full transition-colors duration-300 ${darkMode ? 'bg-[#0a0f1a] text-white' : 'bg-gray-50 text-slate-900'}`}>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      <div className="max-w-md mx-auto pt-8 px-4 pb-10">
        
        {/* TIER SELECTOR */}
        <div className="flex bg-slate-800/40 p-1.5 rounded-2xl mb-8 border border-slate-800 backdrop-blur-sm">
          <button 
            onClick={() => setTier('free')}
            className={`flex-1 py-2.5 text-[10px] font-black tracking-widest rounded-xl transition-all ${tier === 'free' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500'}`}
          >
            FREE (ADS)
          </button>
          <button 
            onClick={() => setTier('pro')}
            className={`flex-1 py-2.5 text-[10px] font-black tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${tier === 'pro' ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500'}`}
          >
            💎 PRO (₹499)
          </button>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black tracking-tighter italic">QUICK-LINK</h1>
          <button onClick={() => setDarkMode(!darkMode)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-xl border border-slate-700 shadow-xl">
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <div className={`p-8 rounded-[2.5rem] shadow-2xl space-y-6 border transition-all ${darkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-100'}`}>
          
          {/* Ad Slot - Visual cue for free tier */}
          {!linkId && tier === 'free' && (
            <div className="p-4 bg-blue-500/5 border border-dashed border-blue-500/20 rounded-2xl text-center">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400 mb-1">Sponsored</p>
              <div className="text-[11px] opacity-40 italic h-10 flex items-center justify-center">Ad Space Available</div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 ml-1">Title / Headline</label>
              <input 
                placeholder="Enter title..." 
                className={`w-full p-4 rounded-2xl mt-1 outline-none focus:ring-2 focus:ring-blue-500 transition ${darkMode ? 'bg-[#1f2937] text-white' : 'bg-gray-50 border-gray-200 border text-black'}`} 
                onChange={(e) => setTitle(e.target.value)} 
              />
            </div>

            {template === 'marketplace' && (
              <div className="animate-in fade-in zoom-in duration-300">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 ml-1">Price Tag</label>
                <input 
                  placeholder="e.g. ₹1,200" 
                  className={`w-full p-4 rounded-2xl mt-1 outline-none focus:ring-2 focus:ring-blue-500 transition ${darkMode ? 'bg-[#1f2937] text-white' : 'bg-gray-50 border-gray-200 border text-black'}`} 
                  onChange={(e) => setPrice(e.target.value)} 
                />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 ml-1 text-center block">Choose Template</label>
            <div className="grid grid-cols-3 gap-2">
              {['marketplace', 'minimal', 'story'].map((t) => (
                <button 
                  key={t} 
                  onClick={() => setTemplate(t)} 
                  className={`py-3 px-1 text-[9px] font-black uppercase rounded-xl border transition-all ${template === t ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-700 bg-slate-800/50 text-slate-400'}`}
                >
                  {t === 'marketplace' ? 'Shop' : t === 'minimal' ? 'Gallery' : 'Story'}
                </button>
              ))}
            </div>
          </div>

          <CldUploadWidget uploadPreset="ngru2tyd" onSuccess={(result: any) => setImages(prev => [...prev, result.info.secure_url])}>
            {({ open }) => (
              <button 
                onClick={() => open()} 
                className={`w-full text-white py-4 rounded-2xl font-bold transition shadow-lg ${tier === 'pro' ? 'bg-indigo-600' : 'bg-slate-700'}`}
              >
                📷 Upload Photos ({images.length}/{tier === 'pro' ? '10' : '5'})
              </button>
            )}
          </CldUploadWidget>

          {images.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {images.map((url, i) => (
                <img key={i} src={url} alt="" className="w-16 h-16 object-cover rounded-xl border-2 border-blue-500 shrink-0 shadow-lg" />
              ))}
            </div>
          )}

          <button 
            onClick={handleAction} 
            disabled={loading} 
            className={`w-full py-5 rounded-2xl font-black text-sm tracking-widest transition active:scale-95 shadow-xl ${tier === 'pro' ? 'bg-white text-indigo-600 border-2 border-indigo-100' : 'bg-white text-black'}`}
          >
            {loading ? "PROCESSING..." : tier === 'pro' ? "PAY & GENERATE PRO LINK" : "GENERATE FREE LINK"}
          </button>

          {linkId && (
            <div className={`mt-6 p-6 rounded-[2.5rem] text-white text-center animate-in slide-in-from-bottom-8 duration-500 shadow-2xl border-2 border-white/20 ${tier === 'pro' ? 'bg-indigo-600' : 'bg-blue-600'}`}>
              <div className="mb-6 pb-6 border-b border-white/10">
                <p className="text-[10px] font-black uppercase tracking-widest mb-3">Management</p>
                <button 
                  onClick={toggleSoldStatus}
                  className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${isSold ? 'bg-red-500' : 'bg-white text-slate-900'}`}
                >
                  {isSold ? '✅ Status: Sold' : '🏷️ Mark as Sold'}
                </button>
              </div>

              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="bg-white p-4 rounded-3xl shadow-2xl">
                  <QRCodeSVG ref={qrRef} value={fullUrl} size={150} level="H" includeMargin={true} />
                </div>
                <button onClick={downloadQR} className="text-[10px] font-bold underline underline-offset-4">📥 Download QR</button>
              </div>

              <div className="flex items-center gap-2 bg-black/20 p-3 rounded-2xl mb-4 backdrop-blur-md">
                <input readOnly value={fullUrl} className="flex-1 bg-transparent text-[10px] font-mono outline-none text-white truncate" />
                <button onClick={() => { navigator.clipboard.writeText(fullUrl); alert("Copied!"); }} className="bg-white text-blue-600 px-3 py-1 rounded-lg text-[10px] font-bold">COPY</button>
              </div>

              <a href={fullUrl} target="_blank" className="block w-full bg-white text-black py-4 rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition">Launch Site →</a>
            </div>
          )}
        </div>

        {/* REQUIRED LEGAL FOOTER FOR RAZORPAY */}
        <footer className="mt-12 py-8 border-t border-slate-800/50 flex flex-wrap justify-center gap-x-6 gap-y-3 px-4">
          <a href="/privacy-policy" className="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition">Privacy</a>
          <a href="/terms-and-conditions" className="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition">Terms</a>
          <a href="/refund-policy" className="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition">Refunds</a>
          <a href="/contact-us" className="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition">Contact</a>
        </footer>
        <p className="text-center text-[9px] opacity-20 mt-4 uppercase tracking-[0.2em]">© 2025 Quick-Link India</p>

      </div>
    </main>
  );
}