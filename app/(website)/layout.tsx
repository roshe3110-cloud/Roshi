import AnnouncementBar from "@/components/common/announcement-bar/AnnouncementBar";
import Header from "@/components/headers/Header";
import Footer from "@/components/layout/footer";
import CartDrawerClient from "./CartDrawerClient";
import FlowerBackground from "@/components/common/flower-animation/FlowerBackground";

const announcements = [
  { id: "1", text: "✨ Free Delivery Across Pakistan on All Beauty & Jewelry Orders" },
  { id: "2", text: "💎 100% Authentic Luxury Cosmetics & 18K Gold Plated Jewelry" },
  { id: "3", text: "💬 WhatsApp Orders & Consultations: +92 347 1060653" },
];

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#F9F4EF]">
      {/* Ultra-lightweight GPU flower & ambient light animation (Zero performance impact) */}
      <FlowerBackground />
      <AnnouncementBar items={announcements} autoPlay interval={3500} />
      <Header />
      <main className="flex-1 relative z-10">{children}</main>
      <Footer />
      <CartDrawerClient />
    </div>
  );
}
