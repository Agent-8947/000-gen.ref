import React from 'react';
import { useLanguageStore } from './languageStore';
import { Language } from './dictionary';

const LANGUAGE_FLAGS: Record<Language, string> = {
  en: 'EN',
  ru: 'RU',
  uk: 'UK',
  de: 'DE',
  fr: 'FR',
  es: 'ES',
  it: 'IT',
  zh: 'ZH',
};

export const LanguageSelector: React.FC = () => {
  const { currentLang, setLanguage } = useLanguageStore();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  return (
    <select
      value={currentLang}
      onChange={handleChange}
      className="fixed top-2 right-16 z-[9999] bg-white/10 backdrop-blur-md text-xs font-bold rounded px-2 py-1 cursor-pointer hover:bg-white/20 transition-all border-none outline-none text-current appearance-none"
      title="Change Language"
      style={{
        WebkitAppearance: 'none',
        textAlign: 'center'
      }}
    >
      {(Object.keys(LANGUAGE_FLAGS) as Language[]).map((lang) => (
        <option key={lang} value={lang} style={{ color: '#000' }}>
          {LANGUAGE_FLAGS[lang]}
        </option>
      ))}
    </select>
  );
};
