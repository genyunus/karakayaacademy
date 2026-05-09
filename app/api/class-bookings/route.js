import { NextResponse } from "next/server";
import { z } from "zod";

import { getSupabaseAdmin } from "../../../lib/supabase-admin";
import { classes } from "../../../lib/site-data";

const bookingSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.email(),
  classSlug: z.string().min(2),
});

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

  const { error } = await supabase.from("class_booking_requests").insert({
    class_slug: selectedClass.slug,
    class_name: selectedClass.name,
    customer_name: parsed.data.name,
    customer_email: parsed.data.email,
    status: "pending",
  });

  if (error) {
    return NextResponse.json(
      { error: "Could not save booking request right now." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: `Request received for ${selectedClass.name}.`,
  });
}
