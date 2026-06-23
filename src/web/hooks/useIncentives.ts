import { useCallback, useEffect, useRef, useState } from 'react';
import type { IncentivesPayload } from '@shared/types';
import { fetchIncentives } from '../api';

const DEFAULT_REFRESH_SECONDS = 60;

export interface IncentivesState {
  data: IncentivesPayload | null;
  error: Error | null;
  loading: boolean;
  /** A user-triggered reload (from cache, never hits BHVR). */
  refresh: () => void;
  refreshing: boolean;
}

/**
 * Polls the server cache on the interval the server recommends. Keeps the last
 * good data on screen while a background refresh is in flight.
 */
export function useIncentives(): IncentivesState {
  const [data, setData] = useState<IncentivesPayload | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(
    async (signal?: AbortSignal, isManual = false): Promise<IncentivesPayload | null> => {
      if (isManual) setRefreshing(true);
      try {
        const payload = await fetchIncentives(signal);
        setData(payload);
        setError(null);
        return payload;
      } catch (err) {
        if ((err as Error).name === 'AbortError') return null;
        setError(err instanceof Error ? err : new Error(String(err)));
        return null;
      } finally {
        setLoading(false);
        if (isManual) setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const tick = async (): Promise<void> => {
      const payload = await load(controller.signal);
      if (cancelled) return;
      const seconds = payload?.refreshSeconds ?? DEFAULT_REFRESH_SECONDS;
      timer.current = setTimeout(() => void tick(), Math.max(5, seconds) * 1000);
    };

    void tick();
    return () => {
      cancelled = true;
      controller.abort();
      if (timer.current) clearTimeout(timer.current);
    };
  }, [load]);

  const refresh = useCallback(() => {
    void load(undefined, true);
  }, [load]);

  return { data, error, loading, refresh, refreshing };
}
