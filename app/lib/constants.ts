import type { LucideIcon } from 'lucide-react';
import {
  Inbox, Database, ListChecks, Tags, UserCheck, BellRing, FileText,
  CalendarClock, AlertTriangle, Handshake, BarChart3,
  Users, TrendingUp, Rocket, Megaphone, FileSpreadsheet,
  ShieldCheck, Hand, Network, KeyRound, Workflow, GitBranch,
  Phone, Search, Lock, Hammer, ClipboardCheck, PackageCheck, LifeBuoy,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────
   Source of truth for homepage copy/data.
   Voice: operator-first, specific, skeptical. No hype, no revenue promises.
   Derived from the Final Strategy Report - §17 Website Brand & Content Strategy.
   ───────────────────────────────────────────────────────────────────────── */

export const SITE = {
  name: 'Zeptaz',
  tagline: 'AI workflow automation for service businesses',
  email: 'hello@zeptaz.com',
  ctaPrimary: 'Book a Workflow Fit Call',
  ctaSecondary: 'Explore Automation Services',
};

export const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Engine', href: '/engine' },
  { label: 'Process', href: '/process' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
];

/* ── HERO ─────────────────────────────────────────────────────────────── */
export const HERO = {
  eyebrow: 'Workflow Automation',
  // headline rendered as two masked lines that rise from the bottom; the
  // second line carries the crimson emphasis.
  headline: ['Stop running', 'operations by hand.'],
  highlight: 'operations by hand.',
  sub: 'We automate the handoffs, follow-ups, and updates that eat your team’s day.',
  // kept for reference / potential reuse elsewhere; no longer rendered in Hero
  stats: [
    { value: 5, suffix: '', label: 'Service workflows automated' },
    { value: 11, suffix: '', label: 'Modules in the engine' },
    { value: 100, suffix: '%', label: 'AI outputs human-approved' },
  ],
};

/* ── PROBLEM ──────────────────────────────────────────────────────────── */
export const PROBLEM = {
  eyebrow: 'The Problem',
  title: 'Work enters from everywhere - and gets stuck between tools.',
  lead: 'Inquiries arrive through forms, email, CRMs, documents, ads, referrals, and internal requests. But ownership, handoffs, updates, and follow-ups get messy - and important work quietly goes stale.',
  channels: ['Web forms', 'Email & inbox', 'CRM / ATS', 'Documents', 'Ads', 'Referrals', 'Internal requests'],
  pains: [
    { stat: 'No owner', label: 'Unclear ownership', desc: 'Inquiries sit in inboxes and forms with no one accountable for the next step.' },
    { stat: 'Manual', label: 'Records fall behind', desc: 'CRM/ATS updates are done by hand, so records are incomplete and inconsistent.' },
    { stat: 'Missed', label: 'Follow-ups slip', desc: 'Recruiters and teams remember follow-ups manually - until they don’t.' },
    { stat: 'Stale', label: 'No visibility', desc: 'Owners and managers can’t see where response and follow-up gaps are forming.' },
  ],
};

/* ── CORE OFFER ───────────────────────────────────────────────────────── */
export const CORE_OFFER = {
  eyebrow: 'What We Build',
  title: 'Workflow automation systems - not a pile of one-off zaps.',
  lead: 'We connect the tools your team already uses into one reliable system across intake, sales, onboarding, marketing operations, reporting, and documents. AI assists inside a controlled workflow; it doesn’t run loose.',
  points: [
    'Connected, dependency-locked - modules build on each other.',
    'Human-approved AI - drafts and sensitive outputs wait for a person.',
    'Minimum-access by default - no raw passwords, anonymized test data.',
  ],
};

/* ── SERVICE CATEGORIES (5) ───────────────────────────────────────────── */
export interface ServiceDetail {
  /** Concrete artifacts the client walks away with. */
  deliverables: string[];
  /** Example run rendered as a mono terminal trace on /services. */
  flow: string[];
  /** One-sentence operational outcome. */
  outcome: string;
}
export interface Service {
  slug: string;
  name: string;
  short: string;
  desc: string;
  icon: LucideIcon;
  bullets: string[];
  detail: ServiceDetail;
}
export const SERVICES: Service[] = [
  {
    slug: 'recruitment',
    name: 'Recruitment Workflow Automation',
    short: 'Recruitment',
    desc: 'Candidate and client inquiries become clean ATS records with an owner and a next step.',
    icon: Users,
    bullets: ['Candidate / client inquiry intake', 'ATS updates & recruiter routing', 'Follow-up tasks', 'Stale-inquiry alerts'],
    detail: {
      deliverables: [
        'Intake workflows wired to your forms, shared inboxes, and landing pages',
        'ATS record creation and update rules mapped to your fields',
        'Recruiter routing logic with named fallback owners',
        'Follow-up task templates and stale-inquiry alerting',
      ],
      flow: [
        'inquiry.received (web-form: candidate)',
        'ats.record.create → fields.verify',
        'route → recruiter.on_duty [fallback: team-lead]',
        'reply.draft.ready [human-approve]',
        'follow-up.scheduled +48h',
      ],
      outcome: 'Every candidate and client inquiry gets an owner, a clean ATS record, and a scheduled next step - without a recruiter copying data by hand.',
    },
  },
  {
    slug: 'sales',
    name: 'Sales Workflow Automation',
    short: 'Sales',
    desc: 'Leads get routed, records stay clean, and follow-ups stop falling through the cracks.',
    icon: TrendingUp,
    bullets: ['Lead routing', 'CRM hygiene', 'Response drafts', 'Follow-up reminders & deal handoffs'],
    detail: {
      deliverables: [
        'Lead routing rules by territory, source, or round-robin',
        'CRM hygiene automations - dedupe, field completion, stage sync',
        'AI response drafts queued for rep approval',
        'Follow-up reminders and deal-stage handoffs',
      ],
      flow: [
        'lead.captured (ad-form: pricing-page)',
        'crm.record.upsert → dedupe.check',
        'route → rep.round_robin(region)',
        'outreach.draft.ready [human-approve]',
        'reminder.set (no-reply +3d)',
      ],
      outcome: 'Leads stop sitting unclaimed in the inbox - each one lands on a rep’s plate with a clean record and a reminder that won’t forget.',
    },
  },
  {
    slug: 'onboarding',
    name: 'Client Onboarding Automation',
    short: 'Onboarding',
    desc: 'Closed-won deals turn into a clean handoff and a repeatable onboarding sequence.',
    icon: Rocket,
    bullets: ['Closed-won handoff', 'Setup tasks', 'Internal briefs', 'Onboarding checklists'],
    detail: {
      deliverables: [
        'Closed-won trigger wired to your CRM stage change',
        'Kickoff checklist and task sequence in your task system',
        'Internal brief auto-drafted from the deal record',
        'Status updates posted to the account channel',
      ],
      flow: [
        'deal.closed_won (crm: stage-change)',
        'handoff.brief.generate [human-approve]',
        'tasks.create (kickoff checklist)',
        'owner.assign → delivery-team',
        'status.post → #client-channel',
      ],
      outcome: 'The win never stalls in the gap between sales and delivery - kickoff starts itself the moment the deal closes.',
    },
  },
  {
    slug: 'marketing-ops',
    name: 'Marketing Operations Automation',
    short: 'Marketing Ops',
    desc: 'Campaigns, approvals, and asset handoffs move without manual chasing.',
    icon: Megaphone,
    bullets: ['Campaign setup', 'Approvals', 'Asset handoffs', 'Internal status updates'],
    detail: {
      deliverables: [
        'Campaign setup checklists triggered from a brief or calendar',
        'Approval loops with named reviewers and automatic reminders',
        'Asset handoff flows between brief, design, and channel owners',
        'Status rollups posted where the team already works',
      ],
      flow: [
        'campaign.brief.submitted',
        'tasks.spawn (setup: channels, tracking, assets)',
        'approval.request → reviewer [reminder +24h]',
        'assets.handoff → channel-owner',
        'status.rollup → #marketing',
      ],
      outcome: 'Campaigns move from brief to live without a coordinator chasing approvals and assets across four tools.',
    },
  },
  {
    slug: 'reporting-documents',
    name: 'Reporting & Document Automation',
    short: 'Reporting & Docs',
    desc: 'Form-to-record workflows and operational reports generate themselves on schedule.',
    icon: FileSpreadsheet,
    bullets: ['Form-to-record workflows', 'Operational reports', 'Internal summaries', 'Document generation'],
    detail: {
      deliverables: [
        'Form-to-record pipelines with validation on entry',
        'Scheduled operational reports built from live system data',
        'Internal summaries drafted for human review',
        'Templated document generation - briefs, SOWs, letters',
      ],
      flow: [
        'schedule.trigger (weekly: fri 07:00)',
        'data.pull (ats, crm, tasks)',
        'report.compile → summary.draft [human-approve]',
        'doc.generate (template: weekly-ops)',
        'deliver → inbox + archive',
      ],
      outcome: 'The weekly numbers assemble themselves from records that are actually consistent - no more Friday spreadsheet archaeology.',
    },
  },
];

/* ── THE ENGINE - modules (the connected pipeline) ────────────────────── */
export type Tier = 'starter' | 'growth' | 'scale';
export interface EngineModule {
  id: string;
  name: string;
  desc: string;
  icon: LucideIcon;
  flag?: 'human' | 'alert';
  /** Longer copy for the /engine dependency spine. */
  detail: string;
  /** Which packages include this module (also powers the /pricing manifest). */
  tiers: Tier[];
}
const ALL: Tier[] = ['starter', 'growth', 'scale'];
const GROWTH_UP: Tier[] = ['growth', 'scale'];
const SCALE_ONLY: Tier[] = ['scale'];
export const ENGINE_MODULES: EngineModule[] = [
  { id: 'intake', name: 'Inquiry Intake', desc: 'Captures the inquiry from form, email, landing page, or connected source.', icon: Inbox, tiers: ALL,
    detail: 'Watches every connected entry point - forms, shared inboxes, landing pages, imports - and normalizes what arrives into one shape the rest of the engine can trust. Nothing depends on a person noticing a notification.' },
  { id: 'record', name: 'ATS / CRM Record', desc: 'Creates or updates a structured record - no manual data entry.', icon: Database, tiers: ALL,
    detail: 'Creates or updates the ATS/CRM record the moment intake fires, mapped to your fields and formats. Every module downstream reads from this record - which is exactly why it can’t be skipped.' },
  { id: 'field-check', name: 'Field Check', desc: 'Checks required fields and flags missing information.', icon: ListChecks, tiers: ALL,
    detail: 'Validates the record against the required-field list you approve during scoping. Incomplete records get flagged with exactly what’s missing instead of quietly rotting in the system.' },
  { id: 'categorize', name: 'Categorization', desc: 'Classifies candidate, client, or job inquiry into the agreed category.', icon: Tags, tiers: ALL,
    detail: 'Sorts the inquiry into the categories you already operate with - candidate, client, job, or your own taxonomy. Routing and reporting both depend on this label being right.' },
  { id: 'owner', name: 'Owner Assignment', desc: 'Routes to the correct recruiter, team, or fallback owner.', icon: UserCheck, tiers: ALL,
    detail: 'Applies your routing rules to give the inquiry a named owner, with a fallback when the first choice is unavailable. Unclear ownership is the single biggest leak we see - this module closes it.' },
  { id: 'alert', name: 'Team Alert', desc: 'Notifies the right person on the right channel.', icon: BellRing, tiers: ALL,
    detail: 'Tells the owner on the channel they actually watch - Slack, Teams, or email - with the record linked. No dashboard someone has to remember to check.' },
  { id: 'draft', name: 'AI Response Draft', desc: 'Prepares a draft for human approval - never sends on its own.', icon: FileText, flag: 'human', tiers: GROWTH_UP,
    detail: 'Prepares a context-aware reply from the record and your tone guidelines, then stops. A person reviews, edits, and sends - the system never messages anyone on its own.' },
  { id: 'followup', name: 'Follow-up Task', desc: 'Schedules the next action in your ATS/CRM/task system.', icon: CalendarClock, tiers: ALL,
    detail: 'Books the next action into your ATS, CRM, or task system with the owner and due date attached. Follow-through stops depending on anyone’s memory.' },
  { id: 'stale', name: 'Stale-Inquiry Flag', desc: 'Flags inquiries with no movement after the agreed time.', icon: AlertTriangle, flag: 'alert', tiers: GROWTH_UP,
    detail: 'Watches for inquiries with no movement past the threshold you set and raises them to a person. Nothing is auto-archived - a human decides what stale means.' },
  { id: 'handoff', name: 'Placement Handoff', desc: 'Triggers the next-step handoff after a conversion.', icon: Handshake, tiers: SCALE_ONLY,
    detail: 'Fires the agreed next-step sequence the moment an inquiry converts - placement made, deal closed, contract signed. The win doesn’t stall in the gap between teams.' },
  { id: 'reporting', name: 'Reporting', desc: 'Keeps consistent records so reporting actually adds up.', icon: BarChart3, tiers: SCALE_ONLY,
    detail: 'Because every upstream module writes consistent records, the numbers finally reconcile. Response times, follow-up rates, and aging inquiries roll up without a spreadsheet exercise.' },
];

/* ── DIFFERENTIATORS - what makes us different ────────────────────────── */
export interface Differentiator {
  no: string;
  not: string;
  title: string;
  desc: string;
  icon: LucideIcon;
}
export const DIFFERENTIATORS: Differentiator[] = [
  { no: '01', not: 'Not lead generation', title: 'We fix the work you already have', desc: 'We don’t promise new leads or cold outreach. We improve how inbound inquiries get handled, owned, and followed up.', icon: Workflow },
  { no: '02', not: 'Not random zaps', title: 'A connected system, not a menu', desc: 'Modules depend on each other. You size the build - you don’t cherry-pick load-bearing steps that break the system.', icon: Network },
  { no: '03', not: 'Not autonomous AI', title: 'AI stays human-approved', desc: 'AI drafts and sensitive outputs are prepared for human review. No autonomous sending, no candidate ranking, no hiring decisions.', icon: Hand },
  { no: '04', not: 'Not broad access', title: 'Minimum access, data-safe', desc: 'Least-privilege by default: no raw password sharing, anonymized or test data where possible, clear PII handling.', icon: KeyRound },
  { no: '05', not: 'Not hype-first', title: 'Operator-first and specific', desc: 'We work in workflow maps, examples, and operational consequences - not jargon or guaranteed-revenue claims.', icon: GitBranch },
  { no: '06', not: 'Not duct tape', title: 'Reliable systems over one-offs', desc: 'A maintained workflow engine beats a drawer of brittle one-off automations that quietly break.', icon: ShieldCheck },
];

/* ── INTEGRATIONS ─────────────────────────────────────────────────────── */
export const INTEGRATIONS = [
  'HubSpot', 'Salesforce', 'Slack', 'Microsoft Teams', 'Gmail',
  'Zapier', 'Make', 'n8n', 'Notion', 'QuickBooks',
];

/* ── PROCESS - Fit Call → … → Managed Plan ────────────────────────────── */
export interface ProcessStep {
  no: string;
  name: string;
  desc: string;
  icon: LucideIcon;
  /** Terminal-style status lines shown on the Process Player stage. */
  logs: string[];
  /** Expanded expectations for the /process step ledger. */
  expects: { fromYou: string; weDeliver: string; duration: string };
}
export const PROCESS: ProcessStep[] = [
  { no: '01', name: 'Workflow Fit Call', desc: 'A short, low-friction conversation to see how inquiries move from form/inbox to an owner and a follow-up.', icon: Phone,
    logs: ['> intake.scan(form, inbox)', '> trace: inquiry → owner → follow-up', 'ready: discovery'],
    expects: { fromYou: '30 minutes and honest answers about how inquiries move today.', weDeliver: 'A straight read on whether automation helps - and a clear no if it doesn’t.', duration: '30-45 minutes' } },
  { no: '02', name: 'Diagnostic', desc: 'We map your current flow, name the top leak points, and recommend a founding build scope.', icon: Search,
    logs: ['> flow.map(current)', '> detect: leak-points', '> scope.recommend(founding build)'],
    expects: { fromYou: 'A walkthrough of your tools and a few real (redacted) inquiry examples.', weDeliver: 'A 1-3 page flow map, the top leak points, and a recommended scope with a price range.', duration: '3-5 business days' } },
  { no: '03', name: 'Access Lock', desc: 'The readiness gate. Access, test data, routing rules, and owners are confirmed before the clock starts.', icon: Lock,
    logs: ['> access.confirm', '> test-data.verify', '> routing.rules.lock', 'clock: START'],
    expects: { fromYou: 'Scoped access, test data, routing rules, and named owners - confirmed.', weDeliver: 'A readiness checklist signed off by both sides. The delivery clock starts here.', duration: 'Driven by your side - typically under a week' } },
  { no: '04', name: 'Build', desc: 'We build the reusable workflow engine against approved test data - connector-first, modular.', icon: Hammer,
    logs: ['> engine.build(modular)', '> connectors.attach', '> test-data.bind'],
    expects: { fromYou: 'Availability for quick clarification questions - not a meeting marathon.', weDeliver: 'The workflow engine built connector-first against approved test data, with logs.', duration: 'Per package - 10 business days to 6 weeks' } },
  { no: '05', name: 'UAT', desc: 'You test agreed pass/fail scenarios. Feedback is consolidated into one punch list, then fixed.', icon: ClipboardCheck,
    logs: ['> scenarios.run(pass/fail)', '> feedback → punch-list', '> fixes.apply'],
    expects: { fromYou: 'Run the agreed pass/fail scenarios against your real cases.', weDeliver: 'One consolidated punch list and the fixes - not an endless revision loop.', duration: '3-5 business days' } },
  { no: '06', name: 'Handover', desc: 'Runbook, workflow map, limitations, and responsibilities reviewed. The build phase ends formally.', icon: PackageCheck,
    logs: ['> runbook.deliver', '> workflow-map.review', 'build-phase: CLOSED'],
    expects: { fromYou: 'One session with the people who will own the system day to day.', weDeliver: 'Runbook, workflow map, known limitations, and named responsibilities - formally closed.', duration: 'One session' } },
  { no: '07', name: 'Managed Plan', desc: 'Optional ongoing plan with hour-capped support, monitoring, and change requests.', icon: LifeBuoy,
    logs: ['> monitoring.enable', '> support.cap(hours)', 'change-requests: OPEN'],
    expects: { fromYou: 'Nothing - it’s optional. Choose it if you want us on call.', weDeliver: 'Hour-capped support, monitoring, and change requests under a monthly cap.', duration: 'Monthly - cancel anytime' } },
];

/* ── PACKAGES ─────────────────────────────────────────────────────────── */
export interface Package {
  name: string;
  tagline: string;
  price: string;
  priceNote: string;
  timeline: string;
  featured?: boolean;
  scope: string[];
}
export const PACKAGES: Package[] = [
  {
    name: 'Starter Build',
    tagline: 'Get inquiries owned and followed up.',
    price: '$1,500',
    priceNote: 'local from / $3,000 international',
    timeline: '10 business days after Access Lock',
    scope: ['Intake & ATS/CRM update', 'Required field check', 'Owner assignment', 'Team alert', 'Basic follow-up task'],
  },
  {
    name: 'Growth Build',
    tagline: 'Add AI drafts and stale-inquiry logic.',
    price: '$3,000',
    priceNote: 'local from / $6,000 international',
    timeline: '2-3 weeks after Access Lock',
    featured: true,
    scope: ['Everything in Starter', 'AI response drafts (human-approved)', 'Stale-inquiry alerts', 'Richer follow-up logic', 'Stronger logs'],
  },
  {
    name: 'Scale Build',
    tagline: 'A multi-workflow operations system.',
    price: '$7,500',
    priceNote: 'local from / $15,000 international',
    timeline: '4-6 weeks after Access Lock',
    scope: ['Everything in Growth', 'Multi-workflow across intake & follow-up', 'Handoff & reporting', 'Operations dashboards', 'Connector layer per system'],
  },
];

export const PACKAGES_NOTE = 'Final pricing depends on workflow complexity, ATS/CRM access, connector availability, data quality, AI involvement, module count, and support needs. Timelines begin only after Access Lock is complete.';

/* ── TRUST & SECURITY ─────────────────────────────────────────────────── */
export const TRUST = {
  eyebrow: 'Trust & Security',
  title: 'Built to be safe inside your stack.',
  lead: 'We treat candidate, client, and operational data carefully. AI is an assistant inside a controlled workflow - not an autonomous actor.',
  items: [
    { title: 'Minimum access', desc: 'We request only the candidate, client, and job data the approved workflow needs.', icon: KeyRound },
    { title: 'No raw passwords', desc: 'Invitations, OAuth, restricted API keys, or client-owned accounts only.', icon: Lock },
    { title: 'Anonymized test data', desc: 'Logic is engineered on anonymized or representative test data where possible.', icon: ShieldCheck },
    { title: 'Human-approved AI', desc: 'AI drafts and sensitive outputs are prepared for human review and approval.', icon: Hand },
  ],
};

/* ── TEAM ─────────────────────────────────────────────────────────────── */
export interface TeamMember {
  name: string;
  role: string;
  photo: string;
  panel: string; // bg color behind the portrait
  social?: { linkedin?: string; instagram?: string };
  /** One-line bio shown in the portrait overlay on /about. Drafted - edit freely. */
  bio?: string;
}
export const TEAM: TeamMember[] = [
  { name: 'Tevin Bandara', role: 'Co-Founder', photo: '/team/Tevin.png', panel: '#5B7B9A',
    bio: 'Maps client workflows and keeps every build accountable to an operational outcome, not a demo.',
    social: { linkedin: 'https://www.linkedin.com/in/tevin-bandara-95a555390/', instagram: 'https://www.instagram.com/0_tevin_0/' } },
  { name: 'Sasindu Silva', role: 'Co-Founder', photo: '/team/Sasindu.png', panel: '#C77B53',
    bio: 'Designs the connector layer - the unglamorous plumbing that keeps records in sync.',
    social: { linkedin: 'https://www.linkedin.com/in/sasindu-rashmith-9862a5394/', instagram: 'https://www.instagram.com/sasindu_rashmith/' } },
  { name: 'Naveen Harry', role: 'Co-Founder', photo: '/team/Harry.png', panel: '#4F8A6B',
    bio: 'Owns testing and reliability - the pass/fail scenarios and punch list nothing ships without.',
    social: { linkedin: 'https://www.linkedin.com/in/naveen-harry-082829359/', instagram: 'https://www.instagram.com/_harry.827_/' } },
  { name: 'Jayith Wijethunge', role: 'Co-Founder', photo: '/team/Jayith.png', panel: '#B6483F',
    bio: 'Builds the engine’s automation logic and the human-approval loops around the AI.',
    social: { linkedin: 'https://www.linkedin.com/in/jayith-wijethunge/', instagram: 'https://www.instagram.com/jayithw/' } },
];

/* ── FAQ ──────────────────────────────────────────────────────────────── */
export interface FaqEntry {
  q: string;
  a: string;
  /** 'general' surfaces on /about, 'pricing' on /pricing. */
  topic: 'general' | 'pricing';
}
export const FAQS: FaqEntry[] = [
  { topic: 'general', q: 'What do you automate?', a: 'Intake, routing, CRM/ATS updates, follow-ups, handoffs, approvals, reporting, and documents across your service workflows.' },
  { topic: 'general', q: 'Do you replace our team?', a: 'No. The system reduces admin chasing and prepares drafts, tasks, alerts, and summaries. Your team stays in control.' },
  { topic: 'general', q: 'Do automations send messages automatically?', a: 'Not by default. AI drafts and sensitive workflow outputs are prepared for human review and approval.' },
  { topic: 'general', q: 'Can you work with any CRM, ATS, or tool?', a: 'Only if access and integration are practical. Projects must pass compatibility and access checks first - connector-first, then API where needed.' },
  { topic: 'general', q: 'How do you handle our data?', a: 'Minimum required access, no raw password sharing, and anonymized or test data where possible.' },
  { topic: 'pricing', q: 'When does the timeline start?', a: 'After Access Lock is complete - once access, test data, routing rules, and owners are confirmed.' },
  { topic: 'pricing', q: 'What affects the final price?', a: 'Workflow complexity, ATS/CRM access, connector availability, data quality, AI involvement, module count, and support needs. The founding diagnostic pins the number before you commit.' },
  { topic: 'pricing', q: 'Is the Managed Plan required?', a: 'No. The build ends formally at Handover with a runbook and workflow map. The Managed Plan is an optional monthly, hour-capped add-on for monitoring and change requests.' },
  { topic: 'pricing', q: 'Can we start small and expand later?', a: 'Yes - that’s the point of the tiers. Starter, Growth, and Scale are the same engine at different reach, so upgrading adds modules without rebuilding what you have.' },
];

/* ── ENGAGEMENT TERMS (/pricing) ──────────────────────────────────────── */
export const ENGAGEMENT = {
  eyebrow: 'How Engagements Run',
  title: 'Fixed scope, formal handover, optional support.',
  lead: 'Every build follows the same shape: scoped after the diagnostic, clocked from Access Lock, closed with a formal handover. No open-ended retainer disguised as a project.',
  terms: [
    { term: 'Timeline', def: 'Starts at Access Lock, never at contract signature. Starter lands in 10 business days; Growth in 2-3 weeks; Scale in 4-6 weeks.' },
    { term: 'Scoping', def: 'The founding diagnostic produces the scope, timeline, and price range. You approve the number before the build starts - no surprise line items mid-project.' },
    { term: 'Handover', def: 'Runbook, workflow map, known limitations, and named responsibilities - reviewed together in one session. The build phase closes formally.' },
    { term: 'Ownership', def: 'The workflows run in your accounts on your tools. Walk away after handover and everything keeps working - and stays yours.' },
    { term: 'Support', def: 'The optional Managed Plan adds hour-capped support, monitoring, and change requests on a monthly basis. It is not required to keep the system running.' },
    { term: 'Changes', def: 'In-build changes go through the UAT punch list. Post-handover changes run through the Managed Plan or a scoped mini-build.' },
  ],
};

/* ── ABOUT - story (/about) ───────────────────────────────────────────── */
export const STORY = [
  'We started Zeptaz because the same thing kept breaking inside good service businesses: work entered from everywhere, then got stuck between tools. Inquiries lost an owner, records fell behind, and follow-ups slipped.',
  'So we build the boring, load-bearing systems that keep work moving. Connected workflows across intake, sales, onboarding, marketing operations, and reporting, with AI kept inside a controlled, human-approved loop.',
  'We are operator-first and specific. We work in workflow maps, examples, and operational consequences, not jargon or guaranteed-revenue claims.',
];
