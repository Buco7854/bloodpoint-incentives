import type { IncentivesPayload } from '@shared/types';

export async function fetchIncentives(signal?: AbortSignal): Promise<IncentivesPayload> {
  const res = await fetch('/api/incentives', {
    signal,
    headers: { Accept: 'application/json' },
  });
  if (res.status === 401) {
    throw new Error('Access denied. This instance is protected; sign in to continue.');
  }
  if (!res.ok) {
    throw new Error(`The incentive service responded with ${res.status}.`);
  }
  return (await res.json()) as IncentivesPayload;
}
