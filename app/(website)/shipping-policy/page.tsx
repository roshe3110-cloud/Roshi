import type { Metadata } from "next";
import {
  PackageCheck,
  Clock,
  Truck,
  MapPin,
  AlertTriangle,
  ShieldCheck,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping Policy | ROSHÉ BEAUTY & JEWELRY",
  description:
    "Learn about ROSHÉ BEAUTY & JEWELRY shipping times, express delivery process, and order policies across Pakistan.",
  alternates: {
    canonical: "/shipping-policy",
  },
  openGraph: {
    url: "/shipping-policy",
    title: "Shipping Policy | ROSHÉ BEAUTY & JEWELRY",
    description:
      "Information about delivery times and shipping policies for ROSHÉ BEAUTY & JEWELRY orders.",
  },
};

const sections = [
  {
    icon: Clock,
    title: "Order Processing Time",
    content: (
      <p>
        All orders are processed within{" "}
        <strong className="text-neutral-900">1–2 working days</strong> after
        order confirmation. Orders placed on weekends or public holidays will be
        processed on the next working day.
      </p>
    ),
  },

  {
    icon: Truck,
    title: "Delivery Time",
    content: (
      <>
        <p>We deliver across Pakistan through trusted courier partners.</p>

        <ul className="mt-4 space-y-2 list-disc pl-5">
          <li>
            <strong className="text-neutral-900">Punjab:</strong> 3–4 working
            days
          </li>
          <li>
            <strong className="text-neutral-900">Other Provinces:</strong> 5–6
            working days
          </li>
        </ul>

        <p className="mt-4">
          Delivery times may vary depending on your location, courier
          availability, and unforeseen circumstances.
        </p>
      </>
    ),
  },

  {
    icon: PackageCheck,
    title: "Shipping Charges",
    content: (
      <p>
        Shipping charges, if applicable, will be displayed during checkout
        before completing your purchase. Any free shipping promotions will also
        be shown during checkout.
      </p>
    ),
  },

  {
    icon: MapPin,
    title: "Order Tracking",
    content: (
      <p>
        Once your order has been dispatched, you will receive confirmation
        details. Tracking information will be provided whenever available so you
        can follow your package until delivery.
      </p>
    ),
  },

  {
    icon: AlertTriangle,
    title: "Delivery Delays",
    content: (
      <>
        <p>
          While we always aim for timely delivery, delays may occasionally occur
          due to:
        </p>

        <ul className="mt-4 space-y-2 list-disc pl-5">
          <li>Public holidays</li>
          <li>Weather conditions</li>
          <li>Courier delays</li>
          <li>Remote locations</li>
        </ul>
      </>
    ),
  },

  {
    icon: ShieldCheck,
    title: "Damaged or Missing Orders",
    content: (
      <p>
        If your order arrives damaged or contains missing items, please contact
        us within <strong className="text-neutral-900">48 hours</strong> of
        receiving your package. Our team will review the issue and assist you
        promptly.
      </p>
    ),
  },
];

export default function ShippingPolicyPage() {
  return (
    <main className="container mx-auto max-w-5xl px-5 py-16">
      {/* Hero */}
      <section className="text-center mb-20">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">
          Delivery
        </span>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-neutral-900 mb-6">
          Shipping{" "}
          <span className="bg-gradient-to-r from-neutral-600 to-neutral-900 bg-clip-text text-transparent">
            Policy
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-neutral-500 leading-relaxed">
          At ROSHÉ BEAUTY &amp; JEWELRY, we make sure every order is carefully packed in luxury packaging and
          delivered safely. Here is everything you need to know about our
          shipping process.
        </p>
      </section>

      {/* Intro */}
      <section className="mb-20">
        <div className="bg-neutral-50 rounded-3xl border border-neutral-100 p-8">
          <p className="text-neutral-500 leading-relaxed">
            We partner with trusted courier services to provide reliable
            delivery across Pakistan. Our goal is to make your shopping
            experience simple, secure, and hassle-free from checkout to
            doorstep.
          </p>
        </div>
      </section>

      {/* Policy Cards */}
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
        <h2 className="text-3xl font-bold font-heading">Delivered With Care &amp; Elegance</h2>

        <p className="mt-6 max-w-2xl mx-auto text-[#F4DCD8] leading-relaxed">
          Every ROSHÉ BEAUTY &amp; JEWELRY order represents our commitment to quality. From
          luxurious protective packaging to reliable nationwide dispatch, we make sure your unboxing
          feels truly special from start to finish.
        </p>
      </section>

      {/* Contact */}
      <section className="text-center">
        <div className="flex justify-center mb-6">
          <Mail className="h-10 w-10 text-[#704638]" />
        </div>

        <h2 className="text-2xl font-bold text-[#704638] mb-4 font-heading">
          Need Help With Your Order?
        </h2>

        <p className="text-[#8C5E50] mb-8">
          If you have questions about delivery or your shipment, contact our
          support team.
        </p>

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
