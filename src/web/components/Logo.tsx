import { BloodpointIcon } from './BloodpointIcon';

function Slashes({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 16" className={className} fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M2 14 10 2" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M11 14 19 2" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 14 27 3" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <BloodpointIcon className="h-9 w-9 drop-shadow-[0_0_10px_rgba(224,30,43,0.55)]" />
      <div className="leading-[0.95]">
        <div className="font-display text-[1.3rem] font-semibold tracking-[0.16em] text-bone-100">
          BLOODPOINT
        </div>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="font-display text-xs tracking-[0.42em] text-blood-500">INCENTIVE</span>
          <Slashes className="h-3 w-6 text-bone-300/60" />
        </div>
      </div>
    </div>
  );
}
