'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionWrapper from '@/components/ui/SectionWrapper';
import SectionHeading from '@/components/ui/SectionHeading';
import { EyebrowTag } from '@/components/ui/SectionHeading';
import { INTEGRATIONS } from '@/lib/constants';
import { prefersReducedMotion } from '@/lib/gsap-utils';

gsap.registerPlugin(ScrollTrigger);

// ── Brand SVG logos ────────────────────────────────────────────────────
const SlackLogo = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#E01E5A"/>
  </svg>
);

const HubSpotLogo = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <path d="M22.25 10.936a4.43 4.43 0 0 0-2.238-1.072V7.8a1.8 1.8 0 0 0 1.04-1.625V6.1a1.8 1.8 0 0 0-1.8-1.8h-.075a1.8 1.8 0 0 0-1.8 1.8v.075a1.8 1.8 0 0 0 1.04 1.625v2.06a4.43 4.43 0 0 0-2.113.887L9.38 6.4a2.15 2.15 0 0 0 .07-.5 2.15 2.15 0 1 0-2.15 2.15 2.12 2.12 0 0 0 1.12-.32l6.83 4.13a4.45 4.45 0 0 0 .13 3.27L12.6 16.8a1.63 1.63 0 0 0-.46-.07 1.65 1.65 0 1 0 1.65 1.65 1.62 1.62 0 0 0-.2-.77l2.73-1.65a4.45 4.45 0 1 0 5.93-5.02zm-2.48 6.56a2.15 2.15 0 1 1 0-4.3 2.15 2.15 0 0 1 0 4.3z" fill="#FF7A59"/>
  </svg>
);

const SalesforceLogo = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <path d="M10.002 3.284c.924-1.006 2.232-1.636 3.685-1.636 1.972 0 3.695 1.08 4.647 2.69a6.153 6.153 0 0 1 2.443-.504c3.432 0 6.216 2.795 6.216 6.24 0 3.448-2.784 6.243-6.216 6.243-.424 0-.838-.045-1.236-.127a4.737 4.737 0 0 1-4.22 2.603c-.656 0-1.279-.135-1.843-.377A5.24 5.24 0 0 1 8.784 21.6C6.11 21.6 3.86 19.725 3.35 17.19a4.74 4.74 0 0 1-.85.077C1.121 17.267 0 16.13 0 14.75a2.5 2.5 0 0 1 .85-1.892A5.25 5.25 0 0 1 .76 11.4c0-2.907 2.357-5.265 5.264-5.265.73 0 1.426.148 2.058.415.44-.756 1.07-1.39 1.92-1.266z" fill="#00A1E0"/>
  </svg>
);

const GoogleSheetsLogo = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <path d="M14.727 0H3.273C2.423 0 1.636.788 1.636 1.636v20.728C1.636 23.212 2.424 24 3.273 24h17.454c.85 0 1.637-.788 1.637-1.636V7.273L14.727 0z" fill="#23A566"/>
    <path d="M14.727 0v7.273h7.273L14.727 0z" fill="#169E53"/>
    <path d="M17.455 13.636H6.546v1.091h10.909v-1.09zm0 2.182H6.546v1.09h10.909v-1.09zm0 2.182H6.546v1.09h10.909V18zm-10.91-6.545h10.91v-1.091H6.546v1.09z" fill="#fff"/>
  </svg>
);

const StripeLogo = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" fill="#635BFF"/>
  </svg>
);

const ZapierLogo = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <path d="M14.785 8.634c.17.534.258 1.102.258 1.688 0 .602-.092 1.183-.267 1.727H21v-3.415h-6.215zM9.233 14.78c-.534.17-1.102.258-1.688.258-.602 0-1.183-.092-1.727-.267V21h3.415V14.78zM14.767 11.38A5.72 5.72 0 0 1 9.22 14.76L6.48 17.5c1.17.768 2.574 1.217 4.08 1.217 4.09 0 7.416-3.286 7.468-7.365l-3.26.028zm-5.55-2.762A5.72 5.72 0 0 1 14.76 9.22l2.74-2.74A7.472 7.472 0 0 0 13.42 5.3c-4.09 0-7.416 3.286-7.468 7.365l3.26-.028a5.72 5.72 0 0 1 .005-3.99v-.028zM9.215 8.634H3v3.415h6.485a6.002 6.002 0 0 1-.27-1.727c0-.586.088-1.154.258-1.688H9.215zM14.767 14.78V21h3.415v-6.487a6.002 6.002 0 0 1-1.727.267c-.586 0-1.154-.088-1.688-.258v.258z" fill="#FF4A00"/>
  </svg>
);

const GmailLogo = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" fill="#EA4335"/>
  </svg>
);

const NotionLogo = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466l1.823 1.447zm.793 3.08v13.906c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933l3.222-.187z" fill="#000" stroke="#fff" strokeWidth="0.5"/>
    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466l1.823 1.447zm.793 3.08v13.906c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933l3.222-.187z" fill="#fff" fillOpacity="0.85"/>
  </svg>
);

const GitHubLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);

const WhatsAppLogo = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" fill="#25D366"/>
  </svg>
);

const TrelloLogo = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <path d="M21 0H3C1.343 0 0 1.343 0 3v18c0 1.657 1.343 3 3 3h18c1.657 0 3-1.343 3-3V3c0-1.657-1.343-3-3-3zM10.44 18.18c0 .795-.645 1.44-1.44 1.44H4.56c-.795 0-1.44-.645-1.44-1.44V4.56c0-.795.645-1.44 1.44-1.44H9c.795 0 1.44.645 1.44 1.44v13.62zm10.44-7.08c0 .794-.645 1.44-1.44 1.44H15c-.795 0-1.44-.646-1.44-1.44V4.56c0-.795.645-1.44 1.44-1.44h4.44c.795 0 1.44.645 1.44 1.44v6.54z" fill="#0052CC"/>
  </svg>
);

const QuickBooksLogo = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <circle cx="12" cy="12" r="12" fill="#2CA01C"/>
    <path d="M5 12a4 4 0 0 1 4-4h.5v1.5H9A2.5 2.5 0 1 0 9 14h.5v1.5H9a4 4 0 0 1-4-3.5zm14 0a4 4 0 0 1-4 4h-.5v-1.5h.5a2.5 2.5 0 1 0 0-5h-.5V8h.5a4 4 0 0 1 4 4z" fill="#fff"/>
    <path d="M10.5 9.5v5h1.5v-5h1.5V8H9v1.5h1.5zm1.5 5v1.5H9V16h4.5v-1.5H12z" fill="#fff" fillOpacity="0"/>
  </svg>
);

const logoMap: Record<string, React.ElementType> = {
  MessageSquare: SlackLogo,
  Building2: HubSpotLogo,
  Cloud: SalesforceLogo,
  Table: GoogleSheetsLogo,
  CreditCard: StripeLogo,
  Zap: ZapierLogo,
  Mail: GmailLogo,
  FileText: NotionLogo,
  Github: GitHubLogo,
  MessageCircle: WhatsAppLogo,
  LayoutGrid: TrelloLogo,
  Calculator: QuickBooksLogo,
};

export default function IntegrationsSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);
  const noteRef    = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    const heading = headingRef.current;
    const grid    = gridRef.current;
    const note    = noteRef.current;
    if (!heading || !grid || prefersReducedMotion()) return;

    gsap.from(heading, {
      opacity: 0, y: 30, duration: 0.6, ease: 'power2.out',
      immediateRender: false,
      scrollTrigger: { trigger: heading, start: 'top 82%', toggleActions: 'play none none none' },
    });

    const cards = Array.from(grid.querySelectorAll('[data-integration-card]'));
    gsap.from(cards, {
      opacity: 0, y: 24, stagger: 0.05, duration: 0.5, ease: 'power2.out',
      immediateRender: false,
      scrollTrigger: { trigger: grid, start: 'top 78%', toggleActions: 'play none none none' },
    });

    if (note) gsap.from(note, {
      opacity: 0, duration: 0.6, immediateRender: false,
      scrollTrigger: { trigger: note, start: 'top 90%', toggleActions: 'play none none none' },
    });
  });

  return (
    <SectionWrapper id="integrations" className="bg-[#080808]">
      <div ref={headingRef}>
        <EyebrowTag className="justify-center">Integrations</EyebrowTag>
        <SectionHeading
          title="Works With Your Stack"
          subtitle="Zeptaz agents connect to the tools you already use — no migration, no disruption."
        />
      </div>

      <div
        ref={gridRef}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
      >
        {INTEGRATIONS.map((integration) => {
          const Logo = logoMap[integration.icon];
          return (
            <div
              key={integration.id}
              data-integration-card
              className="group flex items-center gap-3 p-4 border border-[#1E1E1E] bg-[#0D0D0D] hover:border-[rgba(220,20,60,0.3)] hover:bg-[rgba(220,20,60,0.02)] transition-all duration-200 cursor-default"
            >
              <div className="w-10 h-10 bg-[#161616] border border-[#252525] flex items-center justify-center flex-shrink-0 rounded-sm group-hover:border-[rgba(220,20,60,0.2)] transition-colors duration-200">
                {Logo && <Logo />}
              </div>
              <div className="min-w-0">
                <div
                  className="text-[13px] font-bold text-white leading-tight truncate"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {integration.name}
                </div>
                <div
                  className="text-[10px] text-[#6B6B6B] leading-snug mt-0.5"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {integration.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p
        ref={noteRef}
        className="text-center text-[#6B6B6B] text-[12px] mt-6"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        Don't see your tool?{' '}
        <span className="text-[#DC143C]">We build custom integrations in under 48 hours.</span>
      </p>
    </SectionWrapper>
  );
}
