import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Syne } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Codeflow — Code → Webflow, instantly.",
  description:
    "Convert vanilla HTML, CSS, and JavaScript into Webflow-compatible components. Paste directly into Webflow Designer.",
  keywords: ["webflow", "html to webflow", "css converter", "client-first", "webflow components"],
  openGraph: {
    title: "Codeflow — Code → Webflow, instantly.",
    description:
      "Convert HTML/CSS/JS to Webflow components. Client-First naming, responsive breakpoints, one-click clipboard copy.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${dmSans.variable} ${jetbrainsMono.variable} ${syne.variable} font-sans bg-bg-primary text-brand-text antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
