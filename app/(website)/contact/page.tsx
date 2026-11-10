"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Sparkles,
  Truck,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";
import {
  STORE_CONTACT,
  GlowingSocialSection,
} from "@/components/common/SocialIcons";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay,
    },
  }),
};

const pillars = [
  {
    icon: Sparkles,
    title: "Personalized Beauty & Styling Care",
    description:
      "Expert assistance in shade selection, skincare routine building, and waterproof jewelry sizing.",
  },
  {
    icon: ShieldCheck,
    title: "100% Authentic Quality & 18K PVD Jewels",
    description:
      "Certified original, dermatologist-tested beauty formulations and anti-tarnish, hypoallergenic waterproof jewelry.",
  },
  {
    icon: Truck,
    title: "Nationwide Luxury Dispatch",
    description:
      "Carefully packaged luxury delivery across Mardan, Peshawar, Lahore, Karachi, Islamabad, and all cities in Pakistan.",
  },
];

export default function ContactPage() {
  return (
    <main className="bg-[#F9F4EF] min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#704638] text-white border-b border-[#D4A45E]/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(212,164,94,0.25)_0%,transparent_70%)]" />

        <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-[#D4A45E]/20 text-[#D4A45E] border border-[#D4A45E]/40 mb-5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customer Care &amp; Beauty &amp; Jewelry Consultations</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight font-heading text-white"
          >
            Contact{" "}
            <span className="bg-gradient-to-r from-[#F4DCD8] via-[#D4A45E] to-[#FFFFFF] bg-clip-text text-transparent">
              ROSHÉ BEAUTY &amp; JEWELRY
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="max-w-2xl mx-auto mt-5 text-base sm:text-lg text-[#F4DCD8] leading-relaxed"
          >
            Have questions about skincare routines, cosmetics shades, waterproof jewelry sizing, or orders? Our beauty and jewelry specialists are here to assist you.
          </motion.p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-20 -mt-10 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* WhatsApp & Call */}
            <motion.a
              whileHover={{ y: -6 }}
              href={STORE_CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-3xl p-8 border border-[#D4A45E]/30 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all text-center block group"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#25D366] flex items-center justify-center mx-auto mb-5 shadow-sm group-hover:scale-110 transition-transform">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h2 className="font-bold text-lg text-[#704638] mb-1 font-heading">
                WhatsApp &amp; Direct Call
              </h2>
              <p className="text-xs text-[#8C5E50] mb-4">
                Fastest response for beauty &amp; jewelry consultations &amp; orders
              </p>
              <span className="text-sm font-bold text-emerald-600 block">
                {STORE_CONTACT.phoneFormatted}
              </span>
              <span className="text-xs text-[#8C5E50] mt-1 block font-mono">
                {STORE_CONTACT.phone}
              </span>
            </motion.a>

            {/* Email */}
            <motion.a
              whileHover={{ y: -6 }}
              href={`mailto:${STORE_CONTACT.email}`}
              className="bg-white rounded-3xl p-8 border border-[#D4A45E]/30 shadow-sm hover:shadow-xl hover:border-[#D4A45E] transition-all text-center block group"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#F4DCD8] text-[#704638] flex items-center justify-center mx-auto mb-5 shadow-sm group-hover:scale-110 transition-transform">
                <Mail className="w-8 h-8" />
              </div>
              <h2 className="font-bold text-lg text-[#704638] mb-1 font-heading">
                Email Inquiries
              </h2>
              <p className="text-xs text-[#8C5E50] mb-4">
                Customer support, collaborations &amp; order inquiries
              </p>
              <span className="text-sm font-semibold text-[#704638] block truncate">
                {STORE_CONTACT.email}
              </span>
            </motion.a>

            {/* Location */}
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl p-8 border border-[#D4A45E]/30 shadow-sm hover:shadow-xl hover:border-[#D4A45E] transition-all text-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#F9F4EF] text-[#704638] flex items-center justify-center mx-auto mb-5 shadow-sm group-hover:scale-110 transition-transform border border-[#D4A45E]/20">
                <MapPin className="w-8 h-8 text-[#D4A45E]" />
              </div>
              <h2 className="font-bold text-lg text-[#704638] mb-1 font-heading">
                Showroom &amp; Distribution Hub
              </h2>
              <p className="text-xs text-[#8C5E50] mb-4">
                Official Studio &amp; Distribution Center
              </p>
              <span className="text-sm font-bold text-[#704638] leading-relaxed block">
                {STORE_CONTACT.address}
              </span>
            </motion.div>
          </div>

          {/* Glowing Social Channels Section */}
          <div className="mt-12">
            <GlowingSocialSection />
          </div>
        </div>
      </section>

      {/* Support Values */}
      <section className="py-16 bg-white border-t border-[#D4A45E]/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4A45E]">
              OUR BEAUTY &amp; JEWELRY PROMISE
            </span>
            <h2 className="text-3xl font-extrabold text-[#704638] mt-2 font-heading">
              Why Choose ROSHÉ BEAUTY &amp; JEWELRY?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl p-6 bg-[#F9F4EF] border border-[#D4A45E]/20 hover:border-[#D4A45E] transition-all shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#704638] text-[#D4A45E] flex items-center justify-center mb-4 shadow">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-[#704638] mb-2 font-heading">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#8C5E50] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
