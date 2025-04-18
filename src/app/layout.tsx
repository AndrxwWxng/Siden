import { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Analytics } from '@/components/Analytics';

// Configure the fonts
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains',
});

export const metadata: Metadata = {
  title: 'Siden - Agents that just work',
  description: 'Create and deploy a team of AI agents that work together on complex tasks.',
  authors: [{ name: 'Siden' }],
  keywords: [
    'AI agents',
    'Artificial intelligence',
    'AI workforce',
    'AI teams',
    'AI automation',
    'AI orchestration',
    'Enterprise AI',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${plusJakarta.variable} ${jetbrainsMono.variable} antialiased min-h-screen`}>
        <Providers>
          <div className="relative">
            {/* Decorative blobs - positioned absolutely */}
            <div className="blob blob-primary w-[500px] h-[500px] top-[15%] -left-[250px] opacity-[0.07]"></div>
            <div className="blob blob-success w-[600px] h-[600px] top-[40%] -right-[300px] opacity-[0.07]"></div>
            
            {/* Main content */}
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
