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

const TermsPage = () => {
  useEffect(() => {
    setMeta(
      'Terms & Conditions',
      'Rules and legal terms for using the Trip&Treat platform, including eligibility, account responsibilities, content, and liability.'
    );
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <header className="bg-white py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-black">Terms & Conditions</h1>
          <p className="mt-2 text-black/60">Last Updated: 13 October 2025</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-3xl">
        <p className="text-muted-foreground">
          Welcome to Trip&Treat! By accessing or using our website https://trip-treat.vercel.app/, you agree to these Terms & Conditions. If you do not agree, please do not use our services. These Terms apply to all users, hosts, and visitors.
        </p>

        <Separator className="my-6" />

        <h2 className="text-2xl font-semibold mt-8 mb-3">1. Eligibility</h2>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Users must be at least 13 years old</li>
          <li>Hosts must be at least 18 years old</li>
          <li>Users must provide accurate information when creating accounts</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-3">2. Account Responsibilities</h2>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Keep your account credentials secure</li>
          <li>You are responsible for all activity under your account</li>
          <li>Notify Trip&Treat immediately of unauthorized use</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-3">3. User-Generated Content</h2>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Users may submit reviews, comments, photos, and listings</li>
          <li>You retain ownership of your content but grant Trip&Treat a license to display it</li>
          <li>Do not post content that is illegal, abusive, misleading, or copyrighted without permission</li>
          <li>Trip&Treat may remove content that violates these rules</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-3">4. AI-Powered Features</h2>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Trip&Treat may offer AI-powered suggestions, content, or itineraries</li>
          <li>AI output is for convenience only and may not always be accurate</li>
          <li>Users are responsible for reviewing and verifying AI-generated content</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-3">5. Payments & Transactions</h2>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Currently, Trip&Treat does not process payments</li>
          <li>
            If payments are added in the future, they will be governed by a separate Payment Policy
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-3">6. Prohibited Activities</h2>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Violate any laws or regulations</li>
          <li>Attempt to hack or interfere with Trip&Treat systems</li>
          <li>Submit fraudulent, abusive, or harmful content</li>
          <li>Impersonate others or misrepresent identity</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-3">7. Intellectual Property</h2>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>All content on Trip&Treat, including logos, graphics, and website design, is owned by Trip&Treat or its licensors</li>
          <li>Users may not copy, distribute, or modify any content without permission</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-3">8. Limitation of Liability</h2>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Trip&Treat is a platform provider only</li>
          <li>
            We are not responsible for host properties, user behavior, or any damages arising from bookings or listings
          </li>
          <li>Use the website at your own risk</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-3">9. Indemnification</h2>
        <p className="text-muted-foreground">
          You agree to indemnify and hold Trip&Treat harmless from claims, damages, or losses arising from your use of the website or violation of these Terms & Conditions or any applicable laws.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">10. Termination</h2>
        <p className="text-muted-foreground">
          Trip&Treat may suspend or terminate accounts for violations of these Terms. Hosts or users who repeatedly violate rules may be permanently removed.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">11. Governing Law</h2>
        <p className="text-muted-foreground">
          These Terms are governed by Indian law. Any disputes will be resolved under the jurisdiction of Indian courts.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">12. Changes to Terms</h2>
        <p className="text-muted-foreground">
          Trip&Treat may update these Terms occasionally. Updates will be posted on this page with a new “Last Updated” date. Continued use of the website constitutes acceptance of updated Terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">13. Contact</h2>
        <p className="text-muted-foreground">
          For questions or concerns about these Terms & Conditions, contact us: Email: <a href="mailto:support@triptreat.com">support@triptreat.com</a>
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;
