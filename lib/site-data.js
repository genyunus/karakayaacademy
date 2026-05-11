export const classes = [
  {
    slug: "single-class",
    type: "Single Session",
    name: "Single Class",
    description:
      "A premium one-off session built around boxing, movement, and performance coaching.",
    duration: "60 minutes",
    capacity: "Private",
    priceLabel: "$150",
  },
  {
    slug: "five-class-package",
    type: "Package",
    name: "5 Class Package",
    description:
      "A consistent rhythm for clients who want to build skill and conditioning over multiple sessions.",
    duration: "Flexible scheduling",
    capacity: "Private",
    priceLabel: "$650",
  },
  {
    slug: "ten-class-package",
    type: "Package",
    name: "10 Class Package",
    description:
      "A deeper commitment for clients ready to train consistently and progress over time.",
    duration: "Flexible scheduling",
    capacity: "Private",
    priceLabel: "$1000",
  },
];

export const packages = [
  {
    slug: "single-class",
    badge: "Start here",
    name: "Single Class",
    priceLabel: "$150",
    secondaryPriceLabel: "First class 30% off: $105",
    description:
      "A strong first session for clients who want to experience the academy before committing to a larger package.",
    features: ["60-minute private session", "Technique + conditioning", "Best first step"],
    mode: "payment",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PACK_PRICE_ID || "",
  },
  {
    slug: "five-class-package",
    badge: "Most flexible",
    name: "5 Class Package",
    priceLabel: "$650",
    secondaryPriceLabel: "Total cost",
    description:
      "A practical package for clients who want structure, consistency, and measurable progress across multiple sessions.",
    features: ["5 private classes", "Flexible scheduling", "Momentum-building format"],
    mode: "payment",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRIVATE_PACK_PRICE_ID || "",
  },
  {
    slug: "ten-class-package",
    badge: "Best value",
    name: "10 Class Package",
    priceLabel: "$1000",
    description:
      "For clients committed to long-term improvement and a deeper training cadence.",
    features: ["10 private classes", "High-commitment option", "Built for progression"],
    mode: "payment",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_FOUNDING_MEMBERSHIP_PRICE_ID || "",
  },
];

export function getPackageBySlug(slug) {
  return packages.find((item) => item.slug === slug);
}

export const faqs = [
  {
    question: "Do I need boxing experience to start?",
    answer:
      "No. Sessions are tailored to your level, whether you are completely new or already have experience.",
  },
  {
    question: "Is this only for fighters?",
    answer:
      "No. The training is built for anyone who wants better conditioning, confidence, movement quality, and disciplined coaching.",
  },
  {
    question: "How does functional training fit into boxing?",
    answer:
      "It improves posture, mobility, balance, rotational power, and resilience so the boxing work feels stronger and your body holds up better.",
  },
];
