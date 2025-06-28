import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import CartStoreProvider from "@/components/providers/CartStoreProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LosCC",
  description: "Wuatita LLena Corazón Contento",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F7F3E9] min-h-screen`}
      >
        <AuthProvider>
          <CartStoreProvider>
            <Navbar />
            {children}
          </CartStoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
