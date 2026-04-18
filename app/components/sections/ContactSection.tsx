'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import SectionHeading from '@/components/ui/SectionHeading';
import { EyebrowTag } from '@/components/ui/SectionHeading';
import ContactForm from '@/components/ui/ContactForm';
import { prefersReducedMotion } from '@/lib/gsap-utils';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const leftRef    = useRef<HTMLDivElement>(null);
  const rightRef   = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const heading = headingRef.current;
    const left    = leftRef.current;
    const right   = rightRef.current;
    if (!heading || !left || !right || prefersReducedMotion()) return;

    gsap.from(heading, { opacity: 0, y: 30, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: heading, start: 'top 80%', toggleActions: 'play none none none' } });
    gsap.from(left,    { opacity: 0, x: -40, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: left, start: 'top 78%', toggleActions: 'play none none none' } });
    gsap.from(right,   { opacity: 0, x: 40,  duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: right, start: 'top 78%', toggleActions: 'play none none none' } });
  });

  return (
    <SectionWrapper id="contact" className="bg-[#080808]">
      <div ref={headingRef}>
        <EyebrowTag>Contact</EyebrowTag>
        <SectionHeading
          title="Ready to Deploy Your AI Team?"
          subtitle="Let's talk about your workflows, your pain points, and how Zeptaz can start saving you time in the next 30 days."
          centered={false}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
        {/* Left: Info cards */}
        <div ref={leftRef} className="lg:col-span-2 space-y-3">
          {[
            { icon: Mail,   label: 'Email',    value: 'zecreteye@gmail.com', href: 'mailto:zecreteye@gmail.com' },
            { icon: Phone,  label: 'Phone',    value: '+94 78 264 7341',     href: 'tel:+94782647341' },
            { icon: MapPin, label: 'Location', value: 'Colombo, Sri Lanka',  href: undefined },
          ].map(({ icon: Icon, label, value, href }) => (
            <div
              key={label}
              className="group flex items-center gap-4 p-4 border border-[#1E1E1E] bg-[#0D0D0D] hover:border-[rgba(220,20,60,0.25)] transition-colors duration-200"
            >
              <div className="w-10 h-10 bg-[rgba(220,20,60,0.08)] border border-[rgba(220,20,60,0.15)] flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-[#DC143C]" />
              </div>
              <div>
                <div
                  className="text-[10px] text-[#6B6B6B] font-medium uppercase tracking-[0.1em] mb-0.5"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {label}
                </div>
                {href ? (
                  <a href={href} className="text-[14px] text-[#A1A1A1] hover:text-[#DC143C] transition-colors duration-200">
                    {value}
                  </a>
                ) : (
                  <span className="text-[14px] text-[#A1A1A1]">{value}</span>
                )}
              </div>
            </div>
          ))}

          <div className="mt-4 p-5 border border-[#1E1E1E] bg-[#0D0D0D]">
            <div
              className="text-[12px] font-medium text-white mb-1.5 uppercase tracking-[0.06em]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Response guarantee
            </div>
            <p className="text-[13px] text-[#A1A1A1] leading-[1.65]">
              We reply to every enquiry within 24 hours. You will receive a
              tailored proposal within 48 hours.
            </p>
          </div>
        </div>

        {/* Right: Form */}
        <div ref={rightRef} className="lg:col-span-3 border border-[#1E1E1E] bg-[#0D0D0D] p-8 sm:p-10">
          <h3
            className="text-[20px] font-bold text-white mb-1"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Send us a message
          </h3>
          <p
            className="text-[#6B6B6B] text-[12px] mb-7"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            We reply within 24 hours.
          </p>
          <ContactForm />
        </div>
      </div>
    </SectionWrapper>
  );
}
