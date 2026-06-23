/** Resolve after `ms`, or early (resolved) if the abort signal fires. */
export function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (signal?.aborted) {
      resolve();
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    const onAbort = (): void => {
      clearTimeout(timer);
      resolve();
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

/** Random integer in [min, max] inclusive. */
export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Apply +/- `ratio` jitter to a base value (e.g. jitter(1000, 0.2) -> 800..1200). */
export function jitter(base: number, ratio = 0.2): number {
  const span = base * ratio;
  return Math.max(0, base + (Math.random() * 2 - 1) * span);
}
