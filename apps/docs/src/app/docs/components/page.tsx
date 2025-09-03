import Link from "next/link";
import { Button } from "@sickui/core";
import type { Metadata } from "next";

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
    preview: (
      <div className="flex gap-2">
        <Button size="sm">Default</Button>
        <Button variant="outline" size="sm">
          Outline
        </Button>
      </div>
    ),
  },
  {
    name: "Card",
    description: "Displays a card with header, content, and footer.",
    href: "/docs/components/card",
    preview: (
      <div className="w-full max-w-sm rounded-lg border bg-card p-4 shadow-sm">
        <h3 className="font-semibold">Card Title</h3>
        <p className="text-sm text-muted-foreground">Card description</p>
      </div>
    ),
  },
  {
    name: "Input",
    description: "Displays a form input field.",
    href: "/docs/components/input",
    preview: (
      <input
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        placeholder="Enter text..."
      />
    ),
  },
  {
    name: "Badge",
    description: "Displays a badge or a component that looks like a badge.",
    href: "/docs/components/badge",
    preview: (
      <div className="flex gap-2">
        <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
          Default
        </span>
        <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
          Secondary
        </span>
      </div>
    ),
  },
];

export default function ComponentsOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
          Components
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Beautifully designed components built with Radix UI and Tailwind CSS.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        {components.map((component) => (
          <Link
            key={component.name}
            href={component.href}
            className="group relative rounded-lg border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold group-hover:underline">
                  {component.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {component.description}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0">{component.preview}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-lg border bg-muted/50 p-6">
        <h2 className="text-lg font-semibold mb-2">
          More components coming soon!
        </h2>
        <p className="text-sm text-muted-foreground">
          We're actively working on adding more components to the library. Check
          back regularly for updates or contribute on GitHub.
        </p>
      </div>
    </div>
  );
}
