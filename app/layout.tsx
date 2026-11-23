import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";

import SiteChrome from "@/components/SiteChrome";
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
    // Kept under ~60 characters so the brand is not cut off in results; the
    // fuller keyword set lives in the h1 and description.
    default: "Poggenpohl Atlanta | Luxury German Kitchens in Buckhead",
    template: "%s | Atelier Living Group",
  },
  description:
    "Discover bespoke German kitchens at Poggenpohl Atlanta. Visit our Buckhead showroom to explore cabinetry, finishes, and layouts tailored to the way you live.",
  applicationName: "Atelier Living Group",
  authors: [{ name: "Atelier Living Group", url: siteUrl }],
  creator: "Atelier Living Group",
  publisher: "Atelier Living Group",
  category: "Home & Garden",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // The phone number is already a tel: link; leaving auto-detection on lets
  // iOS Safari restyle it and other numerals on the page.
  formatDetection: { telephone: false, address: false, email: false },
  // The Atelier Living Group leaf mark, in the sizes browsers and phones ask for.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "256x256", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Poggenpohl Atlanta | Luxury German Kitchens in Buckhead",
    description:
      "Discover bespoke German kitchens at Poggenpohl Atlanta. Visit our Buckhead showroom to explore cabinetry, finishes, and layouts tailored to the way you live.",
    url: "/",
    siteName: "Atelier Living Group",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Poggenpohl Atlanta: luxury German kitchens in Buckhead, by Atelier Living Group",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Poggenpohl Atlanta | Luxury German Kitchens in Buckhead",
    description:
      "Discover bespoke German kitchens at Poggenpohl Atlanta. Visit our Buckhead showroom to explore cabinetry, finishes, and layouts tailored to the way you live.",
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
      lang="en-US"
      className={`${geistSans.variable} ${geistMono.variable} ${displaySerif.variable}`}
    >
      <body className="antialiased">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <StartAtTop />
        <SiteChrome nav={<SiteNav />} footer={<SiteFooter />}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
