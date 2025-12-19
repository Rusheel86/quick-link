import { LegalLayout } from '../legal-layout';

export default function Contact() {
  return (
    <LegalLayout title="Contact Us">
      <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-800">
        <p className="mb-4">For support, billing inquiries, or technical issues, please reach out to us:</p>
        <ul className="space-y-3">
          <li><strong>Business Name:</strong> Quick-Link India</li>
          <li><strong>Owner:</strong> Rusheel</li>
          <li><strong>Email:</strong> rusheelhere@gmail.com</li>
          <li><strong>Operating Address:</strong> Mumbai, Maharashtra, India</li>
        </ul>
      </div>
    </LegalLayout>
  );
}