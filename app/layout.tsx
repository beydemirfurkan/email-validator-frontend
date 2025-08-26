import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";
import { Providers } from './providers'

const inter = Inter({ 
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Valid2Go - Professional Email Verification",
  description: "Verify email addresses in bulk with our professional email validation service. Real-time verification, detailed analytics, and API access.",
  keywords: "email validation, email verification, bulk email verification, email checker, disposable email, domain validation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
