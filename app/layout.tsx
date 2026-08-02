import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://minpark.city"),
  title: "minpark.city",
  description:
    "Min Park — urban designer working across masterplans, policy, and the magazines cities deserve.",
  openGraph: {
    title: "minpark.city",
    description:
      "Min Park — urban designer working across masterplans, policy, and the magazines cities deserve.",
    url: "https://minpark.city",
    siteName: "minpark.city",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "minpark.city" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "minpark.city",
    description:
      "Min Park — urban designer working across masterplans, policy, and the magazines cities deserve.",
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
    <html lang="en" className={`h-full antialiased ${inter.variable}`}>
      <head>
        {/*
          Self-hosted Pretendard, linked rather than @import-ed: Next's CSS
          bundler resolves @import at build time as a module, so a /public
          path can't be reached that way. The dynamic subset splits the family
          across unicode-range chunks, so a Latin page pulls a few KB instead
          of the 2MB full variable font.
        */}
        <link
          rel="stylesheet"
          href="/fonts/pretendard/pretendardvariable-dynamic-subset.css"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
