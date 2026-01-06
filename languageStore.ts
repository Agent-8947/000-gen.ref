import { create } from 'zustand';
import { dictionary, Language, TranslationKey } from './dictionary';

interface LanguageStore {
    currentLang: Language;
    setLanguage: (lang: Language) => void;
    t: (key: TranslationKey) => string;
}

export const useLanguageStore = create<LanguageStore>((set, get) => ({
    currentLang: 'en',

    setLanguage: (lang: Language) => {
        console.log(`🌍 Language changed to: ${lang}`);
        set({ currentLang: lang });
    },

    // Strictly typed translation function - only accepts valid TranslationKey!
    t: (key: TranslationKey): string => {
        const { currentLang } = get();
        return dictionary[currentLang][key];
    },
}));
