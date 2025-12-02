// src/app/layout.jsx
'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/context/LanguageContext';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-linear-to-b from-neutral-900 to-neutral-800 text-neutral-50`}
      >
        <LanguageProvider>
          <Header />
          <main className='flex flex-col items-center w-full flex-1 px-6'>
            <div className='w-full max-w-6xl flex flex-col items-center'>
              {children}
            </div>
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
