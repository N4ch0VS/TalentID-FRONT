'use client';

import { motion } from 'motion/react';
import { Activity, Target, Users, Zap } from 'lucide-react';
import { ProfileData } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TalentProfile({ data }: { data: ProfileData }) {
  const { t } = useLanguage();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-10"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-brand-gray/20 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-brand-teal-light" />
            <h3 className="text-xs font-bold text-brand-teal uppercase tracking-widest">{t('profile.personalityType')}</h3>
          </div>
          <p className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{data.personalityType}</p>
        </div>
        <div className="text-left md:text-right">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-brand-teal/10 text-brand-teal-light border border-brand-teal/20 uppercase tracking-wider">
            {t('profile.match')}
          </span>
        </div>
      </div>

      {/* Competencies Grid */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <Activity className="w-4 h-4 text-brand-teal-light" />
          <h3 className="text-xs font-bold text-brand-teal uppercase tracking-widest">{t('profile.coreCompetencies')}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {data.competencies.map((comp, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm items-baseline">
                <span className="font-medium text-gray-200">{comp.name}</span>
                <span className="text-brand-purple-light font-mono font-bold text-xs">{comp.value}%</span>
              </div>
              <div className="w-full bg-brand-dark rounded-sm h-1.5 overflow-hidden border border-brand-gray/10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${comp.value}%` }}
                  transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                  className="bg-brand-purple-light h-full rounded-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="bg-brand-dark/50 p-6 rounded-xl border border-brand-gray/20 hover:border-brand-teal/30 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-brand-teal-light" />
            <h3 className="text-xs font-bold text-brand-teal uppercase tracking-widest">{t('profile.leadershipStyle')}</h3>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">{data.leadershipStyle}</p>
        </div>
        
        <div className="bg-brand-dark/50 p-6 rounded-xl border border-brand-gray/20 hover:border-brand-purple/30 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-brand-purple-light" />
            <h3 className="text-xs font-bold text-brand-purple uppercase tracking-widest">{t('profile.culturalFit')}</h3>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">{data.culturalFit}</p>
        </div>
      </div>
    </motion.div>
  );
}
