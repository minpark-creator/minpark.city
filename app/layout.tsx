import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import "./globals.css";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal"],
  variable: "--font-eb-garamond",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${ebGaramond.variable}`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
