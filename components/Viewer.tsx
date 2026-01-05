import React, { Suspense, useEffect } from 'react';
import { useStore } from '../store';
import { resolveBlock } from '../utils/blockRegistry';
import { translateData } from '../utils/withTranslation';

/**
 * Viewer Component - Production/Read-only Mode
 * 
 * This component renders the site in production mode without any editor UI.
 * It's used when the app is deployed to Vercel or when ?mode=view is in URL.
 * 
 * Features:
 * - No editor controls (no DndContext, no selection, no hover frames)
 * - Pure content rendering
 * - Uses same CSS variables as editor mode
 * - Responsive and optimized for production
 */
export const Viewer: React.FC = () => {
    const {
        contentBlocks,
        uiTheme,
        globalSettings,
        currentLanguage
    } = useStore();

    // Sync CSS variables from global settings
    useEffect(() => {
        const root = document.documentElement;

        // GL01: Typography
        const gl01 = globalSettings['GL01']?.params || [];
        const fontName = gl01[7]?.value || 'Inter';
        const baseSize = gl01[0]?.value || '16';

        const fontMapping: Record<string, string> = {
            'Code': "'JetBrains Mono', monospace",
            'Google Sans': "'Google Sans', 'Product Sans', sans-serif",
            'Share Tech': "'Share Tech', sans-serif",
            'Orbitron': "'Orbitron', sans-serif",
            'Agency': "'Agency FB', sans-serif",
            'Ancorli': "'Ancorli', sans-serif",
            'Lilex': "'Lilex', monospace"
        };

        const fontFamily = fontMapping[fontName] || `'${fontName}', sans-serif`;
        root.style.setProperty('--dna-font-family', fontFamily);
        root.style.setProperty('--dna-unit', `${baseSize}px`);

        // GL02: Colors
        const gl02 = globalSettings['GL02']?.params || [];
        root.style.setProperty('--dna-bg', gl02[0]?.value || '#09090B');
        root.style.setProperty('--dna-surface', gl02[1]?.value || '#18181B');
        root.style.setProperty('--dna-accent', gl02[2]?.value || '#3B82F6');
        root.style.setProperty('--dna-text-prim', gl02[3]?.value || '#FFFFFF');
        root.style.setProperty('--dna-text-sec', gl02[4]?.value || '#A1A1AA');
        root.style.setProperty('--dna-border', gl02[5]?.value || '#27272A');

        // GL02: Pattern
        const patternOpacity = (parseFloat(gl02[8]?.value || '10') / 100).toString();
        const patternSize = `${gl02[9]?.value || '20'}px`;
        root.style.setProperty('--dna-pattern-opacity', patternOpacity);
        root.style.setProperty('--dna-pattern-size', patternSize);
        root.style.setProperty('--dna-pattern-color', gl02[3]?.value || '#FFFFFF');

        // GL07: Radius
        const gl07 = globalSettings['GL07']?.params || [];
        root.style.setProperty('--dna-radius', `${gl07[0]?.value || '8'}px`);

        // GL10: Theme Mode
        const siteTheme = globalSettings['GL10']?.params[6]?.value || 'Dark';
        root.setAttribute('data-theme', siteTheme.toLowerCase());

        // UI Scale (for production, use 100%)
        root.style.setProperty('--ui-scale', '1');
    }, [globalSettings]);

    // Filter visible blocks
    const visibleBlocks = contentBlocks.filter(block => block.isVisible !== false);

    return (
        <main
            className="w-full min-h-screen relative overflow-x-hidden transition-colors duration-500"
            style={{
                backgroundColor: 'var(--dna-bg)',
                color: 'var(--dna-text-prim)',
                fontFamily: 'var(--dna-font-family)'
            }}
        >
            {/* Global Styles for Production */}
            <style>{`
        /* Scrollbar styling */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: var(--dna-border) transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--dna-border);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--dna-accent);
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Selection color */
        ::selection {
          background: var(--dna-accent);
          color: white;
        }

        /* Focus visible for accessibility */
        *:focus-visible {
          outline: 2px solid var(--dna-accent);
          outline-offset: 2px;
        }

        /* Remove all editor-related styles */
        body {
          background-color: var(--dna-bg);
          color: var(--dna-text-prim);
          font-family: var(--dna-font-family);
          margin: 0;
          padding: 0;
        }

        /* Ensure no editor UI elements are visible */
        .editor-only,
        .dnd-context,
        .selection-frame,
        .hover-frame {
          display: none !important;
        }
      `}</style>

            {/* Render blocks */}
            <div className="viewer-content">
                {visibleBlocks.length === 0 ? (
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold mb-4">Welcome</h1>
                            <p className="text-xl opacity-60">No content available yet.</p>
                        </div>
                    </div>
                ) : (
                    visibleBlocks.map((block) => {
                        const BlockComponent = resolveBlock(block.type);

                        if (!BlockComponent) {
                            console.warn(`Block type "${block.type}" not found`);
                            return null;
                        }

                        return (
                            <Suspense
                                key={block.id}
                                fallback={
                                    <div className="w-full h-32 flex items-center justify-center">
                                        <div className="animate-pulse text-sm opacity-50">
                                            Loading...
                                        </div>
                                    </div>
                                }
                            >
                                <div
                                    style={{
                                        position: (block.type === 'B0101' || block.type === 'B0102') ? 'sticky' : 'relative',
                                        top: (block.type === 'B0101' || block.type === 'B0102') ? 0 : 'auto',
                                        zIndex: (block.type === 'B0101' || block.type === 'B0102') ? 1000 : 'auto'
                                    }}
                                >
                                    <BlockComponent
                                        id={block.id}
                                        type={block.type}
                                        localOverrides={{
                                            ...block.localOverrides,
                                            data: translateData(block.localOverrides?.data, currentLanguage)
                                        }}
                                        currentLang={currentLanguage}
                                        isPreview={false}
                                        isSelected={false}
                                        onSelect={() => { }} // No-op in viewer mode
                                    />
                                </div>
                            </Suspense>
                        );
                    })
                )}
            </div>

            {/* Portal root for modals/overlays */}
            <div id="portal-root" className="fixed inset-0 pointer-events-none z-[9999]" />
        </main>
    );
};
