import Link from "next/link";
import { Button } from "@sickui/core";
import { ArrowRight, Zap, Palette, Code } from "lucide-react";
import Layout from "../components/layout";

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SickUI
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A modern, high-performance React component library built with
                TypeScript, Tailwind CSS, and Radix UI primitives. Copy, paste,
                and customize.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/docs/getting-started">
                <Button size="lg" className="gap-2">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/docs/components">
                <Button variant="outline" size="lg" className="gap-2">
                  <Code className="w-4 h-4" />
                  View Components
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
                Built with modern tools and best practices for the best
                developer experience.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Built with Vite and optimized for performance with
                  tree-shaking and minimal bundle size.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                  <Palette className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold">Fully Customizable</h3>
                <p className="text-muted-foreground">
                  CSS variables and Tailwind classes make theming and
                  customization effortless.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                  <Code className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Developer Experience</h3>
                <p className="text-muted-foreground">
                  TypeScript-first with excellent IntelliSense and comprehensive
                  documentation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Component Preview */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-8">
              Component Showcase
            </h2>
            <div className="bg-card border rounded-lg p-8 shadow-sm">
              <div className="flex flex-wrap gap-4 justify-center">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button size="sm">Small</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
            <div className="mt-8">
              <Link href="/docs/components">
                <Button variant="outline">
                  View All Components
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
