'use client';

import dynamic from 'next/dynamic';

// Audio APIs are only needed after the visitor reaches the demo section.
// Keeping this client boundary separate preserves SSR for the product page.
const VoiceDemo = dynamic(() => import('./VoiceDemo'), {
  ssr: false,
  loading: () => <div aria-hidden="true" className="min-h-96" />,
});

export default VoiceDemo;
