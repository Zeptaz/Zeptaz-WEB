import type { Metadata } from 'next';
import CtaBand from '@/components/ui/CtaBand';
import VoiceHero from '@/components/sections/voice/VoiceHero';
import VoiceWorkflow from '@/components/sections/voice/VoiceWorkflow';
import VoiceDemo from '@/components/sections/voice/VoiceDemo';
import VoiceControl from '@/components/sections/voice/VoiceControl';
import VoiceFaq from '@/components/sections/voice/VoiceFaq';
import VoicePilot from '@/components/sections/voice/VoicePilot';

export const metadata: Metadata = {
  title: 'Zeptaz Voice - Multilingual AI Phone Agents',
  description:
    'Zeptaz Voice answers questions, books appointments, and takes orders in Sinhala, Tamil, and English - with human handoffs and every outcome visible to your team.',
};

export default function VoiceAgentPage() {
  return (
    <>
      <VoiceHero />
      <VoiceWorkflow />
      <VoiceDemo />
      <VoiceControl />
      <VoiceFaq />
      <VoicePilot />
      <CtaBand
        title="Put one call type on autopilot."
        lead="Book a workflow assessment. We map one repeatable call, agree the escalation rules and success measures, then run a monitored pilot."
      />
    </>
  );
}
