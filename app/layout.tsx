import type { Metadata, Viewport } from "next";
import { EB_Garamond, Libre_Baskerville } from "next/font/google";
import "./globals.css";

// The interface stays in Helvetica Now → Helvetica Neue → Helvetica → Arial:
// no webfont needed, and Pretendard (self-hosted below) carries Hangul. The
// titles are the exception, and take two serifs: Libre Baskerville for the
// big ones, EB Garamond for the smaller ones and the hero statement. Both are
// self-hosted by next/font, so no request leaves for Google at runtime.
// Baskerville ships as static cuts and needs its weight named; Garamond is
// variable and does not.
const titleSerif = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-title-serif",
  display: "swap",
});

const subheadSerif = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-subhead-serif",
  display: "swap",
});

// The one line that has to say who this is: it runs in Google results and on
// every shared link. It matches the home statement on purpose — the site
// should not introduce itself one way outside and another way inside.
const DESCRIPTION =
  "Research on housing, land governance and climate adaptation across London and Seoul.";

export const metadata: Metadata = {
  metadataBase: new URL("https://minpark.city"),
  // `template` lets inner pages set just their own name and still read as
  // part of the site in a tab or a search result.
  title: {
    default: "Min Park — Urban Policy Researcher",
    template: "%s · minpark",
  },
  description: DESCRIPTION,
  openGraph: {
    title: "Min Park — Urban Policy Researcher",
    description: DESCRIPTION,
    url: "https://minpark.city",
    siteName: "minpark.city",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Min Park — Urban Policy Researcher",
      },
    ],
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Min Park — Urban Policy Researcher",
    description: DESCRIPTION,
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
    <html
      lang="en"
      className={`h-full antialiased no-js ${titleSerif.variable} ${subheadSerif.variable}`}
    >
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
        {/*
          Drops the `no-js` class before first paint. Anything scripted — the
          scroll reveals above all — styles itself as finished under `.no-js`,
          so a visitor whose JS never arrives reads the page rather than a
          blank one. Inline and synchronous on purpose: a deferred script
          would let the un-faded state flash first.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.remove('no-js')`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
