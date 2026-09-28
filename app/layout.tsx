import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DealVerify — Only real deals. Verified.",
  description: "Verified Indian deal alerts for price, pincode availability, and recent value.",
  applicationName: "DealVerify",
  manifest: "/manifest.webmanifest"
};

export const viewport: Viewport = {
  themeColor: "#0F766E",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}