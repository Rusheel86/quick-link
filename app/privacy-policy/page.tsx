import { LegalLayout } from '../legal-layout';

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy">
      <p>Effective Date: December 2025</p>
      <p>At Quick-Link, we respect your privacy. We only collect information necessary to provide our services.</p>
      <h2 className="text-white font-bold text-lg mt-4">1. Information We Collect</h2>
      <p>We collect your name, email address, and payment confirmation details through Razorpay. Images uploaded are stored securely on Cloudinary.</p>
      <h2 className="text-white font-bold text-lg mt-4">2. How We Use Data</h2>
      <p>Your data is used solely to generate your custom links and manage your Pro subscription. We do not sell or share your data with third parties for marketing purposes.</p>
    </LegalLayout>
  );
}