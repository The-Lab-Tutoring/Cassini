import React from 'react';

import { useWhiteboard } from '../context/WhiteboardContext';

const SelectionIndicator = ({ count }) => {
    const { settings } = useWhiteboard();
    if (count === 0) return null;

    const isLight = settings?.iconTheme === 'light';

    return (
        <div className="glass" style={{
            position: 'fixed',
            bottom: '60px',
            left: '20px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-lg)',
            fontSize: '14px',
            fontWeight: 500,
            color: isLight ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
            background: isLight ? 'rgba(255, 255, 255, 0.9)' : undefined,
            border: isLight ? '1px solid rgba(0,0,0,0.1)' : undefined,
            pointerEvents: 'none',
            animation: 'fadeIn 0.2s ease',
            zIndex: 999
        }}>
            {count} selected
        </div>
    );
};

export default SelectionIndicator;
