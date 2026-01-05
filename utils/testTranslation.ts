// Test translation helper - adds a Hero block with translations
// Use this in browser console: addTestTranslationBlock()

export const addTestTranslationBlock = () => {
    const testBlock = {
        id: 'TEST-TRANSLATION-' + Date.now(),
        type: 'B0201',
        isVisible: true,
        localOverrides: {
            data: {
                title: {
                    en: "MULTILINGUAL TEST",
                    uk: "БАГАТОМОВНИЙ ТЕСТ",
                    ru: "МНОГОЯЗЫЧНЫЙ ТЕСТ"
                },
                titleTypo: { useGlobal: true, fontSize: '48', fontWeight: '800', letterSpacing: '-0.02', lineHeight: '1.1', uppercase: true },
                description: {
                    en: "This is a test block with translations. Switch languages to see it work!",
                    uk: "Це тестовий блок з перекладами. Переключіть мови, щоб побачити як це працює!",
                    ru: "Это тестовый блок с переводами. Переключите языки, чтобы увидеть как это работает!"
                },
                descriptionTypo: { useGlobal: true, fontSize: '18', fontWeight: '400', letterSpacing: '0', lineHeight: '1.6', uppercase: false },
                primaryBtnText: {
                    en: "Test Button",
                    uk: "Тестова кнопка",
                    ru: "Тестовая кнопка"
                },
                primaryBtnVisible: true,
                secondaryBtnText: {
                    en: "Learn More",
                    uk: "Дізнатися більше",
                    ru: "Узнать больше"
                },
                secondaryBtnVisible: true
            },
            layout: { height: '70vh', alignment: 'center', paddingTop: '80px' },
            style: { bgFill: '', titleColor: '', descColor: '' },
            media: { showImage: false },
            background: { lockBackground: false, fixedColor: '#FFFFFF' },
            btnUseGlobal: true,
            animation: { useGlobal: true, duration: "0.8", stagger: "0.15", entranceY: "40" }
        }
    };

    // Add to store
    const store = (window as any).__store;
    if (store) {
        const state = store.getState();
        state.addBlock('B0201');
        // Replace the last added block with our test block
        const blocks = state.pages[state.currentPage];
        blocks[blocks.length - 1] = testBlock;
        state.refreshCanvas();
        console.log('✅ Test translation block added! Switch languages to test.');
    } else {
        console.error('❌ Store not found');
    }
};

// Make it available globally
if (typeof window !== 'undefined') {
    (window as any).addTestTranslationBlock = addTestTranslationBlock;
}
