"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cart-store";
import { DynamicForm, FormValues } from "@/components/common/form";
import { billingFields, pakistanCities } from "./type";
import Image from "next/image";
import Link from "next/link";
import {
  MessageSquare,
  ArrowLeft,
  ShoppingBag,
  Loader2,
  FileCheck2,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
} from "lucide-react";
import {
  OrderSnapshotCard,
  OrderDetails,
} from "@/components/checkout/OrderSnapshotCard";
import { useCreateOrderDirect } from "@/hooks/useOrders";
import { validateForm, validatePhone } from "@/utils";
import { useUser } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  STORE_CONTACT,
  GlowingSocialButton,
} from "@/components/common/SocialIcons";

const STORE_WHATSAPP_NUMBER = STORE_CONTACT.whatsappNumber; // 923471060653

function getFormattedDate(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CheckoutClient() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const { data: user } = useUser();

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = 0;
  const total = subtotal + shipping;

  const [values, setValues] = useState<FormValues>({ billing_country: "PK" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string>("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);

  // Auto-fill Province and Postal Code when a City is selected
  const handleFormChange = (newValues: FormValues) => {
    if (
      newValues.billing_city !== values.billing_city &&
      newValues.billing_city
    ) {
      const cityData = pakistanCities.find(
        (c) => c.value === newValues.billing_city,
      );
      if (cityData) {
        setValues({
          ...newValues,
          billing_state: cityData.province,
          billing_postcode: cityData.postalCode,
        });
        return;
      }
    }
    setValues(newValues);
  };

  const isFormValid =
    values.billing_first_name &&
    values.billing_last_name &&
    values.billing_phone &&
    values.billing_email &&
    values.billing_address_1 &&
    values.billing_city &&
    values.billing_state &&
    values.billing_postcode;

  const createOrderMutation = useCreateOrderDirect();

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const errors = validateForm(values);

    if (errors.length > 0) {
      setSubmitError(errors[0]);
      return;
    }

    const phoneValue = String(values.billing_phone || "").trim();
    if (!phoneValue || !validatePhone(phoneValue)) {
      setSubmitError("Enter a valid Pakistani mobile number.");
      return;
    }
    const phone = phoneValue;

    if (items.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const firstName = String(values.billing_first_name || "").trim() || "N/A";
    const lastName = String(values.billing_last_name || "").trim();
    const name = `${firstName} ${lastName}`.trim();
    const email = String(values.billing_email || "").trim() || "N/A";
    const address = String(values.billing_address_1 || "").trim() || "N/A";
    const city = String(values.billing_city || "").trim() || "N/A";
    const state = String(values.billing_state || "").trim() || "N/A";
    const postcode = String(values.billing_postcode || "").trim() || "N/A";
    const notes = String(values.order_comments || "").trim() || "None";

    const orderItems = items.map((item) => ({
      product_id: item.id,
      product_name: item.name,
      unit_price: item.price,
      quantity: item.quantity,
    }));

    setIsPlacingOrder(true);

    try {
      // 1. Save the order to Supabase
      const savedOrder = await createOrderMutation.mutateAsync({
        customer: { name, phone, email, address, city, state, postcode },
        items: orderItems,
        subtotal,
        shipping,
        total,
        shippingAddress: `${address}, ${city}, ${state} (${postcode})`,
        paymentMethod: "Bank Transfer / WhatsApp Slip Verification",
        notes,
      });

      const formattedDate = getFormattedDate();

      const itemSnapshots = items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      const details: OrderDetails = {
        orderId: savedOrder.order_number,
        date: formattedDate,
        customer: {
          firstName,
          lastName,
          email,
          phone,
          address,
          city,
          state,
          postcode,
          notes,
        },
        items: itemSnapshots,
        subtotal,
        shipping,
        total,
        paymentMethod: "Bank Transfer / Payment Slip Verification",
      };

      const itemLines = items
        .map(
          (item) =>
            `• *${item.name}* (Qty: ${item.quantity}) - Rs ${(
              item.price * item.quantity
            ).toLocaleString()}`,
        )
        .join("\n");

      const message = `🛍️ *NEW ORDER FINALIZED* - ROSHÉ BEAUTY & JEWELRY
Order ID: #${savedOrder.order_number}
Date: ${formattedDate}
------------------------------------------
👤 *Customer Information:*
- *Name:* ${name}
- *Phone:* ${phone}
- *Email:* ${email}
- *Address:* ${address}, ${city}, ${state} (${postcode})

📦 *Ordered Items:*
${itemLines}

------------------------------------------
💵 *Subtotal:* Rs ${subtotal.toLocaleString()}
🚚 *Shipping Fee:* FREE
💰 *Total Amount:* Rs ${total.toLocaleString()}
💳 *Payment Method:* Bank Transfer / WhatsApp Slip Verification
------------------------------------------
⚠️ *PAYMENT SLIP REQUIRED FOR DISPATCH:*
Please send your payment slip / transfer screenshot here on WhatsApp.
After finalizing the payment slip verification, we will dispatch your order immediately to your address:
📍 ${address}, ${city}, ${state} (${postcode})

📝 *Order Notes:* ${notes}

🏬 *Store Address:* ${STORE_CONTACT.address}
📞 *Helpline:* ${STORE_CONTACT.phoneFormatted}
📸 *Instagram:* ${STORE_CONTACT.instagram}
📘 *Facebook:* ${STORE_CONTACT.facebook}
📧 *Email:* ${STORE_CONTACT.email}

Thank you for shopping with ROSHÉ BEAUTY & JEWELRY!`;

      const encodedMessage = encodeURIComponent(message);
      const url = `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodedMessage}`;

      setOrderDetails(details);
      setWhatsappUrl(url);
      setIsSubmitted(true);

      // Open WhatsApp directly for instant payment slip submission
      window.open(url, "_blank");
      clearCart();
    } catch {
      toast.error("Something went wrong. Please try again.");
      setSubmitError(
        "Something went wrong placing your order. Please try again.",
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (isSubmitted && orderDetails) {
    return (
      <main className="bg-[#F9F4EF] min-h-[85vh] py-8 sm:py-12 flex items-center justify-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 w-full text-center space-y-6 sm:space-y-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-sm border border-amber-200">
              <FileCheck2 className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Order Registered! Please Send Payment Slip
            </h1>

            {/* Instruction Callout */}
            <div className="bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-4 sm:p-5 max-w-xl mx-auto text-left shadow-sm">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-amber-950 space-y-1">
                  <p className="font-bold text-amber-900">
                    Next Step for Dispatch:
                  </p>
                  <p className="leading-relaxed">
                    Please send your <strong>payment slip / screenshot</strong>{" "}
                    on WhatsApp to finalize your order. Once received, we will
                    immediately dispatch your product to:
                  </p>
                  <p className="font-semibold text-neutral-900 bg-white/70 px-2 py-1 rounded inline-block">
                    📍 {orderDetails.customer.address},{" "}
                    {orderDetails.customer.city}, {orderDetails.customer.state}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-6 max-w-md mx-auto text-left space-y-3 sm:space-y-3.5 shadow-sm">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-[11px] sm:text-xs text-gray-500 uppercase tracking-wide font-medium">
                  Order Number
                </span>
                <span className="font-mono font-bold text-sm sm:text-base text-gray-900">
                  #{orderDetails.orderId}
                </span>
              </div>

              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-[11px] sm:text-xs text-gray-500 uppercase tracking-wide font-medium">
                  Payment Method
                </span>
                <span className="font-semibold text-xs sm:text-sm text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  Send Slip via WhatsApp
                </span>
              </div>

              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-[11px] sm:text-xs text-gray-500 uppercase tracking-wide font-medium">
                  Dispatch Status
                </span>
                <span className="font-semibold text-xs sm:text-sm text-gray-900">
                  Pending Payment Slip
                </span>
              </div>

              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-[11px] sm:text-xs text-gray-500 uppercase tracking-wide font-medium">
                  Customer
                </span>
                <span className="font-semibold text-xs sm:text-sm text-gray-900">
                  {orderDetails.customer.firstName}{" "}
                  {orderDetails.customer.lastName}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[11px] sm:text-xs text-gray-500 uppercase tracking-wide font-medium">
                  Customer Phone
                </span>
                <span className="font-semibold text-xs sm:text-sm text-gray-900">
                  {orderDetails.customer.phone}
                </span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-3 justify-center pt-2 px-4 max-w-md sm:max-w-none mx-auto">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow-lg shadow-emerald-600/20 text-xs sm:text-sm"
              >
                <MessageSquare className="w-4 h-4" />
                Send Payment Slip ({STORE_CONTACT.phoneFormatted})
              </a>

              {user && (
                <Link
                  href="/account/orders"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold px-5 py-3 rounded-xl transition text-xs sm:text-sm"
                >
                  View My Orders
                </Link>
              )}

              <Link
                href="/collection"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#704638] hover:bg-[#5C372B] text-white font-semibold px-5 py-3 rounded-xl transition text-xs sm:text-sm shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                Continue Shopping
              </Link>
            </div>

            {/* Official Store Channels & Physical Address */}
            <div className="pt-4 max-w-xl mx-auto border-t border-[#D4A45E]/30">
              <p className="text-xs text-[#8C5E50] font-medium mb-2.5">
                Connect with our Official Channels:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <GlowingSocialButton
                  platform="instagram"
                  variant="pill"
                  size="md"
                />
                <GlowingSocialButton
                  platform="facebook"
                  variant="pill"
                  size="md"
                />
                <GlowingSocialButton
                  platform="whatsapp"
                  variant="pill"
                  size="md"
                />
              </div>

              <div className="mt-3 text-[#8C5E50] text-[11px] flex items-center justify-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D4A45E]" />
                <span>{STORE_CONTACT.address}</span>
                <span className="text-[#D4A45E]">•</span>
                <Phone className="w-3.5 h-3.5 text-[#D4A45E]" />
                <span>{STORE_CONTACT.phoneFormatted}</span>
              </div>
            </div>
          </motion.div>

          {/* Visual Order Snapshot Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="overflow-x-auto pb-2"
          >
            <OrderSnapshotCard order={orderDetails!} />
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#F9F4EF] min-h-screen py-6 sm:py-10 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 sm:mb-8"
        >
          <Link
            href="/collection"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-500 hover:text-black mb-3 sm:mb-4 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Back to
            Collection
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                Checkout
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Complete your delivery details. Send your payment slip on
                WhatsApp to finalize dispatch.
              </p>
            </div>

            {/* Quick store info badge */}
            <div className="flex items-center gap-2 text-xs text-neutral-600 bg-white border border-gray-200 rounded-xl px-3.5 py-2 w-fit">
              <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="font-medium">{STORE_CONTACT.address}</span>
              <span className="text-gray-300">|</span>
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-mono">{STORE_CONTACT.phone}</span>
            </div>
          </div>
        </motion.div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center border shadow-sm max-w-lg mx-auto space-y-4">
            <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Your Cart is Empty
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              Add items to your cart before proceeding to checkout.
            </p>
            <Link
              href="/collection"
              className="inline-block bg-black text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-medium hover:bg-gray-800 transition"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handlePlaceOrder}
            className="flex flex-col lg:grid lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10"
          >
            {/* Order Summary on top for Mobile / Right for Desktop */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:sticky lg:top-24 h-fit space-y-6 order-1 lg:order-2"
            >
              <div className="rounded-2xl sm:rounded-3xl bg-white border border-gray-200/80 shadow-sm overflow-hidden">
                <div className="border-b px-4 sm:px-6 py-4 sm:py-5 bg-gray-50/50 flex items-center justify-between">
                  <h2 className="font-semibold text-lg sm:text-xl text-gray-900">
                    Order Summary
                  </h2>
                  <span className="text-xs sm:text-sm text-gray-500 font-medium">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                </div>

                <div className="max-h-[280px] sm:max-h-[380px] overflow-y-auto divide-y">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 sm:gap-4 px-4 sm:px-6 py-3.5 sm:py-4 items-center"
                    >
                      <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl overflow-hidden bg-gray-100 relative shrink-0 border border-gray-200">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            sizes="64px"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-xs sm:text-sm text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <div className="font-semibold text-xs sm:text-sm text-gray-900 whitespace-nowrap">
                        Rs {(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 sm:p-6 space-y-4 border-t bg-gray-50/30">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      Rs {subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-medium text-gray-900">
                      {shipping === 0 ? (
                        <span className="text-green-600 font-semibold">
                          FREE
                        </span>
                      ) : (
                        `Rs ${shipping}`
                      )}
                    </span>
                  </div>

                  <div className="border-t pt-3.5 flex justify-between text-sm sm:text-base font-bold text-gray-900">
                    <span>Total</span>
                    <span>Rs {total.toLocaleString()}</span>
                  </div>

                  {submitError && (
                    <p className="text-xs sm:text-sm text-red-500 text-center bg-red-50 p-2.5 rounded-lg border border-red-100">
                      {submitError}
                    </p>
                  )}

                  {/* Payment Method & Slip Verification Notice */}
                  <div className="space-y-3 pt-2">
                    <div className="p-3.5 sm:p-4 rounded-xl border border-amber-300 bg-amber-50/90 text-left space-y-2">
                      <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
                        <FileCheck2 className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>Payment Slip Verification</span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-amber-900/90 leading-relaxed">
                        Please send your <strong>payment slip</strong> on
                        WhatsApp after finalizing the order. We will dispatch
                        your product to your address immediately after
                        verification.
                      </p>
                      <div className="text-[11px] font-mono text-amber-800 bg-amber-100/70 px-2 py-1 rounded inline-flex items-center gap-1">
                        <Phone className="w-3 h-3 text-amber-700" />
                        <span>
                          WhatsApp Helpline: {STORE_CONTACT.phoneFormatted}
                        </span>
                      </div>
                    </div>

                    {/* Official Social Links in Checkout */}
                    <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-[#F4DCD8]/40 border border-[#D4A45E]/30 text-xs">
                      <span className="text-[#704638] font-medium text-xs">
                        Follow Us:
                      </span>
                      <div className="flex items-center gap-2">
                        <GlowingSocialButton
                          platform="instagram"
                          variant="pill"
                          size="sm"
                          label="Instagram"
                        />
                        <GlowingSocialButton
                          platform="facebook"
                          variant="pill"
                          size="sm"
                          label="Facebook"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Confirmation Checkbox */}
                  <div className="flex items-start gap-2.5 pt-1">
                    <input
                      type="checkbox"
                      id="confirm-info"
                      checked={accepted}
                      onChange={(e) => setAccepted(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 text-black focus:ring-black shrink-0 cursor-pointer"
                    />
                    <label
                      htmlFor="confirm-info"
                      className="text-xs sm:text-sm text-gray-600 cursor-pointer select-none leading-tight"
                    >
                      I confirm my delivery details and agree to submit the
                      payment slip on WhatsApp.
                    </label>
                  </div>

                  <motion.button
                    whileHover={{ scale: isPlacingOrder ? 1 : 1.01 }}
                    whileTap={{ scale: isPlacingOrder ? 1 : 0.99 }}
                    type="submit"
                    disabled={!isFormValid || !accepted || isPlacingOrder}
                    className="mt-4 sm:mt-6 h-12 sm:h-14 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm w-full flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition disabled:opacity-60 disabled:cursor-not-allowed px-4 text-center"
                  >
                    {isPlacingOrder ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                        <span>Finalizing Order...</span>
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" />
                        <span className="truncate">
                          Finalize Order & Send Payment Slip
                        </span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Billing Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-2 order-2 lg:order-1"
            >
              <div className="rounded-2xl sm:rounded-3xl bg-white shadow-sm border border-gray-200/80 p-4 sm:p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                      Billing & Delivery Details
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Enter your address where your products will be dispatched
                      after payment slip confirmation.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200 self-start sm:self-auto">
                    <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                    <span>Safe Packaging & Direct Dispatch</span>
                  </div>
                </div>

                <DynamicForm
                  fields={billingFields}
                  values={values}
                  onChange={handleFormChange}
                />
              </div>
            </motion.div>
          </form>
        )}
      </div>
    </main>
  );
}
