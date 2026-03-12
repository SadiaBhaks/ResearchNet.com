import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { DarkModeProvider } from "@/components/DarkModeContext";
import AuthProvider from "@/components/AuthProvider"; 
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ResearchNet.com",
  description: "Advanced Research Feasibility Tool",
  icons: {
    icon: [
      {
        url: "/icon.svg?v=1", // Make sure you saved the SVG I gave you as 'icon.svg' in /public or /app
        href: "/icon.svg?v=1",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/*  Wrap everything in AuthProvider */}
        <AuthProvider>
          <DarkModeProvider>
            <Navbar />
            {children}
            <Footer/>
          </DarkModeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}