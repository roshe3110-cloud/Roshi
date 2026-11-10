"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Sparkles, Heart } from "lucide-react";
import Image from "next/image";
import {
  STORE_CONTACT,
  GlowingSocialButton,
} from "@/components/common/SocialIcons";

const solutionLinks = [
  {
    label: "Skincare & Radiant Serums",
    href: "/collection?category=skincare-serums",
  },
  {
    label: "Velvet Matte Cosmetics",
    href: "/collection?category=luxury-cosmetics",
  },
  {
    label: "Fine & Waterproof Jewelry",
    href: "/collection?category=fine-jewelry",
  },
  {
    label: "Lip & Eye Beauty Care",
    href: "/collection?category=lip-eye-care",
  },
  {
    label: "Fragrance & Body Glow",
    href: "/collection?category=fragrance-glow",
  },
];

const companyLinks = [
  { label: "About ROSHÉ", href: "/about" },
  { label: "Contact & Support", href: "/contact" },
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Refund Policy", href: "/refund-policy" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#D4A45E]/40 bg-[#704638] text-[#F9F4EF]">
      <div className="container mx-auto px-6 py-14 max-w-7xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white rounded-2xl flex items-center justify-center p-1.5 border border-[#D4A45E]/40 shadow-sm">
                <Image
                  src="/logo.png"
                  alt="ROSHÉ BEAUTY &amp; JEWELRY Logo"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-wider block font-heading">
                  ROSHÉ
                </span>
                <span className="text-[10px] tracking-widest uppercase text-[#D4A45E] font-medium">
                  Beauty &amp; Jewelry
                </span>
              </div>
            </div>
            <p className="text-xs text-[#F4DCD8] leading-relaxed mb-4">
              Discover pure elegance, glowing skin, and radiant self-confidence with ROSHÉ BEAUTY &amp; JEWELRY. Delivering authentic dermatologist-inspired skincare, velvet cosmetics, and timeless 18K gold-plated waterproof jewelry across Pakistan.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#D4A45E] mb-5 font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>100% Authentic Quality Guaranteed</span>
            </div>

            {/* Social Channels with Glowing Light Burst on Click */}
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-white tracking-wide uppercase">
                Official Channels
              </p>
              <div className="flex items-center gap-2.5 pt-1">
                <GlowingSocialButton platform="instagram" variant="icon-only" size="md" />
                <GlowingSocialButton platform="facebook" variant="icon-only" size="md" />
                <GlowingSocialButton platform="whatsapp" variant="icon-only" size="md" />
              </div>
            </div>
          </div>

          {/* Solutions & Product Lines */}
          <div>
            <h3 className="mb-4 text-xs font-bold tracking-widest text-[#D4A45E] uppercase">
              BEAUTY &amp; JEWELRY
            </h3>
            <ul className="space-y-2.5">
              {solutionLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-[#F4DCD8] transition hover:text-[#D4A45E]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-4 text-xs font-bold tracking-widest text-[#D4A45E] uppercase">
              CUSTOMER CARE
            </h3>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-[#F4DCD8] transition hover:text-[#D4A45E]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="mb-4 text-xs font-bold tracking-widest text-[#D4A45E] uppercase">
              GET IN TOUCH
            </h3>
            <div className="space-y-3 text-xs text-[#F4DCD8]">
              <a
                href={STORE_CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-[#D4A45E] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#D4A45E] shrink-0" />
                <span>{STORE_CONTACT.phoneFormatted} (WhatsApp Care)</span>
              </a>
              <a
                href={`tel:${STORE_CONTACT.phone}`}
                className="flex items-center gap-2.5 hover:text-[#D4A45E] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#D4A45E] shrink-0" />
                <span>{STORE_CONTACT.phone}</span>
              </a>
              <a
                href={`mailto:${STORE_CONTACT.email}`}
                className="flex items-center gap-2.5 hover:text-[#D4A45E] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#D4A45E] shrink-0" />
                <span>{STORE_CONTACT.email}</span>
              </a>
              <a
                href={STORE_CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-[#D4A45E] transition-colors"
              >
                <Heart className="w-4 h-4 text-[#D4A45E] shrink-0" />
                <span>@rosh.e21 (Instagram)</span>
              </a>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4A45E] shrink-0 mt-0.5" />
                <span>{STORE_CONTACT.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#D4A45E]/30 pt-8 text-xs text-[#F4DCD8]/80 sm:flex-row">
          <p>
            © {new Date().getFullYear()} ROSHÉ BEAUTY &amp; JEWELRY. All rights reserved.
          </p>
          <p className="text-[11px] text-[#F4DCD8]/70">
            {STORE_CONTACT.address} · {STORE_CONTACT.phoneFormatted}
          </p>
        </div>
      </div>
    </footer>
  );
}
