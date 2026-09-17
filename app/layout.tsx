import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
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
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteNav />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
