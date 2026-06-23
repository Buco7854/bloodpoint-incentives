// steam-user and steam-totp ship no TypeScript types and are optional deps,
// loaded only in full Steam mode via dynamic import. Declare them as untyped so
// the build does not depend on them being installed.
declare module 'steam-user';
declare module 'steam-totp';
