import SmoothScroll from '@/components/layout/SmoothScroll';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Preloader from '@/components/layout/Preloader';
import PageTransition from '@/components/layout/PageTransition';

// Marketing chrome lives here (not the root layout) so /admin can render
// without the preloader, page transitions, and Lenis smooth scrolling.
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Preloader />
      <PageTransition />
      <SmoothScroll>
        <Navbar />
        <main className="relative">{children}</main>
        <Footer />
      </SmoothScroll>
    </>
  );
}
