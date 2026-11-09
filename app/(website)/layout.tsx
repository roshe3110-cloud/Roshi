import AnnouncementBar from "@/components/common/announcement-bar/AnnouncementBar";
import Header from "@/components/headers/Header";
import Footer from "@/components/layout/footer";
import CartDrawerClient from "./CartDrawerClient";
import FlowerBackground from "@/components/common/flower-animation/FlowerBackground";

const announcements = [
  { id: "1", text: "✨ Free Delivery Across Pakistan on All Beauty Orders" },
  { id: "2", text: "🌸 100% Authentic Luxury Skincare & Cosmetics" },
  { id: "3", text: "💬 Personalized Beauty Advice & Fast WhatsApp Dispatch" },
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
