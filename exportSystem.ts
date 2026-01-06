import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { dictionary, Language } from './dictionary';

// ============================================================================
// TEMPLATE GENERATORS
// ============================================================================

/**
 * Generate dictionary.ts file content with current translations
 */
export const generateDictionaryFile = (currentDictionary: typeof dictionary): string => {
    return `// Supported languages
export type Language = 'en' | 'ru' | 'uk' | 'de' | 'fr' | 'es' | 'it' | 'zh';

// Master source - English translations
const en = ${JSON.stringify(currentDictionary.en, null, 2)} as const;

// Automatically derive translation keys from English
export type TranslationKey = keyof typeof en;

// Type for a complete translation object
type Translations = Record<TranslationKey, string>;

// Main dictionary - TypeScript enforces ALL keys in ALL languages!
export const dictionary: Record<Language, Translations> = ${JSON.stringify(currentDictionary, null, 2)};
`;
};

/**
 * Generate languageStore.ts file content
 */
export const generateLanguageStoreFile = (): string => {
    return `import { create } from 'zustand';
import { dictionary, Language, TranslationKey } from './dictionary';

interface LanguageStore {
  currentLang: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

export const useLanguageStore = create<LanguageStore>((set, get) => ({
  currentLang: 'en',
  
  setLanguage: (lang: Language) => {
    console.log(\`🌍 Language changed to: \${lang}\`);
    set({ currentLang: lang });
  },
  
  // Strictly typed translation function
  t: (key: TranslationKey): string => {
    const { currentLang } = get();
    return dictionary[currentLang][key];
  },
}));
`;
};

/**
 * Generate LanguageSelector.tsx component
 */
export const generateLanguageSelectorFile = (): string => {
    return `import React from 'react';
import { useLanguageStore } from './languageStore';
import { Language } from './dictionary';

const LANGUAGE_NAMES: Record<Language, { name: string; flag: string }> = {
  en: { name: 'English', flag: '🇬🇧' },
  ru: { name: 'Русский', flag: '🇷🇺' },
  uk: { name: 'Українська', flag: '🇺🇦' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  fr: { name: 'Français', flag: '🇫🇷' },
  es: { name: 'Español', flag: '🇪🇸' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  zh: { name: '中文', flag: '🇨🇳' },
};

export const LanguageSelector: React.FC = () => {
  const { currentLang, setLanguage } = useLanguageStore();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  return (
    <div className="language-selector" style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
      <select
        value={currentLang}
        onChange={handleChange}
        style={{
          padding: '8px 12px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          minWidth: '140px',
          color: 'inherit',
        }}
      >
        {(Object.keys(LANGUAGE_NAMES) as Language[]).map((lang) => (
          <option key={lang} value={lang} style={{ color: '#000' }}>
            {LANGUAGE_NAMES[lang].flag} {LANGUAGE_NAMES[lang].name}
          </option>
        ))}
      </select>
    </div>
  );
};
`;
};

/**
 * Generate App.tsx with i18n support
 */
export const generateAppFile = (blocks: any[]): string => {
    return `import React from 'react';
import { useLanguageStore } from './languageStore';
import { LanguageSelector } from './LanguageSelector';
import './App.css';

function App() {
  const { t, currentLang } = useLanguageStore();

  return (
    <div className="app">
      <LanguageSelector />
      
      {/* Your content blocks will be rendered here */}
      <div className="content">
        <h1>{t('welcome')}</h1>
        <p>Current language: {currentLang}</p>
        
        {/* Example navigation */}
        <nav style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
          <a href="#home">{t('home')}</a>
          <a href="#about">{t('about')}</a>
          <a href="#services">{t('services')}</a>
          <a href="#portfolio">{t('portfolio')}</a>
          <a href="#contact">{t('contact')}</a>
        </nav>

        {/* Render your blocks here */}
        <div className="blocks">
          {/* TODO: Render actual blocks with translations */}
          <p>{t('configure')} {t('your_interface')}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
`;
};

/**
 * Generate main.tsx entry point
 */
export const generateMainFile = (): string => {
    return `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`;
};

/**
 * Generate package.json
 */
export const generatePackageJson = (projectName: string = 'my-react-app'): string => {
    return JSON.stringify({
        name: projectName,
        private: true,
        version: '0.0.0',
        type: 'module',
        scripts: {
            dev: 'vite',
            build: 'tsc && vite build',
            preview: 'vite preview',
        },
        dependencies: {
            react: '^18.2.0',
            'react-dom': '^18.2.0',
            zustand: '^4.4.7',
        },
        devDependencies: {
            '@types/react': '^18.2.43',
            '@types/react-dom': '^18.2.17',
            '@vitejs/plugin-react': '^4.2.1',
            typescript: '^5.2.2',
            vite: '^5.0.8',
        },
    }, null, 2);
};

