import { ArrowRight, Check, LockKeyhole } from 'lucide-react';

const TRACE = [
  { label: 'Receive', detail: 'A question, request or brief' },
  { label: 'Check', detail: 'Confirm the available details' },
  { label: 'Prepare', detail: 'Create a draft or proposed action' },
  { label: 'Approve', detail: 'A person reviews the next action', approval: true },
  { label: 'Act', detail: 'Assign, schedule or prepare the work' },
  { label: 'Review', detail: 'See the result and who acts next' },
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
