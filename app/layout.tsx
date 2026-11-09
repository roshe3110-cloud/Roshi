import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import QueryProvider from "@/providers/query-provider";
import ToasterClient from "@/components/common/ToasterClient";
import { STORE_CONTACT } from "@/components/common/SocialIcons";

// Heading font: Outfit — modern, geometric, authoritative luxury feel
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

// Body font: Plus Jakarta Sans — award-winning clean readability
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F9F4EF",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://roshebeauty.com"),
  title: {
    default:
      "ROSHÉ BEAUTY | Luxury Skincare, Cosmetics & Radiant Beauty Essentials",
    template: "%s | ROSHÉ BEAUTY",
  },
  description:
    "Discover ROSHÉ BEAUTY — Pakistan's premier destination for pure luxury skincare, radiant cosmetic formulations, and rejuvenating beauty essentials with nationwide delivery.",
  keywords: [
    "ROSHÉ BEAUTY",
    "Roshe Beauty",
    "Luxury Skincare Pakistan",
    "Cosmetics Pakistan",
    "Face Serums",
    "Lipstick",
    "Velvet Matte",
    "Radiant Glow",
    "Hydrating Skincare",
    "Dermatology Tested Cosmetics",
  ],
  authors: [{ name: "ROSHÉ BEAUTY", url: "https://roshebeauty.com" }],
  creator: "ROSHÉ BEAUTY",
  publisher: "ROSHÉ BEAUTY",
  category: "Beauty, Cosmetics & Personal Care",
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: "https://roshebeauty.com",
    siteName: "ROSHÉ BEAUTY",
    title:
      "ROSHÉ BEAUTY | Luxury Skincare, Cosmetics & Radiant Beauty Essentials",
    description:
      "Your trusted destination for pure luxury skincare, radiant cosmetic formulations, and rejuvenating beauty essentials. 100% authentic with nationwide delivery.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "ROSHÉ BEAUTY — Luxury Skincare & Cosmetics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "ROSHÉ BEAUTY | Luxury Skincare, Cosmetics & Radiant Beauty Essentials",
    description:
      "Pure luxury skincare, cosmetics, and radiant beauty essentials with nationwide delivery.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://roshebeauty.com/#organization",
      name: "ROSHÉ BEAUTY",
      url: "https://roshebeauty.com",
      logo: "https://roshebeauty.com/logo.png",
      description:
        "Pakistan's premier brand for luxury skincare, cosmetics, and rejuvenating beauty solutions.",
      email: STORE_CONTACT.email,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: STORE_CONTACT.phoneFormatted,
        contactType: "customer service",
        availableLanguage: ["English", "Urdu"],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://roshebeauty.com/#website",
      url: "https://roshebeauty.com",
      name: "ROSHÉ BEAUTY",
      publisher: {
        "@id": "https://roshebeauty.com/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://roshebeauty.com/collection?search={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        plusJakartaSans.variable,
        outfit.variable,
      )}
    >
      <head>
        <link
          rel="preconnect"
          href="https://wqioxoqrolqezrasgbfu.supabase.co"
        />
        <link
          rel="dns-prefetch"
          href="https://wqioxoqrolqezrasgbfu.supabase.co"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans bg-[#F9F4EF] text-[#704638]">
        <QueryProvider>{children}</QueryProvider>
        <ToasterClient />
      </body>
    </html>
  );
}
