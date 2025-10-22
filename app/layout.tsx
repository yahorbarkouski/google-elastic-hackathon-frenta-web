import { Provider as JotaiProvider } from 'jotai';
import type { Metadata } from 'next';
import { Hanken_Grotesk, Libre_Baskerville } from 'next/font/google';
import React from "react";
import './globals.css';

import { ViewTransitions } from 'next-view-transitions';
import { MapsProvider } from '@/components/maps-provider';

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
    template: '%s | Life Ledger',
    default: 'Life Ledger',
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
        <body className="min-h-screen overflow-y-auto bg-background">
          <JotaiProvider>
            <MapsProvider>
              {children}
            </MapsProvider>
          </JotaiProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
