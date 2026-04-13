import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HUSTLR | AI Solutions for Malaysian & Singaporean Businesses",
  description: "We build custom AI agents, workflow automations, and AI applications for SMEs in Malaysia and Singapore. Save 20+ hours a week without hiring engineers.",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
  },
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
