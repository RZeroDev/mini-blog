import { Link } from 'react-router-dom';
import { ArrowUp, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Button } from './ui/button';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const siteMapLinks = [
    { label: 'Accueil', path: '/' },
    { label: 'Articles', path: '/posts' },
    { label: 'Catégories', path: '/categories' },
    { label: 'À propos', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const legalLinks = [
    { label: 'Politique de confidentialité', path: '/privacy' },
    { label: 'Conditions d\'utilisation', path: '/terms' },
    { label: 'Mentions légales', path: '/legal' },
  ];

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  ];

  return (
    <footer className="bg-primary text-white mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand Section - Larger on desktop */}
          <div className="lg:col-span-6">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold tracking-wide">MINI-BLOG</span>
            </Link>
            <p className="text-white/80 text-sm mb-8 leading-relaxed max-w-md">
              Empowering physicians with advanced multi-modal tools to improve treatment 
              selection and patient outcomes.
            </p>

            {/* Social Links */}
            <div className="flex space-x-3 mb-8">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>

            {/* Back to Top Button */}
            <Button
              onClick={scrollToTop}
              variant="outline"
              className="border-white/30 text-black  hover:border-white/50"
              size="sm"
            >
              <ArrowUp size={16} className="mr-2" />
              BACK TO TOP
            </Button>
          </div>

          {/* Site Map */}
          <div className="lg:col-span-3">
            <h3 className="text-base font-semibold mb-6 text-white">Site Map</h3>
            <ul className="space-y-3">
              {siteMapLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-3">
            <h3 className="text-base font-semibold mb-6 text-white">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-black/20 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-white/60 text-xs">
            Copyright © {new Date().getFullYear()} MINI-BLOG. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
