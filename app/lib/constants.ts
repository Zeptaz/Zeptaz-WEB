// ─── Agents ──────────────────────────────────────────────────────────
export const AGENTS = [
  {
    id: 'onboarding',
    name: 'Onboarding Agent',
    icon: 'UserPlus',
    description: 'Personalized onboarding based on behavior & plan type',
    accent: '#3B82F6'
  },
  {
    id: 'support',
    name: 'Support Agent',
    icon: 'Headphones',
    description: 'Auto-resolve tickets, escalate complex issues',
    accent: '#10B981'
  },
  {
    id: 'leadgen',
    name: 'Lead Gen Agent',
    icon: 'Target',
    description: 'Identify, score, and qualify leads from multiple sources',
    accent: '#DC143C'
  },
  {
    id: 'outreach',
    name: 'Outreach Agent',
    icon: 'Mail',
    description: 'Personalized cold email sequences with smart follow-ups',
    accent: '#F59E0B'
  },
  {
    id: 'social',
    name: 'Social Media Agent',
    icon: 'Share2',
    description: 'Content creation, scheduling, engagement tracking',
    accent: '#8B5CF6'
  },
  {
    id: 'sales',
    name: 'Sales Pipeline Agent',
    icon: 'TrendingUp',
    description: 'CRM updates, proposals, sales reports',
    accent: '#14B8A6'
  },
  {
    id: 'prediction',
    name: 'Prediction Agent',
    icon: 'Brain',
    description: 'Simulate audience reactions before you spend',
    accent: '#DC143C'
  },
  {
    id: 'content',
    name: 'Content Agent',
    icon: 'PenTool',
    description: 'Blog posts, ad copy, SEO content in brand voice',
    accent: '#F59E0B'
  },
  {
    id: 'hr',
    name: 'HR & Recruitment Agent',
    icon: 'Users',
    description: 'Resume screening, interview scheduling, job distribution',
    accent: '#10B981'
  },
  {
    id: 'finance',
    name: 'Financial Ops Agent',
    icon: 'DollarSign',
    description: 'Invoices, payment reminders, expense tracking',
    accent: '#3B82F6'
  }
] as const;

// ─── Integrations ─────────────────────────────────────────────────────
export const INTEGRATIONS = [
  { id: 'slack',       name: 'Slack',         description: 'Team notifications',       icon: 'MessageSquare' },
  { id: 'hubspot',     name: 'HubSpot',        description: 'CRM sync',                 icon: 'Building2' },
  { id: 'salesforce',  name: 'Salesforce',     description: 'Pipeline automation',      icon: 'Cloud' },
  { id: 'sheets',      name: 'Google Sheets',  description: 'Data export & reporting',  icon: 'Table' },
  { id: 'stripe',      name: 'Stripe',         description: 'Payment tracking',         icon: 'CreditCard' },
  { id: 'zapier',      name: 'Zapier',         description: '5,000+ app connections',   icon: 'Zap' },
  { id: 'gmail',       name: 'Gmail',          description: 'Email automation',         icon: 'Mail' },
  { id: 'notion',      name: 'Notion',         description: 'Knowledge base sync',      icon: 'FileText' },
  { id: 'github',      name: 'GitHub',         description: 'Dev workflow triggers',    icon: 'Github' },
  { id: 'whatsapp',    name: 'WhatsApp',       description: 'Customer messaging',       icon: 'MessageCircle' },
  { id: 'trello',      name: 'Trello',         description: 'Task management',          icon: 'LayoutGrid' },
  { id: 'quickbooks',  name: 'QuickBooks',     description: 'Finance & invoicing',      icon: 'Calculator' },
] as const;

// ─── Before / After ────────────────────────────────────────────────────
export const BEFORE_AFTER = [
  { before: 'Manual lead qualification taking hours',      after: 'Leads auto-qualified in under 60 seconds' },
  { before: 'Missed follow-ups and lost deals',           after: 'Automated follow-ups — zero leads slip through' },
  { before: '9-to-5 customer support only',              after: '24/7 AI support with instant response' },
  { before: 'Spreadsheet chaos for reporting',           after: 'Real-time dashboards updated automatically' },
  { before: 'Reactive, gut-feel decisions',              after: 'Data-driven insights before you spend' },
  { before: 'Scaling means hiring more people',          after: 'Scale operations without growing headcount' },
] as const;

