'use client';
import { usePathname } from 'next/navigation';
import { useRef, type ReactNode } from 'react';
import SmoothScroll from './SmoothScroll';
import Navbar from './Navbar';
import Footer from './Footer';
import Preloader from './Preloader';
import PageTransition from './PageTransition';
import DemoSessions from '@/components/work/DemoSessions';
export default function MarketingFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const expanded = /^\/work\/[^/]+\/demo\/?$/.test(pathname);
  const initialPath = useRef(pathname);
  return <DemoSessions>{expanded ? <main>{children}</main> : <>
    {initialPath.current === pathname && !pathname.startsWith('/work') && <Preloader />}
    <PageTransition />
    <SmoothScroll><Navbar /><main className="relative">{children}</main><Footer /></SmoothScroll>
  </>}</DemoSessions>;
}
