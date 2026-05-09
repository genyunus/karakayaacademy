import { NextResponse } from "next/server";
import { z } from "zod";

import { getPackageBySlug } from "../../../lib/site-data";
import { getStripeServer } from "../../../lib/stripe";

const checkoutSchema = z.object({
  packageSlug: z.string().min(2),
});

export async function POST(request) {
  const payload = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Select a package first." }, { status: 400 });
  }

  const selectedPackage = getPackageBySlug(parsed.data.packageSlug);

  if (!selectedPackage) {
    return NextResponse.json({ error: "Package not found." }, { status: 404 });
  }

  const stripe = getStripeServer();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!stripe || !siteUrl || !selectedPackage.stripePriceId) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured yet. The package wiring is in place, but checkout still needs live Stripe price IDs.",
      },
      { status: 501 }
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: selectedPackage.mode,
    line_items: [{ price: selectedPackage.stripePriceId, quantity: 1 }],
    success_url: `${siteUrl}/?checkout=success`,
    cancel_url: `${siteUrl}/?checkout=cancelled`,
  });

  return NextResponse.json({ ok: true, checkoutUrl: session.url });
}
