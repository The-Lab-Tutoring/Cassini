import React from 'react';
import { Trash2 } from 'lucide-react';

const SelectionActionMenu = ({ selectedElements, onDelete, position }) => {
    if (!selectedElements || selectedElements.length === 0) return null;

    return (
        <div
            className="glass"
            style={{
                position: 'absolute',
                left: position.x,
                top: position.y - 60,
                zIndex: 2000,
                padding: '8px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                gap: '4px',
                pointerEvents: 'auto'
            }}
        >
            <button
                className="glass-button"
                onClick={onDelete}
                title="Delete"
                style={{
                    width: '36px',
                    height: '36px',
                    padding: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 45, 85, 0.2)'
                }}
            >
                <Trash2 size={18} />
            </button>
            <div style={{
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.7)',
                padding: '0 8px',
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'nowrap'
            }}>
                {selectedElements.length} selected
            </div>
        </div>
    );
};

export default SelectionActionMenu;
