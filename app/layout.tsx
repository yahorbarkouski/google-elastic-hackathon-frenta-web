import { Provider as JotaiProvider } from 'jotai';
import type { Metadata } from 'next';
import { Hanken_Grotesk, Libre_Baskerville } from 'next/font/google';
import React from "react";
import './globals.css';

import { ViewTransitions } from 'next-view-transitions';
import { MapsProvider } from '@/components/maps-provider';
import { Navigation } from '@/components/navigation';

const inter = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800', '900']
});

const title = Libre_Baskerville({
  subsets: ['latin'],
  variable: '--font-title',
  weight: ['400', '700']
});

export const metadata: Metadata = {
  title: {
    template: '%s | Frenta',
    default: 'Frenta',
  },
};


export default function RootLayout(
  {
    children,
  }: Readonly<{ children: React.ReactNode }>
) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning className={`${inter.variable} ${title.variable}`}>
        <body className="min-h-screen bg-background h-full">
          <JotaiProvider>
            <MapsProvider>
              <Navigation />
              <main className="pt-16 h-full">
                {children}
              </main>
            </MapsProvider>
          </JotaiProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
