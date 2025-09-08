import { Button } from "@sickui/core";
import { CheckCircle, AlertCircle } from "lucide-react";
import { CodeBlock } from "../../../components/code-block";

export default function InstallationPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Installation</h1>
          <p className="text-xl text-muted-foreground">
            Get started with SickUI in your project. Copy, paste, and customize
            components.
          </p>
        </div>

        {/* Requirements */}
        <div className="bg-muted/50 border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold">Requirements</h2>
          </div>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              React 16.8 or later
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Tailwind CSS 3.0 or later
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Node.js 16.0 or later
            </li>
          </ul>
        </div>

        {/* Step 1: Initialize */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                1
              </span>
              Initialize your project
            </h2>
            <p className="text-muted-foreground">
              Run the init command to set up your project with the necessary
              configuration files.
            </p>
          </div>

          <CodeBlock code="npx @sickui/cli init" title="Terminal" />

          <div className="bg-card border rounded-lg p-4">
            <h3 className="font-semibold mb-2">What this does:</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>
                • Creates a{" "}
                <code className="bg-muted px-1 rounded">components.json</code>{" "}
                configuration file
              </li>
              <li>
                • Sets up your{" "}
                <code className="bg-muted px-1 rounded">
                  tailwind.config.js
                </code>{" "}
                with required settings
              </li>
              <li>
                • Creates a{" "}
                <code className="bg-muted px-1 rounded">lib/utils.ts</code> file
                with the cn helper
              </li>
              <li>• Installs necessary dependencies</li>
              <li>• Creates the components directory structure</li>
            </ul>
          </div>
        </div>

        {/* Step 2: Add Components */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                2
              </span>
              Add components
            </h2>
            <p className="text-muted-foreground">
              Add components to your project using the CLI.
            </p>
          </div>

          <CodeBlock
            code="npx @sickui/cli add button"
            title="Add a single component"
          />

          <CodeBlock
            code="npx @sickui/cli add button card input"
            title="Add multiple components"
          />

          <CodeBlock
            code="npx @sickui/cli add --all"
            title="Add all available components"
          />
        </div>

        {/* Step 3: Use Components */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                3
              </span>
              Start using components
            </h2>
            <p className="text-muted-foreground">
              Import and use components in your React application.
            </p>
          </div>

          <CodeBlock
            code={`import { Button } from "@/components/ui/button"

export function MyComponent() {
  return (
    <div>
      <Button>Click me</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  )
}`}
            language="tsx"
            title="app/page.tsx"
          />
        </div>

        {/* CLI Commands */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">CLI Commands</h2>

          <div className="grid gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">init</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Initialize configuration and dependencies for a new project.
              </p>
              <CodeBlock code="npx @sickui/cli init" />
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">add</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Add a component to your project.
              </p>
              <CodeBlock code="npx @sickui/cli add [component]" />
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">list</h3>
              <p className="text-sm text-muted-foreground mb-3">
                List all available components.
              </p>
              <CodeBlock code="npx @sickui/cli list" />
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">diff</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Check for updates against the registry.
              </p>
              <CodeBlock code="npx @sickui/cli diff [component]" />
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Next Steps</h2>
          <div className="space-y-3">
            <p className="text-muted-foreground">
              Now that you have SickUI set up, explore our components and start
              building!
            </p>
            <div className="flex gap-3">
              <Button asChild>
                <a href="/docs/components">Browse Components</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/docs/theming">Customize Themes</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
