'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Send, User, Calendar, FileText } from 'lucide-react';
import TalentProfile from './TalentProfile';
import { ENNEAGRAM_QUESTIONS } from '@/constants/enneagram';
import { FormData, ProfileData } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TalentForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t, language } = useLanguage();

  const questions = ENNEAGRAM_QUESTIONS[language];

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    setProfileData(null);

    try {
      const enneagramAnswers = questions.map(
        q => `Question: ${q.text}\nAnswer (1-5): ${data[q.id as keyof FormData]}`
      ).join('\n\n');

      const payload = {
        name: data.name,
        birthDate: data.birthDate,
        enneagramAnswers,
        language,
      };

      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(t('form.errorGenerating'));
      }

      const result = await response.json();
      setProfileData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row w-full">
      {/* Left Sidebar: Form (Controls) */}
      <div className="w-full lg:w-[380px] xl:w-[420px] flex-shrink-0 border-r border-brand-gray/20 bg-brand-dark/40 p-6 lg:p-8 lg:min-h-[calc(100vh-3.5rem)] flex flex-col">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white tracking-tight">{t('form.newAnalysis')}</h2>
          <p className="text-sm text-brand-gray-light mt-1">{t('form.description')}</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex-1 flex flex-col">
          <div className="space-y-5 flex-1">
            <div className="space-y-1.5">
              <label htmlFor="name" className="flex items-center gap-2 text-xs font-semibold text-brand-teal-light uppercase tracking-wider">
                <User className="w-3.5 h-3.5" /> {t('form.fullName')}
              </label>
              <input
                id="name"
                {...register('name', { required: { value: true, message: t('form.required') } })}
                className="w-full px-3 py-2 text-sm bg-brand-black border border-brand-gray/30 rounded-md text-white focus:ring-1 focus:ring-brand-purple focus:border-brand-purple outline-none transition-all placeholder-brand-gray/50"
                placeholder={t('form.fullNamePlaceholder')}
              />
              {errors.name && <p className="text-red-400 text-xs">{errors.name.message as string}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="birthDate" className="flex items-center gap-2 text-xs font-semibold text-brand-teal-light uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" /> {t('form.dob')}
              </label>
              <input
                id="birthDate"
                type="date"
                {...register('birthDate', { required: { value: true, message: t('form.required') } })}
                className="w-full px-3 py-2 text-sm bg-brand-black border border-brand-gray/30 rounded-md text-white focus:ring-1 focus:ring-brand-purple focus:border-brand-purple outline-none transition-all [color-scheme:dark]"
              />
              {errors.birthDate && <p className="text-red-400 text-xs">{errors.birthDate.message as string}</p>}
            </div>

            <div className="space-y-2 flex flex-col flex-1 min-h-[300px]">
              <label className="flex items-center gap-2 text-xs font-semibold text-brand-teal-light uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5" /> {t('form.quickTest')}
              </label>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 pb-2">
                {questions.map((q, idx) => (
                  <div key={q.id} className="bg-brand-black/40 p-3 rounded-md border border-brand-gray/20">
                    <p className="text-sm text-gray-200 mb-3 leading-snug">{idx + 1}. {q.text}</p>
                    <div className="flex justify-between px-2">
                      {[1, 2, 3, 4, 5].map(val => (
                        <label key={val} className="flex flex-col items-center gap-1.5 cursor-pointer group">
                          <input
                            type="radio"
                            value={val}
                            {...register(q.id as keyof FormData, { required: true })}
                            className="w-4 h-4 accent-brand-purple cursor-pointer"
                          />
                          <span className="text-[10px] text-brand-gray-light group-hover:text-white transition-colors">{val}</span>
                        </label>
                      ))}
                    </div>
                    {errors[q.id as keyof FormData] && <p className="text-red-400 text-xs mt-2">{t('form.required')}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 mt-auto">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-purple hover:bg-brand-purple-light text-white text-sm font-medium py-2.5 rounded-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed border border-brand-purple-light/50 shadow-[0_0_15px_rgba(74,0,128,0.2)]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('form.processing')}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {t('form.generateBtn')}
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-900/20 text-red-400 text-xs rounded-md border border-red-900/50">
                {error}
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Right Area: Results Canvas */}
      <div className="flex-1 bg-brand-black p-6 lg:p-12 relative overflow-y-auto">
        <div className="max-w-4xl mx-auto h-full">
          {profileData ? (
            <TalentProfile data={profileData} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-brand-gray-light text-center space-y-4 py-20">
              <div className="w-16 h-16 bg-brand-dark rounded-xl flex items-center justify-center border border-brand-gray/20">
                <svg className="w-8 h-8 text-brand-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm max-w-sm">
                {t('profile.emptyState')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
