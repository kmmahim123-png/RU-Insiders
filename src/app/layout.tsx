import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Hind_Siliguri } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hind-siliguri',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RU Insiders | Official Rajshahi University Apparel & Print Station',
  description: 'Customize hoodies, drop-shoulder tees, sports jerseys with RU logo, and print assignment/slide PDFs directly at Rajshahi University campus.',
  keywords: [
    'RU Insiders',
    'Rajshahi University',
    'রাবি হুডি',
    'RU Hoodie',
    'RU Jersey',
    'Drop Shoulder RU',
    'Print Lagbe',
    'প্রিন্ট লাগবে',
    'Paris Road'
  ],
  openGraph: {
    title: 'RU Insiders | Official Merchandise & Print Station',
    description: 'Exclusive Rajshahi University branded apparel and instant PDF print queue.',
    url: 'https://www.facebook.com/ru.insiders/followers',
    siteName: 'RU Insiders',
    locale: 'bn_BD',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${hindSiliguri.variable} dark`}>
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-rose-600 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