// ─── Team Members ─────────────────────────────────────────────────────
export const TEAM_MEMBERS = [
  {
    id: 'tevin',
    name: 'Tevin Bandara',
    role: 'Co-Founder',
    focus: 'Strategy, client relationships, business development',
    initials: 'TB',
    image: '/team/Tevin.png',
    social: { linkedin: '#', instagram: '#' },
  },
  {
    id: 'sasindu',
    name: 'Sasindu Silva',
    role: 'Co-Founder',
    focus: 'Product design, user experience, brand direction',
    initials: 'SS',
    image: '/team/Sasindu.png',
    social: { linkedin: '#', instagram: '#' },
  },
  {
    id: 'naveen',
    name: 'Naveen Harry',
    role: 'Co-Founder',
    focus: 'Operations, workflow design, agent deployment',
    initials: 'NH',
    image: '/team/Harry.png',
    social: { linkedin: '#', instagram: '#' },
  },
  {
    id: 'jayith',
    name: 'Jayith Wijethunge',
    role: 'Co-Founder',
    focus: 'Technical architecture, AI engineering, integrations',
    initials: 'JW',
    image: '/team/Jayith.png',
    social: { linkedin: '#', github: '#' },
  },
];

// ─── How It Works Phases ──────────────────────────────────────────────
export const PHASES = [
  {
    step: 1,
    title: 'Discovery',
    timeline: 'Week 1',
    description: 'Deep workflow audit of your business. We map every repetitive task and identify the highest-value automation opportunities across your team.',
    icon: 'Search'
  },
  {
    step: 2,
    title: 'Build',
    timeline: 'Week 2–3',
    description: 'Agents are configured and trained on your business context, integrations go live, and memory is populated with your data and brand voice.',
    icon: 'Wrench'
  },
  {
    step: 3,
    title: 'Test',
    timeline: 'Week 4',
    description: 'Validated with real production data. We run parallel tests, measure output quality, and incorporate your feedback before any live traffic.',
    icon: 'FlaskConical'
  },
  {
    step: 4,
    title: 'Launch',
    timeline: 'Week 5',
    description: 'Full deployment to production. Your team is trained on the new workflows and handoff protocols. Agents go live and start delivering value immediately.',
    icon: 'Rocket'
  },
  {
    step: 5,
    title: 'Optimize',
    timeline: 'Week 6–8',
    description: 'Continuous monitoring and improvement. Performance tuned based on real usage data, new automations identified, and agents updated as your business evolves.',
    icon: 'LineChart'
  }
] as const;

// ─── Competitive Advantages ───────────────────────────────────────────
export const ADVANTAGES = [
  {
    id: 'specialized',
    title: 'Specialized, Not Generic',
    description: 'Every agent is trained for your specific industry and use case — not a one-size-fits-all chatbot. Deep domain knowledge baked in from day one.',
    icon: 'Crosshair'
  },
  {
    id: 'memory',
    title: 'Memory-First Architecture',
    description: 'Persistent context means your agents remember every customer, every interaction, every preference. They learn and improve over time without retraining.',
    icon: 'Database'
  },
  {
    id: 'predictive',
    title: 'Predictive Intelligence',
    description: 'MiroFish swarm intelligence is built into every deployment — your agents don\'t just react, they predict and preempt outcomes before they happen.',
    icon: 'TrendingUp'
  },
  {
    id: 'fullstack',
    title: 'Full-Stack Automation',
    description: 'End-to-end execution from data scraping to email sending to CRM updates. No partial solutions. No gaps between tools. Complete workflows, automated.',
    icon: 'Layers'
  },
  {
    id: 'orchestration',
    title: 'Multi-Tool Orchestration',
    description: 'Intelligent routing selects the right tool for each subtask — whether that\'s a language model, a search API, or a custom integration you already use.',
    icon: 'GitBranch'
  },
  {
    id: 'nocode',
    title: 'No-Code Dashboard',
    description: 'Adjust agent behavior, update workflows, and review performance without touching a line of code. Your ops team owns it, not just engineering.',
    icon: 'LayoutDashboard'
  }
] as const;