/**
 * Generate index.html
 */
export const generateIndexHtml = (): string => {
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React App with i18n</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
};

/**
 * Generate vite.config.ts
 */
export const generateViteConfig = (): string => {
    return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
`;
};

/**
 * Generate tsconfig.json
 */
export const generateTsConfig = (): string => {
    return JSON.stringify({
        compilerOptions: {
            target: 'ES2020',
            useDefineForClassFields: true,
            lib: ['ES2020', 'DOM', 'DOM.Iterable'],
            module: 'ESNext',
            skipLibCheck: true,
            moduleResolution: 'bundler',
            allowImportingTsExtensions: true,
            resolveJsonModule: true,
            isolatedModules: true,
            noEmit: true,
            jsx: 'react-jsx',
            strict: true,
            noUnusedLocals: true,
            noUnusedParameters: true,
            noFallthroughCasesInSwitch: true,
        },
        include: ['src'],
        references: [{ path: './tsconfig.node.json' }],
    }, null, 2);
};

/**
 * Generate tsconfig.node.json
 */
export const generateTsConfigNode = (): string => {
    return JSON.stringify({
        compilerOptions: {
            composite: true,
            skipLibCheck: true,
            module: 'ESNext',
            moduleResolution: 'bundler',
            allowSyntheticDefaultImports: true,
        },
        include: ['vite.config.ts'],
    }, null, 2);
};

/**
 * Generate App.css
 */
export const generateAppCss = (): string => {
    return `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: white;
}

.app {
  min-height: 100vh;
  padding: 20px;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

h1 {
  font-size: 3rem;
  margin-bottom: 20px;
  text-align: center;
}

nav {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 15px 30px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  gap: 30px;
}

nav a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s;
}

nav a:hover {
  opacity: 0.7;
}

.blocks {
  margin-top: 40px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  text-align: center;
  font-size: 1.2rem;
}
`;
};

/**
 * Generate index.css
 */
export const generateIndexCss = (): string => {
    return `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
`;
};

// ============================================================================
// MAIN EXPORT FUNCTION
// ============================================================================

/**
 * Generate and download ZIP archive with full React app + i18n support
 */
export const generateZip = async (
    currentBlocks: any[] = [],
    currentDictionary: typeof dictionary = dictionary,
    projectName: string = 'my-react-app'
): Promise<void> => {
    console.log('🚀 Starting ZIP generation...');

    const zip = new JSZip();

    // Root files
    zip.file('package.json', generatePackageJson(projectName));
    zip.file('index.html', generateIndexHtml());
    zip.file('vite.config.ts', generateViteConfig());
    zip.file('tsconfig.json', generateTsConfig());
    zip.file('tsconfig.node.json', generateTsConfigNode());

    // README
    zip.file('README.md', `# ${projectName}

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run development server:
\`\`\`bash
npm run dev
\`\`\`

3. Build for production:
\`\`\`bash
npm run build
\`\`\`

## Features

- ✅ React 18 + TypeScript
- ✅ Vite for fast development
- ✅ Zustand for state management
- ✅ Multi-language support (i18n)
- ✅ 8 languages: EN, RU, UK, DE, FR, ES, IT, ZH

## Language Switching

Use the language selector in the top-right corner to switch between languages.
All translations are type-safe and managed through the \`dictionary.ts\` file.
`);

    // src/ folder
    const src = zip.folder('src');
    if (src) {
        src.file('main.tsx', generateMainFile());
        src.file('App.tsx', generateAppFile(currentBlocks));
        src.file('App.css', generateAppCss());
        src.file('index.css', generateIndexCss());
        src.file('dictionary.ts', generateDictionaryFile(currentDictionary));
        src.file('languageStore.ts', generateLanguageStoreFile());
        src.file('LanguageSelector.tsx', generateLanguageSelectorFile());
    }

    // Generate ZIP blob
    console.log('📦 Generating ZIP blob...');
    const blob = await zip.generateAsync({ type: 'blob' });

    // Download
    console.log('💾 Downloading ZIP...');
    saveAs(blob, `${projectName}.zip`);

    console.log('✅ ZIP generated successfully!');
};

/**
 * Export function to be called from UI
 */
export const handleExportProject = async () => {
    try {
        await generateZip([], dictionary, 'my-multilingual-app');
        alert('✅ Project exported successfully! Check your downloads folder.');
    } catch (error) {
        console.error('❌ Export failed:', error);
        alert('❌ Export failed. Check console for details.');
    }
};
