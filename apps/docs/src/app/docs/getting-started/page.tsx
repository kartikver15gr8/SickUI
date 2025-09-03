import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Getting Started",
  description:
    "Get started with SickUI by installing the package and setting up your first component.",
};

export default function GettingStarted() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
          Getting Started
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Get started with SickUI by installing the package and setting up your
          first component.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Installation
        </h2>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Install the package
          </h3>
          <div className="rounded-md bg-muted p-4">
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
              npm install @sickui/core
            </code>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Import styles
          </h3>
          <p className="leading-7">
            Add the CSS file to your app's root layout or main CSS file:
          </p>
          <div className="rounded-md bg-muted p-4">
            <pre className="font-mono text-sm">
              <code>{`import '@sickui/core/dist/styles.css'`}</code>
            </pre>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Configure Tailwind CSS
          </h3>
          <p className="leading-7">
            Add the SickUI source to your{" "}
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
              tailwind.config.js
            </code>{" "}
            file:
          </p>
          <div className="rounded-md bg-muted p-4">
            <pre className="font-mono text-sm">
              <code>{`module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@sickui/core/dist/**/*.js',
  ],
  // ... rest of your config
}`}</code>
            </pre>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
            Usage
          </h2>
          <p className="leading-7">
            Import and use components in your React application:
          </p>
          <div className="rounded-md bg-muted p-4">
            <pre className="font-mono text-sm">
              <code>{`import { Button } from '@sickui/core'

function App() {
  return (
    <div>
      <Button>Click me</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  )
}`}</code>
            </pre>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
            Next Steps
          </h2>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>
              Explore the{" "}
              <a
                href="/docs/components"
                className="font-medium text-primary underline underline-offset-4"
              >
                component library
              </a>
            </li>
            <li>
              Check out{" "}
              <a
                href="/docs/examples"
                className="font-medium text-primary underline underline-offset-4"
              >
                examples
              </a>{" "}
              and use cases
            </li>
            <li>
              Learn about{" "}
              <a
                href="/docs/theming"
                className="font-medium text-primary underline underline-offset-4"
              >
                theming and customization
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
