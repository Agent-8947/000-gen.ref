// Language translations for multi-language support
// Supported languages: EN, UK, RU

export const LANGUAGE_NAMES: Record<string, { name: string; flag: string }> = {
    en: { name: 'English', flag: '🇬🇧' },
    uk: { name: 'Українська', flag: '🇺🇦' },
    ru: { name: 'Русский', flag: '🇷🇺' }
};

export const translations: Record<string, Record<string, string>> = {
    en: {
        // Navigation
        'nav.home': 'Home',
        'nav.about': 'About',
        'nav.services': 'Services',
        'nav.contact': 'Contact',

        // Buttons
        'btn.getStarted': 'Get Started',
        'btn.learnMore': 'Learn More',
        'btn.send': 'Send',
        'btn.submit': 'Submit',
        'btn.cancel': 'Cancel',

        // Form
        'form.name': 'Name',
        'form.email': 'Email',
        'form.message': 'Message',
        'form.placeholder.name': 'Your name',
        'form.placeholder.email': 'your@email.com',
        'form.placeholder.message': 'Your message...',

        // Common
        'common.readMore': 'Read More',
        'common.viewAll': 'View All',
        'common.close': 'Close',
        'common.open': 'Open'
    },

    uk: {
        // Navigation
        'nav.home': 'Головна',
        'nav.about': 'Про нас',
        'nav.services': 'Послуги',
        'nav.contact': 'Контакти',

        // Buttons
        'btn.getStarted': 'Почати',
        'btn.learnMore': 'Дізнатися більше',
        'btn.send': 'Надіслати',
        'btn.submit': 'Відправити',
        'btn.cancel': 'Скасувати',

        // Form
        'form.name': "Ім'я",
        'form.email': 'Email',
        'form.message': 'Повідомлення',
        'form.placeholder.name': "Ваше ім'я",
        'form.placeholder.email': 'ваш@email.com',
        'form.placeholder.message': 'Ваше повідомлення...',

        // Common
        'common.readMore': 'Читати далі',
        'common.viewAll': 'Переглянути все',
        'common.close': 'Закрити',
        'common.open': 'Відкрити'
    },

    ru: {
        // Navigation
        'nav.home': 'Главная',
        'nav.about': 'О нас',
        'nav.services': 'Услуги',
        'nav.contact': 'Контакты',

        // Buttons
        'btn.getStarted': 'Начать',
        'btn.learnMore': 'Узнать больше',
        'btn.send': 'Отправить',
        'btn.submit': 'Отправить',
        'btn.cancel': 'Отмена',

        // Form
        'form.name': 'Имя',
        'form.email': 'Email',
        'form.message': 'Сообщение',
        'form.placeholder.name': 'Ваше имя',
        'form.placeholder.email': 'ваш@email.com',
        'form.placeholder.message': 'Ваше сообщение...',

        // Common
        'common.readMore': 'Читать далее',
        'common.viewAll': 'Посмотреть все',
        'common.close': 'Закрыть',
        'common.open': 'Открыть'
    }
};

// Hook for using translations
export const useTranslation = (currentLanguage: string) => {
    const t = (key: string): string => {
        return translations[currentLanguage]?.[key] || translations['en'][key] || key;
    };

    return { t };
};
