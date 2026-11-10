import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | ROSHÉ BEAUTY & JEWELRY",
  description: "Secure checkout. Complete your details to place your order with ROSHÉ BEAUTY & JEWELRY.",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
