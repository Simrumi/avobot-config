import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HUSTLR | Digital Marketing Agency",
  description: "Premium digital marketing services: Web Development, Social Media Management, Content Creation & Performance Marketing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
