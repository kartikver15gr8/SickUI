import type { Metadata } from "next";
import { Button } from "@sickui/core";
import { Terminal, CheckCircle, ArrowRight, Copy } from "lucide-react";
import { CodeBlock } from "../../../components/code-block";

export const metadata: Metadata = {
  title: "Getting Started",
  description:
    "Get started with SickUI using our CLI. Copy, paste, and customize components in minutes.",
};

export default function GettingStarted() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
          Getting Started
        </h1>
        <p className="text-xl text-muted-foreground">
          Get started with SickUI using our CLI. Copy, paste, and customize
          components in minutes.
        </p>
      </div>

      {/* Quick Start */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Terminal className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Quick Start</h2>
        </div>
        <div className="space-y-3">
          <p className="text-muted-foreground">
            Get up and running with SickUI in under 2 minutes:
          </p>
          <div className="grid gap-2">
            <CodeBlock
              code="npx @sickui/cli init"
              title="1. Initialize your project"
            />
            <CodeBlock
              code="npx @sickui/cli add button"
              title="2. Add your first component"
            />
          </div>
        </div>
      </div>

      {/* Prerequisites */}
      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Prerequisites
        </h2>
        <div className="grid gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>React 16.8 or later</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Tailwind CSS 3.0 or later</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Node.js 16.0 or later</span>
          </div>
        </div>
      </div>

      {/* Step by Step */}
      <div className="space-y-8">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Step-by-Step Guide
        </h2>

        {/* Step 1 */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold">Initialize your project</h3>
          </div>
          <p className="text-muted-foreground ml-11">
            Run the init command to set up your project configuration:
          </p>
          <div className="ml-11">
            <CodeBlock code="npx @sickui/cli init" />
          </div>
          <div className="ml-11 bg-card border rounded-lg p-4">
            <p className="text-sm font-medium mb-2">This will:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                • Create a{" "}
                <code className="bg-muted px-1 rounded">components.json</code>{" "}
                config file
              </li>
              <li>• Set up your Tailwind CSS configuration</li>
              <li>
                • Create the{" "}
                <code className="bg-muted px-1 rounded">lib/utils.ts</code> file
              </li>
              <li>• Install necessary dependencies</li>
            </ul>
          </div>
        </div>

        {/* Step 2 */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold">Add components</h3>
          </div>
          <p className="text-muted-foreground ml-11">
            Add components to your project using the CLI:
          </p>
          <div className="ml-11 space-y-3">
            <CodeBlock
              code="npx @sickui/cli add button"
              title="Add a single component"
            />
            <CodeBlock
              code="npx @sickui/cli add button card input"
              title="Add multiple components"
            />
          </div>
        </div>

        {/* Step 3 */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold">Start building</h3>
          </div>
          <p className="text-muted-foreground ml-11">
            Import and use components in your React application:
          </p>
          <div className="ml-11">
            <CodeBlock
              code={`import { Button } from "@/components/ui/button"

export default function MyPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome to SickUI</h1>
      <div className="space-x-2">
        <Button>Primary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
    </div>
  )
}`}
              language="tsx"
              title="app/page.tsx"
            />
          </div>
        </div>
      </div>

      {/* What's Different */}
      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Why CLI over NPM?
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Copy className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold">You own the code</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Components are copied directly to your project. No package
              dependencies, no version conflicts.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold">Easy customization</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Modify components directly in your codebase. Change styles, add
              features, make it yours.
            </p>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-muted/50 border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Next Steps</h2>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Now that you have SickUI set up, here's what you can do next:
          </p>
          <div className="grid gap-3">
            <Button variant="outline" className="justify-start" asChild>
              <a href="/docs/components" className="flex items-center gap-2">
                Browse all components
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="/docs/cli" className="flex items-center gap-2">
                Learn CLI commands
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
