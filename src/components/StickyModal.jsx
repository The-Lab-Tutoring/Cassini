import React, { useState, useEffect } from 'react';
import { useWhiteboard } from '../context/WhiteboardContext';
import { X, Trash2 } from 'lucide-react';

const StickyModal = () => {
    const {
        showStickyModal,
        setShowStickyModal,
        selectedElement,
        updateElement,
        deleteElement
    } = useWhiteboard();

    const [text, setText] = useState('');
    const [color, setColor] = useState('#FFEB3B');

    useEffect(() => {
        if (selectedElement && selectedElement.type === 'sticky') {
            setText(selectedElement.text || '');
            setColor(selectedElement.color || '#FFEB3B');
        }
    }, [selectedElement, showStickyModal]);

    if (!showStickyModal || !selectedElement) return null;

    const handleSave = () => {
        updateElement(selectedElement.id, { text, color });
        setShowStickyModal(false);
    };

    const handleDelete = () => {
        deleteElement(selectedElement.id);
        setShowStickyModal(false);
    };

    const stickyColors = [
        '#FFEB3B', // Yellow
        '#FFCDD2', // Red
        '#F8BBD0', // Pink
        '#E1BEE7', // Purple
        '#CCEEFF', // Light Blue
        '#B2DFDB', // Teal
        '#C8E6C9', // Green
        '#FFE0B2', // Orange
    ];

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
        }}>
            <div className="glass-modal" style={{
                width: '400px',
                maxWidth: '90vw',
                background: color,
                color: '#333'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                }}>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>Edit Sticky Note</h2>
                    <button onClick={() => setShowStickyModal(false)} className="glass-button" style={{ color: '#333' }}>
                        <X size={20} />
                    </button>
                </div>

                <textarea
                    autoFocus
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type something..."
                    style={{
                        width: '100%',
                        minHeight: '150px',
                        background: 'rgba(255, 255, 255, 0.3)',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        borderRadius: 'var(--radius-md)',
                        padding: '12px',
                        fontSize: '18px',
                        fontFamily: 'Inter',
                        color: '#333',
                        resize: 'none',
                        outline: 'none',
                        marginBottom: '16px'
                    }}
                />

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                        Color
                    </label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {stickyColors.map(c => (
                            <button
                                key={c}
                                onClick={() => setColor(c)}
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: c,
                                    border: color === c ? '3px solid #333' : '2px solid rgba(0,0,0,0.1)',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            />
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button
                        onClick={handleDelete}
                        className="glass-button"
                        style={{ color: '#d32f2f', background: 'rgba(211, 47, 47, 0.1)' }}
                    >
                        <Trash2 size={18} style={{ marginRight: '8px' }} />
                        Delete
                    </button>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => setShowStickyModal(false)} className="glass-button">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="glass-button active" style={{ background: '#333', color: '#fff' }}>
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StickyModal;
