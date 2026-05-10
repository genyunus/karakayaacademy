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
});

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

  const fullName = `${parsed.data.firstName} ${parsed.data.lastName}`.trim();
  const { error } = await supabase.from("inquiries").insert({
    first_name: parsed.data.firstName,
    last_name: parsed.data.lastName,
    full_name: fullName,
    email_address: parsed.data.email,
    phone_number: parsed.data.phoneNumber,
    interest: parsed.data.interest,
    title: parsed.data.interest,
    message_body: parsed.data.messageBody,
    source: "website",
  });

  if (error) {
    return NextResponse.json(
      {
        error:
          "Could not save inquiry right now. Check the Supabase URL, secret key, and database columns.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Inquiry submitted successfully.",
  });
}
