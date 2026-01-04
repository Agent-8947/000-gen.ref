
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useStore } from '../store';
import { Ban, X } from 'lucide-react';

// --- Helper: Debounce ---
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

// --- Scrubber ---
export const Scrubber: React.FC<{ label: string; value: string; min?: number; max?: number; onChange: (val: string) => void }> = React.memo(({ label, value, min = 0, max = 100, onChange }) => {
    const [isDragging, setIsDragging] = useState(false);
    const startX = useRef(0);
    const startY = useRef(0);
    const startVal = useRef(0);
    const rafRef = useRef<number | null>(null);
    const [localVal, setLocalVal] = useState(value);

    useEffect(() => {
        if (!isDragging) {
            setLocalVal(value);
        }
    }, [value, isDragging]);

    const handleCommit = () => {
        let val = parseFloat(localVal);
        if (isNaN(val)) val = parseFloat(value) || 0;
        const clamped = Math.max(min, Math.min(max, val)).toFixed(2);
        onChange(clamped);
        setLocalVal(clamped);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        startX.current = e.clientX;
        startY.current = e.clientY;
        startVal.current = parseFloat(value) || 0;
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'all-scroll';
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            const deltaX = e.clientX - startX.current;
            const deltaY = startY.current - e.clientY;
            const totalDelta = deltaX + deltaY;
            const sensitivity = 0.2;
            const newVal = Math.max(min, Math.min(max, startVal.current + totalDelta * sensitivity));
            const formattedVal = newVal.toFixed(2);

            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => {
                onChange(formattedVal);
                setLocalVal(formattedVal);
            });
        };
        const handleMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
                document.body.style.userSelect = '';
                document.body.style.cursor = '';
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [value, min, max, onChange, isDragging]);

    return (
        <div className={`flex items-center justify-between py-4 group/row transition-all ${isDragging ? 'relative z-[100] scale-[1.02]' : 'z-0'}`}>
            <div className="flex flex-col">
                <span className="text-xs font-medium tracking-tight opacity-50 group-hover/row:opacity-100 transition-opacity">
                    {label}
                </span>
            </div>
            <div className="flex items-center gap-3 transition-colors">
                <input
                    className="bg-transparent border-none outline-none text-right font-mono text-sm w-[60px] focus:text-blue-500 placeholder:opacity-20 transition-colors"
                    value={localVal}
                    onChange={(e) => setLocalVal(e.target.value)}
                    onBlur={handleCommit}
                    onKeyDown={(e) => e.key === 'Enter' && handleCommit()}
                    onMouseDown={(e) => e.stopPropagation()}
                    style={{ color: isDragging ? useStore.getState().uiTheme.accents : 'inherit' }}
                />
                <div
                    className="flex items-center gap-3 cursor-all-scroll group/scrub"
                    onMouseDown={handleMouseDown}
                >
                    <div className="w-20 h-[1px] bg-current opacity-20 relative group-hover/scrub:opacity-40 transition-opacity">
                        <div
                            className={`absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 bg-current rounded-full transition-shadow ${isDragging ? '' : 'transition-all duration-300 ease-out'}`}
                            style={{
                                left: `${((parseFloat(value) || 0) - min) / Math.max(1, (max - min)) * 100}%`,
                                transform: 'translate(-50%, -50%)',
                                color: isDragging ? useStore.getState().uiTheme.accents : undefined,
                                boxShadow: isDragging ? `0 0 10px ${useStore.getState().uiTheme.accents}40` : undefined
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});

// --- TypoControls ---
export const TypoControls: React.FC<{
    label: string;
    typo: any;
    onUpdate: (path: string, val: any) => void;
    basePath: string;
}> = React.memo(({ label, typo, onUpdate, basePath }) => {
    const t = typo || { useGlobal: true, fontSize: '16', fontWeight: '400', letterSpacing: '0', lineHeight: '1.5', uppercase: false };

    return (
        <div className="space-y-1 py-1 mt-2">
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-30 italic">{label} Typo</span>
                <div className="flex items-center gap-2">
                    <span className="text-xs opacity-40 uppercase tracking-widest font-mono">Use Global</span>
                    <button
                        onClick={() => onUpdate(`${basePath}.useGlobal`, !t.useGlobal)}
                        className={`w-7 h-3.5 rounded-full transition-colors relative ${t.useGlobal ? 'bg-blue-500' : 'bg-gray-300'}`}
                    >
                        <div className={`absolute top-0.5 left-0.5 w-2.5 h-2.5 bg-white rounded-full transition-transform ${t.useGlobal ? 'translate-x-3.5' : ''}`} />
                    </button>
                </div>
            </div>

            <div className={`space-y-0 transition-opacity duration-300 ${t.useGlobal ? 'opacity-30 grayscale pointer-events-none' : 'opacity-100'}`}>
                <div className={!t.useGlobal ? "text-blue-500" : ""}>
                    <Scrubber label="Font Size" value={t.fontSize || '16'} min={8} max={120} onChange={(v) => onUpdate(`${basePath}.fontSize`, v)} />
                    <Scrubber label="Weight" value={t.fontWeight || '400'} min={100} max={900} onChange={(v) => onUpdate(`${basePath}.fontWeight`, Math.round(parseFloat(v)).toString())} />
                    <Scrubber label="Tracking" value={t.letterSpacing || '0'} min={-1} max={5} onChange={(v) => onUpdate(`${basePath}.letterSpacing`, v)} />
                    <Scrubber label="Line H." value={t.lineHeight || '1.5'} min={0.5} max={3} onChange={(v) => onUpdate(`${basePath}.lineHeight`, v)} />
                    <div className="flex items-center justify-between py-2">
                        <span className="text-[10px] font-medium opacity-50 uppercase tracking-widest">Uppercase</span>
                        <button
                            onClick={() => onUpdate(`${basePath}.uppercase`, !t.uppercase)}
                            className={`w-7 h-3.5 rounded-full transition-colors relative ${t.uppercase ? 'bg-blue-500' : 'bg-gray-300'}`}
                        >
                            <div className={`absolute top-0.5 left-0.5 w-2.5 h-2.5 bg-white rounded-full transition-transform ${t.uppercase ? 'translate-x-3.5' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

// --- ColorPicker ---
export const ColorPicker: React.FC<{
    label: string;
    value: string | null | undefined;
    defaultValue: string;
    onChange: (val: string | null) => void;
}> = React.memo(({ label, value, defaultValue, onChange }) => {
    const isInherited = value === null || value === undefined;
    const displayColor = isInherited ? defaultValue : value;

    // Helper to get hex and alpha from various formats
    const parseColor = (c: string = '#ffffff') => {
        let hex = '#ffffff';
        let alpha = 1;

        if (c.startsWith('#')) {
            hex = c.slice(0, 7);
            if (c.length === 9) {
                // Hex with alpha #RRGGBBAA
                const aHex = c.slice(7, 9);
                alpha = parseInt(aHex, 16) / 255;
            }
        } else if (c.startsWith('rgba')) {
            const parts = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
            if (parts) {
                const r = parseInt(parts[1]).toString(16).padStart(2, '0');
                const g = parseInt(parts[2]).toString(16).padStart(2, '0');
                const b = parseInt(parts[3]).toString(16).padStart(2, '0');
                hex = `#${r}${g}${b}`;
                alpha = parts[4] ? parseFloat(parts[4]) : 1;
            }
        }
        return { hex, alpha };
    };

    const { hex: parsedHex, alpha: parsedAlpha } = parseColor(displayColor);

    const [localHex, setLocalHex] = useState(parsedHex);
    const [localAlpha, setLocalAlpha] = useState(parsedAlpha);

    // Sync from props if prop value changes externally
    useEffect(() => {
        const { hex, alpha } = parseColor(displayColor);
        setLocalHex(hex);
        setLocalAlpha(alpha);
    }, [displayColor]);

    // Debounced update
    const debouncedHex = useDebounce(localHex, 50);
    const debouncedAlpha = useDebounce(localAlpha, 50);

    // Trigger onChange when debounced values change
    useEffect(() => {
        // Only update if it differs from current prop to avoid loops
        const { hex: currentHex, alpha: currentAlpha } = parseColor(displayColor);
        if (!isInherited && (debouncedHex !== currentHex || debouncedAlpha !== currentAlpha)) {
            const r = parseInt(debouncedHex.slice(1, 3), 16);
            const g = parseInt(debouncedHex.slice(3, 5), 16);
            const b = parseInt(debouncedHex.slice(5, 7), 16);
            onChange(`rgba(${r},${g},${b},${debouncedAlpha.toFixed(2)})`);
        }
    }, [debouncedHex, debouncedAlpha]);


    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalHex(e.target.value);
        if (isInherited) onChange(e.target.value); // Break inheritance immediately
    };

    const handleAlphaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalAlpha(parseFloat(e.target.value));
        if (isInherited) onChange(parsedHex); // Break inheritance
    }

    return (
        <div className="flex flex-col gap-2 py-2 group/color">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium opacity-50 group-hover/color:opacity-100 transition-opacity">{label}</span>
                <div className="flex items-center gap-3">
                    <div className="relative flex items-center gap-2">
                        {!isInherited && (
                            <button
                                onClick={() => onChange(null)}
                                className="p-1 hover:text-red-500 opacity-30 hover:opacity-100 transition-opacity"
                                title="Reset to Global"
                            >
                                <Ban size={14} />
                            </button>
                        )}
                        <div className="relative">
                            <input
                                type="color"
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                value={localHex}
                                onChange={handleHexChange}
                            />
                            <div
                                className={`w-6 h-6 rounded-full border border-black/10 flex items-center justify-center overflow-hidden transition-all ${isInherited ? 'opacity-40 grayscale' : 'shadow-sm'}`}
                                style={{ backgroundColor: displayColor || 'transparent' }}
                            >
                                {isInherited && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-full h-[1px] bg-red-500/40 rotate-45" />
                                    </div>
                                )}
                            </div>
                        </div>
                        {isInherited && (
                            <span className="text-[10px] font-mono opacity-20 uppercase tracking-tighter">Auto</span>
                        )}
                    </div>
                </div>
            </div>

            {!isInherited && (
                <div className="flex items-center gap-2 px-1">
                    <span className="text-[9px] font-mono opacity-30 uppercase">OPACITY</span>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={localAlpha}
                        onChange={handleAlphaChange}
                        className="flex-1 h-1 bg-black/5 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                    />
                    <span className="text-[9px] font-mono opacity-50 w-6 text-right">{Math.round(localAlpha * 100)}%</span>
                </div>
            )}
        </div>
    );
});

// --- TextInput ---
export const TextInput: React.FC<{
    value: string;
    placeholder?: string;
    onChange: (val: string) => void;
    className?: string;
}> = React.memo(({ value, placeholder, onChange, className }) => {
    const [localVal, setLocalVal] = useState(value);

    useEffect(() => {
        setLocalVal(value);
    }, [value]);

    return (
        <input
            className={className}
            placeholder={placeholder}
            value={localVal || ''}
            onChange={(e) => setLocalVal(e.target.value)}
            onBlur={() => onChange(localVal)}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
        />
    );
});

// --- ControlGroup (New) ---
export const ControlGroup: React.FC<{
    title: string;
    action?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}> = React.memo(({ title, action, children, className = "space-y-4" }) => {
    return (
        <div className={className}>
            <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">{title}</label>
                {action}
            </div>
            {children}
        </div>
    );
});
