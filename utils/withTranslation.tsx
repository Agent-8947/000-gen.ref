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
        const translated: any = {};
        const keys = Object.keys(data);

        // First pass: copy all keys recursively
        keys.forEach(key => {
            // Skip translation keys (e.g. title_uk) from being copied as main keys
            // But we might need them if we want to fallback? 
            // Actually, let's copy everything first, recursively
            translated[key] = translateData(data[key], currentLang);
        });

        // Second pass: apply flat translations (title_uk overrides title)
        if (currentLang !== 'en') {
            keys.forEach(key => {
                // If this is NOT a translation key (doesn't have _lang suffix)
                if (!key.includes('_')) {
                    const translatedKey = `${key}_${currentLang}`;
                    if (data[translatedKey]) {
                        // Found a translation! Override the original value
                        translated[key] = data[translatedKey];
                        // console.log(`[translateData] Overrided ${key} with ${translatedKey}: ${data[translatedKey]}`);
                    }
                }
            });
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
