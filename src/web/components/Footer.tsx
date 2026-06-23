import type { IncentivesPayload } from '@shared/types';

interface Props {
  data: IncentivesPayload | null;
}

export function Footer({ data }: Props) {
  return (
    <footer className="mt-12 border-t border-white/5 pt-6 pb-10 text-center text-xs text-bone-600">
      <p className="mx-auto max-w-2xl">
        Unofficial fan project. Not affiliated with or endorsed by Behaviour Interactive. Dead by
        Daylight and Bloodpoints are trademarks of Behaviour Interactive. Use at your own risk.
      </p>
      {data && (
        <p className="mt-2 font-mono text-[11px] text-bone-700">
          {data.platform} · {data.category ?? 'version pending'} · provider {data.provider}
        </p>
      )}
    </footer>
  );
}
