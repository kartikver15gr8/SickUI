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
# Initialization
npx @sickui/cli init

# Install components
npx @sickui/cli add button

# Start development
turbo dev
```

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
