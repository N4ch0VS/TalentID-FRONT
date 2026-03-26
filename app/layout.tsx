import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { LanguageProvider } from '@/contexts/LanguageContext';

export const metadata: Metadata = {
  title: 'TalentID - AI-Powered Psychometric Profiling',
  description: 'AI-Powered Psychometric Profiling',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
