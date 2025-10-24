import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Send,
  Github,
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-white">
      <div className="container mx-auto py-12 px-4">
        {/* Newsletter */}
        <div className="max-w-3xl mx-auto mb-16">
          <h3 className="text-2xl font-semibold mb-2 text-center">
            Join Our Newsletter
          </h3>
          <p className="text-white/80 text-center mb-6">
            Stay updated with the latest homestays, tours, and cultural
            experiences in Manipur
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow p-3 rounded-md text-foreground focus:outline-none"
            />
            <Button className="bg-primary hover:bg-primary/90">
              <Send size={16} className="mr-2" /> Subscribe
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h4 className="text-xl font-bold mb-4">
              Trip<span className="text-secondary">&</span>Treat
            </h4>
            <p className="text-white/80 mb-4">
              Connecting travelers with authentic Manipuri experiences,
              homestays, and local guides since 2019.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-white/80 hover:text-white transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-white transition-colors"
              >
                <Youtube size={20} />
              </a>
            </div>
              {/* GitHub Star link */}
  <div className="mt-4">
    <a
      href="https://github.com/Lanthoiba2022/TripTreat"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 border border-white/30 rounded-lg px-4 py-2 text-white/80 hover:text-white hover:border-white transition-colors"
  >      
  ⭐ Star us on <Github size={20} />
    </a>
  </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Discover</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/homestays"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Homestays
                </Link>
              </li>
              <li>
                <Link
                  to="/tours"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Tours & Packages
                </Link>
              </li>
              <li>
                <Link
                  to="/experiences"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Local Experiences
                </Link>
              </li>
              <li>
                <Link
                  to="/eateries"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Eateries
                </Link>
              </li>
              <li>
                <Link
                  to="/hotspots"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Tourist Hotspots
                </Link>
              </li>
            </ul>
          </div>

          {/* Host */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Host</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/become-host"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Become a Host
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/host-guidelines"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Hosting Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 flex-shrink-0" />
                <span className="text-white/80">
                  123 Tourism Road, Imphal East, Manipur, India - 795001
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 flex-shrink-0" />
                <span className="text-white/80">+91 9876543210</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 flex-shrink-0" />
                <span className="text-white/80">info@tripandtreat.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/20 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 mb-4 md:mb-0 order-1">
            &copy; {new Date().getFullYear()} Trip & Treat. All rights reserved.
          </p>

          <div className="flex space-x-6 order-2 md:order-3">
            <Link
              to="/privacy-policy"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Terms & Conditions
            </Link>
            <Link
              to="/faq"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              FAQs
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
