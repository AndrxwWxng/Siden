import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Agent Team Builder | Build and orchestrate your AI agent team",
  description: "The purpose-built platform for creating, deploying, and managing AI agents at scale.",
  keywords: "AI agents, agent teams, AI workflow, agent orchestration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${plusJakarta.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-[#121212] text-white overflow-x-hidden`}>
        <div className="relative">
          {/* Decorative blobs - positioned absolutely */}
          <div className="blob blob-primary w-[500px] h-[500px] top-[15%] -left-[250px] opacity-[0.07]"></div>
          <div className="blob blob-success w-[600px] h-[600px] top-[40%] -right-[300px] opacity-[0.07]"></div>
          
          {/* Main content */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
