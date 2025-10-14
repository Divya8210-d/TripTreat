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

const PrivacyPolicyPage = () => {
  useEffect(() => {
    setMeta(
      'Privacy Policy',
      'How Trip&Treat collects, uses, and protects data, including personal information, cookies, analytics, and user rights.'
    );
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <header className="bg-white py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-black">Privacy Policy</h1>
          <p className="mt-2 text-black/60">Last Updated: 13 October 2025</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-3xl">
        <p className="text-muted-foreground">
          At Trip&Treat, your privacy is important to us. This Privacy Policy explains what information we collect, how we use it, how we protect it, and your rights regarding your personal data. By using our website https://trip-treat.vercel.app/, you agree to this Privacy Policy.
        </p>

        <Separator className="my-6" />

        <h2 className="text-2xl font-semibold mt-8 mb-3">1. Information We Collect</h2>
        <h3 className="text-xl font-semibold mt-4">a. Personal Information</h3>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Name</li>
          <li>Email address</li>
        </ul>
        <h3 className="text-xl font-semibold mt-4">b. Technical Information</h3>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Cookies and usage data</li>
          <li>Analytics data (browser, device, location, interactions)</li>
        </ul>
        <h3 className="text-xl font-semibold mt-4">c. User-Generated Content</h3>
        <p className="text-muted-foreground">Reviews, comments, photos, and listings submitted by hosts or users</p>
        <h3 className="text-xl font-semibold mt-4">d. AI Features (Optional)</h3>
        <p className="text-muted-foreground">
          If you use AI-powered itinerary or content features, your input may be processed for generating suggestions
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">2. How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Provide and improve our services</li>
          <li>Communicate with users about bookings, updates, or support</li>
          <li>Analyze website usage for better experience and performance</li>
          <li>Personalize content and recommendations</li>
          <li>Ensure platform safety and prevent fraud or abuse</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-3">3. Cookies & Analytics</h2>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Trip&Treat uses cookies to store preferences and improve functionality</li>
          <li>Analytics tools may track user behavior to enhance the website</li>
          <li>You can disable cookies via your browser, but some features may not work</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-3">4. Data Sharing & Third Parties</h2>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Trip&Treat does not sell your data</li>
          <li>
            We may share data with trusted service providers for hosting, analytics, and AI features
          </li>
          <li>Third-party integrations (e.g., AI or maps) are bound by their own privacy policies</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-3">5. Children’s Privacy</h2>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Trip&Treat is intended for users 13 years and older</li>
          <li>We do not knowingly collect personal data from children under 13</li>
          <li>If we discover that a child under 13 has provided personal data, we will delete it</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-3">6. AI-Powered Features Disclaimer</h2>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>AI-generated itineraries or content are provided for convenience</li>
          <li>Accuracy cannot be guaranteed</li>
          <li>Users should review AI-generated suggestions before acting on them</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-3">7. Data Security</h2>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>We implement technical and organizational measures to protect data</li>
          <li>Data is stored securely using Supabase backend</li>
          <li>No system is 100% secure; we cannot guarantee absolute protection</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-3">8. Your Rights</h2>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Access your personal data</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your data</li>
          <li>Opt out of analytics tracking</li>
        </ul>
        <p className="text-muted-foreground">To exercise these rights, please contact: support@triptreat.com</p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">9. Changes to Privacy Policy</h2>
        <p className="text-muted-foreground">
          Trip&Treat may update this policy occasionally. Changes will be posted on this page with a revised “Last Updated” date. Continued use of the website after changes constitutes acceptance.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">10. Contact</h2>
        <p className="text-muted-foreground">
          For any questions or concerns about privacy, reach out to us at: Email: <a href="mailto:support@triptreat.com">support@triptreat.com</a>
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
