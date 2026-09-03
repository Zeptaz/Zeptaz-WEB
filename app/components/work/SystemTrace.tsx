import { ArrowRight, Check, LockKeyhole } from 'lucide-react';

const TRACE = [
  { label: 'Input', detail: 'Form, message, brief, source' },
  { label: 'Validate', detail: 'Fields, evidence, state' },
  { label: 'Assist', detail: 'Draft, classify, summarize' },
  { label: 'Approve', detail: 'Named human checkpoint', approval: true },
  { label: 'Act', detail: 'Route, schedule, hand off' },
  { label: 'Audit', detail: 'Result, exception, owner' },
];

export default function SystemTrace() {
  return (
    <div className="system-trace">
      {TRACE.map((item, index) => (
        <div className="system-trace-item" key={item.label}>
          <div className={item.approval ? 'trace-node approval' : 'trace-node'}>
            <span>{item.approval ? <LockKeyhole size={15} /> : index === TRACE.length - 1 ? <Check size={15} /> : String(index + 1).padStart(2, '0')}</span>
            <strong>{item.label}</strong>
            <small>{item.detail}</small>
          </div>
          {index < TRACE.length - 1 && <ArrowRight className="trace-arrow" size={17} />}
        </div>
      ))}
    </div>
  );
}
