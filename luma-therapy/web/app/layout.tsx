import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/components/layout/Header';
import { Toaster } from '@/components/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Luma - Therapeutic Companion',
  description: 'A safe space for reflection and emotional support',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-white to-purple-50/30">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
