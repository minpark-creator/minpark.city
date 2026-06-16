import type { Metadata, Viewport } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://minpark.city"),
  title: "minpark.city",
  description:
    "Min Park — urban designer and researcher working at the intersection of planning, research, and spatial vision.",
  openGraph: {
    title: "minpark.city",
    description:
      "Min Park — urban designer and researcher working at the intersection of planning, research, and spatial vision.",
    url: "https://minpark.city",
    siteName: "minpark.city",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "minpark.city" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "minpark.city",
    description:
      "Min Park — urban designer and researcher working at the intersection of planning, research, and spatial vision.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${spaceMono.variable}`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
