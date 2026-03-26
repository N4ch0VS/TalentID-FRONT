'use client';

import TalentForm from '@/components/TalentForm';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-brand-black text-white font-sans selection:bg-brand-purple selection:text-white flex flex-col">
      {/* Top Navigation Bar */}
      <header className="h-14 border-b border-brand-gray/20 bg-brand-dark/80 backdrop-blur-md flex items-center px-6 sticky top-0 z-50 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-brand-teal/20 border border-brand-teal flex items-center justify-center">
            <svg className="w-4 h-4 text-brand-teal-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white">
            {t('app.title')}<span className="text-brand-purple-light">{t('app.subtitle')}</span>
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-xs font-medium text-brand-gray-light hidden sm:block tracking-wide uppercase">
            {t('app.tagline')}
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col">
        <TalentForm />
      </div>
    </main>
  );
}
