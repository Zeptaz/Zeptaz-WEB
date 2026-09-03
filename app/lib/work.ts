export type WorkSlug =
  | 'lead-operations'
  | 'campaign-operations'
  | 'operator-workstation'
  | 'media-intelligence';

export interface DemoStep {
  label: string;
  title: string;
  description: string;
  event: string;
}

export interface CaseStudy {
  slug: WorkSlug;
  number: string;
  eyebrow: string;
  title: string;
  shortTitle: string;
  description: string;
  audience: string;
  problem: string;
  solution: string;
  value: string;
  accent: string;
  services: string[];
  workflow: string[];
  features: Array<{ title: string; description: string }>;
  technology: string[];
  integrations: string[];
  demoTitle: string;
  demoDescription: string;
  demoSteps: DemoStep[];
  implementationNote: string;
  cta: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'lead-operations',
    number: '01',
    eyebrow: 'Enquiry operations',
    title: 'From website question to owned follow-up.',
    shortTitle: 'Lead intake & follow-up',
    description:
      'A connected enquiry workflow that answers from approved information, captures consent, assigns an owner, and keeps the next action visible.',
    audience: 'Recruitment, admissions, and service-business sales teams.',
    problem:
      'Customer questions, consented enquiries, lead records, ownership, and follow-ups become disconnected across websites, inboxes, spreadsheets, and CRMs.',
    solution:
      'One controlled path connects a grounded customer conversation to structured intake, validation, routing, a human-approved response, and a scheduled next action.',
    value: 'Every enquiry leaves the demo with an owner, an explainable status, and a next step.',
    accent: '#39d98a',
    services: ['Recruitment automation', 'Sales workflow automation'],
    workflow: ['Question', 'Evidence', 'Consent', 'Validate', 'Assign', 'Approve', 'Follow up'],
    features: [
      { title: 'Grounded answers', description: 'Answers expose the approved information used instead of presenting an unsupported AI response.' },
      { title: 'Consent-first capture', description: 'Contact permission is collected explicitly and stored separately from the conversation.' },
      { title: 'Explainable routing', description: 'Validation, duplicate checks, categorization, priority, and fallback ownership stay visible.' },
      { title: 'Human approval', description: 'A team member edits and approves the drafted response before any outbound action.' },
      { title: 'Operational timeline', description: 'Each handoff, decision, and retry is represented as an append-only event.' },
      { title: 'Stale-work protection', description: 'The next action is scheduled so the enquiry does not disappear into an inbox.' },
    ],
    technology: ['Next.js', 'NestJS', 'Zod', 'PostgreSQL', 'Hybrid retrieval', 'SSE'],
    integrations: ['CRM / ATS', 'n8n', 'Email', 'Messaging'],
    demoTitle: 'Follow Maya from question to callback',
    demoDescription: 'A fictional programme enquiry moves through evidence, consent, routing, approval, and follow-up.',
    demoSteps: [
      { label: 'Ask', title: 'A specific question arrives', description: 'Maya asks what documents she needs and when the next intake begins.', event: 'conversation.received' },
      { label: 'Ground', title: 'Approved information supports the answer', description: 'The assistant returns a concise answer with two inspectable source cards.', event: 'evidence.matched · 2 sources' },
      { label: 'Consent', title: 'The visitor requests a callback', description: 'Contact details and explicit consent enter a validated form.', event: 'lead.capture.consented' },
      { label: 'Route', title: 'The record is checked and assigned', description: 'Validation, deduplication, categorization, and fallback ownership run in sequence.', event: 'owner.assigned · priya.s' },
      { label: 'Review', title: 'An operator sees the full context', description: 'The queue item explains priority, source, owner, and the next required action.', event: 'queue.item.created' },
      { label: 'Approve', title: 'The response waits for a person', description: 'Priya reviews the AI-assisted draft and approves the exact outgoing text.', event: 'draft.approved · priya.s' },
      { label: 'Follow up', title: 'The next action is recorded', description: 'A callback is scheduled and the full decision trail remains visible.', event: 'followup.scheduled · +2h' },
    ],
    implementationNote:
      'Interactive showcase built from working chatbot, lead-platform, follow-up queue, and orchestration patterns. Customer records, AI output, CRM writes, and notifications are simulated with synthetic data.',
    cta: 'Discuss an enquiry workflow like this',
  },
  {
    slug: 'campaign-operations',
    number: '02',
    eyebrow: 'Marketing operations',
    title: 'Campaign automation with facts and people still in control.',
    shortTitle: 'Governed campaign operations',
    description:
      'A governed marketing workflow connecting evidence, creative production, exact-version approval, scheduling, and operational visibility.',
    audience: 'Marketing teams coordinating briefs, evidence, creative work, reviewers, and multiple channels.',
    problem:
      'Claims, assets, reviewers, and publishing dates are scattered across tools, leaving teams to chase approvals and reconstruct which version was accepted.',
    solution:
      'The workspace links claims to evidence, checks risky wording, creates channel variants, hashes the final payload, and schedules only the approved version.',
    value: 'AI can accelerate drafting without becoming the authority for facts or final publication.',
    accent: '#f2a900',
    services: ['Marketing operations automation'],
    workflow: ['Brief', 'Evidence', 'Claims', 'Drafts', 'Review', 'Approve', 'Schedule', 'Report'],
    features: [
      { title: 'Evidence-linked claims', description: 'Reviewers can trace important wording back to the approved brief.' },
      { title: 'Deterministic checks', description: 'Red and amber rules flag unsupported dates, guarantees, and risky claims.' },
      { title: 'Channel variants', description: 'One approved narrative becomes editable formats for each social channel.' },
      { title: 'Exact-version approval', description: 'A content hash changes whenever the approved payload changes.' },
      { title: 'Durable workflow view', description: 'Waiting, retrying, blocked, and completed work is visible to operators.' },
      { title: 'Reviewable reporting', description: 'Synthetic campaign signals are summarized without inventing causation or ROI.' },
    ],
    technology: ['Next.js', 'Fastify', 'Temporal', 'Satori / Resvg', 'SHA-256', 'Supabase architecture'],
    integrations: ['LinkedIn', 'Meta', 'X', 'Asset storage'],
    demoTitle: 'Take one campaign from brief to schedule',
    demoDescription: 'A fictional Open Day campaign moves through evidence checks, creative review, approval, and durable execution.',
    demoSteps: [
      { label: 'Brief', title: 'The campaign begins with a controlled brief', description: 'The objective, channels, owner, date, and approved evidence are visible together.', event: 'campaign.brief.ready' },
      { label: 'Check', title: 'A risky claim is stopped', description: 'The fact scanner blocks an application deadline that is not supported by the source.', event: 'claim.blocked · unsupported date' },
      { label: 'Correct', title: 'The operator resolves the claim', description: 'The wording is corrected to match the approved evidence before drafting continues.', event: 'claim.resolved · evidence linked' },
      { label: 'Create', title: 'Channel variants are prepared', description: 'Editable LinkedIn, Instagram, and X versions share one controlled narrative.', event: 'variants.generated · 3' },
      { label: 'Version', title: 'The exact payload is identified', description: 'Editing the final copy produces a new SHA-256 approval fingerprint.', event: 'payload.hash.updated' },
      { label: 'Approve', title: 'A named reviewer approves the version', description: 'Only the currently hashed payload moves into the publishing queue.', event: 'payload.approved · alex.m' },
      { label: 'Schedule', title: 'The durable workflow waits safely', description: 'The job is scheduled and its waiting, retry, and completion states remain inspectable.', event: 'workflow.waiting · publish window' },
      { label: 'Report', title: 'Signals return for human interpretation', description: 'A clearly synthetic report organizes reactions without claiming business causation.', event: 'report.ready · demo data' },
    ],
    implementationNote:
      'The evidence, claim checking, rendering, approval, and workflow architecture come from working project code. AI generation, social publishing, platform metrics, and long-running execution are simulated.',
    cta: 'See how this fits your marketing operations',
  },
  {
    slug: 'operator-workstation',
    number: '03',
    eyebrow: 'Controlled AI operations',
    title: 'An AI workstation that asks before it acts.',
    shortTitle: 'AI operator workstation',
    description:
      'A multimodal operator console for assembling project context, supervising work, and preserving an approval and audit trail.',
    audience: 'Founders, engineering leads, and operators working across projects, tasks, notes, and development tools.',
    problem:
      'Project context is fragmented, while many AI tools hide their plan, requested permissions, and execution history.',
    solution:
      'The workstation gathers context, proposes bounded actions, requests approval, supervises execution, and returns evidence instead of claiming success silently.',
    value: 'Advanced AI assistance remains interruptible, reviewable, and accountable to the operator.',
    accent: '#62d7ff',
    services: ['Internal operations', 'Controlled AI assistance'],
    workflow: ['Command', 'Context', 'Plan', 'Permissions', 'Approve', 'Execute', 'Evidence'],
    features: [
      { title: 'Multimodal command surface', description: 'Voice and text concepts share a single operator-first interface.' },
      { title: 'Project context assembly', description: 'Repository activity, tests, tasks, and notes become one inspectable brief.' },
      { title: 'Permission boundaries', description: 'Read, write, external, and destructive actions are presented before execution.' },
      { title: 'Supervised execution', description: 'A visible session log, pause control, and emergency stop keep the operator present.' },
      { title: 'Persistent memory', description: 'Useful decisions and follow-ups can be stored without hiding where they came from.' },
      { title: 'Evidence-first results', description: 'Changed files, test output, remaining risk, and next actions close the loop.' },
    ],
    technology: ['FastAPI', 'WebSockets', 'Gemini Live architecture', 'SQLite WAL', 'AudioWorklet', 'Three.js'],
    integrations: ['Google Workspace', 'Notion', 'Git', 'Desktop tools'],
    demoTitle: 'Resume Project Atlas under operator control',
    demoDescription: 'The workstation assembles context, proposes a bounded plan, waits for approval, and returns test evidence.',
    demoSteps: [
      { label: 'Command', title: 'The operator names the outcome', description: '“Resume Project Atlas and tell me what needs attention.”', event: 'command.accepted · project resume' },
      { label: 'Context', title: 'The system assembles a project brief', description: 'Git activity, tests, tasks, notes, and risks appear as inspectable inputs.', event: 'context.scan.complete · 4 sources' },
      { label: 'Plan', title: 'Actions are proposed before execution', description: 'The workstation recommends tests, a bounded code change, and a review summary.', event: 'plan.proposed · 3 actions' },
      { label: 'Permissions', title: 'The operator narrows access', description: 'Repository write is allowed; email and desktop control remain denied.', event: 'permissions.locked · least privilege' },
      { label: 'Approve', title: 'Only selected work is authorized', description: 'The operator approves tests and a prepared change, with an emergency stop available.', event: 'execution.approved · 2 actions' },
      { label: 'Supervise', title: 'The coding session stays visible', description: 'Progress, tool activity, test output, and pause controls remain on screen.', event: 'session.complete · tests green' },
      { label: 'Evidence', title: 'The result closes with proof', description: 'The summary lists files, tests, remaining risks, and a saved follow-up task.', event: 'result.recorded · audit sealed' },
    ],
    implementationNote:
      'The interface and architecture are based on a working local assistant with broad automated test coverage. Model calls, coding subprocesses, desktop control, and third-party integrations are simulated in this browser-safe showcase.',
    cta: 'Discuss a controlled AI operator',
  },
  {
    slug: 'media-intelligence',
    number: '04',
    eyebrow: 'Reporting & intelligence',
    title: 'Turn noisy monitoring into a reviewable intelligence brief.',
    shortTitle: 'Media intelligence desk',
    description:
      'A media operations console that converts multiple incoming sources into organized evidence, analyst-reviewed summaries, and traceable reports.',
    audience: 'Communications, research, risk, and market-intelligence teams.',
    problem:
      'Website and video monitoring produces noisy, duplicated information that is difficult to verify and convert into an accountable report.',
    solution:
      'One workspace exposes ingestion, validation, duplicate detection, topic grouping, evidence comparison, analyst editing, system health, and approval.',
    value: 'The final brief remains connected to its evidence and honest about uncertainty.',
    accent: '#b798ff',
    services: ['Reporting automation', 'Document automation'],
    workflow: ['Sources', 'Ingest', 'Validate', 'Dedupe', 'Group', 'Review', 'Approve', 'Report'],
    features: [
      { title: 'Multi-source intake', description: 'Website and video sources share one observable processing queue.' },
      { title: 'Duplicate control', description: 'Related coverage is grouped instead of being mistaken for independent confirmation.' },
      { title: 'Evidence comparison', description: 'Conflicting claims remain visible beside their original source excerpts.' },
      { title: 'Analyst review', description: 'Generated summaries are editable and require approval before becoming a report.' },
      { title: 'Operational health', description: 'Parser failures, fallbacks, retries, and source health remain visible.' },
      { title: 'Traceable reports', description: 'The output preserves evidence, uncertainty, and the reviewer decision.' },
    ],
    technology: ['FastAPI', 'Next.js', 'PostgreSQL', 'Redis', 'Qdrant', 'MinIO'],
    integrations: ['Web sources', 'YouTube', 'Email alerts', 'Local models'],
    demoTitle: 'Build an analyst-reviewed brief from eight sources',
    demoDescription: 'A fictional logistics policy update is ingested, grouped, checked, edited, and approved.',
    demoSteps: [
      { label: 'Monitor', title: 'Eight prepared sources are ready', description: 'Six fictional publishers and two video channels enter one monitoring view.', event: 'source.refresh.started · 8 sources' },
      { label: 'Process', title: 'The queue exposes every stage', description: 'Fetch, validation, duplicate detection, analysis, and topic assignment remain visible.', event: 'processing.complete · 8 items' },
      { label: 'Group', title: 'Related coverage becomes one topic', description: 'Duplicates collapse into a coherent timeline without inflating source agreement.', event: 'topic.created · logistics policy' },
      { label: 'Compare', title: 'Conflicting claims remain visible', description: 'Two sources disagree on the effective date and are shown side by side.', event: 'conflict.flagged · effective date' },
      { label: 'Draft', title: 'A sourced summary is prepared', description: 'The draft cites the evidence and marks the unresolved date as uncertain.', event: 'summary.drafted · evidence linked' },
      { label: 'Review', title: 'The analyst edits the interpretation', description: 'A human clarifies the uncertainty before approving the final brief.', event: 'summary.reviewed · sam.k' },
      { label: 'Report', title: 'The brief and system health are inspectable', description: 'The final report includes evidence while parser and retry status remain available.', event: 'report.approved · health nominal' },
    ],
    implementationNote:
      'The product structure reflects a working multi-service media-monitoring codebase. Sources, crawling, transcription, model processing, storage services, and alerts are simulated with fictional data for this public demo.',
    cta: 'Explore a reporting workflow for your team',
  },
];

export const CASE_STUDY_BY_SLUG = Object.fromEntries(
  CASE_STUDIES.map((study) => [study.slug, study]),
) as Record<WorkSlug, CaseStudy>;

export function isWorkSlug(value: string): value is WorkSlug {
  return Object.prototype.hasOwnProperty.call(CASE_STUDY_BY_SLUG, value);
}

export function clampDemoStep(step: number, total: number): number {
  if (!Number.isFinite(step) || total < 1) return 0;
  return Math.min(Math.max(Math.trunc(step), 0), total - 1);
}