// ─── Industries ───────────────────────────────────────────────────────
export const INDUSTRIES = [
  { id: 'saas',         name: 'SaaS & Tech',        icon: 'Code',             useCase: 'Automate onboarding, support tickets & churn prediction' },
  { id: 'ecommerce',    name: 'E-commerce',          icon: 'ShoppingCart',     useCase: 'Smart product recommendations & inventory alerts' },
  { id: 'realestate',   name: 'Real Estate',         icon: 'Building2',        useCase: 'Lead qualification & automated property matching' },
  { id: 'healthcare',   name: 'Healthcare',          icon: 'Heart',            useCase: 'Patient scheduling & follow-up automation' },
  { id: 'finance',      name: 'Finance & Crypto',    icon: 'TrendingUp',       useCase: 'Transaction monitoring & compliance reporting' },
  { id: 'education',    name: 'Education',           icon: 'GraduationCap',    useCase: 'Student engagement tracking & enrollment automation' },
  { id: 'legal',        name: 'Legal',               icon: 'Scale',            useCase: 'Document review & client intake automation' },
  { id: 'fnb',          name: 'Restaurants & F&B',   icon: 'UtensilsCrossed',  useCase: 'Reservation management & review response' },
  { id: 'construction', name: 'Construction',        icon: 'HardHat',          useCase: 'Project tracking & subcontractor coordination' },
] as const;

// ─── Stats ────────────────────────────────────────────────────────────
export const STATS = [
  { value: 10, suffix: '+', label: 'AI Agents' },
  { value: 15, suffix: '+', label: 'Industries' },
  { value: 99.9, suffix: '%', label: 'Uptime' }
] as const;

// ─── Pain Points ──────────────────────────────────────────────────────
export const PAIN_POINTS = [
  {
    id: 'manual',
    title: 'Manual Work Overload',
    description: '40–60% of your team\'s time is consumed by repetitive, low-value tasks that could be automated. That\'s time stolen from growth, strategy, and customers.',
    stat: '60%',
    statLabel: 'of work is automatable',
    icon: 'Clock'
  },
  {
    id: 'response',
    title: 'Slow Response Times',
    description: 'Leads go cold in minutes. Tickets pile up. Customers churn because no one responded fast enough. Speed is a competitive advantage you\'re leaving on the table.',
    stat: '5 min',
    statLabel: 'is the ideal response window',
    icon: 'Zap'
  },
  {
    id: 'decisions',
    title: 'Blind Decision-Making',
    description: 'Campaigns launched on gut feel. Pricing set by guesswork. Product decisions made without data. Every unchecked assumption is money burned and opportunity lost.',
    stat: '70%',
    statLabel: 'of campaigns underperform without prediction',
    icon: 'EyeOff'
  }
] as const;

// ─── FAQ ──────────────────────────────────────────────────────────────
export const FAQS = [
  {
    question: 'What exactly does Zeptaz do?',
    answer: 'Zeptaz deploys specialized AI agents that handle specific business functions — from lead generation and customer support to social media management and financial operations. Each agent is purpose-built, not a generic chatbot.',
  },
  {
    question: 'Who is Zeptaz built for?',
    answer: 'Zeptaz is built for SMEs, growing startups, and enterprise teams that want to automate repetitive workflows, move faster, and scale operations without proportionally growing headcount.',
  },
  {
    question: 'How do we get started?',
    answer: 'You start with a discovery call where we audit your current workflows and identify automation opportunities. From there we configure your agents, integrate with your existing tools, and deploy — typically within 5 weeks.',
  },
  {
    question: 'How long does deployment take?',
    answer: 'Our proven process runs 5–8 weeks: Week 1 discovery, Weeks 2–3 build and integration, Week 4 testing with real data, Week 5 launch, Weeks 6–8 optimization. Complex enterprise setups may take longer.',
  },
  {
    question: 'Do we need technical knowledge to use Zeptaz?',
    answer: 'No. Zeptaz comes with a no-code dashboard so your team can monitor agents, adjust workflows, and review outputs without engineering support. We also provide full team training at launch.',
  },
  {
    question: 'How is Zeptaz different from tools like Zapier or Make?',
    answer: 'Zapier and Make automate simple if-this-then-that triggers. Zeptaz agents reason, decide, and act across multi-step workflows with memory and context — much closer to a human employee than a rule-based automation.',
  },
  {
    question: 'What integrations do you support?',
    answer: 'We support CRMs (HubSpot, Salesforce), communication tools (Slack, Gmail, WhatsApp), social platforms, e-commerce systems, and most APIs. Custom integrations are available on Growth and Enterprise plans.',
  },
  {
    question: 'What does pricing look like?',
    answer: 'We operate on a contact-for-pricing model based on the number of agents, workflows, and integrations you need. Reach out and we will put together a custom proposal — no dollar figures are hidden, just tailored to your scope.',
  },
] as const;

// ─── Nav Links ────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: 'Agents', href: '#agents' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Results', href: '#transformation' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#contact' }
] as const;
