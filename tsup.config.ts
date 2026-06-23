import { defineConfig } from 'tsup';

/**
 * Server build. Bundles our own source (src/server + src/shared) into a single
 * CommonJS file and leaves node_modules external (resolved at runtime). CJS keeps
 * dynamic `import('steam-user')` and friends simple even though package.json is ESM.
 */
export default defineConfig({
  entry: { 'server/index': 'src/server/index.ts' },
  outDir: 'dist',
  format: ['cjs'],
  platform: 'node',
  target: 'node20',
  // Do NOT clean: vite writes dist/public first and we must not wipe it.
  clean: false,
  sourcemap: true,
  minify: false,
  splitting: false,
  skipNodeModulesBundle: true,
  shims: true,
});
