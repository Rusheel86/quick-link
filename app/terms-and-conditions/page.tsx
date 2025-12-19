import { LegalLayout } from '../legal-layout';

export default function Terms() {
  return (
    <LegalLayout title="Terms & Conditions">
      <p>By using Quick-Link, you agree to the following terms:</p>
      <h2 className="text-white font-bold text-lg mt-4">1. Content Usage</h2>
      <p>You are responsible for the images and titles you upload. Any content that is illegal, pornographic, or promotes hate speech will be deleted without a refund.</p>
      <h2 className="text-white font-bold text-lg mt-4">2. Service Availability</h2>
      <p>While we strive for 99.9% uptime, we are not liable for temporary service interruptions. Pro links are valid for the lifetime of the application unless otherwise specified.</p>
    </LegalLayout>
  );
}