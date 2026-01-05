// Translation helper for all components
// Supports both string and object (multi-language) values

export const getTranslatedText = (value: any, currentLang: string = 'en'): string => {
    if (!value) return '';

    // If value is an object with language keys, return the current language
    if (typeof value === 'object' && !Array.isArray(value)) {
        return value[currentLang] || value['en'] || Object.values(value)[0] || '';
    }

    // Otherwise return as string
    return String(value);
};

// Helper for translating arrays of items (e.g., links, skills, testimonials)
export const getTranslatedArray = (items: any[], currentLang: string = 'en'): any[] => {
    if (!Array.isArray(items)) return [];

    return items.map(item => {
        if (typeof item === 'object' && item !== null) {
            const translated: any = {};
            for (const key in item) {
                translated[key] = getTranslatedText(item[key], currentLang);
            }
            return translated;
        }
        return getTranslatedText(item, currentLang);
    });
};
