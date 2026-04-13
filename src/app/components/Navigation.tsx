"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#services", label: "Services" },
    { href: "#clients", label: "Clients" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className={`font-black tracking-tighter transition-all duration-300 ${isScrolled ? 'text-xl text-[#E8524A]' : 'text-2xl text-white'}`}>
              HUSTLR
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors uppercase tracking-wide ${
                  isScrolled 
                    ? "text-gray-700 hover:text-[#E8524A]" 
                    : "text-white hover:text-white/80"
                }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className={`px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors ${
                isScrolled
                  ? "bg-[#E8524A] text-white hover:bg-[#d14a43]"
                  : "bg-white text-[#E8524A] hover:bg-white/90"
              }`}
            >
              Start Project
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span
                className={`w-full h-0.5 transition-all duration-300 ${
                  isScrolled ? "bg-[#E8524A]" : "bg-white"
                } ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`w-full h-0.5 transition-all duration-300 ${
                  isScrolled ? "bg-[#E8524A]" : "bg-white"
                } ${isMobileMenuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`w-full h-0.5 transition-all duration-300 ${
                  isScrolled ? "bg-[#E8524A]" : "bg-white"
                } ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 bg-[#E8524A] z-40 transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ top: "80px" }}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8 pb-20">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-2xl font-semibold text-white uppercase tracking-wide"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="bg-white text-[#E8524A] px-8 py-4 text-lg font-semibold uppercase tracking-wide rounded"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Start Project
          </a>
        </div>
      </div>
    </nav>
  );
}
