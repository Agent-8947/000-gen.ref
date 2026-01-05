// Auto-translate helper - adds translations to existing blocks
// This will convert all string values to translation objects

export const autoTranslateBlocks = () => {
    const store = (window as any).useStore;
    if (!store) {
        console.error('❌ Store not found');
        return;
    }

    const state = store.getState();
    const blocks = state.pages[state.currentPage];

    if (!blocks || blocks.length === 0) {
        console.warn('⚠️ No blocks found');
        return;
    }

    console.log(`🔄 Auto-translating ${blocks.length} blocks...`);

    let translatedCount = 0;

    blocks.forEach((block: any) => {
        if (!block.localOverrides?.data) return;

        const data = block.localOverrides.data;
        let hasChanges = false;

        // Translate all string fields
        Object.keys(data).forEach(key => {
            const value = data[key];

            // Skip if already translated or not a string
            if (typeof value !== 'string') return;

            // Skip empty strings
            if (!value.trim()) return;

            // Convert to translation object
            data[key] = {
                en: value,
                uk: translateToUkrainian(value),
                ru: translateToRussian(value)
            };

            hasChanges = true;
            console.log(`  ✓ Translated: ${key}`);
        });

        // Also translate arrays (like links, items, etc.)
        Object.keys(data).forEach(key => {
            const value = data[key];

            if (!Array.isArray(value)) return;

            value.forEach((item: any) => {
                if (typeof item === 'object' && item !== null) {
                    Object.keys(item).forEach(itemKey => {
                        const itemValue = item[itemKey];

                        if (typeof itemValue !== 'string') return;
                        if (!itemValue.trim()) return;

                        item[itemKey] = {
                            en: itemValue,
                            uk: translateToUkrainian(itemValue),
                            ru: translateToRussian(itemValue)
                        };

                        hasChanges = true;
                    });
                }
            });
        });

        if (hasChanges) {
            translatedCount++;
        }
    });

    // Force re-render
    state.setCurrentLanguage(state.currentLanguage);

    console.log(`✅ Auto-translation complete! Translated ${translatedCount} blocks.`);
    console.log('🔄 Switch languages to test!');
};

// Simple translation helpers (basic word-by-word translation)
function translateToUkrainian(text: string): string {
    const dict: Record<string, string> = {
        // Common words
        'DESIGN': 'ДИЗАЙН',
        'DRIVEN': 'КЕРОВАНИЙ',
        'BY': '',
        'DNA': 'ДНК',
        'Configure': 'Налаштуйте',
        'your': 'ваш',
        'interface': 'інтерфейс',
        'through': 'через',
        'global': 'глобальні',
        'genetic': 'генетичні',
        'parameters': 'параметри',
        'or': 'або',
        'local': 'локальні',
        'overrides': 'перевизначення',
        'Get': 'Почати',
        'Started': '',
        'Launch': 'Запустити',
        'System': 'систему',
        'Learn': 'Дізнатися',
        'More': 'більше',
        'Read': 'Читати',
        'Documentation': 'документацію',
        'Protocol': 'протокол',
        'Home': 'Головна',
        'About': 'Про нас',
        'Services': 'Послуги',
        'Contact': 'Контакти',
        'Portfolio': 'Портфоліо',
        'Projects': 'Проекти',
        'Skills': 'Навички',
        'Experience': 'Досвід',
        'Blog': 'Блог',
        'Team': 'Команда'
    };

    return translateText(text, dict);
}

function translateToRussian(text: string): string {
    const dict: Record<string, string> = {
        // Common words
        'DESIGN': 'ДИЗАЙН',
        'DRIVEN': 'УПРАВЛЯЕМЫЙ',
        'BY': '',
        'DNA': 'ДНК',
        'Configure': 'Настройте',
        'your': 'ваш',
        'interface': 'интерфейс',
        'through': 'через',
        'global': 'глобальные',
        'genetic': 'генетические',
        'parameters': 'параметры',
        'or': 'или',
        'local': 'локальные',
        'overrides': 'переопределения',
        'Get': 'Начать',
        'Started': '',
        'Launch': 'Запустить',
        'System': 'систему',
        'Learn': 'Узнать',
        'More': 'больше',
        'Read': 'Читать',
        'Documentation': 'документацию',
        'Protocol': 'протокол',
        'Home': 'Главная',
        'About': 'О нас',
        'Services': 'Услуги',
        'Contact': 'Контакты',
        'Portfolio': 'Портфолио',
        'Projects': 'Проекты',
        'Skills': 'Навыки',
        'Experience': 'Опыт',
        'Blog': 'Блог',
        'Team': 'Команда'
    };

    return translateText(text, dict);
}

function translateText(text: string, dict: Record<string, string>): string {
    let result = text;

    // Replace each word
    Object.keys(dict).forEach(key => {
        const value = dict[key];
        const regex = new RegExp(`\\b${key}\\b`, 'gi');
        result = result.replace(regex, value);
    });

    // Clean up extra spaces
    result = result.replace(/\s+/g, ' ').trim();

    return result;
}

// Make it available globally
if (typeof window !== 'undefined') {
    (window as any).autoTranslateBlocks = autoTranslateBlocks;
    console.log('✅ autoTranslateBlocks() is ready! Run it in console to auto-translate all blocks.');
}
