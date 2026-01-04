import { lazy, ComponentType } from 'react';

// Helper to lazy load named exports
const loadBlock = <T extends ComponentType<any>>(
    importFn: () => Promise<any>,
    name: string
) => {
    return lazy(() => importFn().then(module => ({ default: module[name] })));
};

// Lazy loaded components
export const BLOCKS: Record<string, ComponentType<any>> = {
    Navbar: loadBlock(() => import('../components/Navbar'), 'Navbar'),
    Hero: loadBlock(() => import('../components/Hero'), 'Hero'),
    Skills: loadBlock(() => import('../components/Skills'), 'Skills'),
    Article: loadBlock(() => import('../components/Article'), 'Article'),
    Portfolio: loadBlock(() => import('../components/Portfolio'), 'Portfolio'),
    Timeline: loadBlock(() => import('../components/Timeline'), 'Timeline'),
    Stats: loadBlock(() => import('../components/Stats'), 'Stats'),
    Spacer: loadBlock(() => import('../components/Spacer'), 'Spacer'),
    Badges: loadBlock(() => import('../components/Badges'), 'Badges'),
    Preview: loadBlock(() => import('../components/Preview'), 'Preview'),
    Testimonials: loadBlock(() => import('../components/Testimonials'), 'Testimonials'),
    ContactForm: loadBlock(() => import('../components/ContactForm'), 'ContactForm'),
    SocialDock: loadBlock(() => import('../components/SocialDock'), 'SocialDock'),
    Footer: loadBlock(() => import('../components/Footer'), 'Footer'),
    Logos: loadBlock(() => import('../components/Logos'), 'Logos'),
    Accordion: loadBlock(() => import('../components/Accordion'), 'Accordion'),
    Tabs: loadBlock(() => import('../components/Tabs'), 'Tabs'),
    Methodology: loadBlock(() => import('../components/Methodology'), 'Methodology'),
    TechStack: loadBlock(() => import('../components/TechStack'), 'TechStack'),
    FeaturedProject: loadBlock(() => import('../components/FeaturedProject'), 'FeaturedProject'),
    ProjectsGrid: loadBlock(() => import('../components/ProjectsGrid'), 'ProjectsGrid'),
    CodeShowcase: loadBlock(() => import('../components/CodeShowcase'), 'CodeShowcase'),
    // RadarChart is currently mapped to Testimonials in the original code, but we have a component for it.
    // Mapping it to Testimonials to preserve original behavior for now, but keeping the import ready.
    RadarChart: loadBlock(() => import('../components/Testimonials'), 'Testimonials'),
};

// Map DNA codes and aliases to the canonical component key
export const BLOCK_MAPPING: Record<string, string> = {
    // Navbar
    'B0101': 'Navbar',
    'B0102': 'Navbar',
    'Navbar': 'Navbar',

    // Hero
    'B0201': 'Hero',
    'B0202': 'Hero',
    'B0203': 'Hero',
    'Hero': 'Hero',

    // Skills
    'B0301': 'Skills',
    'B0302': 'Skills',
    'Skills': 'Skills',

    // Article
    'B0401': 'Article',
    'B0402': 'Article',
    'Article': 'Article',

    // Portfolio
    'B0501': 'Portfolio',
    'B0503': 'Portfolio',
    'Portfolio': 'Portfolio',

    // Timeline
    'B0601': 'Timeline',
    'B0602': 'Timeline',
    'Timeline': 'Timeline',

    // Accordion
    'B0701': 'Accordion',
    'Accordion': 'Accordion',

    // Tabs
    'B1001': 'Tabs',
    'Tabs': 'Tabs',

    // Stats
    'B0801': 'Stats',
    'Stats': 'Stats',

    // Spacer
    'B0901': 'Spacer',
    'Spacer': 'Spacer',

    // Contact
    'B1301': 'ContactForm',
    'Contact': 'ContactForm',
    'ContactForm': 'ContactForm',

    // Footer
    'B1401': 'Footer',
    'Footer': 'Footer',

    // Badges
    'B1501': 'Badges',
    'Badges': 'Badges',

    // Preview
    'B1601': 'Preview',
    'B1602': 'Preview',
    'Preview': 'Preview',

    // Methodology
    'B1701': 'Methodology',
    'Methodology': 'Methodology',

    // TechStack
    'B1801': 'TechStack',
    'TechStack': 'TechStack',

    // Features
    'B1901': 'FeaturedProject',
    'FeaturedProject': 'FeaturedProject',

    'B1902': 'ProjectsGrid',
    'ProjectsGrid': 'ProjectsGrid',

    'B1903': 'CodeShowcase',
    'CodeShowcase': 'CodeShowcase',

    // Logos
    'B2101': 'Logos',
    'Logos': 'Logos',

    // Testimonials / Reviews / Radar ??
    'B2201': 'Testimonials',
    'B2202': 'Testimonials',
    'Reviews': 'Testimonials',
    'Testimonials': 'Testimonials',
    'RadarChart': 'RadarChart', // Points to Testimonials component via BLOCKS above

    // Social
    'B2401': 'SocialDock',
    'Socials': 'SocialDock',
    'SocialDock': 'SocialDock',
};

export const resolveBlock = (type: string) => {
    const key = BLOCK_MAPPING[type];
    return key ? BLOCKS[key] : null;
};
