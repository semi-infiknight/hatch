import type { Metadata } from "next";
import { Barlow_Condensed, Geist_Mono, Newsreader } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const spine = Barlow_Condensed({
  variable: "--font-spine",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const letter = Newsreader({
  variable: "--font-letter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hatch",
  description: "Hatch launches a token for one sealed product. The sale buys that product into a vault.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spine.variable} ${letter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#070707] font-letter text-[#f5f5f5]">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
