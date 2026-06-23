export class AuthError extends Error {
  override name = 'AuthError';
}

/** An auth/config error that cannot be recovered by retrying (bad credentials,
 *  a rejected non-refreshable key, etc.). The process should stop on these. */
export class FatalAuthError extends AuthError {
  override name = 'FatalAuthError';
}

export class NotImplementedError extends Error {
  override name = 'NotImplementedError';
}

/** True when the error means the deployment cannot work as configured. */
export function isFatalError(err: unknown): boolean {
  return err instanceof FatalAuthError || err instanceof NotImplementedError;
}
