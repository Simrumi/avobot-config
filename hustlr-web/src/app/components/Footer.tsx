import Link from "next/link";
import { Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { label: "Web Development", href: "#services" },
      { label: "Social Media", href: "#services" },
      { label: "Content Creation", href: "#services" },
      { label: "Performance Marketing", href: "#services" },
    ],
    company: [
      { label: "About Us", href: "#about" },
      { label: "Our Work", href: "#clients" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#contact" },
    ],
    social: [
      { label: "LinkedIn", href: "#", icon: Linkedin },
      { label: "Instagram", href: "#", icon: Instagram },
      { label: "Twitter", href: "#", icon: Twitter },
      { label: "YouTube", href: "#", icon: Youtube },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <img 
                src="/hustlr-logo.jpg" 
                alt="HUSTLR" 
                className="h-12 w-auto rounded"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Strategic digital marketing that drives measurable growth. We turn brands into movements.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4">
              {footerLinks.social.map((item, index) => {
                const Icon = item.icon;
                return (
                  <a
                    key={index}
                    href={item.href}
                    aria-label={item.label}
                    className="w-10 h-10 bg-[#E8524A] flex items-center justify-center hover:bg-white hover:text-[#E8524A] transition-all rounded"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-[#E8524A]">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[#E8524A] transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-[#E8524A]">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[#E8524A] transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-[#E8524A]">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">
              Get the latest insights on digital marketing and growth strategies.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#E8524A] transition-colors rounded-l"
              />
              <button
                type="submit"
                className="px-4 py-3 bg-[#E8524A] text-white font-semibold text-sm hover:bg-[#d14a43] transition-colors rounded-r"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            {currentYear} HUSTLR. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-[#E8524A] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-[#E8524A] transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
