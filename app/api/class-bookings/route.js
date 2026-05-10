import { NextResponse } from "next/server";
import { z } from "zod";

import { getSupabaseAdmin } from "../../../lib/supabase-admin";
import { classes } from "../../../lib/site-data";

const bookingSchema = z.object({
  firstName: z.string().trim().min(2).max(80),
  lastName: z.string().trim().min(2).max(80),
  email: z.email(),
  phoneNumber: z.string().trim().min(7).max(30),
  interest: z.string().min(2).max(160),
  messageBody: z.string().min(10).max(2000),
  classSlug: z.string().min(2),
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

async function sendBookingNotification(selectedClass, data) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const recipients = formatRecipients(process.env.INQUIRY_NOTIFICATION_TO || "");

  if (!apiKey || !from || !recipients.length) {
    return { skipped: true };
  }

  const fullName = `${data.firstName} ${data.lastName}`.trim();
  const subject = `New booking request: ${selectedClass.name}`;
  const escapedMessage = escapeHtml(data.messageBody).replaceAll("\n", "<br />");
  const html = `
    <div style="font-family: Arial, sans-serif; color: #111;">
      <h2 style="margin-bottom: 16px;">New class booking request</h2>
      <p><strong>Class:</strong> ${escapeHtml(selectedClass.name)}</p>
      <p><strong>Interest:</strong> ${escapeHtml(data.interest)}</p>
      <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(data.phoneNumber)}</p>
      <div style="margin-top: 20px;">
        <strong>Message:</strong>
        <p style="margin-top: 8px; line-height: 1.6;">${escapedMessage}</p>
      </div>
    </div>
  `;

  const text = [
    "New class booking request",
    "",
    `Class: ${selectedClass.name}`,
    `Interest: ${data.interest}`,
    `Name: ${fullName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phoneNumber}`,
    "",
    "Message:",
    data.messageBody,
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
      reply_to: data.email,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend error: ${errorText}`);
  }

  return { skipped: false };
}

async function saveBookingRequest(supabase, selectedClass, data) {
  const fullName = `${data.firstName} ${data.lastName}`.trim();

  const primaryInsert = await supabase.from("class_booking_requests").insert({
    class_slug: selectedClass.slug,
    class_name: selectedClass.name,
    first_name: data.firstName,
    last_name: data.lastName,
    full_name: fullName,
    email_address: data.email,
    phone_number: data.phoneNumber,
    interest: data.interest,
    title: data.interest,
    message_body: data.messageBody,
    status: "pending",
  });

  if (!primaryInsert.error) {
    return { ok: true, mode: "modern" };
  }

  console.error("Class booking primary insert failed", primaryInsert.error);

  const legacyInsert = await supabase.from("class_booking_requests").insert({
    class_slug: selectedClass.slug,
    class_name: selectedClass.name,
    customer_name: fullName,
    customer_email: data.email,
    status: "pending",
  });

  if (!legacyInsert.error) {
    return { ok: true, mode: "legacy" };
  }

  console.error("Class booking legacy insert failed", legacyInsert.error);

  return { ok: false, error: primaryInsert.error, legacyError: legacyInsert.error };
}

export async function POST(request) {
  const payload = await request.json().catch(() => null);
  const parsed = bookingSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please choose a class and complete your details." },
      { status: 400 }
    );
  }

  const selectedClass = classes.find(
    (classItem) => classItem.slug === parsed.data.classSlug
  );

  if (!selectedClass) {
    return NextResponse.json({ error: "Selected class not found." }, { status: 404 });
  }

  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json({
      ok: true,
      mode: "demo",
      message: `Booking flow is wired for ${selectedClass.name}. Add Supabase to persist reservations.`,
    });
  }

  const saveResult = await saveBookingRequest(supabase, selectedClass, parsed.data);

  if (!saveResult.ok) {
    console.error("Class booking insert failed", saveResult.error, saveResult.legacyError);

    return NextResponse.json(
      {
        error:
          "Could not save booking request right now. Check the Supabase URL, secret key, and database columns.",
      },
      { status: 500 }
    );
  }

  try {
    await sendBookingNotification(selectedClass, parsed.data);
  } catch (notificationError) {
    console.error("Booking notification failed", notificationError);

    return NextResponse.json({
      ok: true,
      mode: "partial",
      message: `Request received for ${selectedClass.name}. We saved it, but email notification needs attention.`,
    });
  }

  return NextResponse.json({
    ok: true,
    message: `Request received for ${selectedClass.name}.`,
  });
}
