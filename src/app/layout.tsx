import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Hind_Siliguri } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';

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
  description: 'Customize hoodies, drop-shoulder tees, sports jerseys with official RU logo, and print assignment/slide PDFs directly at Rajshahi University campus.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'RU Insiders | Official Merchandise & Print Station',
    description: 'Exclusive Rajshahi University branded apparel and instant PDF print queue.',
    url: 'https://www.facebook.com/ru.insiders/followers',
    siteName: 'RU Insiders',
    locale: 'bn_BD',
    type: 'website',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${hindSiliguri.variable}`}>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white pb-16 md:pb-0">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
