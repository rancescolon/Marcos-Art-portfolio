import Navbar from '@/components/Navbar';
import ContactForm from '@/components/ContactForm';
import LinkedInLink from '@/components/LinkedInLink';
import { Poetsen_One, Old_Standard_TT } from 'next/font/google';
import './globals.css';

// Configure Poetsen One for Titles
const poetsenOne = Poetsen_One({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-poetsen-one',
});

// Configure Old Standard TT for Everything Else
const oldStandard = Old_Standard_TT({
    weight: ['400', '700'],
    subsets: ['latin'],
    variable: '--font-old-standard',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`scroll-smooth ${oldStandard.variable} ${poetsenOne.variable}`}>
        <body className="font-serif bg-white text-black antialiased flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
            {children}
        </div>
        <LinkedInLink />
        <ContactForm />
        <div className="pb-12"></div>
        </body>
        </html>
    );
}