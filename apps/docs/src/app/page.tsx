import { Button } from "@sickui/core";
import { ArrowRight, Code, Terminal } from "lucide-react";
import Link from "next/link";
import { CodeBlock } from "../components/code-block";
import FooterLayout from "../components/footer/footer-layout";
import HomeLayout from "../components/navbar/home-layout";

export default function Home() {
  return (
    <HomeLayout>
      <div className="flex min-h-screen flex-col">
        {/* Hero Section */}
        <section className="flex flex-1 items-center justify-center px-4 py-16 md:py-24">
          <div className="mx-auto max-w-6xl space-y-12 text-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold sm:text-6xl xl:text-7xl">
                SickUI
              </h1>
              <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
                Beautifully designed components that you can copy and paste into
                your apps. Accessible. Customizable. Open Source.
              </p>
            </div>

            {/* CLI Demo */}
            <div className="mx-auto max-w-2xl space-y-4">
              <div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
                <Terminal className="h-4 w-4" />
                <span>Get started in seconds</span>
              </div>

              <div className="grid gap-3">
                <CodeBlock
                  code="npx @sickui/cli init"
                  title="Initialize your project"
                />
                <CodeBlock
                  code="npx @sickui/cli add button"
                  title="Add components"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/docs/installation">
                <Button size="lg" className="gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/docs/components">
                <Button variant="outline" size="lg" className="gap-2">
                  <Code className="h-4 w-4" />
                  Browse Components
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Component Preview */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight">
                Built with Modern Stack
              </h2>
              <p className="text-muted-foreground">
                Every component is built with accessibility and customization in
                mind.
              </p>
            </div>

            <div className="grid items-center gap-8 lg:grid-cols-2">
              {/* Component Demo */}
              <div className="bg-card rounded-lg border p-8 shadow-sm">
                <div className="space-y-4">
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button>Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button size="sm">Small</Button>
                  </div>
                </div>
              </div>

              {/* Code Example */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Add to your project</h3>
                <CodeBlock code="npx @sickui/cli add button" showCopy={true} />
                <div className="text-muted-foreground text-sm">
                  <p>Then use in your components:</p>
                </div>
                <CodeBlock
                  code={`import { Button } from "@/components/ui/button"

export function MyComponent() {
  return <Button>Click me</Button>
}`}
                  language="tsx"
                  showCopy={true}
                />
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link href="/docs/components">
                <Button variant="outline" size="lg">
                  Browse All Components
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
      <FooterLayout />
    </HomeLayout>
  );
}
