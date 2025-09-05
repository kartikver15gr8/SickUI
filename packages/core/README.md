# @sickui/core

A modern, high-performance React component library built with TypeScript, Tailwind CSS, and Radix UI primitives.

> ⚠️ **Early Stage**: This library is in active development. Currently includes 1 component with more coming soon!

[![NPM Version](https://img.shields.io/npm/v/@sickui/core)](https://www.npmjs.com/package/@sickui/core)
[![License](https://img.shields.io/npm/l/@sickui/core)](https://github.com/kartikver15gr8/SickUI/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)

## ✨ Features

- 🚀 **Modern Stack**: Built with React 18+, TypeScript, and Tailwind CSS
- ⚡ **High Performance**: Optimized with tree-shaking and minimal bundle size
- ♿ **Accessible**: Built on Radix UI primitives for excellent accessibility
- 🎨 **Customizable**: CSS variables and Tailwind classes for easy theming
- 📱 **Responsive**: Mobile-first design approach
- 🔧 **Developer Experience**: TypeScript-first with excellent IntelliSense
- 🎯 **"use client" Ready**: Optimized for Next.js App Router

## 📦 Installation

```bash
npm install @sickui/core
# or
yarn add @sickui/core
# or
pnpm add @sickui/core
```

## 🚀 Quick Start

### 1. Import Styles

Import the CSS file in your app's root file:

```tsx
// app/layout.tsx (Next.js App Router)
import "@sickui/core/styles";

// or _app.tsx (Next.js Pages Router)
import "@sickui/core/styles";

// or main.tsx (Vite/React)
import "@sickui/core/styles";
```

### 2. Configure Tailwind CSS

Add the SickUI source path to your `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@sickui/core/dist/**/*.{js,mjs}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### 3. Start Using Components

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

## 🎨 Components

### Button

A versatile button component with multiple variants and sizes.

```tsx
import { Button } from "@sickui/core";

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>

// As child (renders as different element)
<Button asChild>
  <a href="/link">Link Button</a>
</Button>
```

#### Button Props

| Prop      | Type                                                                          | Default     | Description             |
| --------- | ----------------------------------------------------------------------------- | ----------- | ----------------------- |
| `variant` | `"default" \| "destructive" \| "outline" \| "secondary" \| "ghost" \| "link"` | `"default"` | Button style variant    |
| `size`    | `"default" \| "sm" \| "lg" \| "icon"`                                         | `"default"` | Button size             |
| `asChild` | `boolean`                                                                     | `false`     | Render as child element |

## 🛠️ Utilities

### cn (Class Name Utility)

A utility function for merging Tailwind CSS classes with proper conflict resolution.

```tsx
import { cn } from "@sickui/core";

// Merge classes with conflict resolution
const className = cn(
  "px-4 py-2 bg-blue-500",
  "bg-red-500", // This will override bg-blue-500
  condition && "text-white"
);
```

## 🎨 Theming

SickUI uses CSS variables for theming. You can customize the appearance by overriding these variables:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* ... more variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark mode variables */
}
```

## 📱 Framework Support

### Next.js

SickUI works seamlessly with both Next.js App Router and Pages Router:

```tsx
// App Router (app/layout.tsx)
import "@sickui/core/styles";

// Pages Router (_app.tsx)
import "@sickui/core/styles";
```

### Vite

```tsx
// main.tsx
import "@sickui/core/styles";
```

### Create React App

```tsx
// index.tsx or App.tsx
import "@sickui/core/styles";
```

## 🔧 TypeScript

SickUI is built with TypeScript and provides full type safety:

```tsx
import { Button, type ButtonProps } from "@sickui/core";

const CustomButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/kartikver15gr8/SickUI/blob/main/CONTRIBUTING.md) for details.

## 📄 License

MIT © [SickUI](https://github.com/kartikver15gr8/SickUI)

## 🔗 Links

- [Documentation](https://sickui.dev)
- [GitHub](https://github.com/kartikver15gr8/SickUI)
- [NPM](https://www.npmjs.com/package/@sickui/core)
- [Issues](https://github.com/kartikver15gr8/SickUI/issues)
