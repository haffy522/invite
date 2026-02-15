import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Noor — Intimate Event Invites",
  description:
    "Beautiful, one-time invite pages for intimate gatherings. RSVP with warmth and elegance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
