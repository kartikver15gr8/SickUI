#!/bin/bash

# SickUI Setup Test Script
# This script tests the complete SickUI setup process

set -e  # Exit on any error

echo "🚀 Testing SickUI Setup Process"
echo "================================"

# Cleanup function
cleanup() {
    echo "🧹 Cleaning up test directory..."
    cd /tmp
    rm -rf sickui-test-app
}

# Set trap to cleanup on exit
trap cleanup EXIT

# Create test directory
cd /tmp
rm -rf sickui-test-app

echo "📦 Creating fresh Next.js app..."
npx create-next-app@latest sickui-test-app \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-git \
  --yes

cd sickui-test-app

echo "🔧 Initializing SickUI..."
npx @sickui/cli@0.0.6 init --yes --defaults

echo "🔧 Fixing CSS variables for Tailwind v4..."
cat > src/app/globals.css << 'EOF'
@import "tailwindcss";

@theme {
  --color-background: 0 0% 100%;
  --color-foreground: 222.2 84% 4.9%;
  --color-primary: 221.2 83.2% 53.3%;
  --color-primary-foreground: 210 40% 98%;
  --color-secondary: 210 40% 96%;
  --color-secondary-foreground: 222.2 84% 4.9%;
  --color-muted: 210 40% 96%;
  --color-muted-foreground: 215.4 16.3% 46.9%;
  --color-accent: 210 40% 96%;
  --color-accent-foreground: 222.2 84% 4.9%;
  --color-destructive: 0 84.2% 60.2%;
  --color-destructive-foreground: 210 40% 98%;
  --color-border: 214.3 31.8% 91.4%;
  --color-input: 214.3 31.8% 91.4%;
  --color-ring: 221.2 83.2% 53.3%;
  --color-card: 0 0% 100%;
  --color-card-foreground: 222.2 84% 4.9%;
  --color-popover: 0 0% 100%;
  --color-popover-foreground: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: 222.2 84% 4.9%;
    --color-foreground: 210 40% 98%;
    --color-primary: 217.2 91.2% 59.8%;
    --color-primary-foreground: 222.2 84% 4.9%;
    --color-secondary: 217.2 32.6% 17.5%;
    --color-secondary-foreground: 210 40% 98%;
    --color-muted: 217.2 32.6% 17.5%;
    --color-muted-foreground: 215 20.2% 65.1%;
    --color-accent: 217.2 32.6% 17.5%;
    --color-accent-foreground: 210 40% 98%;
    --color-destructive: 0 62.8% 30.6%;
    --color-destructive-foreground: 210 40% 98%;
    --color-border: 217.2 32.6% 17.5%;
    --color-input: 217.2 32.6% 17.5%;
    --color-ring: 224.3 76.3% 94.1%;
    --color-card: 222.2 84% 4.9%;
    --color-card-foreground: 210 40% 98%;
    --color-popover: 222.2 84% 4.9%;
    --color-popover-foreground: 210 40% 98%;
  }
}

/* Legacy CSS Variables for SickUI Components */
:root {
  --background: var(--color-background);
  --foreground: var(--color-foreground);
  --primary: var(--color-primary);
  --primary-foreground: var(--color-primary-foreground);
  --secondary: var(--color-secondary);
  --secondary-foreground: var(--color-secondary-foreground);
  --muted: var(--color-muted);
  --muted-foreground: var(--color-muted-foreground);
  --accent: var(--color-accent);
  --accent-foreground: var(--color-accent-foreground);
  --destructive: var(--color-destructive);
  --destructive-foreground: var(--color-destructive-foreground);
  --border: var(--color-border);
  --input: var(--color-input);
  --ring: var(--color-ring);
  --card: var(--color-card);
  --card-foreground: var(--color-card-foreground);
  --popover: var(--color-popover);
  --popover-foreground: var(--color-popover-foreground);
}

/* Base Styles */
* {
  border-color: hsl(var(--border));
}

body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}
EOF

echo "🎨 Adding button component..."
npx @sickui/cli@0.0.6 add button --yes

echo "🧪 Creating test page..."
cat > src/app/page.tsx << 'EOF'
"use client";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-8 bg-gray-50">
      <h1 className="text-4xl font-bold text-blue-600">SickUI Test</h1>
      <div className="bg-red-100 border border-red-300 p-4 rounded-lg">
        <p className="text-red-800">Tailwind Test Box</p>
      </div>

      <div className="flex gap-4 flex-wrap">
        <Button>Default</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>

      <div className="flex gap-4 flex-wrap">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon">🎉</Button>
      </div>

      <Button onClick={() => alert('SickUI Works!')}>
        Click Me to Test
      </Button>
    </main>
  );
}
EOF

echo "✅ Running final check..."
npx @sickui/cli@0.0.6 check

echo "🏗️ Building the app..."
npm run build

echo "🎉 SUCCESS! SickUI setup completed successfully!"
echo ""
echo "📋 Summary:"
echo "✅ Next.js app created"
echo "✅ SickUI initialized"
echo "✅ Button component added"
echo "✅ Test page created"
echo "✅ All checks passed"
echo "✅ App builds successfully"
echo ""
echo "🚀 To test the app:"
echo "   cd /tmp/sickui-test-app"
echo "   npm run dev"
echo "   Open http://localhost:3000"
