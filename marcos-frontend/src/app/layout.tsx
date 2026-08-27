import Navbar from '@/components/Navbar';
import ContactForm from '@/components/ContactForm';
import LinkedInLink from '@/components/LinkedInLink';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en" className="scroll-smooth">
      <body className="bg-white text-black antialiased flex flex-col min-h-screen">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area (renders page.tsx, about/page.tsx, etc.) */}
      <div className="flex-grow">
        {children}
      </div>

      {/* Global Footer Elements */}
      <LinkedInLink />
      <ContactForm />

      <div className="pb-12"></div> {/* Bottom spacing */}
      </body>
      </html>
  );
}