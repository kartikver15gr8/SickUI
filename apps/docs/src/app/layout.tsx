import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import { ThemeProvider } from "../components/theme-provider";
import "../styles/globals.css";

const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "SickUI - Copy & Paste React Components",
    template: "%s | SickUI",
  },
  description:
    "Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.",
  keywords: [
    "React",
    "Components",
    "TypeScript",
    "Tailwind CSS",
    "CLI",
    "Copy Paste",
    "shadcn",
    "UI Library",
  ],
  authors: [{ name: "KartikeyStack" }],
  creator: "KartikeyStack",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sickui.com/opengraph-image.png",
    title: "SickUI - Copy & Paste React Components",
    description:
      "A modern open-source UI library. Flexible primitives, zero clutter, maximum control.",
    siteName: "SickUI",
    images: [
      {
        url: "https://sickui.com/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "SickUI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SickUI - Primitives, not prescriptions, build your UI your way.",
    description:
      "Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.",
    creator: "@KartikeyStack",
    images: [
      {
        url: "https://sickui.com/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "SickUI",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={nunito.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
