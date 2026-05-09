import { NextResponse } from "next/server";
import { z } from "zod";

import { getSupabaseAdmin } from "../../../lib/supabase-admin";

const inquirySchema = z.object({
  name: z.string().min(2).max(120),
  email: z.email(),
  interest: z.string().min(2).max(160),
  message: z.string().min(10).max(2000),
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

  const { error } = await supabase.from("inquiries").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    interest: parsed.data.interest,
    message: parsed.data.message,
    source: "website",
  });

  if (error) {
    return NextResponse.json(
      { error: "Could not save inquiry right now." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Inquiry submitted successfully.",
  });
}
