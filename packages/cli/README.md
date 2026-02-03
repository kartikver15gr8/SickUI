# @sickui/cli

A CLI for adding SickUI components to your project.

## Installation

You can run the CLI via `npx` (recommended) or install it globally:

```bash
# Recommended: run via npx
npx @sickui/cli init

# Or install globally
npm install -g @sickui/cli
```

## Tailwind CSS support (v3 & v4)

The CLI is **Tailwind-version aware**:

- If your project already has Tailwind, it **keeps that major version** (3 or 4).
- If Tailwind is not installed yet, it defaults to **Tailwind v4**.
- It then:
  - Installs the correct Tailwind + PostCSS dependencies.
  - Writes a matching `tailwind.config` and `postcss.config`.
  - Generates or merges a global CSS file with SickUI design tokens and base styles.

Make sure the generated global CSS is imported in your app:

- Next.js App Router: `app/layout.tsx` or `src/app/layout.tsx`
- Next.js Pages Router: `pages/_app.tsx`
- Vite/CRA: `src/main.tsx` or `src/index.tsx`

After that, use the `add` command to copy components into your project.

### init

```bash
npx @sickui/cli init
```

Initialize your project and install dependencies.

You will be asked a few questions to configure `components.json`:

```txt
Which style would you like to use? › default
Which color would you like to use as base color? › slate
Would you like to use CSS variables for colors? › no / yes
```

#### Options

```txt
Usage: sickui init [options]

initialize your project and install dependencies

Options:
  -y, --yes        skip confirmation prompt. (default: false)
  -d, --defaults,  use default configuration. (default: false)
  -c, --cwd <cwd>  the working directory. defaults to the current directory.
  --skip-install   skip dependency installation. (default: false)
  -h, --help       display help for command
```

### add

```bash
npx @sickui/cli add [component]
```

Add a component to your project.

```bash
npx @sickui/cli add button
```

You can also run the command without any arguments to view a list of all available components:

```bash
npx @sickui/cli add
```

#### Options

```txt
Usage: sickui add [options] [components...]

add a component to your project

Arguments:
  components         the components to add

Options:
  -y, --yes          skip confirmation prompt. (default: false)
  -o, --overwrite    overwrite existing files. (default: false)
  -c, --cwd <cwd>    the working directory. defaults to the current directory.
  -a, --all          add all available components (default: false)
  -p, --path <path>  the path to add the component to.
  --skip-install     skip installing dependencies. (default: false)
  -h, --help         display help for command
```

### list

```bash
npx @sickui/cli list
```

List all available components.

### diff (experimental)

```bash
npx @sickui/cli diff [component]
```

Check for updates against the registry.

Running the following command will check if there's an update available for the `button` component:

```bash
npx @sickui/cli diff button
```

## FAQ

### Why use a CLI instead of an npm package?

The CLI approach gives you full control over the components. You can modify them as needed, and you don't have to worry about version conflicts or breaking changes.

### Can I use this in my existing project?

Yes! The CLI is designed to work with existing projects. Just run `npx @sickui/cli init` to get started.

### What happens when I run init?

Running `init` will:

1. Create a `components.json` file in your project root
2. Create a `lib/utils.ts` file with the `cn` helper
3. Create a `components/ui` directory for your components
4. Install the required dependencies

### What happens when I run add?

Running `add` will:

1. Check if the component exists in the registry
2. Check if you have a `components.json` file (if not, you'll be prompted to run `init`)
3. Install the component dependencies
4. Create the component files in your project

### Can I customize the components after adding them?

Yes! That's the whole point. The components are copied to your project, so you can modify them as needed.

### How do I update a component?

You can use the `diff` command to check if there's an update available, then run `add` with the `--overwrite` flag to update the component.

```bash
npx @sickui/cli diff button
npx @sickui/cli add button --overwrite
```
