"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import GitHubStarBtn from "./githubstar-btn";

const navigation = [
  { name: "Installation", href: "/docs/installation" },
  { name: "Components", href: "/docs/components" },
  { name: "CLI", href: "/docs/cli" },
];

const componentLinks = [
  { name: "Button", href: "/docs/components/button" },
  // { name: "Card", href: "/docs/components/card" },
  // { name: "Input", href: "/docs/components/input" },
  // { name: "Badge", href: "/docs/components/badge" },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="hidden font-bold sm:inline-block">SickUI</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`transition-colors hover:text-foreground/80 ${
                    isActive(item.href)
                      ? "text-foreground"
                      : "text-foreground/60"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Mobile menu button */}
          <button
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              {/* Search would go here */}
            </div>
            <nav className="flex items-center gap-2">
              <GitHubStarBtn />
              <span
                className={`border-[0.4px] h-5 rounded-full border-[#C6C9CF] dark:border-[#2D2D2D]`}
              ></span>
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </header>

      {/* Conditional layout based on route */}
      {pathname.startsWith("/docs") ? (
        // Docs layout with sidebar
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          {/* Sidebar */}
          <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block border-r">
            <div className="h-full py-6 lg:py-8">
              <div className="w-full">
                <div className="pb-4">
                  <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
                    Getting Started
                  </h4>
                  <div className="grid grid-flow-row auto-rows-max text-sm">
                    <Link
                      href="/docs/installation"
                      className={`group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline ${
                        pathname === "/docs/installation"
                          ? "font-medium text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      Installation
                    </Link>
                    <Link
                      href="/docs/cli"
                      className={`group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline ${
                        pathname === "/docs/cli"
                          ? "font-medium text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      CLI Reference
                    </Link>
                  </div>
                </div>
                <div className="pb-4">
                  <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
                    Components
                  </h4>
                  <div className="grid grid-flow-row auto-rows-max text-sm">
                    {componentLinks.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline ${
                          pathname === item.href
                            ? "font-medium text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content for docs */}
          <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
            <div className="mx-auto w-full min-w-0">{children}</div>
          </main>
        </div>
      ) : (
        // Full-width layout for home page
        <main className="flex-1">{children}</main>
      )}
    </div>
  );
}
