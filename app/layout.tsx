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
      "ROSHÉ BEAUTY & JEWELRY | Luxury Skincare, Cosmetics & Fine Jewelry",
    template: "%s | ROSHÉ BEAUTY & JEWELRY",
  },
  description:
    "Discover ROSHÉ BEAUTY & JEWELRY — Pakistan's premier destination for pure luxury skincare, radiant cosmetic formulations, and exquisite 18K gold-plated waterproof jewelry with nationwide delivery.",
  keywords: [
    "ROSHÉ BEAUTY",
    "ROSHÉ BEAUTY & JEWELRY",
    "Roshe Beauty",
    "Luxury Skincare Pakistan",
    "Cosmetics Pakistan",
    "Fine Jewelry Pakistan",
    "Waterproof Jewelry",
    "18K Gold Plated Jewelry",
    "Anti Tarnish Jewelry",
    "Necklaces",
    "Rings",
    "Bracelets",
    "Earrings",
    "Face Serums",
    "Lipstick",
    "Velvet Matte",
    "Radiant Glow",
    "Hydrating Skincare",
  ],
  authors: [{ name: "ROSHÉ BEAUTY & JEWELRY", url: "https://roshebeauty.com" }],
  creator: "ROSHÉ BEAUTY & JEWELRY",
  publisher: "ROSHÉ BEAUTY & JEWELRY",
  category: "Beauty, Cosmetics & Fine Jewelry",
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: "https://roshebeauty.com",
    siteName: "ROSHÉ BEAUTY & JEWELRY",
    title:
      "ROSHÉ BEAUTY & JEWELRY | Luxury Skincare, Cosmetics & Fine Jewelry",
    description:
      "Your trusted destination for pure luxury skincare, radiant cosmetic formulations, and 18K gold-plated waterproof fine jewelry. 100% authentic with nationwide delivery.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "ROSHÉ BEAUTY & JEWELRY — Luxury Skincare, Cosmetics & Fine Jewelry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "ROSHÉ BEAUTY & JEWELRY | Luxury Skincare, Cosmetics & Fine Jewelry",
    description:
      "Pure luxury skincare, velvet cosmetics, and 18K gold-plated fine jewelry with nationwide delivery.",
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
      name: "ROSHÉ BEAUTY & JEWELRY",
      url: "https://roshebeauty.com",
      logo: "https://roshebeauty.com/logo.png",
      description:
        "Pakistan's premier brand for luxury skincare, cosmetics, and handcrafted 18K gold-plated waterproof fine jewelry.",
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
      name: "ROSHÉ BEAUTY & JEWELRY",
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
