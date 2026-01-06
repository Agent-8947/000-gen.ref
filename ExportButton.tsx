import React from 'react';
import { handleExportProject } from './exportSystem';

/**
 * Export Button Component
 * Add this to your DataPanel or wherever you want the export functionality
 */
export const ExportButton: React.FC = () => {
    const [isExporting, setIsExporting] = React.useState(false);

    const handleClick = async () => {
        setIsExporting(true);
        try {
            await handleExportProject();
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={isExporting}
            className="export-button"
            style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isExporting ? 'not-allowed' : 'pointer',
                opacity: isExporting ? 0.6 : 1,
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
            }}
        >
            {isExporting ? (
                <>
                    <span className="spinner">⏳</span>
                    <span>Exporting...</span>
                </>
            ) : (
                <>
                    <span>📦</span>
                    <span>Export Project (with i18n)</span>
                </>
            )}
        </button>
    );
};
