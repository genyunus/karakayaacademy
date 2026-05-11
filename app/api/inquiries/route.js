import { NextResponse } from "next/server";
import { z } from "zod";

import { getSupabaseAdmin } from "../../../lib/supabase-admin";

const inquirySchema = z.object({
  firstName: z.string().trim().min(2).max(80),
  lastName: z.string().trim().min(2).max(80),
  email: z.email(),
  phoneNumber: z.string().trim().min(7).max(30),
  interest: z.string().min(2).max(160),
  messageBody: z.string().min(10).max(2000),
  consent: z.literal(true),
});

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatRecipients(rawValue) {
  return rawValue
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

async function sendInquiryNotification({
  firstName,
  lastName,
  email,
  phoneNumber,
  interest,
  messageBody,
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const recipients = formatRecipients(process.env.INQUIRY_NOTIFICATION_TO || "");

  if (!apiKey || !from || !recipients.length) {
    return { skipped: true };
  }

  const fullName = `${firstName} ${lastName}`.trim();
  const subject = `New inquiry: ${interest}`;
  const escapedMessage = escapeHtml(messageBody).replaceAll("\n", "<br />");
  const html = `
    <div style="font-family: Arial, sans-serif; color: #111;">
      <h2 style="margin-bottom: 16px;">New inquiry received</h2>
      <p><strong>Interest:</strong> ${escapeHtml(interest)}</p>
      <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phoneNumber)}</p>
      <div style="margin-top: 20px;">
        <strong>Message:</strong>
        <p style="margin-top: 8px; line-height: 1.6;">${escapedMessage}</p>
      </div>
    </div>
  `;

  const text = [
    "New inquiry received",
    "",
    `Interest: ${interest}`,
    `Name: ${fullName}`,
    `Email: ${email}`,
    `Phone: ${phoneNumber}`,
    "",
    "Message:",
    messageBody,
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: recipients,
      subject,
      html,
      text,
      reply_to: email,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend error: ${errorText}`);
  }

  return { skipped: false };
}

async function saveInquiry(supabase, data) {
  const fullName = `${data.firstName} ${data.lastName}`.trim();

  const primaryInsert = await supabase.from("inquiries").insert({
    first_name: data.firstName,
    last_name: data.lastName,
    full_name: fullName,
    email_address: data.email,
    phone_number: data.phoneNumber,
    interest: data.interest,
    title: data.interest,
    message_body: data.messageBody,
    source: "website",
  });

  if (!primaryInsert.error) {
    return { ok: true, mode: "modern" };
  }

  console.error("Inquiry primary insert failed", primaryInsert.error);

  const legacyInsert = await supabase.from("inquiries").insert({
    name: fullName,
    email: data.email,
    interest: data.interest,
    message: data.messageBody,
    source: "website",
  });

  if (!legacyInsert.error) {
    return { ok: true, mode: "legacy" };
  }

  console.error("Inquiry legacy insert failed", legacyInsert.error);

  return { ok: false, error: primaryInsert.error, legacyError: legacyInsert.error };
}

export async function POST(request) {
  const payload = await request.json().catch(() => null);
  const parsed = inquirySchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please complete all required inquiry fields." },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json({
      ok: true,
      mode: "demo",
      message:
        "Inquiry endpoint is ready. Add Supabase keys to persist submissions.",
    });
  }

  const saveResult = await saveInquiry(supabase, parsed.data);

  if (!saveResult.ok) {
    return NextResponse.json(
      {
        error:
          "Could not save inquiry right now. Check the Supabase URL, secret key, and database columns.",
      },
      { status: 500 }
    );
  }

  try {
    await sendInquiryNotification(parsed.data);
  } catch (notificationError) {
    console.error("Inquiry notification failed", notificationError);

    return NextResponse.json({
      ok: true,
      mode: "partial",
      message:
        "Inquiry submitted successfully. We saved your message, but email notification needs attention.",
    });
  }

  return NextResponse.json({
    ok: true,
    message: "Inquiry submitted successfully.",
  });
}
