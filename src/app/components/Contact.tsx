"use client";

import { useState } from "react";
import { ArrowRight, Mail, MapPin, Send } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    budget: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="py-32 bg-[#E8524A] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-4 block">
            Start Your AI Journey
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            LET&apos;S FIND YOUR
            <br />
            <span className="text-white/70">BIGGEST AI WIN</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Book a free AI audit — we&apos;ll show you exactly where AI can
            save you time and money, with no obligation.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="bg-white text-black p-8 md:p-12 rounded-lg shadow-2xl">
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#E8524A] text-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Message Sent!</h3>
                <p className="text-gray-600">
                  We&apos;ll be in touch soon to discuss your project.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold uppercase tracking-wide mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-[#E8524A] focus:outline-none transition-colors rounded"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold uppercase tracking-wide mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-[#E8524A] focus:outline-none transition-colors rounded"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold uppercase tracking-wide mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-[#E8524A] focus:outline-none transition-colors rounded"
                      placeholder="Your Company"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold uppercase tracking-wide mb-2">
                      Service Interested In
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-[#E8524A] focus:outline-none transition-colors bg-white rounded"
                    >
                      <option value="">Select a service</option>
                      <option value="agents">Custom AI Agents</option>
                      <option value="automation">AI Workflow Automation</option>
                      <option value="consulting">AI Consulting & Strategy</option>
                      <option value="apps">AI App Development</option>
                      <option value="unsure">Not Sure — Help Me Decide</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold uppercase tracking-wide mb-2">
                    Project Budget (Monthly)
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-[#E8524A] focus:outline-none transition-colors bg-white rounded"
                  >
                    <option value="">Select budget range</option>
                    <option value="5k-15k">RM5,000 - RM15,000</option>
                    <option value="15k-30k">RM15,000 - RM30,000</option>
                    <option value="30k-50k">RM30,000 - RM50,000</option>
                    <option value="50k+">RM50,000+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold uppercase tracking-wide mb-2">
                    Project Details *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-[#E8524A] focus:outline-none transition-colors resize-none rounded"
                    placeholder="Tell us about your goals, challenges, and what success looks like..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#E8524A] text-white py-4 font-bold uppercase tracking-widest hover:bg-[#d14a43] transition-colors flex items-center justify-center gap-3 disabled:opacity-50 rounded"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
              <p className="text-white/70 leading-relaxed mb-4">
                Whether you have a specific project in mind or just want to explore
                what AI can do for your business, we&apos;d love to hear from you.
              </p>
              <p className="text-white/90 font-medium text-sm bg-white/10 px-4 py-3 rounded">
                Most AI consultancies charge RM5,000–15,000 for an audit like this. Yours is free.
              </p>
            </div>

            {/* Guarantee */}
            <div className="bg-white/10 p-6 rounded-lg">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <span className="text-lg">🛡️</span> The Clarity Guarantee
              </h4>
              <p className="text-white/70 text-sm leading-relaxed">
                If our free AI audit doesn&apos;t reveal at least 3 actionable ways to
                save your business 10+ hours a week, we&apos;ll pay for your next
                consultation with any competitor. No questions asked.
              </p>
            </div>

            <div className="space-y-6">
              <a 
                href="mailto:hello@hustlr.com" 
                className="flex items-center gap-4 group"
              >
                <div className="w-14 h-14 bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-[#E8524A] transition-all rounded">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-white/60 uppercase tracking-wide">Email</div>
                  <div className="font-semibold">hello@hustlr.com</div>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/10 flex items-center justify-center rounded">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-white/60 uppercase tracking-wide">Office</div>
                  <div className="font-semibold">Raffles Place, Singapore</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
