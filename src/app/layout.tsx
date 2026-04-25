import type { Metadata, Viewport } from "next";
import localFont from 'next/font/local'
import "./globals.css";

const minecraft = localFont({
  src: '../fonts/minecraft.ttf',
})

export const metadata: Metadata = {
  title: "Чат",
  description: "Многопользовательский чат в реальном времени",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${minecraft.className} antialiased`}>{children}</body>
    </html>
  );
}
