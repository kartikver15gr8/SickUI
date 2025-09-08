import Link from "next/link";
import { Button } from "@sickui/core";
import type { Metadata } from "next";
import { Terminal, Copy } from "lucide-react";
import { CodeBlock } from "../../../components/code-block";

export const metadata: Metadata = {
  title: "Components",
  description:
    "Beautifully designed components built with Radix UI and Tailwind CSS.",
};

const components = [
  {
    name: "Button",
    description: "Displays a button or a component that looks like a button.",
    href: "/docs/components/button",
    command: "npx @sickui/cli add button",
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ],
    preview: (
      <div className="flex gap-2">
        <Button size="sm">Default</Button>
        <Button variant="outline" size="sm">
          Outline
        </Button>
      </div>
    ),
  },
  // {
  //   name: "Card",
  //   description: "Displays a card with header, content, and footer.",
  //   href: "/docs/components/card",
  //   command: "npx @sickui/cli add card",
  //   dependencies: ["clsx", "tailwind-merge"],
  //   preview: (
  //     <div className="w-full max-w-sm rounded-lg border bg-card p-4 shadow-sm">
  //       <h3 className="font-semibold">Card Title</h3>
  //       <p className="text-sm text-muted-foreground">Card description</p>
  //     </div>
  //   ),
  // },
  // {
  //   name: "Input",
  //   description: "Displays a form input field.",
  //   href: "/docs/components/input",
  //   command: "npx @sickui/cli add input",
  //   dependencies: ["clsx", "tailwind-merge"],
  //   preview: (
  //     <input
  //       className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
  //       placeholder="Enter text..."
  //     />
  //   ),
  // },
  // {
  //   name: "Badge",
  //   description: "Displays a badge or a component that looks like a badge.",
  //   href: "/docs/components/badge",
  //   command: "npx @sickui/cli add badge",
  //   dependencies: ["clsx", "tailwind-merge", "class-variance-authority"],
  //   preview: (
  //     <div className="flex gap-2">
  //       <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
  //         Default
  //       </span>
  //       <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
  //         Secondary
  //       </span>
  //     </div>
  //   ),
  // },
];

export default function ComponentsOverview() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
          Components
        </h1>
        <p className="text-xl text-muted-foreground">
          Copy and paste the most re-usable components built with Radix UI and
          Tailwind CSS.
        </p>
      </div>

      {/* Quick Install */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Terminal className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Quick Install</h2>
        </div>
        <div className="space-y-3">
          <p className="text-muted-foreground">
            Add any component to your project with a single command:
          </p>
          <CodeBlock code="npx @sickui/cli add [component-name]" />
        </div>
      </div>

      {/* Components Grid */}
      <div className="space-y-6">
        {components.map((component) => (
          <div
            key={component.name}
            className="group relative rounded-lg border p-6 hover:shadow-md transition-shadow"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Link href={component.href}>
                    <h3 className="text-xl font-semibold group-hover:underline cursor-pointer">
                      {component.name}
                    </h3>
                  </Link>
                  <p className="text-muted-foreground">
                    {component.description}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">{component.preview}</div>
              </div>

              {/* Installation */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Copy className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Installation</span>
                </div>
                <CodeBlock code={component.command} showCopy={true} />
              </div>

              {/* Dependencies */}
              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Dependencies:
                </span>
                <div className="flex flex-wrap gap-2">
                  {component.dependencies.map((dep) => (
                    <code
                      key={dep}
                      className="bg-muted px-2 py-1 rounded text-xs"
                    >
                      {dep}
                    </code>
                  ))}
                </div>
              </div>

              {/* View Details Link */}
              <div className="pt-2">
                <Link
                  href={component.href}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  View component details →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon */}
      <div className="mt-8 rounded-lg border bg-muted/50 p-6">
        <h2 className="text-lg font-semibold mb-2">
          More components coming soon!
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          We're actively working on adding more components to the library. Check
          back regularly for updates or contribute on GitHub.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
          <span>• Card</span>
          <span>• Input</span>
          <span>• Badge</span>
          <span>• Dialog</span>
          <span>• Dropdown</span>
          <span>• Tooltip</span>
          <span>• Avatar</span>
          <span>• Tabs</span>
        </div>
      </div>
    </div>
  );
}
