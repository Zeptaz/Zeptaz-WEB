import type { Metadata } from 'next';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { signOut } from '@/lib/actions/posts';
import LogoMark from '@/components/ui/LogoMark';

export const metadata: Metadata = {
  title: 'Admin - Zeptaz',
  robots: { index: false, follow: false },
};

// Deliberately minimal: no Preloader/PageTransition/Lenis - native scrolling
// behaves better inside long editor forms.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <header className="sticky top-0 z-40 border-b border-border bg-bg-primary/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-[1240px] items-center justify-between px-5 sm:px-8">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center bg-crimson">
              <LogoMark className="h-6 w-6 text-white" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-secondary">
              Zeptaz <span className="text-crimson">Admin</span>
            </span>
          </Link>
          <div className="flex items-center gap-5">
            <Link
              href="/blog"
              target="_blank"
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted transition-colors hover:text-crimson"
            >
              View blog
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted transition-colors hover:text-crimson"
              >
                Sign out <LogOut className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1240px] px-5 py-10 sm:px-8">{children}</main>
    </div>
  );
}
