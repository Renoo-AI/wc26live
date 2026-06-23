import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#F5F0EB",
};

export const metadata: Metadata = {
  title: "Wc26Live — Free Legal World Cup 2026 Streams",
  description:
    "Find official, legal, free ways to watch FIFA World Cup 2026 matches live in your country. Match schedule, broadcaster links, and calendar reminders.",
  keywords: [
    "World Cup 2026",
    "FIFA",
    "live stream",
    "free",
    "legal",
    "broadcasters",
    "match schedule",
    "WC26",
  ],
  authors: [{ name: "Wc26Live" }],
  openGraph: {
    title: "Wc26Live — Free Legal World Cup 2026 Streams",
    description:
      "Find official, legal, free ways to watch FIFA World Cup 2026 matches live in your country.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="wc26live-theme"
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}