import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SVG 预览",
  description: "SVG 预览",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className=" p-0">
        {children}
      </body>
    </html>
  );
}
