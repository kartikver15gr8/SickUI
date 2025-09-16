import Link from "next/link";
import { Button } from "@sickui/core";
import { ArrowRight, Terminal, Copy, Palette, Code } from "lucide-react";
import { CodeBlock } from "../components/code-block";
import HomeLayout from "../components/navbar/home-layout";
import FooterLayout from "../components/footer/footer-layout";

export default function Home() {
  return (
    <HomeLayout>
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center px-4 py-16 md:py-24">
          <div className="max-w-6xl mx-auto text-center space-y-12">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SickUI
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Beautifully designed components that you can copy and paste into
                your apps. Accessible. Customizable. Open Source.
              </p>
            </div>

            {/* CLI Demo */}
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Terminal className="w-4 h-4" />
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

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/docs/installation">
                <Button size="lg" className="gap-2">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/docs/components">
                <Button variant="outline" size="lg" className="gap-2">
                  <Code className="w-4 h-4" />
                  Browse Components
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-muted/50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Why SickUI?</h2>
              <p className="text-muted-foreground mt-4">
                Copy, paste, own. The simplest way to add components to your
                project.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                  <Copy className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Copy & Paste</h3>
                <p className="text-muted-foreground">
                  Copy the code directly into your project. No package
                  dependencies. You own the code.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                  <Palette className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold">Fully Customizable</h3>
                <p className="text-muted-foreground">
                  Built with Tailwind CSS and CSS variables. Customize colors,
                  spacing, and styling to match your design.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                  <Terminal className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">CLI Powered</h3>
                <p className="text-muted-foreground">
                  Use our CLI to add components to your project. Automatic
                  dependency installation and setup.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Component Preview */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Built with Modern Stack
              </h2>
              <p className="text-muted-foreground">
                Every component is built with accessibility and customization in
                mind.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Component Demo */}
              <div className="bg-card border rounded-lg p-8 shadow-sm">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Button>Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center">
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
                <div className="text-sm text-muted-foreground">
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

            <div className="text-center mt-12">
              <Link href="/docs/components">
                <Button variant="outline" size="lg">
                  Browse All Components
                  <ArrowRight className="w-4 h-4 ml-2" />
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
