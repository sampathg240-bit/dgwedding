import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gimhan & Disna Wedding Invitation",
  description: "Join Gimhan and Disna as they celebrate their wedding on 30 November 2026 at Wasana Hotel, Akuressa.",
  openGraph: {
    title: "Gimhan & Disna — Save the Date",
    description: "30 November 2026 · Wasana Hotel, Akuressa",
    type: "website",
  },
  other: { "codex-preview": "development", "theme-color": "#180d19" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geist.variable} antialiased`}>{children}</body></html>;
}
