import type { Metadata } from 'next';
import { Big_Shoulders, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SmoothScroll from '@/components/layout/SmoothScroll';
import ScrollProgress from '@/components/ui/ScrollProgress';

const bigShoulders = Big_Shoulders({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-big-shoulders',
  display: 'swap',
  adjustFontFallback: false,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Zeptaz — AI-Powered Digital Workforce',
  description:
    'Zeptaz deploys specialized AI agents that automate your workflows, qualify your leads, predict your outcomes, and scale your operations 24/7.',
  keywords: ['AI automation', 'AI agents', 'business automation', 'workflow automation', 'Sri Lanka'],
  authors: [{ name: 'Zeptaz' }],
  openGraph: {
    title: 'Zeptaz — AI-Powered Digital Workforce',
    description:
      'Deploy specialized AI agents that automate your workflows and scale your business 24/7.',
    type: 'website',
    siteName: 'Zeptaz',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zeptaz' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zeptaz — AI-Powered Digital Workforce',
    description: 'Deploy specialized AI agents that automate your workflows and scale your business 24/7.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bigShoulders.variable} ${jetbrainsMono.variable} ${inter.variable}`}
      style={{ colorScheme: 'dark' }}
      suppressHydrationWarning
    >
      <body className="bg-[#080808] text-[#EFEFEF] min-h-screen">
        <SmoothScroll>
          <ScrollProgress />
          <Navbar />
          <main className="relative z-10">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
