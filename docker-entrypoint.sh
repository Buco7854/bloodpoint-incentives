#!/bin/sh
set -e

# A named volume mounted at the state dir is typically root-owned, which the
# non-root app user cannot write. Fix it here (we still run as root at this
# point), then drop privileges to the node user for the app itself.
DIR="${STATE_DIR:-/app/data}"
mkdir -p "$DIR" 2>/dev/null || true
chown -R node:node "$DIR" 2>/dev/null || true

exec gosu node "$@"
