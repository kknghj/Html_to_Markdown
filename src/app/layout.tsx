import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Response → Markdown",
  description: "Convert copied AI answers into clean Markdown",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
