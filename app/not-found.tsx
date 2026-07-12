import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AsciiWall from '@/components/ui/AsciiWall';

/**
 * 404. Renders under the bare root layout (no navbar/footer/preloader), so it
 * carries its own ASCII backdrop - the site's signature element - and a single
 * way back.
 */
export default function NotFound() {
  return (
    <section className="section-dark relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <AsciiWall className="h-full w-full" />
      </div>
      {/* legibility scrim */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_50%,rgba(8,8,8,0.78),transparent_75%)]" />

      <div className="relative z-10 mx-auto w-full max-w-md px-6 text-center">
        <div className="eyebrow mb-6 justify-center text-text-muted">Error 404</div>

        <div className="display-hero select-none leading-none text-text-primary">
          4<span className="text-crimson">0</span>4
        </div>

        <h1 className="heading-md mt-5 text-text-primary">This route doesn’t exist.</h1>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">
          The page you’re looking for was moved, renamed, or never existed.
        </p>

        <Link href="/" className="btn btn-primary group mt-8">
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to home
        </Link>
      </div>
    </section>
  );
}
