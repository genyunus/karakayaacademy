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

  return NextResponse.json({
    ok: true,
    message: `Request received for ${selectedClass.name}.`,
  });
}
