import { LegalLayout } from '../legal-layout';

export default function Refund() {
  return (
    <LegalLayout title="Refund Policy">
      <h2 className="text-white font-bold text-lg mt-4">1. Digital Nature of Service</h2>
      <p>Quick-Link Pro is a digital product that is activated immediately upon successful payment. Because the service is consumed instantly, we <strong>do not offer refunds</strong> once a Pro link has been generated.</p>
      <h2 className="text-white font-bold text-lg mt-4">2. Technical Failures</h2>
      <p>If you have paid but your link was not upgraded to Pro due to a technical error, please contact us with your payment ID, and we will manually upgrade your account within 24 hours.</p>
    </LegalLayout>
  );
}