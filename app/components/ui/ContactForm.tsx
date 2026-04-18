'use client';
import { useState, FormEvent, useRef } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { motion, useAnimate, stagger } from 'framer-motion';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [scope, animate] = useAnimate();
  const successRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch('https://formspree.io/f/xkgjekvl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, _replyto: formData.email })
      });
      if (response.ok) {
        await animate('.form-field', { opacity: 0, y: -8 }, { duration: 0.2, delay: stagger(0.04) });
        setStatus('success');
        setFormData({ name: '', email: '', company: '', message: '' });
        animate('.success-icon', { scale: [0, 1.15, 1], opacity: [0, 1, 1] }, { times: [0, 0.7, 1], duration: 0.4, delay: 0.1 });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const focusRing = {
    whileFocus: { boxShadow: 'inset 3px 0 0 #DC143C', transition: { duration: 0.15 } },
  };

  const inputClass = 'w-full px-4 py-3 bg-[#141414] border border-[#1E1E1E] text-[#EFEFEF] placeholder:text-[#3F3F3F] text-[14px] transition-all duration-200 focus:outline-none focus:border-[#DC143C]';

  const labelClass = 'block text-[#6B6B6B] text-[10px] font-medium mb-1.5 uppercase tracking-[0.1em]';

  if (status === 'success') {
    return (
      <div ref={scope} className="flex flex-col items-center justify-center py-16 gap-5 text-center">
        <motion.div
          className="success-icon w-14 h-14 flex items-center justify-center bg-[rgba(220,20,60,0.08)] border border-[rgba(220,20,60,0.2)]"
          initial={{ scale: 0, opacity: 0 }}
        >
          <CheckCircle className="w-7 h-7 text-[#DC143C]" />
        </motion.div>
        <div>
          <h3
            className="text-[20px] font-bold text-white mb-1.5"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Message Received
          </h3>
          <p className="text-[13px] text-[#6B6B6B]" style={{ fontFamily: 'var(--font-mono)' }}>
            We will get back to you within 24 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form ref={scope} onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="form-field">
          <label htmlFor="name" className={labelClass} style={{ fontFamily: 'var(--font-mono)' }}>Name *</label>
          <motion.input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
            placeholder="Your name"
            className={inputClass}
            {...focusRing}
          />
        </div>
        <div className="form-field">
          <label htmlFor="email" className={labelClass} style={{ fontFamily: 'var(--font-mono)' }}>Email *</label>
          <motion.input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
            placeholder="your@email.com"
            className={inputClass}
            {...focusRing}
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="company" className={labelClass} style={{ fontFamily: 'var(--font-mono)' }}>Company</label>
        <motion.input
          id="company"
          type="text"
          value={formData.company}
          onChange={e => setFormData(p => ({ ...p, company: e.target.value }))}
          placeholder="Your company name"
          className={inputClass}
          {...focusRing}
        />
      </div>

      <div className="form-field">
        <label htmlFor="message" className={labelClass} style={{ fontFamily: 'var(--font-mono)' }}>Message *</label>
        <motion.textarea
          id="message"
          rows={5}
          required
          value={formData.message}
          onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
          placeholder="Tell us about your automation needs..."
          className={`${inputClass} resize-none`}
          {...focusRing}
        />
      </div>

      {status === 'error' && (
        <p className="form-field text-[#DC143C] text-[13px]" style={{ fontFamily: 'var(--font-mono)' }}>
          Something went wrong. Please try again or email us directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="form-field group w-full flex items-center justify-center gap-2 py-3.5 bg-[#DC143C] text-white text-[13px] font-bold uppercase tracking-[0.05em] hover:bg-[#FF1F4E] transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {status === 'loading' ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}
