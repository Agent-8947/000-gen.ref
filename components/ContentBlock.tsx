import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { resolveBlock } from '../utils/blockRegistry';
import { translateData } from '../utils/withTranslation';

// Loading Skeleton
const BlockSkeleton = () => (
    <div className="w-full h-32 bg-gray-100/5 animate-pulse rounded-lg border border-white/5 mx-auto max-w-4xl my-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-100%] animate-[shimmer_1.5s_infinite]" />
    </div>
);

export const ContentBlock: React.FC<{ id: string, type: string, localOverrides: any }> = ({ id, type, localOverrides }) => {
    const { setSelectedBlock, selectedBlockId, uiTheme, globalSettings, currentLanguage } = useStore();
    const isSelected = selectedBlockId === id;

    const gPattern = globalSettings.GL02.params[7]?.value || 'None';
    const activePattern = localOverrides.style?.backgroundPattern || gPattern;

    const BlockComponent = resolveBlock(type);

    const isNavbar = type === 'B0101' || type === 'B0102' || type === 'Navbar';
    const stickySetting = localOverrides.data?.stickyLogic === 'true' || globalSettings['GL11']?.params[0]?.value === 'true';
    const isSticky = isNavbar && stickySetting;

    // Translate data for current language
    const translatedOverrides = {
        ...localOverrides,
        data: translateData(localOverrides?.data, currentLanguage)
    };

    // Debug: log translation (detailed)
    console.log(`[Translation Debug] Block ${type} (${id.slice(0, 8)}):`, {
        currentLanguage,
        hasData: !!localOverrides?.data,
        originalData: localOverrides?.data,
        translatedData: translatedOverrides?.data,
        dataKeys: localOverrides?.data ? Object.keys(localOverrides.data) : []
    });

    return (
        <motion.div
            id={id}
            onDoubleClick={(e) => {
                e.stopPropagation();
                setSelectedBlock(isSelected ? null : id);
            }}
            initial={false}
            animate={{
                zIndex: isSticky ? 1000 : (isSelected ? 20 : 0)
            }}
            transition={{ duration: 0.2 }}
            style={{
                position: isSticky ? 'sticky' : 'relative',
                top: isSticky ? 0 : undefined,
                color: localOverrides.style?.textColor,
                backgroundColor: localOverrides.background?.lockBackground && localOverrides.background?.fixedColor
                    ? localOverrides.background.fixedColor
                    : (localOverrides.style?.bgFill || localOverrides.style?.background || localOverrides.style?.backgroundColor || 'transparent')
            }}
            className={`relative group cursor-pointer transition-all duration-300
                ${isSelected ? 'shadow-[0_20px_50px_rgba(0,0,0,0.1)] scale-[1.002]' : 'hover:ring-1 hover:ring-black/5'}
            `}
        >
            {/* Pattern Overlay */}
            {activePattern !== 'None' && (
                <div className={`dna-pattern pattern-${activePattern.toLowerCase()}`} />
            )}

            {/* Component Render */}
            <Suspense fallback={<BlockSkeleton />}>
                {BlockComponent ? (
                    <BlockComponent id={id} type={type} localOverrides={translatedOverrides} currentLang={currentLanguage} />
                ) : (
                    <div className="p-12 border-4 border-dashed border-red-500 bg-red-500/10 text-center flex flex-col items-center gap-4">
                        <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center font-black animate-pulse">!</div>
                        <div className="space-y-1">
                            <div className="text-red-600 font-black text-xs uppercase tracking-[0.3em]">Lost Node Detected</div>
                            <div className="text-[10px] font-mono opacity-50">TYPE: {type} | ID: {id.slice(0, 8)}</div>
                        </div>
                    </div>
                )}
            </Suspense>

            {/* Selection Highlight & Structural Frame */}
            <AnimatePresence>
                {isSelected && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="absolute -inset-[2px] pointer-events-none rounded-sm z-[100]"
                        style={{
                            border: `2px solid ${uiTheme.accents}`,
                            boxShadow: `0 0 40px ${uiTheme.accents}20`
                        }}
                    >
                        {/* Pulse Effect */}
                        <motion.div
                            className="absolute inset-0 border-2"
                            style={{ borderColor: uiTheme.accents }}
                            animate={{
                                scale: [1, 1.05, 1],
                                opacity: [0.5, 0, 0.5]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};