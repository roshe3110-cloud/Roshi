import type { Metadata } from "next";
import {
  FileText,
  UserCheck,
  ShieldCheck,
  ShoppingBag,
  CreditCard,
  Link,
  MessageSquare,
  Lock,
  AlertTriangle,
  Ban,
  Scale,
  RefreshCcw,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | ROSHÉ BEAUTY & JEWELRY",
  description:
    "Read ROSHÉ BEAUTY & JEWELRY Terms of Service covering website usage, purchases, policies, and customer responsibilities.",
  alternates: {
    canonical: "/terms-of-service",
  },
  openGraph: {
    url: "/terms-of-service",
    title: "Terms of Service | ROSHÉ BEAUTY & JEWELRY",
    description:
      "Terms and conditions for using ROSHÉ BEAUTY & JEWELRY website and services.",
  },
};

const sections = [
  {
    icon: UserCheck,
    title: "Online Store Terms",
    content: (
      <>
        <p>
          By using ROSHÉ BEAUTY &amp; JEWELRY website, you confirm that you are at least 18
          years old or accessing the website with permission from a parent or
          legal guardian.
        </p>

        <p className="mt-4">
          You agree not to use our products or services for any illegal,
          harmful, or unauthorized purpose.
        </p>
      </>
    ),
  },

  {
    icon: ShieldCheck,
    title: "General Conditions",
    content: (
      <>
        <p>We reserve the right to refuse service to anyone when necessary.</p>

        <p className="mt-4">
          Payment information is always encrypted and protected during
          processing.
        </p>

        <p className="mt-4">
          You may not copy, reproduce, sell, or exploit any part of our website
          or content without written permission.
        </p>
      </>
    ),
  },

  {
    icon: FileText,
    title: "Accuracy of Information",
    content: (
      <p>
        We work hard to ensure all website information is accurate. However,
        errors may occasionally occur. Product details, prices, and availability
        may change without notice.
      </p>
    ),
  },

  {
    icon: ShoppingBag,
    title: "Products & Pricing",
    content: (
      <>
        <p>
          Some products may only be available online. Colors may appear
          differently depending on your device screen.
        </p>

        <p className="mt-4">
          We reserve the right to modify, discontinue, limit, or cancel products
          and orders when required.
        </p>
      </>
    ),
  },

  {
    icon: CreditCard,
    title: "Billing & Account Information",
    content: (
      <>
        <p>
          Customers must provide accurate and complete information when placing
          an order.
        </p>

        <p className="mt-4">
          We may cancel or limit orders that appear suspicious, including bulk
          purchases intended for resale.
        </p>
      </>
    ),
  },

  {
    icon: Link,
    title: "Third-Party Links",
    content: (
      <p>
        Our website may contain links to external websites. ROSHÉ BEAUTY &amp; JEWELRY is not
        responsible for third-party content, services, or privacy practices.
        Please review their policies before using external websites.
      </p>
    ),
  },

  {
    icon: MessageSquare,
    title: "User Feedback",
    content: (
      <>
        <p>
          Any feedback, suggestions, or comments shared with us may be used to
          improve our products and services.
        </p>

        <p className="mt-4">
          Users agree not to submit illegal, abusive, harmful, or inappropriate
          content.
        </p>
      </>
    ),
  },

  {
    icon: Lock,
    title: "Personal Information",
    content: (
      <p>
        Your personal information is handled according to our Privacy Policy. We
        take reasonable steps to protect your information and maintain your
        privacy.
      </p>
    ),
  },

  {
    icon: AlertTriangle,
    title: "Errors & Updates",
    content: (
      <p>
        Occasionally, our website may contain errors relating to pricing,
        product details, or availability. We reserve the right to correct errors
        and cancel incorrect orders when necessary.
      </p>
    ),
  },

  {
    icon: Ban,
    title: "Prohibited Uses",
    content: (
      <>
        <p>You may not use this website:</p>

        <ul className="mt-4 list-disc pl-5 space-y-2">
          <li>For illegal purposes</li>
          <li>To harm or harass others</li>
          <li>To upload harmful software or viruses</li>
          <li>To collect personal information without permission</li>
          <li>To misuse our content or design</li>
        </ul>
      </>
    ),
  },

  {
    icon: Scale,
    title: "Disclaimer & Liability",
    content: (
      <p>
        We do not guarantee that our website will always be error-free or
        available without interruption. You use our website and products at your
        own risk. ROSHÉ BEAUTY &amp; JEWELRY is not responsible for indirect losses or damages.
      </p>
    ),
  },

  {
    icon: RefreshCcw,
    title: "Changes to Terms",
    content: (
      <p>
        We may update these Terms of Service from time to time. Continued use of
        our website after changes are posted means you accept the updated terms.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <main className="container mx-auto max-w-5xl px-5 py-16">
      {/* Hero */}
      <section className="text-center mb-20">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">
          Legal
        </span>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-neutral-900 mb-6">
          Terms of{" "}
          <span className="bg-gradient-to-r from-neutral-600 to-neutral-900 bg-clip-text text-transparent">
            Service
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-neutral-500 leading-relaxed">
          Please read these terms carefully before using ROSHÉ BEAUTY &amp; JEWELRY website or
          purchasing our products.
        </p>
      </section>

      {/* Intro */}
      <section className="mb-20">
        <div className="bg-neutral-50 rounded-3xl border border-neutral-100 p-8">
          <p className="text-neutral-500 leading-relaxed">
            This website is operated by ROSHÉ BEAUTY &amp; JEWELRY. By visiting our website or
            placing an order, you agree to follow these Terms of Service.
          </p>
        </div>
      </section>

      {/* Sections */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {sections.map((section) => {
          const Icon = section.icon;

          return (
            <div
              key={section.title}
              className="bg-neutral-50 rounded-3xl border border-neutral-100 p-8"
            >
              <Icon className="h-8 w-8 text-neutral-900 mb-5" />

              <h2 className="text-lg font-bold text-neutral-900 mb-3">
                {section.title}
              </h2>

              <div className="text-sm text-neutral-500 leading-relaxed">
                {section.content}
              </div>
            </div>
          );
        })}
      </section>

      {/* Brand Statement */}
      <section className="bg-[#704638] rounded-3xl px-10 py-16 text-center text-white mb-20 border border-[#D4A45E]/30 shadow-xl">
        <h2 className="text-3xl font-bold font-heading">Built On Trust &amp; Radiance</h2>

        <p className="mt-6 max-w-2xl mx-auto text-[#F4DCD8] leading-relaxed">
          We believe strong relationships are built through honesty,
          responsibility, and authentic care. These terms help create a safe, luxurious, and
          reliable experience for everyone.
        </p>
      </section>

      {/* Contact */}
      <section className="text-center">
        <h2 className="text-2xl font-bold text-[#704638] mb-6 font-heading">
          Questions About Our Terms?
        </h2>

        <div className="space-y-3 text-[#8C5E50] mb-8">
          <p className="flex justify-center items-center gap-2">
            <Mail className="h-4 w-4 text-[#D4A45E]" />
            Roshe3110@gmail.com
          </p>

          <p className="flex justify-center items-center gap-2">
            <Phone className="h-4 w-4 text-[#D4A45E]" />
            +92 347 1060653
          </p>

          <p className="flex justify-center items-center gap-2">
            <MapPin className="h-4 w-4 text-[#D4A45E]" />
            Koragh Chowk By Pass Road Mardan
          </p>
        </div>

        <a
          href="mailto:Roshe3110@gmail.com"
          className="inline-flex items-center gap-2 bg-[#704638] text-white px-8 py-3.5 rounded-2xl font-semibold hover:bg-[#5C372B] transition-colors"
        >
          Contact Us
        </a>

        <p className="mt-8 text-sm text-neutral-400">
          Last Updated • August 2026
        </p>
      </section>
    </main>
  );
}
