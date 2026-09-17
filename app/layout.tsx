import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";

import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import StartAtTop from "@/components/StartAtTop";
import { siteUrl } from "@/content/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Display serif. Replaces "Times New Roman", which is a system default and
 * read as an unstyled document rather than a considered brand face.
 * 600 is carried so smaller headings do not go thin.
 */
const displaySerif = Cormorant_Garamond({
  variable: "--font-display-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Luxury German Kitchens, Custom Cabinetry & Appliances Atlanta | Atelier Living Group",
    template: "%s | Atelier Living Group",
  },
  description:
    "Exclusive Poggenpohl dealer for Atlanta and Georgia. Luxury kitchen design-build, premium remodeling, high-end appliances and custom German cabinetry at the Terminus showroom.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Luxury German Kitchens, Custom Cabinetry & Appliances Atlanta",
    description:
      "Atelier Living Group is the exclusive Poggenpohl dealer for Atlanta and Georgia, specializing in luxury kitchens, premium remodeling, high-end appliances and fully custom German cabinetry.",
    url: "/",
    siteName: "Atelier Living Group",
    images: ["/og.png"],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxury German Kitchens, Custom Cabinetry & Appliances Atlanta",
    description:
      "Exclusive Poggenpohl dealer for Atlanta and Georgia. Luxury kitchen design-build, premium remodeling, high-end appliances and custom German cabinetry.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // Font variables go on <html>, not <body>: globals.css composes --serif
    // and --sans on :root, and a var() there cannot see a custom property
    // defined one level below it.
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${displaySerif.variable}`}
    >
      <body className="antialiased">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <StartAtTop />
        <SiteNav />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
