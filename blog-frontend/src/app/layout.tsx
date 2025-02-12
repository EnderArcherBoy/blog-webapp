"use client";

import localFont from "next/font/local";
import "./globals.css";
import { usePathname } from "next/navigation";
import { metadata } from "./metadata";
import NavigationMenuDemo from "../components/navbar";
import LogoTitle from "../components/logo";
import ButtonLogin from "@/components/buttonlogin"; // Rename from ButtonDemo
import FooterBlog from "../components/footer";
import { Toaster } from 'react-hot-toast';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        {!isDashboard && (
          <div className="">
            <div className="flex items-center justify-around bg-slate-300/50 w-full absolute">
              <div className="flex flex-row items-center">
                <LogoTitle />
                <NavigationMenuDemo />
              </div>
              <ButtonLogin />
            </div>
          </div>
        )}
        <div className="flex-grow">
          {children}
        </div>
        <Toaster />
        {!isDashboard && <FooterBlog />}
      </body>
    </html>
  );
}
