import type { LucideIcon } from 'lucide-react';
import { PhoneIncoming, Bot, DatabaseZap, CircleCheckBig, Activity, SlidersHorizontal, Hand } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────
   Source of truth for the Zeptaz Voice product page (/products/voice-agent).
   Kept out of constants.ts so the product owns its own copy surface.
   Voice: operator-first, specific, no revenue promises. Demo data is always
   labelled as demo data.
   ───────────────────────────────────────────────────────────────────────── */

export const VOICE = {
  name: 'Zeptaz Voice',
  tagline: 'Multilingual AI phone agents',
  eyebrow: 'Zeptaz Voice / Multilingual AI Phone Agents',
  headline: 'AI phone agents that get routine calls handled.',
  lead: 'Answer questions, book appointments, and take orders in Sinhala, Tamil, and English - with human handoffs and every outcome visible to your team.',
  ctaPrimary: 'Book a workflow assessment',
  ctaSecondary: 'Try the voice preview',
  languages: ['Sinhala', 'Tamil', 'English'],
  capabilities: ['3 Languages', 'Questions', 'Appointments', 'Orders'],
};

/* ── HERO: simulated live call panel ──────────────────────────────────── */
export const VOICE_CALL = {
  status: 'Live call',
  caller: { initials: 'NP', name: 'Nimal Perera', context: 'Inbound / Colombo', language: 'SI + EN' },
  transcript: {
    speaker: 'Caller',
    line: 'Tomorrow හවස four o’clock appointment එකක් තියෙනවද?',
  },
  action: { label: 'Action checked', result: '4:15 PM slot available', status: 'Awaiting confirmation' },
  indicators: ['Transcript on', 'Ruleset v2.0', 'Operator visible'],
};

/* ── 01 HOW IT WORKS ──────────────────────────────────────────────────── */
export const VOICE_STEPS: { n: string; title: string; desc: string; icon: LucideIcon }[] = [
  { n: '01', title: 'Customer calls', desc: 'Your existing number or a pilot line.', icon: PhoneIncoming },
  { n: '02', title: 'Zeptaz handles it', desc: 'Answers questions and gathers the details.', icon: Bot },
  { n: '03', title: 'Systems are checked', desc: 'Approved information, availability, or order data.', icon: DatabaseZap },
  { n: '04', title: 'Task is completed', desc: 'Confirmed, recorded, or handed to your team.', icon: CircleCheckBig },
];

/* ── 02 VOICE SCENARIO PREVIEW ────────────────────────────────────────── */
export interface VoiceScenario {
  id: 'question' | 'appointment' | 'order';
  n: string;
  tab: string;
  business: string;
  type: string;
  language: string;
  /** BCP-47 locale handed to the voice backend as `lang`. */
  locale: string;
  prompt: string;
}
export const VOICE_SCENARIOS: VoiceScenario[] = [
  {
    id: 'question',
    n: '01',
    tab: 'Ask a Question',
    business: 'zepStay',
    type: 'Boutique hotel',
    language: 'English',
    locale: 'en-LK',
    prompt: 'Ask about check-in times, parking, room facilities, or hotel policies.',
  },
  {
    id: 'appointment',
    n: '02',
    tab: 'Book an Appointment',
    business: 'zepCare',
    type: 'Dental clinic',
    language: 'Tamil',
    locale: 'ta-LK',
    prompt: 'Ask for an available dental consultation tomorrow afternoon.',
  },
  {
    id: 'order',
    n: '03',
    tab: 'Place an Order',
    business: 'zepFoods',
    type: 'Restaurant',
    language: 'Sinhala + English',
    locale: 'si-LK',
    prompt: 'Order a meal, choose delivery or pickup, and confirm the details.',
  },
];

/* ── 03 OPERATOR CONTROL ──────────────────────────────────────────────── */
export const VOICE_CONTROL: { title: string; desc: string; icon: LucideIcon }[] = [
  {
    title: 'Monitor every call',
    desc: 'See call activity, transcripts, completed actions, and requests that need attention.',
    icon: Activity,
  },
  {
    title: 'Adjust workflow settings',
    desc: 'Update business information, confirmation rules, and how each workflow responds.',
    icon: SlidersHorizontal,
  },
  {
    title: 'Control human handoffs',
    desc: 'Choose when Zeptaz completes a task and when it routes the caller to your team.',
    icon: Hand,
  },
];

export const VOICE_DASHBOARD = {
  context: 'Today / Colombo',
  title: 'Voice operations',
  status: 'System ready',
  stats: [
    { label: 'Calls', value: '24' },
    { label: 'Completed', value: '18' },
    { label: 'Review', value: '04' },
  ],
  columns: ['Caller', 'Workflow', 'Outcome', 'Time'],
  rows: [
    { caller: 'N. Perera', workflow: 'Appointment', outcome: 'Confirmed', time: '10:42', tone: 'green' as const },
    { caller: 'Unknown', workflow: 'Customer question', outcome: 'Answered', time: '10:31', tone: 'green' as const },
    { caller: 'S. Fernando', workflow: 'Refund request', outcome: 'Review', time: '10:18', tone: 'amber' as const },
  ],
};

/* ── 04 COMMON QUESTIONS ──────────────────────────────────────────────── */
export const VOICE_FAQS = [
  {
    q: 'Do we need to replace our current phone number?',
    a: 'Not necessarily. We review your provider and recommend forwarding, a dedicated line, or a supported integration for the pilot.',
  },
  {
    q: 'Which languages are supported?',
    a: 'Zeptaz Voice supports Sinhala, Tamil, and English. Each workflow is tested against representative calls before going live.',
  },
  {
    q: 'What happens when the system is uncertain?',
    a: 'It follows your agreed fallback rules: clarify, take a message, flag for review, or route the caller to a person.',
  },
  {
    q: 'Can it connect to our calendar or other tools?',
    a: 'It can connect to supported calendars, spreadsheets, and custom APIs after a compatibility review.',
  },
  {
    q: 'How is call data handled?',
    a: 'Recording, consent, retention, access, and deletion rules are agreed and documented before launch.',
  },
  {
    q: 'What does a pilot include?',
    a: 'We agree one workflow, its integrations, escalation rules, and success measures; test normal and failure cases; then introduce a controlled share of live calls and review the results with your team.',
  },
];

/* ── 05 START A PILOT ─────────────────────────────────────────────────── */
export const VOICE_PILOT_STEPS = [
  { n: '01', title: 'Map', desc: 'Choose one repeatable call and define its outcome.' },
  { n: '02', title: 'Test', desc: 'Configure the workflow and validate normal and failure cases.' },
  { n: '03', title: 'Pilot', desc: 'Introduce monitored traffic and review real outcomes.' },
];

export const VOICE_PILOT_TERMS = [
  {
    label: 'You receive',
    items: ['A configured voice workflow', 'Testing before live traffic', 'Dashboard access and an outcome review'],
  },
  {
    label: 'You provide',
    items: ['One valuable call scenario', 'An escalation owner', 'Representative test calls'],
  },
];

export const VOICE_CALL_VOLUMES = ['Under 250', '250–1,000', '1,000–5,000', '5,000+'];
export const VOICE_WORKFLOW_OPTIONS = ['Ask a Question', 'Book an Appointment', 'Place an Order'];
