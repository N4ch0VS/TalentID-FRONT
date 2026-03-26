'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { en } from '@/locales/en';
import { es } from '@/locales/es';

type Language = 'en' | 'es';

type Dictionary = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const dictionaries: Record<Language, Dictionary> = {
    en,
    es,
  };

  const t = (path: string): string => {
    const keys = path.split('.');
    let value: any = dictionaries[language];
    for (const key of keys) {
      if (value[key] === undefined) {
        return path; // Fallback to key if translation is missing
      }
      value = value[key];
    }
    return value as string;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
