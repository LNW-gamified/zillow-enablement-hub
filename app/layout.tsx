import type { Metadata } from 'next';
import { DM_Sans, DM_Serif_Display } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/NavBar';
import PageWrapper from '@/components/PageWrapper';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });
const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-dm-serif',
});

export const metadata: Metadata = {
  title: 'Zillow Enablement Hub',
  description: 'Sales Enablement Portfolio',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerif.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased font-sans">
        <NavBar />
        <main className="flex-1 pt-16"><PageWrapper>{children}</PageWrapper></main>
        <footer className="py-5 text-center text-xs text-gray-400 border-t border-gray-100 bg-white tracking-wide">
          Built by Chris Oliver · Sales Enablement · Sales Enablement Portfolio
        </footer>
      </body>
    </html>
  );
}
