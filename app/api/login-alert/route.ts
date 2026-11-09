import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { AdminLoginFailedAlertTemplate } from "@/lib/emails/templates";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email = "unknown@user.com", attempts = 3 } = body;

    const time = new Date().toLocaleString("en-PK", {
      timeZone: "Asia/Karachi",
      dateStyle: "full",
      timeStyle: "medium",
    });

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "Unknown IP";

    const adminEmail =
      process.env.ADMIN_NOTIFICATION_EMAIL ||
      process.env.ADMIN_EMAIL ||
      "Roshe3110@gmail.com";

    // 1. Send security alert email to our Gmail
    await sendEmail({
      to: adminEmail,
      subject: `🚨 Security Alert: 3 Failed Admin Login Attempts Detected`,
      html: AdminLoginFailedAlertTemplate(email, time, clientIp),
    });

    // 2. Log in Supabase if URL and key exist
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase.from("login_attempts").insert({
        email,
        ip_address: clientIp,
        attempt_count: attempts,
        is_locked: true,
        locked_until: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Security alert dispatched to admin Gmail.",
    });
  } catch (error) {
    console.error("Error in login-alert handler:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process alert." },
      { status: 500 }
    );
  }
}

