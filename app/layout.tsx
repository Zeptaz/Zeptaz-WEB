import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

// Geist (variable) - futuristic, highly readable. One cohesive system:
// sans drives both display + body, mono drives the terminal/labels.
const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Zeptaz - AI Workflow Automation for Service Businesses',
  description:
    'Zeptaz builds reliable AI workflow automation systems that connect your forms, inboxes, CRM/ATS, alerts, AI-assisted drafts, follow-ups, and reporting - so important work never gets stuck between tools.',
  keywords: [
    'AI workflow automation', 'recruitment workflow automation', 'CRM automation',
    'ATS automation', 'service business automation', 'sales workflow automation',
  ],
  authors: [{ name: 'Zeptaz' }],
  openGraph: {
    title: 'Zeptaz - AI Workflow Automation for Service Businesses',
    description: 'Reliable workflow systems, not one-off zaps. AI assists inside a controlled, human-approved workflow.',
    type: 'website',
    siteName: 'Zeptaz',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zeptaz - AI Workflow Automation for Service Businesses',
    description: 'Reliable workflow systems, not one-off zaps. AI assists inside a controlled, human-approved workflow.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      style={{ colorScheme: 'dark' }}
      suppressHydrationWarning
    >
      <body className="bg-bg-primary text-text-primary antialiased">{children}</body>
    </html>
  );
}
