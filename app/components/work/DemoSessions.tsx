'use client';
import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';
import { createGuided, guidedReducer, type GuidedAction, type GuidedState } from '@/lib/demo-state';
import type { WorkSlug } from '@/lib/work';
type Sessions = Partial<Record<WorkSlug, GuidedState>>;
type SessionAction = { slug: WorkSlug; action: GuidedAction };
const Context = createContext<{ sessions: Sessions; dispatch: Dispatch<SessionAction> } | null>(null);
function reduce(sessions: Sessions, { slug, action }: SessionAction): Sessions {
  return { ...sessions, [slug]: guidedReducer(sessions[slug] ?? createGuided(slug), action) };
}
export default function DemoSessions({ children }: { children: ReactNode }) {
  const [sessions, dispatch] = useReducer(reduce, {});
  return <Context.Provider value={{ sessions, dispatch }}>{children}</Context.Provider>;
}
export function useDemoSession(slug: WorkSlug) {
  const context = useContext(Context);
  if (!context) throw new Error('DemoSessions provider is required');
  return { state: context.sessions[slug] ?? createGuided(slug), dispatch: (action: GuidedAction) => context.dispatch({ slug, action }) };
}
