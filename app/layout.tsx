import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  SignIn,
} from "@clerk/nextjs";
import ToasterProvider from "@/components/providers/toaster.provider";
import { ConfettiProvider } from "@/components/providers/confetti.provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Learn2PNL",
  description: "Secure profits and cut losses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ConfettiProvider />
          <ToasterProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
