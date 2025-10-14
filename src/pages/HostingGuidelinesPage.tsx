import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';

const setMeta = (title: string, description: string) => {
  document.title = title;
  let tag = document.querySelector('meta[name="description"]');
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', 'description');
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', description);
};

const HostingGuidelinesPage = () => {
  useEffect(() => {
    setMeta(
      'Hosting Guidelines',
      'Responsibilities and expectations for hosts listing homestays or experiences on Trip&Treat, including safety, conduct, and listing requirements.'
    );
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      <header className="bg-white py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-black">Hosting Guidelines</h1>
          <p className="mt-2 text-black/60">Last Updated: 13 October 2025</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-3xl">
        <p className="text-muted-foreground">
          Welcome to Trip&Treat! These Hosting Guidelines explain the responsibilities and expectations for hosts offering homestays or experiences on our platform. By creating a host account and listing your property, you agree to follow these guidelines along with our Terms & Conditions.
        </p>

        <Separator className="my-6" />

        <h2 id="eligibility" className="text-2xl font-semibold mt-8 mb-3">1. Eligibility to Host</h2>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Be at least 18 years old</li>
          <li>Provide accurate identity and contact information</li>
          <li>Be the owner or authorized manager of the property</li>
          <li>Comply with local housing, tourism, and rental regulations</li>
        </ul>

        <h2 id="listing-requirements" className="text-2xl font-semibold mt-8 mb-3">2. Listing Requirements</h2>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Property details are accurate and complete</li>
          <li>Photos reflect the actual property</li>
          <li>Pricing, amenities, and availability are updated regularly</li>
          <li>House rules are mentioned clearly</li>
          <li>Location and safety information are accurate</li>
        </ul>

        <h2 id="safety" className="text-2xl font-semibold mt-8 mb-3">3. Guest Safety & Cleanliness</h2>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Maintain clean and hygienic rooms</li>
          <li>Ensure safe water and electricity supply</li>
          <li>Provide emergency contact numbers</li>
          <li>Highlight any safety risks in or around the property</li>
          <li>Install basic safety measures (locks, first-aid, ventilation)</li>
        </ul>

        <h2 id="conduct" className="text-2xl font-semibold mt-8 mb-3">4. Host Conduct</h2>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Treat guests with respect and professionalism</li>
          <li>Respond to guest inquiries promptly</li>
          <li>Not cancel bookings without valid reasons</li>
          <li>
            Avoid discrimination based on religion, caste, gender, nationality, etc.
          </li>
          <li>Communicate clearly with guests about check-in and house rules</li>
        </ul>

        <h2 id="prohibited" className="text-2xl font-semibold mt-8 mb-3">5. Prohibited Content & Activities</h2>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Upload false, illegal, or misleading information</li>
          <li>Engage in harassment or abusive behavior</li>
          <li>Offer unsafe or unauthorized spaces</li>
          <li>Post copyrighted images without permission</li>
          <li>Promote illegal activities</li>
          <li>Host harmful or offensive content</li>
        </ul>

        <h2 id="reviews" className="text-2xl font-semibold mt-8 mb-3">6. Reviews & Ratings</h2>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Reviews must be honest and respectful</li>
          <li>Fake or manipulated reviews are strictly prohibited</li>
          <li>Trip&Treat may remove unfair or abusive reviews</li>
        </ul>

        <h2 id="suspension" className="text-2xl font-semibold mt-8 mb-3">7. Listing Suspension or Removal</h2>
        <p className="text-muted-foreground">Trip&Treat reserves the right to suspend or remove listings if:</p>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Fake information is provided</li>
          <li>Multiple guest complaints are received</li>
          <li>Host violates safety standards</li>
          <li>Illegal or unethical activity is reported</li>
          <li>Platform rules are ignored after warnings</li>
        </ul>

        <h2 id="cancellation" className="text-2xl font-semibold mt-8 mb-3">8. Host Cancellation Policy (Strict)</h2>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Hosts must not cancel confirmed bookings except in emergencies</li>
          <li>Hosts must notify Trip&Treat immediately if cancellation is unavoidable</li>
          <li>Repeated cancellations may lead to account suspension or removal</li>
          <li>Guests affected by cancellations may receive priority support or alternative accommodations</li>
        </ul>

        <h2 id="damage" className="text-2xl font-semibold mt-8 mb-3">9. Guest Damage & Liability</h2>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Hosts are responsible for reporting any damages caused by guests</li>
          <li>Guests are liable for damage to property or belongings</li>
          <li>
            Trip&Treat acts as a platform and does not assume responsibility for guest or host property damages
          </li>
        </ul>

        <h2 id="safety-req" className="text-2xl font-semibold mt-8 mb-3">10. Safety Requirements</h2>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Smoke detectors and fire safety equipment are recommended</li>
          <li>First aid kits should be available</li>
          <li>Hosts must clearly communicate emergency exits and procedures</li>
          <li>Electrical and plumbing systems should be safe and functional</li>
        </ul>

        <h2 id="payouts" className="text-2xl font-semibold mt-8 mb-3">11. Payouts & Earnings Policy (Future-Proof)</h2>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Currently, Trip&Treat does not process payments</li>
          <li>When payments are enabled, hosts will be notified and provided clear payout terms</li>
          <li>Trip&Treat will provide guidance on payout schedules, taxes, and fees</li>
        </ul>

        <h2 id="booking-types" className="text-2xl font-semibold mt-8 mb-3">12. Instant Booking vs Request Booking</h2>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>
            <strong>Instant Booking:</strong> Some properties may allow immediate booking without host approval
          </li>
          <li>
            <strong>Request Booking:</strong> Other properties require host confirmation before the booking is confirmed
          </li>
          <li>Hosts must clearly set which booking type applies to each listing</li>
        </ul>

        <h2 id="ai-disclaimer" className="text-2xl font-semibold mt-8 mb-3">13. AI-Generated Content Disclaimer</h2>
        <p className="text-muted-foreground">
          Trip&Treat may offer AI-powered features such as auto descriptions or itinerary suggestions in the future. These are provided for convenience and may not always be accurate. Hosts must review and edit AI-generated content before publishing.
        </p>

        <h2 id="legal" className="text-2xl font-semibold mt-8 mb-3">14. Legal Responsibility</h2>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Local taxes, permits, or licenses</li>
          <li>Safety compliance</li>
          <li>Guest safety during stay</li>
          <li>Damages occurring on their property</li>
        </ul>
        <p className="text-muted-foreground">Trip&Treat is a platform provider only and does not control or manage host properties.</p>

        <h2 id="support" className="text-2xl font-semibold mt-8 mb-3">15. Reporting & Support</h2>
        <p className="text-muted-foreground">
          If you face any issues as a host, please contact us via: Email: <a href="mailto:support@triptreat.com">support@triptreat.com</a>
        </p>
        <p>Report system in your Host Dashboard (coming soon)</p>
      </main>

      <Footer />
    </div>
  );
};

export default HostingGuidelinesPage;
