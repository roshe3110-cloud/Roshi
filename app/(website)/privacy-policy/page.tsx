// app/privacy-policy/page.tsx

import {
  ShieldCheck,
  Lock,
  Database,
  CreditCard,
  Cookie,
  UserCheck,
  Mail,
  RefreshCw,
} from "lucide-react";

const sections = [
  {
    icon: Database,
    title: "Information We Collect",
    content: (
      <>
        <p className="text-muted-foreground leading-7">
          To provide a smooth shopping experience, we may collect the following
          information when you use our website:
        </p>

        <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
          <li>Full name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Shipping & billing address</li>
          <li>Payment information (processed securely)</li>
          <li>Preferences and shopping interests</li>
        </ul>
      </>
    ),
  },

  {
    icon: UserCheck,
    title: "How We Use Your Information",
    content: (
      <>
        <p className="text-muted-foreground leading-7">
          We only use your information for legitimate business purposes,
          including:
        </p>

        <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
          <li>Processing and delivering your orders</li>
          <li>Providing order updates and customer support</li>
          <li>Improving our products and website experience</li>
          <li>Processing payments securely</li>
          <li>
            Sending promotional emails only if you have chosen to receive them
          </li>
        </ul>
      </>
    ),
  },

  {
    icon: CreditCard,
    title: "Payment Security",
    content: (
      <p className="text-muted-foreground leading-7">
        Your payment information is used only to complete your purchase.
        Sensitive payment details such as credit or debit card numbers are not
        stored on our servers after your transaction has been completed.
      </p>
    ),
  },

  {
    icon: ShieldCheck,
    title: "Data Sharing",
    content: (
      <>
        <p className="text-muted-foreground leading-7">
          We never sell or rent your personal information.
        </p>

        <p className="mt-4 text-muted-foreground leading-7">
          Your information may be shared only with trusted service providers,
          such as payment gateways and delivery partners, when necessary to
          process and deliver your order. These partners are required to protect
          your information and use it solely for providing their services.
        </p>
      </>
    ),
  },

  {
    icon: Lock,
    title: "Your Privacy Rights",
    content: (
      <>
        <p className="text-muted-foreground leading-7">
          You have the right to:
        </p>

        <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
          <li>Request a copy of your personal information</li>
          <li>Correct inaccurate or outdated information</li>
          <li>
            Request deletion of your personal data, subject to legal obligations
          </li>
          <li>Withdraw marketing consent at any time</li>
        </ul>
      </>
    ),
  },

  {
    icon: Cookie,
    title: "Cookies",
    content: (
      <p className="text-muted-foreground leading-7">
        We use cookies to improve your browsing experience, remember your
        preferences, and enhance website functionality. You can disable cookies
        through your browser settings if you prefer, although some features may
        not function properly.
      </p>
    ),
  },

  {
    icon: RefreshCw,
    title: "Policy Updates",
    content: (
      <p className="text-muted-foreground leading-7">
        This Privacy Policy may be updated periodically to reflect changes in
        our services or legal requirements. Updates will be posted on this page.
        Continued use of our website after any changes indicates your acceptance
        of the revised policy.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 via-background to-zinc-200 dark:from-zinc-900 dark:via-background dark:to-zinc-950" />

        <div className="relative mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center rounded-full border bg-background px-4 py-2 text-sm font-medium shadow-sm">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Your Privacy Matters
            </div>

            <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
              Privacy Policy
            </h1>

            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              At <span className="font-semibold text-primary">ROSHÉ BEAUTY</span>, protecting
              your personal information is one of our highest priorities. This
              policy explains how we collect, use, and safeguard your data when
              you browse or shop with us.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl border bg-card p-8 shadow-sm">
          <p className="leading-8 text-muted-foreground">
            We value the trust you place in us. Every piece of personal
            information shared with ROSHÉ BEAUTY is handled responsibly and
            securely. We never sell your personal information, and we only share
            it with trusted partners when necessary to provide our services.
          </p>
        </div>
      </section>

      {/* Sections */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-8 md:grid-cols-2">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <div
                key={section.title}
                className="rounded-3xl border bg-card p-8 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <Icon className="h-7 w-7 text-primary" />
                </div>

                <h2 className="mb-4 text-2xl font-semibold">
                  {section.title}
                </h2>

                {section.content}
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto flex max-w-5xl flex-col items-center px-6 py-20 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>

          <h2 className="text-3xl font-bold">
            Questions About Your Privacy?
          </h2>

          <p className="mt-4 max-w-2xl text-muted-foreground leading-7">
            If you have any questions about this Privacy Policy, your personal
            information, or would like to exercise your privacy rights, please
            contact us.
          </p>

          <a
            href="mailto:Roshe3110@gmail.com"
            className="mt-8 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:opacity-90"
          >
            Roshe3110@gmail.com
          </a>

          <p className="mt-8 text-sm text-muted-foreground">
            Last Updated • July 2026
          </p>
        </div>
      </section>
    </main>
  );
}