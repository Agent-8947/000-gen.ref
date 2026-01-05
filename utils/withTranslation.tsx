// Higher-Order Component (HOC) to add translation support to any component
// This automatically wraps text content with getTranslatedText

import React from 'react';
import { getTranslatedText, getTranslatedArray } from './translationHelper';

interface WithTranslationProps {
    currentLang?: string;
    [key: string]: any;
}

// Helper to recursively translate data object
export const translateData = (data: any, currentLang: string = 'en'): any => {
    if (!data) return data;

    // Handle arrays
    if (Array.isArray(data)) {
        return data.map(item => translateData(item, currentLang));
    }

    // Handle objects
    if (typeof data === 'object') {
        const keys = Object.keys(data);

        // Check if this is a translation object
        // Translation object must have ONLY language keys (en, uk, ru, etc.)
        const languageKeys = ['en', 'uk', 'ru', 'de', 'fr', 'es', 'it', 'zh'];
        const hasLanguageKey = keys.some(k => languageKeys.includes(k));
        const allKeysAreLanguages = keys.every(k => languageKeys.includes(k));

        // If it has language keys AND all keys are languages, it's a translation object
        if (hasLanguageKey && allKeysAreLanguages && keys.length > 0) {
            // This is a translation object, return the translated value
            const translated = getTranslatedText(data, currentLang);
            console.log('[translateData] Found translation:', { keys, currentLang, original: data, translated });
            return translated;
        }

        // Otherwise, recursively translate all properties
        const translated: any = {};
        for (const key in data) {
            translated[key] = translateData(data[key], currentLang);
        }
        return translated;
    }

    // Return primitives as-is
    return data;
};

// HOC that wraps a component and translates its localOverrides.data
export function withTranslation<P extends WithTranslationProps>(
    WrappedComponent: React.ComponentType<P>
): React.FC<P> {
    return (props: P) => {
        const { currentLang = 'en', localOverrides, ...rest } = props;

        // Translate the data if localOverrides exists
        const translatedOverrides = localOverrides ? {
            ...localOverrides,
            data: translateData(localOverrides.data, currentLang)
        } : localOverrides;

        return (
            <WrappedComponent
                {...rest as P}
                currentLang={currentLang}
                localOverrides={translatedOverrides}
            />
        );
    };
}
