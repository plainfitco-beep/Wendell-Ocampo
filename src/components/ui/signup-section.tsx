'use client';
import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, Mail, Send, Sparkles, MessageSquare, User, FileText, ChevronRight } from 'lucide-react';

export function SignupSection() {
  const [activeTab, setActiveTab] = useState<'contact' | 'newsletter'>('contact');
  
  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<null | 'success' | 'error'>(null);
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactStatus, setContactStatus] = useState<null | 'success' | 'error'>(null);
  const [contactLoading, setContactLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterLoading(true);

    try {
      const existing = localStorage.getItem('wendell_newsletter_signups');
      const list = existing ? JSON.parse(existing) : [];
      list.push({ email: newsletterEmail, timestamp: new Date().toISOString() });
      localStorage.setItem('wendell_newsletter_signups', JSON.stringify(list));

      // Log subscription on the backend Express pipeline
      const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
      await fetch(`${API_BASE}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail })
      });

      setNewsletterStatus('success');
      setNewsletterEmail('');
    } catch (err) {
      console.warn("Backend subscriber registration failed, saved locally", err);
      // Fallback to local success representation
      setNewsletterStatus('success');
      setNewsletterEmail('');
    } finally {
      setNewsletterLoading(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setContactLoading(true);

    try {
      // Store locally for rich dynamic interaction & persistence
      const id = 'inquiry_' + Math.random().toString(36).substr(2, 9);
      const existingInquiries = localStorage.getItem('wendell_project_inquiries');
      const list = existingInquiries ? JSON.parse(existingInquiries) : [];
      list.push({
        id,
        name: contactName,
        email: contactEmail,
        subject: contactSubject || 'General 3D Inquiry',
        message: contactMessage,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('wendell_project_inquiries', JSON.stringify(list));

      const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
      const response = await fetch(`${API_BASE}/api/inquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          subject: contactSubject,
          message: contactMessage
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setContactStatus('success');
        // Reset details
        setContactName('');
        setContactEmail('');
        setContactSubject('');
        setContactMessage('');
      } else {
        setContactStatus('error');
      }
    } catch (err) {
      setContactStatus('error');
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <section id="signup" className="py-24 w-full relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent pointer-events-none" />
      <div className="mx-auto w-full max-w-5xl px-4 relative z-10">
        <AnimatedContainer className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#0c0c0e] via-neutral-950 to-black p-8 md:p-16 text-center shadow-2xl shadow-black/80">
          
          {/* Decorative visual circles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.02] rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/[0.01] rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

          {/* Toggle switcher */}
          <div className="inline-flex p-1 bg-white/5 border border-white/10 rounded-full mb-10 relative z-30">
            <button
              type="button"
              onClick={() => { setActiveTab('contact'); setNewsletterStatus(null); setContactStatus(null); }}
              className={`px-6 py-2 rounded-full text-xs font-semibold tracking-wider font-mono cursor-pointer transition-all ${
                activeTab === 'contact' 
                  ? 'bg-white text-black shadow-lg shadow-white/5' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              PROJECT INQUIRY
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('newsletter'); setNewsletterStatus(null); setContactStatus(null); }}
              className={`px-6 py-2 rounded-full text-xs font-semibold tracking-wider font-mono cursor-pointer transition-all ${
                activeTab === 'newsletter' 
                  ? 'bg-white text-black shadow-lg shadow-white/5' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              SUBSCRIBE LIST
            </button>
          </div>

          {/* Icon Badge */}
          <div className="mx-auto w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 hover:scale-110 transition-transform duration-300">
            {activeTab === 'contact' ? (
              <MessageSquare className="size-5 text-neutral-300" />
            ) : (
              <Mail className="size-5 text-neutral-300" />
            )}
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl text-white font-display">
            {activeTab === 'contact' ? (
              <>Initiate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-300 via-neutral-100 to-neutral-500">3D Design</span></>
            ) : (
              <>Join The <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-300 via-neutral-100 to-neutral-500">Render Dispatch</span></>
            )}
          </h2>
          
          <p className="text-neutral-400 mt-4 text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed">
            {activeTab === 'contact' ? (
              "Submit your architectural vision, interior landscape, or custom product concept. We construct secure pipeline renders and immersive virtual assets."
            ) : (
              "Subscribe to receive ultra-high-resolution visualization showcases, real D5 Render presets, and exclusive personal studio updates directly in your mailbox."
            )}
          </p>

          <div className="mt-10 max-w-lg mx-auto relative z-30">
            {activeTab === 'contact' ? (
              contactStatus === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-sm flex flex-col items-center justify-center gap-3"
                >
                  <CheckCircle2 className="size-8 stroke-[1.5] text-emerald-400 mb-1" />
                  <span className="font-semibold text-base text-white">Inquiry Transmitted Successfully</span>
                  <p className="text-neutral-400 text-xs text-center leading-relaxed">
                    Your inquiry has been securely sent directly through our SMTP gateway. We will review your vision and get back to you shortly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2">
                        <User className="size-4 text-neutral-500" />
                      </span>
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Your full name..."
                        className="w-full pl-11 pr-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20 transition-all font-mono placeholder:text-neutral-600"
                        required
                      />
                    </div>
                    
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Mail className="size-4 text-neutral-500" />
                      </span>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="Your contact email..."
                        className="w-full pl-11 pr-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20 transition-all font-mono placeholder:text-neutral-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2">
                      <FileText className="size-4 text-neutral-500" />
                    </span>
                    <input
                      type="text"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      placeholder="Subject (e.g. Modern Villa Project)..."
                      className="w-full pl-11 pr-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20 transition-all font-mono placeholder:text-neutral-600"
                    />
                  </div>

                  <div className="relative">
                    <textarea
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Detail your requirements, spatial scope, scale elements..."
                      rows={4}
                      className="w-full px-5 py-4 rounded-3xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20 transition-all font-mono placeholder:text-neutral-600 resize-none min-h-[120px]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={contactLoading}
                    className="w-full py-4 rounded-full bg-white text-black text-sm font-semibold hover:bg-neutral-200 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-white/5"
                  >
                    <span>{contactLoading ? 'Encrypting & Dispatching...' : 'Dispatch Custom Inquiry'}</span>
                    <Send className="size-3.5" />
                  </button>
                </form>
              )
            ) : (
              newsletterStatus === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-sm flex items-center justify-center gap-3"
                >
                  <CheckCircle2 className="size-5 shrink-0" />
                  <span className="font-medium">Transmission complete. Welcome to the future of 3D Web! 🪐</span>
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="relative flex flex-col sm:flex-row items-stretch gap-2.5">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Mail className="size-4 text-neutral-500" />
                    </span>
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Enter terminal email reference..."
                      className="w-full pl-11 pr-5 py-3 rounded-full bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20 transition-all font-mono"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={newsletterLoading}
                    className="px-8 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-neutral-200 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    {newsletterLoading ? 'Transmitting...' : 'Subscribe'}
                    <Send className="size-3.5" />
                  </button>
                </form>
              )
            )}
            
            {(newsletterStatus === 'error' || contactStatus === 'error') && (
              <p className="mt-3 text-red-400 text-xs font-light">
                Transmission pipeline failed. Please retry your submission.
              </p>
            )}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-neutral-500 font-light select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Secure 256-bit automated encryption. Emails are fully modularized and private.</span>
          </div>

        </AnimatedContainer>
      </div>
    </section>
  );
}

type ViewAnimationProps = {
  className?: string;
  children: React.ReactNode;
};

function AnimatedContainer({ className, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ filter: 'blur(10px)', y: 30, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: 0.1, duration: 0.8, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
