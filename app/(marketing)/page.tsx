import Hero from '@/components/sections/Hero';
import Problem from '@/components/sections/Problem';
import ServiceCategories from '@/components/sections/ServiceCategories';
import Engine from '@/components/sections/Engine';
import Differentiators from '@/components/sections/Differentiators';
import Integrations from '@/components/sections/Integrations';
import Process from '@/components/sections/Process';
import Packages from '@/components/sections/Packages';
import Team from '@/components/sections/Team';
import FinalCta from '@/components/sections/FinalCta';

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <ServiceCategories />
      <Engine />
      <Differentiators />
      <Integrations />
      <Process />
      <Packages />
      <Team />
      <FinalCta />
    </>
  );
}
