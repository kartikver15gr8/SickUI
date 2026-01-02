import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import { ThemeProvider } from "../components/theme-provider";
import "../styles/globals.css";
import TopNotice from "@/components/top-notice";

const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sickui.com"),
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
    "Design System",
    "Frontend",
    "Web Development",
  ],
  authors: [
    { name: "KartikeyStack", url: "https://github.com/kartikver15gr8" },
  ],
  creator: "KartikeyStack",
  publisher: "SickUI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sickui.com",
    title: "SickUI - Copy & Paste React Components",
    description:
      "Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.",
    siteName: "SickUI",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "SickUI - Modern React Component Library",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SickUI - Copy & Paste React Components",
    description:
      "Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.",
    creator: "@KartikeyStack",
    site: "@SickUI",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "SickUI - Modern React Component Library",
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
  verification: {
    google: "your-google-verification-code", // Add your actual verification code
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
  category: "technology",
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
          <TopNotice />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
