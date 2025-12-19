# ⚡ Quick-Link 
[![Live Demo](https://img.shields.io/badge/demo-live-green?style=for-the-badge)](https://quick-links-teal.vercel.app/)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-blue?style=for-the-badge&logo=supabase)](https://supabase.com/)

**Quick-Link** is a high-speed marketplace and portfolio engine. Create professional, mobile-optimized landing pages with integrated AdSense revenue and QR code support in under 60 seconds.

---

## 🌟 Key Features

* **⚡ Instant Generation:** Go from zero to a live link in seconds.
* **📱 Mobile-First Design:** Optimized for WhatsApp sharing and social media browsing.
* **🖼️ Professional Templates:**
    * 🛍️ **Marketplace:** Clean product listings with price tags and WhatsApp CTAs.
    * 🖼️ **Minimal:** A sleek gallery for creators and photographers.
    * 📖 **Story:** Vertical, immersive layout for high-impact viewing.
* **🏁 QR Code Engine:** Automated QR generation for every link—perfect for physical product tags.
* **💰 AdSense Integration:** Built-in ad slots for Free tier users to monetize traffic automatically.
* **💎 Tiered Ecosystem:**
    * **Free:** Ad-supported, 5-photo limit, standard SEO.
    * **Pro (₹499):** Ad-free, 10 high-res photos, "Sold/Inactive" status toggles, and premium analytics.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) (Full Dark/Light Support) |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL + Auth) |
| **Storage** | [Cloudinary](https://cloudinary.com/) (CDN-optimized images) |
| **Payments** | [Razorpay India](https://razorpay.com/) |
| **Monetization** | [Google AdSense](https://adsense.google.com/) |

---

## 📂 Project Structure

```text
├── app/
│   ├── view/[id]/     # Dynamic product viewing routes (Next.js 15)
│   ├── layout.tsx     # Global AdSense & Meta configuration
│   └── page.tsx       # Link generation dashboard
├── lib/
│   └── supabase.js    # Database client configuration
└── public/            # Static assets and icons
🚀 Local Installation & Setup
Clone the repo:

Bash

git clone [https://github.com/Rusheel86/quick-link.git](https://github.com/Rusheel86/quick-link.git)
cd quick-link
Install dependencies:

Bash

npm install
Configure Environment Variables: Create a .env.local file:

Code snippet

NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_name
Launch:

Bash

npm run dev
⚖️ Legal & Compliance
This project is built to comply with Indian digital regulations and payment gateway requirements.

Privacy Policy

Terms & Conditions

Refund Policy

🤝 Support
Created by Rusheel. 
LinkedIn : https://www.linkedin.com/in/rusheel-sharma/
For inquiries or support, please reach out via: 📧 Email: rusheelhere@gmail.com 🌐 Website: Quick-Link Live