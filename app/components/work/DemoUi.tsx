import type { Dispatch, ReactNode } from 'react';
import type { DemoAction, DemoState } from '@/lib/demo-state';
import s from './demo.module.css';
export { s };
export type SceneProps = { state: DemoState; dispatch: Dispatch<DemoAction>; open: (title: string, body: ReactNode) => void };
export function Panel({ title, meta, children }: { title: string; meta?: string; children: ReactNode }) {
  return <section className={s.panel}><header><h3>{title}</h3>{meta && <span className={s.meta}>{meta}</span>}</header><div className={s.panelBody}>{children}</div></section>;
}
export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'good' | 'warn' | 'bad' }) {
  return <span className={s.badge} data-tone={tone}>{children}</span>;
}
export function Note({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'good' | 'warn' | 'bad' }) {
  return <div className={s.note} data-tone={tone}>{children}</div>;
}
export function Button({ children, onClick, disabled, secondary = false }: { children: ReactNode; onClick: () => void; disabled?: boolean; secondary?: boolean }) {
  return <button type="button" className={secondary ? s.secondary : s.action} onClick={onClick} disabled={disabled}>{children}</button>;
}
export function Field({ label, value, onChange, multiline = false, readOnly = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; readOnly?: boolean }) {
  return <label className={s.field}><span>{label}</span>{multiline ? <textarea rows={4} value={value} onChange={e => onChange(e.target.value)} readOnly={readOnly} /> : <input value={value} onChange={e => onChange(e.target.value)} readOnly={readOnly} />}</label>;
}
export function CheckField({ label, checked, onChange, disabled = false }: { label: string; checked: boolean; onChange?: (value: boolean) => void; disabled?: boolean }) {
  return <label className={s.check}><input type="checkbox" checked={checked} disabled={disabled} onChange={e => onChange?.(e.target.checked)} /><span>{label}</span></label>;
}
