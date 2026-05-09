export const classes = [
  {
    slug: "intro-boxing-session",
    type: "Intro",
    name: "Intro Boxing Session",
    description:
      "Best first step for new clients. Includes movement screen, boxing fundamentals, and training recommendation.",
    duration: "60 minutes",
    capacity: "1 person",
    priceLabel: "$45 intro offer",
  },
  {
    slug: "small-group-boxing",
    type: "Small Group",
    name: "Small Group Boxing",
    description:
      "Technique, pad work, conditioning, and functional movement in a tighter group setting.",
    duration: "60 minutes",
    capacity: "Up to 6 people",
    priceLabel: "$30 per class",
  },
  {
    slug: "private-performance-coaching",
    type: "Private",
    name: "Private Performance Coaching",
    description:
      "One-on-one boxing and functional training designed around skill goals, performance, and recovery.",
    duration: "60 minutes",
    capacity: "1 person",
    priceLabel: "$110 per session",
  },
];

export const packages = [
  {
    slug: "starter-pack",
    badge: "Best first product",
    name: "Starter Pack",
    priceLabel: "$120",
    description:
      "A low-friction first purchase for new members who want commitment without a full membership.",
    features: ["3 small group classes", "Valid for 30 days", "Great first conversion offer"],
    mode: "payment",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PACK_PRICE_ID || "",
  },
  {
    slug: "private-coaching-pack",
    badge: "High-touch",
    name: "Private Coaching Pack",
    priceLabel: "$400",
    description:
      "Ideal for clients who want accelerated technical progress and individualized training structure.",
    features: ["4 private sessions", "Priority scheduling", "Technique + performance focus"],
    mode: "payment",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRIVATE_PACK_PRICE_ID || "",
  },
  {
    slug: "founding-membership",
    badge: "Recurring",
    name: "Founding Membership",
    priceLabel: "$179/mo",
    description:
      "A clean first subscription tier for early members once class rhythm and fulfillment are stable.",
    features: ["8 classes per month", "Member booking access", "Preferred intro pricing"],
    mode: "subscription",
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
      "No. We coach complete beginners, returning athletes, and experienced boxers. The structure adapts to your level without lowering the standard.",
  },
  {
    question: "Is this only for fighters?",
    answer:
      "No. The academy is for anyone who wants disciplined training, body confidence, better movement, and a more elevated alternative to generic gyms.",
  },
  {
    question: "How does the functional side fit into boxing?",
    answer:
      "We use it to improve posture, balance, force transfer, rotational strength, mobility, and durability so your boxing gets better and your body holds up.",
  },
  {
    question: "What should launch first for a small business?",
    answer:
      "Launch inquiry capture, intro booking, and one or two simple packages first. Full memberships and account dashboards should follow after real demand validates the workflow.",
  },
];
