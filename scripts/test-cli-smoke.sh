#!/bin/bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CLI_ENTRY="$ROOT_DIR/packages/cli/dist/index.js"

if [ ! -f "$CLI_ENTRY" ]; then
  echo "CLI build not found at $CLI_ENTRY"
  echo "Run: pnpm -C packages/cli build"
  exit 1
fi

TMP_ROOT="$(mktemp -d /tmp/sickui-cli-smoke-XXXXXX)"

cleanup() {
  rm -rf "$TMP_ROOT"
}

trap cleanup EXIT

create_project() {
  local dir="$1"
  local package_json="$2"
  local tsconfig="${3:-}"
  local app_dir="${4:-}"

  mkdir -p "$dir"
  printf "%s\n" "$package_json" > "$dir/package.json"

  if [ -n "$tsconfig" ]; then
    printf "%s\n" "$tsconfig" > "$dir/tsconfig.json"
  fi

  if [ -n "$app_dir" ]; then
    mkdir -p "$dir/$app_dir"
  fi
}

run_init() {
  local dir="$1"
  node "$CLI_ENTRY" init --defaults --yes --skip-install --cwd "$dir"
}

run_check() {
  local dir="$1"
  (cd "$dir" && node "$CLI_ENTRY" check)
}

assert_contains() {
  local file="$1"
  local pattern="$2"
  if ! grep -q -- "$pattern" "$file"; then
    echo "Expected '$pattern' in $file"
    exit 1
  fi
}

assert_not_contains() {
  local file="$1"
  local pattern="$2"
  if grep -q -- "$pattern" "$file"; then
    echo "Did not expect '$pattern' in $file"
    exit 1
  fi
}

echo "== SickUI CLI smoke tests =="

V3_DIR="$TMP_ROOT/v3"
V4_DIR="$TMP_ROOT/v4"
NEXT_DIR="$TMP_ROOT/next"

create_project "$V3_DIR" '{
  "name": "sickui-test-v3",
  "private": true,
  "version": "0.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.4.17"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.33"
  }
}' '{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "jsx": "react-jsx"
  }
}'

create_project "$V4_DIR" '{
  "name": "sickui-test-v4",
  "private": true,
  "version": "0.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^4.0.0"
  },
  "devDependencies": {
    "postcss": "^8.5.6",
    "@tailwindcss/postcss": "^0.0.0"
  }
}'

create_project "$NEXT_DIR" '{
  "name": "sickui-test-next",
  "private": true,
  "version": "0.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "14.2.0",
    "tailwindcss": "^4.0.0"
  },
  "devDependencies": {
    "postcss": "^8.5.6",
    "@tailwindcss/postcss": "^0.0.0"
  }
}' '{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "jsx": "preserve"
  }
}' "src/app"

echo "-> init v3"
run_init "$V3_DIR"
assert_contains "$V3_DIR/postcss.config.js" "tailwindcss"
assert_contains "$V3_DIR/postcss.config.js" "autoprefixer"
assert_not_contains "$V3_DIR/postcss.config.js" "@tailwindcss/postcss"
assert_contains "$V3_DIR/src/index.css" "@tailwind base;"
assert_contains "$V3_DIR/src/index.css" "--background"
assert_contains "$V3_DIR/src/index.css" ".dark"
run_check "$V3_DIR"

echo "-> init v4"
run_init "$V4_DIR"
assert_contains "$V4_DIR/postcss.config.js" "@tailwindcss/postcss"
assert_contains "$V4_DIR/src/index.css" "@import \"tailwindcss\";"
assert_contains "$V4_DIR/src/index.css" "@theme"
assert_contains "$V4_DIR/src/index.css" "--color-background"
assert_contains "$V4_DIR/src/index.css" ".dark"
run_check "$V4_DIR"

echo "-> init next (v4 + app dir)"
run_init "$NEXT_DIR"
assert_contains "$NEXT_DIR/postcss.config.js" "@tailwindcss/postcss"
assert_contains "$NEXT_DIR/src/app/globals.css" "@import \"tailwindcss\";"
assert_contains "$NEXT_DIR/src/app/globals.css" "@theme"
assert_contains "$NEXT_DIR/src/app/globals.css" ".dark"
if [ ! -f "$NEXT_DIR/tailwind.config.ts" ]; then
  echo "Expected tailwind.config.ts in Next.js project"
  exit 1
fi
run_check "$NEXT_DIR"

echo "All smoke tests passed."
