import { Button } from "@sickui/core";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Button",
  description: "Displays a button or a component that looks like a button.",
};

export default function ButtonDocs() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
          Button
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Displays a button or a component that looks like a button.
        </p>
      </div>

      {/* Preview */}
      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Preview
        </h2>
        <div className="flex items-center justify-center rounded-md border p-8">
          <Button className="">Button</Button>
        </div>
      </div>

      {/* Installation */}
      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Installation
        </h2>
        <div className="rounded-md bg-muted p-4">
          <pre className="font-mono text-sm">
            <code>{`npm install @sickui/core`}</code>
          </pre>
        </div>
      </div>

      {/* Usage */}
      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Usage
        </h2>
        <div className="rounded-md bg-muted p-4">
          <pre className="font-mono text-sm">
            <code>{`import { Button } from "@sickui/core"

export default function Example() {
  return <Button>Button</Button>
}`}</code>
          </pre>
        </div>
      </div>

      {/* Examples */}
      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Examples
        </h2>

        {/* Default */}
        <div className="space-y-2">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Default
          </h3>
          <div className="rounded-md border p-8">
            <Button>Button</Button>
          </div>
          <div className="rounded-md bg-muted p-4">
            <pre className="font-mono text-sm">
              <code>{`<Button>Button</Button>`}</code>
            </pre>
          </div>
        </div>

        {/* Variants */}
        <div className="space-y-2">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Variants
          </h3>
          <div className="rounded-md border p-8">
            <div className="flex flex-wrap gap-2">
              <Button variant="default">Default</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>
          <div className="rounded-md bg-muted p-4">
            <pre className="font-mono text-sm">
              <code>{`<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>`}</code>
            </pre>
          </div>
        </div>

        {/* Sizes */}
        <div className="space-y-2">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Sizes
          </h3>
          <div className="rounded-md border p-8">
            <div className="flex items-center gap-2">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>
          <div className="rounded-md bg-muted p-4">
            <pre className="font-mono text-sm">
              <code>{`<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Props */}
      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Props
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-border">
            <thead>
              <tr className="border-b">
                <th className="border border-border p-2 text-left">Prop</th>
                <th className="border border-border p-2 text-left">Type</th>
                <th className="border border-border p-2 text-left">Default</th>
                <th className="border border-border p-2 text-left">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border p-2 font-mono text-sm">
                  variant
                </td>
                <td className="border border-border p-2 font-mono text-sm">
                  "default" | "destructive" | "outline" | "secondary" | "ghost"
                  | "link"
                </td>
                <td className="border border-border p-2 font-mono text-sm">
                  "default"
                </td>
                <td className="border border-border p-2">
                  The variant of the button
                </td>
              </tr>
              <tr>
                <td className="border border-border p-2 font-mono text-sm">
                  size
                </td>
                <td className="border border-border p-2 font-mono text-sm">
                  "default" | "sm" | "lg" | "icon"
                </td>
                <td className="border border-border p-2 font-mono text-sm">
                  "default"
                </td>
                <td className="border border-border p-2">
                  The size of the button
                </td>
              </tr>
              <tr>
                <td className="border border-border p-2 font-mono text-sm">
                  asChild
                </td>
                <td className="border border-border p-2 font-mono text-sm">
                  boolean
                </td>
                <td className="border border-border p-2 font-mono text-sm">
                  false
                </td>
                <td className="border border-border p-2">
                  Change the default rendered element for the one passed as a
                  child
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
