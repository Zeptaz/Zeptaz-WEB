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
  actor: string;
  action: string | null;
}

export interface CaseStudy {
  slug: WorkSlug;
  number: string;
  theme: 'lead' | 'campaign' | 'workstation' | 'media';
  question: string;
  serviceLinks: Array<{ label: string; href: string }>;
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
    theme: 'lead',
    question: 'Who owns this enquiry?',
    serviceLinks: [{"label":"Sales workflows","href":"/services#sales"},{"label":"Recruitment workflows","href":"/services#recruitment"}],
    number: '01',
    eyebrow: 'Enquiry operations',
    title: 'Turn an enquiry into an owned next step.',
    shortTitle: 'Lead intake & follow-up',
    description:
      'See Maya get an answer, a named adviser, a reviewed reply and a scheduled callback.',
    audience: 'Recruitment, admissions, and service-business sales teams.',
    problem:
      'Customer questions, consented enquiries, lead records, ownership, and follow-ups become disconnected across websites, inboxes, spreadsheets, and CRMs.',
    solution:
      'One controlled path connects a grounded customer conversation to structured intake, validation, routing, a human-approved response, and a scheduled next action.',
    value: 'The enquiry has an owner, an approved reply and a scheduled callback.',
    accent: '#39d98a',
    services: ['Recruitment automation', 'Sales workflow automation'],
    workflow: ['Question', 'Evidence', 'Consent', 'Validate', 'Assign', 'Approve', 'Follow up'],
    features: [
      { title: 'Grounded answers', description: 'Answers expose the approved information used instead of presenting an unsupported AI response.' },
      { title: 'Consent-first capture', description: 'Contact permission is collected explicitly and stored separately from the conversation.' },
      { title: 'Explainable routing', description: 'Validation, duplicate checks, categorization, priority, and fallback ownership stay visible.' },
      { title: 'Human approval', description: 'A team member approves the prepared reply before scheduling the next action in this demo.' },
      { title: 'Operational timeline', description: 'The demo records each completed handoff and decision in an inspectable session history.' },
      { title: 'Stale-work protection', description: 'The next action is scheduled so the enquiry does not disappear into an inbox.' },
    ],
    technology: ['Next.js', 'NestJS', 'Zod', 'PostgreSQL', 'Hybrid retrieval', 'SSE'],
    integrations: ['CRM / ATS', 'n8n', 'Email', 'Messaging'],
    demoTitle: 'Follow Maya from question to callback',
    demoDescription: 'A fictional programme enquiry moves through evidence, consent, routing, approval, and follow-up.',
    demoSteps: [
  {
    "label": "A prospective student asks a question",
    "title": "A prospective student asks a question",
    "description": "Maya wants to know what she needs to apply.",
    "actor": "Customer",
    "action": "Prepare an answer",
    "event": ""
  },
  {
    "label": "An answer from approved information",
    "title": "An answer from approved information",
    "description": "The assistant uses the programme information; an adviser confirms individual requirements.",
    "actor": "AI prepares an answer",
    "action": "See Maya’s callback request",
    "event": ""
  },
  {
    "label": "Maya asks to be contacted",
    "title": "Maya asks to be contacted",
    "description": "These are Maya’s fictional details and permission—not yours.",
    "actor": "Customer",
    "action": "Save the enquiry",
    "event": ""
  },
  {
    "label": "Priya receives the enquiry",
    "title": "Priya receives the enquiry",
    "description": "The system assigns an adviser and prepares a reply for you to review.",
    "actor": "You approve",
    "action": "Approve reply",
    "event": ""
  },
  {
    "label": "The reply is approved",
    "title": "The reply is approved",
    "description": "Priya owns the next action. The callback is ready to schedule.",
    "actor": "System prepares follow-up",
    "action": "Schedule callback",
    "event": ""
  },
  {
    "label": "Callback scheduled",
    "title": "Callback scheduled",
    "description": "The enquiry has an owner and a clear next action. No email was sent.",
    "actor": "Result",
    "action": null,
    "event": ""
  }
],
    implementationNote:
      'Interactive showcase built from working chatbot, lead-platform, follow-up queue, and orchestration patterns. Customer records, AI output, CRM writes, and notifications are simulated with synthetic data.',
    cta: 'Discuss your enquiry workflow',
  },
  {
    slug: 'campaign-operations',
    theme: 'campaign',
    question: 'Can a mistake be caught before a post goes out?',
    serviceLinks: [{"label":"Marketing operations","href":"/services#marketing-ops"}],
    number: '02',
    eyebrow: 'Marketing operations',
    title: 'Move campaigns forward with the approved version.',
    shortTitle: 'Governed campaign operations',
    description:
      'Catch an unsupported deadline, approve corrected social posts, and see their simulated delivery.',
    audience: 'Marketing teams coordinating briefs, evidence, creative work, reviewers, and multiple channels.',
    problem:
      'Claims, assets, reviewers, and publishing dates are scattered across tools, leaving teams to chase approvals and reconstruct which version was accepted.',
    solution:
      'The system checks the draft against the event brief, prepares corrected posts and schedules only the version a person approved.',
    value: 'The approved version reaches its schedule with a reviewable result.',
    accent: '#f2a900',
    services: ['Marketing operations automation'],
    workflow: ['Brief', 'Evidence', 'Claims', 'Drafts', 'Review', 'Approve', 'Schedule', 'Report'],
    features: [
      { title: 'Evidence-linked claims', description: 'Reviewers can trace important wording back to the approved brief.' },
      { title: 'Deterministic checks', description: 'Red and amber rules flag unsupported dates, guarantees, and risky claims.' },
      { title: 'Channel variants', description: 'The corrected message is prepared for three social channels and reviewed together.' },
      { title: 'Exact-version approval', description: 'The approved posts are saved as an exact snapshot. Supporting details include its browser-generated fingerprint.' },
      { title: 'Durable workflow view', description: 'The guided example schedules only approved posts and shows their simulated delivery confirmations.' },
      { title: 'Reviewable reporting', description: 'Synthetic campaign signals are summarized without inventing causation or ROI.' },
    ],
    technology: ['Next.js', 'Fastify', 'Temporal', 'Satori / Resvg', 'SHA-256', 'Supabase architecture'],
    integrations: ['LinkedIn', 'Meta', 'X', 'Asset storage'],
    demoTitle: 'Take one campaign from brief to schedule',
    demoDescription: 'A fictional Open Day campaign moves through evidence checks, creative review, approval, and durable execution.',
    demoSteps: [
  {
    "label": "The team needs to promote an Open Day",
    "title": "The team needs to promote an Open Day",
    "description": "Start with the confirmed event details.",
    "actor": "Marketing team",
    "action": "Prepare social posts",
    "event": ""
  },
  {
    "label": "The draft is ready to check",
    "title": "The draft is ready to check",
    "description": "Compare the draft with the event details before anyone approves it.",
    "actor": "AI prepares a draft",
    "action": "Check against the event details",
    "event": ""
  },
  {
    "label": "The deadline is not supported",
    "title": "The deadline is not supported",
    "description": "The brief gives an event date, but no application deadline.",
    "actor": "System flags a problem",
    "action": "Use the corrected wording",
    "event": ""
  },
  {
    "label": "Three corrected posts are ready",
    "title": "Three corrected posts are ready",
    "description": "Review the posts below. Nothing is approved yet.",
    "actor": "You approve",
    "action": "Approve these posts",
    "event": ""
  },
  {
    "label": "Only these approved posts can be published",
    "title": "Only these approved posts can be published",
    "description": "The saved posts are ready for the scheduled time.",
    "actor": "System prepares publishing",
    "action": "Schedule and show publishing",
    "event": ""
  },
  {
    "label": "The approved posts were delivered",
    "title": "The approved posts were delivered",
    "description": "Three delivery confirmations in this simulation—not measured campaign performance.",
    "actor": "Result",
    "action": null,
    "event": ""
  }
],
    implementationNote:
      'The evidence, claim checking, rendering, approval, and workflow architecture come from working project code. AI generation, social publishing, platform metrics, and long-running execution are simulated.',
    cta: 'Discuss your campaign workflow',
  },
  {
    slug: 'operator-workstation',
    theme: 'workstation',
    question: 'How does a person stay in control of an AI fix?',
    serviceLinks: [{"label":"Custom workflow delivery","href":"/process"}],
    number: '03',
    eyebrow: 'Controlled AI operations',
    title: 'Give AI a task. Keep control of the work.',
    shortTitle: 'AI operator workstation',
    description:
      'Follow a project check, approve one proposed fix, and see a handover ready for review.',
    audience: 'Founders, engineering leads, and operators working across projects, tasks, notes, and development tools.',
    problem:
      'Project context is fragmented, while many AI tools hide their plan, requested permissions, and execution history.',
    solution:
      'The workstation gathers context, proposes bounded actions, requests approval, supervises execution, and returns evidence instead of claiming success silently.',
    value: 'The operator can inspect the work and decide what happens next.',
    accent: '#62d7ff',
    services: ['Internal operations', 'Controlled AI assistance'],
    workflow: ['Command', 'Context', 'Plan', 'Permissions', 'Approve', 'Execute', 'Evidence'],
    features: [
      { title: 'Multimodal command surface', description: 'This browser walkthrough uses a prepared text request. Voice input is part of the underlying local assistant.' },
      { title: 'Project context assembly', description: 'Repository activity, tests, tasks, and notes become one inspectable brief.' },
      { title: 'Permission boundaries', description: 'The approved plan permits one prepared fix. Deployment, external messages and unrelated changes remain out of bounds.' },
      { title: 'Supervised execution', description: 'The guided example waits for approval before preparing a fix. Leaving the walkthrough pauses processing.' },
      { title: 'Persistent memory', description: 'A follow-up receipt identifies the decision and session. Demo records are kept only for this browser visit.' },
      { title: 'Evidence-first results', description: 'Changed files, test output, remaining risk, and next actions close the loop.' },
    ],
    technology: ['FastAPI', 'WebSockets', 'Gemini Live architecture', 'SQLite WAL', 'AudioWorklet', 'Three.js'],
    integrations: ['Google Workspace', 'Notion', 'Git', 'Desktop tools'],
    demoTitle: 'Resume Project Atlas under operator control',
    demoDescription: 'The workstation assembles context, proposes a bounded plan, waits for approval, and returns test evidence.',
    demoSteps: [
  {
    "label": "Check the project before work continues",
    "title": "Check the project before work continues",
    "description": "The assistant will assess first, without changing anything.",
    "actor": "Project owner",
    "action": "Check the project",
    "event": ""
  },
  {
    "label": "The form accepts an answer containing only spaces",
    "title": "The form accepts an answer containing only spaces",
    "description": "A blank-looking answer should not pass the form’s checks.",
    "actor": "AI identifies an issue",
    "action": "Show the proposed fix",
    "event": ""
  },
  {
    "label": "One small change is proposed",
    "title": "One small change is proposed",
    "description": "Reject blank answers and add a check. No deployment or external messages are allowed.",
    "actor": "You approve",
    "action": "Approve this fix",
    "event": ""
  },
  {
    "label": "The approved work is ready",
    "title": "The approved work is ready",
    "description": "Permission covers only preparing the fix and its check in project files.",
    "actor": "System waits for your action",
    "action": "Run the approved fix",
    "event": ""
  },
  {
    "label": "The simulated checks pass",
    "title": "The simulated checks pass",
    "description": "The blank-answer check now passes. A person still needs to review the prepared changes.",
    "actor": "System checks the result",
    "action": "Create the handover",
    "event": ""
  },
  {
    "label": "A review package is ready",
    "title": "A review package is ready",
    "description": "The project owner receives the prepared changes, checks and next action. Nothing was deployed.",
    "actor": "Result",
    "action": null,
    "event": ""
  }
],
    implementationNote:
      'The interface and architecture are based on a working local assistant with broad automated test coverage. Model calls, coding subprocesses, desktop control, and third-party integrations are simulated in this browser-safe showcase.',
    cta: 'Discuss your internal workflow',
  },
  {
    slug: 'media-intelligence',
    theme: 'media',
    question: 'Which source disagrees?',
    serviceLinks: [{"label":"Reporting and documents","href":"/services#reporting-documents"}],
    number: '04',
    eyebrow: 'Reporting & intelligence',
    title: 'Turn conflicting sources into a clearer brief.',
    shortTitle: 'Media intelligence desk',
    description:
      'Follow the coverage, compare a disagreement, and approve a brief that keeps the unknown date visible.',
    audience: 'Communications, research, risk, and market-intelligence teams.',
    problem:
      'Website and video monitoring produces noisy, duplicated information that is difficult to verify and convert into an accountable report.',
    solution:
      'The system groups repeated coverage, compares conflicting claims and prepares a source-linked brief for a person to approve.',
    value: 'The final brief preserves its sources, uncertainty and reviewer decision.',
    accent: '#b798ff',
    services: ['Reporting automation', 'Document automation'],
    workflow: ['Sources', 'Ingest', 'Validate', 'Dedupe', 'Group', 'Review', 'Approve', 'Report'],
    features: [
      { title: 'Multi-source intake', description: 'Website and video sources share one observable processing queue.' },
      { title: 'Duplicate control', description: 'Related coverage is grouped instead of being mistaken for independent confirmation.' },
      { title: 'Evidence comparison', description: 'Conflicting claims remain visible beside their original source excerpts.' },
      { title: 'Analyst review', description: 'The prepared summary requires explicit approval, with the unknown date clearly retained.' },
      { title: 'Operational health', description: 'Read-only processing history and source records are available after the walkthrough.' },
      { title: 'Traceable reports', description: 'The output preserves evidence, uncertainty, and the reviewer decision.' },
    ],
    technology: ['FastAPI', 'Next.js', 'PostgreSQL', 'Redis', 'Qdrant', 'MinIO'],
    integrations: ['Web sources', 'YouTube', 'Email alerts', 'Local models'],
    demoTitle: 'Build an analyst-reviewed brief from eight sources',
    demoDescription: 'A fictional policy update is grouped, compared, summarised and approved with its unknown date visible.',
    demoSteps: [
  {
    "label": "Eight articles and videos cover the policy",
    "title": "Eight articles and videos cover the policy",
    "description": "Find what changed and what still needs confirmation.",
    "actor": "Research team",
    "action": "Review the coverage",
    "event": ""
  },
  {
    "label": "Repeated coverage is grouped together",
    "title": "Repeated coverage is grouped together",
    "description": "Eight items become five distinct reports. Two claims disagree.",
    "actor": "System groups coverage",
    "action": "Compare the two claims",
    "event": ""
  },
  {
    "label": "Two sources disagree about the start date",
    "title": "Two sources disagree about the start date",
    "description": "The official notice does not yet confirm when the policy starts.",
    "actor": "You review the sources",
    "action": "Prepare a summary",
    "event": ""
  },
  {
    "label": "The summary keeps the disagreement visible",
    "title": "The summary keeps the disagreement visible",
    "description": "The draft preserves both sources instead of treating the date as settled.",
    "actor": "AI prepares a draft",
    "action": "Review the summary",
    "event": ""
  },
  {
    "label": "The date is still unconfirmed",
    "title": "The date is still unconfirmed",
    "description": "Approve only with that limitation clearly stated in the report.",
    "actor": "You approve",
    "action": "Approve with the date marked unconfirmed",
    "event": ""
  },
  {
    "label": "The brief is ready",
    "title": "The brief is ready",
    "description": "The report names its sources, reviewer and the question that still needs an answer.",
    "actor": "Result",
    "action": null,
    "event": ""
  }
],
    implementationNote:
      'The product structure reflects a working multi-service media-monitoring codebase. Sources, crawling, transcription, model processing, storage services, and alerts are simulated with fictional data for this public demo.',
    cta: 'Discuss your reporting workflow',
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

export const GUIDED_STORIES: Record<WorkSlug, { intro: string; customer: string; problem: string; outcome: string; recap: string[] }> = {
  "lead-operations": {
    "intro": "Turn a question into a scheduled callback",
    "customer": "An admissions team",
    "problem": "Questions arrive on the website, but follow-ups can get lost.",
    "outcome": "See Maya get an answer, a named adviser and a callback.",
    "recap": [
      "Maya asked about applying.",
      "The system prepared an answer and assigned Priya.",
      "You approved the reply before scheduling the callback."
    ]
  },
  "campaign-operations": {
    "intro": "Catch a mistake before a campaign goes out",
    "customer": "A marketing team",
    "problem": "A draft can include details that the event brief never confirmed.",
    "outcome": "Catch an unsupported deadline, approve corrected posts and follow their simulated delivery.",
    "recap": [
      "The team supplied an Open Day brief.",
      "The system flagged a deadline and prepared corrected posts.",
      "You approved the exact posts before simulated publishing."
    ]
  },
  "operator-workstation": {
    "intro": "Let AI prepare a fix—with your approval",
    "customer": "A team managing a software project",
    "problem": "A small form error needs attention, but the assistant should not make changes without permission.",
    "outcome": "Review one proposed fix and see a handover ready for a person to check.",
    "recap": [
      "The team asked for a project check.",
      "The assistant found a blank-answer problem and prepared a bounded fix.",
      "You approved the fix; a person still reviews it before release."
    ]
  },
  "media-intelligence": {
    "intro": "Turn scattered coverage into a useful brief",
    "customer": "A team tracking policy news",
    "problem": "Repeated coverage and conflicting claims make it hard to know what to trust.",
    "outcome": "Compare the disagreement and approve a brief that keeps the uncertainty visible.",
    "recap": [
      "Eight articles and videos covered the policy.",
      "The system grouped repeats and found a disagreement.",
      "You approved a brief that keeps the date marked unconfirmed."
    ]
  }
};
