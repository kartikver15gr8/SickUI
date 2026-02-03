# SickUI (Under Development)

A modern, high-performance React component library built with TypeScript, Tailwind CSS, and Radix UI primitives.

## 🚀 Features

- **Modern Stack**: Built with React 18+, TypeScript, and Tailwind CSS
- **High Performance**: Optimized with Vite, tree-shaking, and minimal bundle size
- **Accessible**: Built on Radix UI primitives for excellent accessibility
- **Customizable**: CSS variables and Tailwind classes for easy theming
- **Developer Experience**: TypeScript-first with excellent IntelliSense
- **Monorepo**: Turborepo for optimal development and build performance

## 📦 Setup

```bash
# Initialize SickUI in your app (Tailwind v3 or v4)
npx @sickui/cli init

# Add components
npx @sickui/cli add button
```

This is a **CLI-first** project: the CLI copies fully editable components into your app and wires up Tailwind + global styles for you.

### Tailwind CSS support (v3 & v4)

- SickUI **detects and preserves** your Tailwind major version:
  - If Tailwind is already installed, it keeps that major (3 or 4).
  - If Tailwind is missing, it defaults to **Tailwind v4** for new projects.
- It then installs the right dependencies and config:
  - **Tailwind v3**: `tailwindcss@^3.4.0`, `postcss`, `autoprefixer`, classic `tailwind.config` + `postcss.config`.
  - **Tailwind v4**: `tailwindcss@latest`, `postcss`, `@tailwindcss/postcss`, CSS-first config with `@import "tailwindcss"; @theme { ... }`.

After running `npx @sickui/cli init`, make sure the generated global CSS file is imported:

- **Next.js App Router**: in `app/layout.tsx` or `src/app/layout.tsx`
- **Next.js Pages Router**: in `pages/_app.tsx`
- **Vite/CRA/others**: in `src/main.tsx` or `src/index.tsx`

Then add components:

```bash
npx @sickui/cli add button badge skeleton
```

SickUI will:

- Copy components into `@/components/ui/*`
- Install any extra dependencies (e.g. `@radix-ui/react-slot`, `clsx`, `tailwind-merge`)

## 🏗️ Project Structure

```
sickui/
├── packages/
|   ├── cli/                  # Command-line interface
│   └── core/                 # Main component library
│       ├── src/
│       │   ├── components/   # React components
│       │   ├── lib/         # Utilities
│       │   └── styles/      # CSS and themes
│       └── package.json
├── apps/
│   └── docs/                # Documentation site
│       ├── src/
│       └── package.json
├── turbo.json              # Turborepo configuration
└── package.json           # Root package.json
```

## 🎨 Usage

```tsx
import { Button } from "@sickui/core";

function App() {
  return (
    <div>
      <Button>Click me</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  );
}
```

## 🛠️ Development

```bash
# Start all development servers
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Type check
pnpm type-check
```

## 📚 Documentation

Visit the documentation site at `http://localhost:3000` after running `pnpm dev`.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.
