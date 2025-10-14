import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

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

const FAQPage = () => {
  useEffect(() => {
    setMeta(
      'Frequently Asked Questions',
      'Answers to common questions about Trip&Treat: accounts, bookings, hosts, AI features, privacy, and future plans.'
    );
  }, []);

  const faqs = [
    {
      q: 'What is Trip&Treat?',
      a:
        'Trip&Treat is a web platform that helps travelers discover and book authentic homestays in Northeast India, especially Manipur. It also connects you to nearby tourist spots, local eateries, and experiences to make your stay memorable.',
    },
    {
      q: 'How do I access Trip&Treat?',
      a: 'You can access Trip&Treat via https://trip-treat.vercel.app/ on any device — it’s fully responsive.',
    },
    {
      q: 'Do I need an account to use Trip&Treat?',
      a: 'Yes, creating an account allows you to book stays, save favorites, and manage your profile.',
    },
    {
      q: 'Who can create an account?',
      a: 'Users aged 13+ can create accounts. Hosts must be at least 18 years old.',
    },
    {
      q: 'How do I reset my password?',
      a: 'Click on “Forgot Password” on the login page and follow the instructions sent to your registered email.',
    },
    {
      q: 'Can I become a host on Trip&Treat?',
      a: 'Yes! Hosts can list properties and experiences. Please follow our Hosting Guidelines to ensure a safe and professional listing.',
    },
    {
      q: 'How are bookings confirmed?',
      a: 'Properties may offer Instant Booking (immediate confirmation) or Request Booking (host approval required).',
    },
    {
      q: 'What if a host cancels my booking?',
      a: 'Hosts are required to avoid cancellations except in emergencies. Trip&Treat will assist affected guests with alternatives whenever possible.',
    },
    {
      q: 'Does Trip&Treat use AI for itineraries?',
      a: 'Yes, we provide AI-powered itinerary and content suggestions. These are for convenience and may not always be 100% accurate. Users should review suggestions before relying on them.',
    },
    {
      q: 'What information does Trip&Treat collect?',
      a: 'We collect your Name, Email, Cookies, and Analytics data. User-generated content like reviews and photos may also be stored.',
    },
    {
      q: 'How is my data used?',
      a: 'Data helps us improve the platform, communicate updates, provide personalized recommendations, and ensure safety.',
    },
    {
      q: 'Can I request my data to be deleted?',
      a: 'Yes, contact support@triptreat.com to request deletion or updates to your personal data.',
    },
    {
      q: 'Are the homestays verified?',
      a: 'Hosts are responsible for providing accurate property information. Trip&Treat is a platform and does not directly manage properties.',
    },
    {
      q: 'How do I report issues or unsafe situations?',
      a: 'Use your Host Dashboard report system (coming soon) or email us at support@triptreat.com.',
    },
    {
      q: 'Will Trip&Treat handle payments in the future?',
      a: 'Currently, Trip&Treat does not process payments. When enabled, we will provide clear payout and payment policies for hosts and users.',
    },
    {
      q: 'Can I suggest new features?',
      a: 'Absolutely! Submit your ideas via our Contact page or open a feature request on our platform.',
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <header className="bg-white py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-black">Frequently Asked Questions</h1>
          <p className="mt-2 text-black/60">Last Updated: 13 October 2025</p>
        </div>
      </header>
      <main className="container mx-auto px-4 py-10 max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((item, idx) => (
            <AccordionItem value={`item-${idx + 1}`} key={idx}>
              <AccordionTrigger className="text-left text-base md:text-lg">
                {item.q}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">{item.a}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
      <Footer />
    </div>
  );
};

export default FAQPage;
