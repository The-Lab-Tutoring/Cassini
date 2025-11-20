import React, { useState } from 'react';
import { useWhiteboard } from '../context/WhiteboardContext';
import { X } from 'lucide-react';
import { renderLatexToHtml, latexToCanvasImage } from '../utils/katexRenderer';

const EquationModal = () => {
    const { showEquationModal, setShowEquationModal, addElement, toolProperties } = useWhiteboard();
    const [latex, setLatex] = useState('');
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(null);

    if (!showEquationModal) return null;

    const handleLatexChange = (value) => {
        setLatex(value);

        // Real-time preview
        const result = renderLatexToHtml(value);
        if (result.success) {
            setPreview(result.html);
            setError(null);
        } else {
            setPreview(null);
            setError(result.error);
        }
    };

    const handleInsert = async () => {
        if (!latex.trim()) {
            setError('Please enter a valid equation');
            return;
        }

        try {
            // Convert LaTeX to get dimensions
            const result = await latexToCanvasImage(
                latex,
                toolProperties.fontSize || 24,
                toolProperties.color
            );

            // Add equation element to canvas
            addElement({
                id: Date.now(),
                type: 'equation',
                latex: result.latex,
                html: result.html,
                x: window.innerWidth / 2 - result.width / 2,
                y: window.innerHeight / 2 - result.height / 2,
                width: result.width,
                height: result.height,
                fontSize: result.fontSize,
                color: result.color,
                opacity: toolProperties.opacity
            });

            // Close modal and reset
            setShowEquationModal(false);
            setLatex('');
            setPreview(null);
            setError(null);
        } catch (err) {
            setError(`Failed to render equation: ${err.message}`);
        }
    };

    const handleClose = () => {
        setShowEquationModal(false);
        setLatex('');
        setPreview(null);
        setError(null);
    };

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
                width: '500px',
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
                    }}>Insert Equation</h2>
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

                {/* Instructions */}
                <div style={{
                    marginBottom: '16px',
                    padding: '12px',
                    background: 'rgba(0, 122, 255, 0.1)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(0, 122, 255, 0.3)'
                }}>
                    <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5' }}>
                        Enter LaTeX notation. Examples:<br />
                        Math: <code>E = mc^2</code> or <code>\frac{'{a}{b}'}</code><br />
                        Chemistry: <code>\ce{'{H2O}'}</code> or <code>\ce{'{CO2 + H2O -> H2CO3}'}</code>
                    </p>
                </div>

                {/* Input */}
                <div style={{ marginBottom: '16px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: 500
                    }}>
                        LaTeX Input
                    </label>
                    <input
                        type="text"
                        className="glass-input"
                        value={latex}
                        onChange={(e) => handleLatexChange(e.target.value)}
                        placeholder="E.g., E = mc^2 or \ce{H2O}"
                        autoFocus
                    />
                </div>

                {/* Preview */}
                <div style={{ marginBottom: '16px' }}>
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
                        {preview ? (
                            <div dangerouslySetInnerHTML={{ __html: preview }} />
                        ) : error ? (
                            <span style={{ color: '#ff6b6b', fontSize: '13px' }}>{error}</span>
                        ) : (
                            <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '13px' }}>
                                Preview will appear here...
                            </span>
                        )}
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
                        disabled={!preview}
                    >
                        Insert Equation
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EquationModal;
