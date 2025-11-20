import React, { useState } from 'react';
import { useWhiteboard } from '../context/WhiteboardContext';
import { X } from 'lucide-react';

const TextModal = () => {
    const { showTextModal, setShowTextModal, addElement, toolProperties } = useWhiteboard();
    const [text, setText] = useState('');
    const [fontSize, setFontSize] = useState(24);
    const [fontFamily, setFontFamily] = useState('Inter');

    if (!showTextModal) return null;

    const handleInsert = () => {
        if (!text.trim()) return;

        addElement({
            id: Date.now(),
            type: 'text',
            text: text,
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            fontSize: fontSize,
            fontFamily: fontFamily,
            color: toolProperties.color,
            opacity: toolProperties.opacity
        });

        setShowTextModal(false);
        setText('');
    };

    const handleClose = () => {
        setShowTextModal(false);
        setText('');
    };

    const fonts = ['Inter', 'Arial', 'Georgia', 'Courier New', 'Comic Sans MS', 'Times New Roman'];

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
                width: '450px',
                maxWidth: '90vw'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: 600,
                        margin: 0
                    }}>Insert Text</h2>
                    <button
                        onClick={handleClose}
                        className="glass-button"
                        style={{
                            width: '36px',
                            height: '36px',
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Text Input */}
                <div style={{ marginBottom: '16px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: 500
                    }}>
                        Text Content
                    </label>
                    <textarea
                        className="glass-input"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter your text here..."
                        rows={4}
                        autoFocus
                        style={{
                            resize: 'vertical',
                            minHeight: '80px'
                        }}
                    />
                </div>

                {/* Font Family */}
                <div style={{ marginBottom: '16px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: 500
                    }}>
                        Font Family
                    </label>
                    <select
                        className="glass-input"
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                        style={{
                            cursor: 'pointer'
                        }}
                    >
                        {fonts.map(font => (
                            <option key={font} value={font} style={{ background: '#1e1e2e' }}>
                                {font}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Font Size */}
                <div style={{ marginBottom: '24px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: 500
                    }}>
                        Font Size: {fontSize}px
                    </label>
                    <input
                        type="range"
                        min="12"
                        max="72"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        style={{
                            width: '100%',
                            accentColor: 'var(--accent-blue)'
                        }}
                    />
                </div>

                {/* Preview */}
                <div style={{ marginBottom: '24px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: 500
                    }}>
                        Preview
                    </label>
                    <div style={{
                        padding: '20px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        minHeight: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <span style={{
                            fontSize: `${fontSize}px`,
                            fontFamily: fontFamily,
                            color: toolProperties.color,
                            textAlign: 'center'
                        }}>
                            {text || 'Your text here...'}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'flex-end'
                }}>
                    <button
                        onClick={handleClose}
                        className="glass-button"
                        style={{ padding: '10px 20px' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleInsert}
                        className="glass-button active"
                        style={{ padding: '10px 20px' }}
                        disabled={!text.trim()}
                    >
                        Insert Text
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TextModal;
