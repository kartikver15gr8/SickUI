"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import GitHubStarBtn from "./githubstar-btn";
import Image from "next/image";

const navigation = [
  { name: "Installation", href: "/docs/installation" },
  { name: "Components", href: "/docs/components" },
  { name: "CLI", href: "/docs/cli" },
];

const componentLinks = [
  { name: "Badge", href: "/docs/components/badge" },
  { name: "Button", href: "/docs/components/button" },
  { name: "Calendar", href: "/docs/components/calendar" },
  { name: "Circular Progress", href: "/docs/components/circular-progress" },
  { name: "Skeleton", href: "/docs/components/skeleton" },
  // { name: "Card", href: "/docs/components/card" },
  // { name: "Input", href: "/docs/components/input" },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Function to handle closing with animation
  const handleCloseMobileMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setMobileMenuOpen(false);
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  // Close mobile menu when route changes
  useEffect(() => {
    if (mobileMenuOpen) {
      handleCloseMobileMenu();
    }
  }, [pathname]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        handleCloseMobileMenu();
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when mobile menu is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
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
                  className={`hover:text-foreground/80 transition-colors ${
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

          {/* Mobile menu button - only show on docs pages */}
          {pathname.startsWith("/docs") && (
            <button
              className="dark:hover:bg-accent hover:text-accent-foreground focus:ring-ring inline-flex items-center justify-center rounded-md p-2 outline-none transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          )}

          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              {/* Search would go here */}
            </div>
            <nav className="flex items-center gap-2">
              <GitHubStarBtn />
              <span
                className={`h-5 rounded-full border-[0.4px] border-[#C6C9CF] dark:border-[#2D2D2D]`}
              ></span>
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && pathname.startsWith("/docs") && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
              isClosing ? "mobile-backdrop-exit" : "mobile-backdrop-enter"
            }`}
            onClick={handleCloseMobileMenu}
          />

          {/* Mobile Sidebar */}
          <div
            className={`bg-background fixed left-0 top-0 h-screen w-80 max-w-[80vw] rounded-r-2xl shadow-lg transition-transform duration-300 ${
              isClosing ? "mobile-sidebar-exit" : "mobile-sidebar-enter"
            }`}
          >
            {/* Close button */}
            <div className="flex justify-between p-4">
              <Link href="/" className="ml-2 mr-5 flex items-center space-x-3">
                <Image
                  className={`h-9 w-9 rounded-lg dark:border dark:border-[#9493935a]`}
                  src={"/logo/sickui-logo.png"}
                  alt="SickUI Logo"
                  width={200}
                  height={200}
                />
                <span className="text-[15px] font-bold sm:inline-block sm:text-[12px] md:text-[14px] lg:text-[15px]">
                  SickUI
                </span>
              </Link>
              <button
                onClick={handleCloseMobileMenu}
                className="text-muted-foreground hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-md p-2 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="h-full overflow-y-auto px-4 py-6">
              <div className="w-full">
                <div className="pb-4">
                  <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
                    Getting Started
                  </h4>
                  <div className="grid grid-flow-row auto-rows-max text-sm">
                    <Link
                      href="/docs/installation"
                      onClick={handleCloseMobileMenu}
                      className={`group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline ${
                        pathname === "/docs/installation"
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      Installation
                    </Link>
                    <Link
                      href="/docs/cli"
                      onClick={handleCloseMobileMenu}
                      className={`group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline ${
                        pathname === "/docs/cli"
                          ? "text-foreground font-medium"
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
                        onClick={handleCloseMobileMenu}
                        className={`group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline ${
                          pathname === item.href
                            ? "text-foreground font-medium"
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
          </div>
        </div>
      )}

      {/* Conditional layout based on route */}
      {pathname.startsWith("/docs") ? (
        // Docs layout with sidebar
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          {/* Desktop Sidebar */}
          <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 border-r md:sticky md:block">
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
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      Installation
                    </Link>
                    <Link
                      href="/docs/cli"
                      className={`group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline ${
                        pathname === "/docs/cli"
                          ? "text-foreground font-medium"
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
                            ? "text-foreground font-medium"
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
            <div className="mx-auto w-full min-w-0 max-w-full overflow-hidden px-4 sm:px-6">
              {children}
            </div>
          </main>
        </div>
      ) : (
        // Full-width layout for home page
        <main className="flex-1">{children}</main>
      )}
    </div>
  );
}
