import type { Metadata } from "next";
import {
  Ban,
  RotateCcw,
  RefreshCcw,
  CreditCard,
  Mail,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Refund & Exchange Policy",
  description:
    "Learn about ROSHÉ BEAUTY refund, return, exchange, and customer satisfaction policies.",
  alternates: {
    canonical: "/refund-policy",
  },
  openGraph: {
    url: "/refund-policy",
    title: "Refund & Exchange Policy | ROSHÉ BEAUTY",
    description:
      "Information about returns, refunds, exchanges, and beauty satisfaction guarantee.",
  },
};

const sections = [
  {
    icon: Ban,
    title: "Order Cancellation",
    content: (
      <>
        <p>
          We begin processing your order as soon as it is confirmed. If you wish
          to cancel your order, please contact us as soon as possible through
          call, WhatsApp, or email.
        </p>

        <p className="mt-4">
          There are no cancellation fees; however, cancellations must be
          requested before your order enters the production or shipping stage.
        </p>
      </>
    ),
  },

  {
    icon: RotateCcw,
    title: "Refunds & Returns",
    content: (
      <>
        <p>
          New and unused items can be returned within{" "}
          <strong className="text-neutral-900">14 days</strong> of delivery for
          a refund.
        </p>

        <ul className="mt-4 space-y-2 list-disc pl-5">
          <li>
            Items must be returned in original packaging and unused condition.
          </li>
          <li>
            Customers are responsible for return shipping unless the product is
            defective or damaged.
          </li>
          <li>
            Refunds are processed within 5–10 business days after inspection.
          </li>
          <li>
            Defective or incorrect products qualify for a full refund and return
            shipping coverage.
          </li>
          <li>
            Sale items, custom products, and personalized items are
            non-refundable and non-exchangeable.
          </li>
        </ul>
      </>
    ),
  },

  {
    icon: RefreshCcw,
    title: "Exchange Policy",
    content: (
      <>
        <p>
          Customers may exchange their item within{" "}
          <strong className="text-neutral-900">14 days</strong> for a different
          size, color, or model.
        </p>

        <p className="mt-4">
          The product must be unused and returned in its original condition.
          Exchange shipping costs are the customers responsibility unless the
          received item was defective.
        </p>
      </>
    ),
  },

  {
    icon: CreditCard,
    title: "Chargeback Policy",
    content: (
      <>
        <p>
          A chargeback occurs when a customer requests their bank or payment
          provider to reverse a transaction.
        </p>

        <p className="mt-4">
          Before initiating a chargeback, we kindly request that you contact our
          team first so we can review and resolve your concern.
        </p>

        <p className="mt-4">
          False or unnecessary chargeback claims may delay resolution and may
          affect your account status with payment providers.
        </p>
      </>
    ),
  },

  {
    icon: ShieldCheck,
    title: "Our Commitment",
    content: (
      <p>
        We aim to handle every refund, exchange, and order-related concern
        fairly, transparently, and quickly. Customer satisfaction remains our
        priority.
      </p>
    ),
  },
];

export default function RefundPolicyPage() {
  return (
    <main className="container mx-auto max-w-5xl px-5 py-16">
      {/* Hero */}
      <section className="text-center mb-20">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">
          Customer Support
        </span>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-neutral-900 mb-6">
          Refund &{" "}
          <span className="bg-gradient-to-r from-neutral-600 to-neutral-900 bg-clip-text text-transparent">
            Chargeback Policy
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-neutral-500 leading-relaxed">
          At ROSHÉ BEAUTY, your satisfaction matters to us. We want every purchase
          experience to be simple, transparent, and radiant.
        </p>
      </section>

      {/* Introduction */}
      <section className="mb-20">
        <div className="bg-neutral-50 rounded-3xl border border-neutral-100 p-8">
          <p className="text-neutral-500 leading-relaxed">
            Please review our refund, return, exchange, and chargeback policies
            before placing an order. Our goal is to resolve every concern fairly
            while protecting both our customers and our brand.
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
      <section className="bg-neutral-900 rounded-3xl px-10 py-16 text-center text-white mb-20">
        <h2 className="text-3xl font-bold">Your Satisfaction Comes First</h2>

        <p className="mt-6 max-w-2xl mx-auto text-neutral-400 leading-relaxed">
          We believe in building long-term relationships with our customers.
          Every refund, exchange, and support request is handled with honesty,
          fairness, and care.
        </p>
      </section>

      {/* Contact */}
      <section className="text-center">
        <div className="flex justify-center mb-6">
          <Mail className="h-10 w-10 text-neutral-900" />
        </div>

        <h2 className="text-2xl font-bold text-neutral-900 mb-4">
          Need Help With Your Order?
        </h2>

        <p className="text-neutral-500 mb-3">
          For refunds, exchanges, or payment questions, contact our support
          team.
        </p>

        <p className="text-neutral-500 mb-8">
          WhatsApp / Mobile:{" "}
          <strong className="text-neutral-900">+92 347 1060653</strong>
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
