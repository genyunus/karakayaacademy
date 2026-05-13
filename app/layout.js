import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "Karakayaacademy | Boxing x Functional Training",
  description:
    "Karakayaacademy blends technical boxing with functional training to build speed, strength, control, and confidence.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
