import React, { useState } from 'react';
import { X, Check, Image as ImageIcon, FileCode, FileText } from 'lucide-react';
import { useWhiteboard } from '../context/WhiteboardContext';
import { drawElement, drawGrid } from '../utils/renderUtils';
import { exportToSVG, downloadSVG } from '../utils/svgExport';
import { exportToPDF } from '../utils/pdfExport';
import { saveWhiteboard } from '../utils/fileUtils';

const ExportModal = ({ onClose }) => {
    const {
        elements,
        selectedElements,
        viewport,
        background,
        settings,
        canvasRef
    } = useWhiteboard();

    const [format, setFormat] = useState('png'); // png, svg, pdf, json
    const [quality, setQuality] = useState(1); // 1, 2, 4
    const [scope, setScope] = useState('canvas'); // canvas, selection, visible
    const [includeBackground, setIncludeBackground] = useState(true);
    const [isExporting, setIsExporting] = useState(false);

    const getElementsToExport = () => {
        if (scope === 'selection') {
            return selectedElements.length > 0 ? selectedElements : elements;
        }
        // For 'visible', we could filter, but for now 'visible' usually means 'viewport area'
        // which applies to the bounds, NOT the elements list (we clip).
        // For 'canvas', we take all.
        return elements.filter(el => el.visible !== false);
    };

    const getExportBounds = (elementsToExport) => {
        if (scope === 'visible') {
            // Visible area logic (screen coordinates transformed to world)
            // But usually users want "what I see on screen".
            // That corresponds to viewport rectangle.
            // Screen (0,0) -> World ( (0-vx)/s, (0-vy)/s )
            const left = -viewport.x / viewport.scale;
            const top = -viewport.y / viewport.scale;
            const width = window.innerWidth / viewport.scale;
            const height = window.innerHeight / viewport.scale;
            return { x: left, y: top, width, height };
        }

        // Calculate bounds of elements
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        if (elementsToExport.length === 0) {
            return { x: 0, y: 0, width: 800, height: 600 }; // Default
        }

        elementsToExport.forEach(el => {
            const x = el.x || (el.points ? Math.min(...el.points.map(p => p.x)) : 0);
            const y = el.y || (el.points ? Math.min(...el.points.map(p => p.y)) : 0);
            const w = el.width || (el.points ? Math.max(...el.points.map(p => p.x)) - x : 0);
            const h = el.height || (el.points ? Math.max(...el.points.map(p => p.y)) - y : 0);
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x + w);
            maxY = Math.max(maxY, y + h);
        });

        // Add padding
        const padding = 50;
        return {
            x: minX - padding,
            y: minY - padding,
            width: (maxX - minX) + padding * 2,
            height: (maxY - minY) + padding * 2
        };
    };

    const handleExport = async () => {
        setIsExporting(true);

        // Wait for UI to update
        await new Promise(resolve => setTimeout(resolve, 50));

        try {
            const elementsToExport = getElementsToExport();
            const bounds = getExportBounds(elementsToExport);
            const filename = `cassini-${settings?.userName?.toLowerCase().replace(/\s+/g, '-') || 'drawing'}-${Date.now()}`;

            if (format === 'json') {
                const data = {
                    version: '1.8.0',
                    name: filename,
                    elements: elementsToExport,
                    background,
                    viewport: scope === 'visible' ? viewport : { x: 0, y: 0, scale: 1 }
                };
                saveWhiteboard(data);
            } else if (format === 'svg') {
                const svgContent = exportToSVG(elementsToExport, includeBackground ? background : { ...background, backgroundColor: 'transparent', gridType: 'none' });
                // Note: exportToSVG utils might need updates to support bounds cropping, but it generates based on elements.
                downloadSVG(svgContent, `${filename}.svg`);
            } else if (format === 'png' || format === 'pdf') {
                const canvas = document.createElement('canvas');
                const scale = quality;
                canvas.width = bounds.width * scale;
                canvas.height = bounds.height * scale;
                const ctx = canvas.getContext('2d');

                // Fill background
                if (includeBackground) {
                    ctx.fillStyle = background.backgroundColor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    if (background.gridType !== 'none') {
                        // Draw grid logic adapted (trickier with offset). 
                        // For simplicity, we might skip grid on export or strictly map it.
                        // renderUtils drawGrid assumes full canvas.
                    }
                } else {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }

                // Scale and Translate
                ctx.scale(scale, scale);
                ctx.translate(-bounds.x, -bounds.y);

                // Determine elements to draw
                // If scope is visible, we check intersection? No, just draw all, browser clips.

                // Helper for loading images
                const imageCache = new Map();
                // We assume images are already loaded in main app? 
                // We should probably share imageCache from context? 
                // Context doesn't expose imageCache ref directly.
                // We can try to rely on browser cache or just re-load.
                // Re-loading is safer for isolation.

                const renderPromises = elementsToExport.map(el => {
                    return new Promise(resolve => {
                        // drawElement is synchronous except for image loading
                        // We need to special case images or handle logic
                        if (el.type === 'image') {
                            const img = new Image();
                            img.crossOrigin = "Anonymous";
                            img.src = el.src;
                            img.onload = () => {
                                ctx.save();
                                if (el.rotation) {
                                    // ... rotation logic duplicated? No, drawElement handles it if passed loaded img
                                    // drawElement expects cache.
                                    // Let's manually populate a cache
                                    imageCache.set(el.src, img);
                                    drawElement(ctx, el, { imageCache });
                                    resolve();
                                }
                                imageCache.set(el.src, img);
                                drawElement(ctx, el, { imageCache });
                                resolve();
                            };
                            img.onerror = resolve;
                        } else {
                            drawElement(ctx, el);
                            resolve();
                        }
                    });
                });

                await Promise.all(renderPromises);

                if (format === 'png') {
                    const link = document.createElement('a');
                    link.download = `${filename}.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                } else {
                    // PDF
                    // Just use the image
                    exportToPDF(canvas, `${filename}.pdf`);
                }
            }
            onClose();
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. See console.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)'
        }} onClick={onClose}>
            <div
                className="glass-panel"
                onClick={e => e.stopPropagation()}
                style={{
                    width: '500px',
                    padding: '24px',
                    borderRadius: '24px',
                    background: '#1a1a1a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white',
                    fontFamily: 'Inter, sans-serif'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>Export</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                        <X size={20} />
                    </button>
                </div>

                {/* Format Selection */}
                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>FORMAT</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {['png', 'svg', 'pdf', 'json'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFormat(f)}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '12px',
                                    border: format === f ? '1px solid #007AFF' : '1px solid rgba(255,255,255,0.1)',
                                    background: format === f ? 'rgba(0, 122, 255, 0.1)' : 'rgba(255,255,255,0.05)',
                                    color: format === f ? '#007AFF' : 'white',
                                    cursor: 'pointer',
                                    fontWeight: 500,
                                    textTransform: 'uppercase',
                                    fontSize: '13px'
                                }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Quality (PNG/PDF only) */}
                {(format === 'png' || format === 'pdf') && (
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>QUALITY</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {[
                                { label: 'Standard', value: 1, sub: '1x' },
                                { label: 'High', value: 2, sub: '2x' },
                                { label: '4K', value: 4, sub: '4x' }
                            ].map(q => (
                                <button
                                    key={q.value}
                                    onClick={() => setQuality(q.value)}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '12px',
                                        border: quality === q.value ? '1px solid #007AFF' : '1px solid rgba(255,255,255,0.1)',
                                        background: quality === q.value ? 'rgba(0, 122, 255, 0.1)' : 'rgba(255,255,255,0.05)',
                                        color: quality === q.value ? '#007AFF' : 'white',
                                        cursor: 'pointer',
                                        textAlign: 'center'
                                    }}
                                >
                                    <div style={{ fontSize: '14px', fontWeight: 500 }}>{q.label}</div>
                                    <div style={{ fontSize: '11px', opacity: 0.5 }}>{q.sub}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Scope */}
                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>SCOPE</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {[
                            { id: 'canvas', label: 'Entire Canvas' },
                            { id: 'selection', label: 'Selection Only', disabled: selectedElements.length === 0 },
                            { id: 'visible', label: 'Visible Area' }
                        ].map(s => (
                            <label
                                key={s.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    background: 'rgba(255,255,255,0.03)',
                                    cursor: s.disabled ? 'not-allowed' : 'pointer',
                                    opacity: s.disabled ? 0.5 : 1
                                }}
                            >
                                <input
                                    type="radio"
                                    name="scope"
                                    checked={scope === s.id}
                                    onChange={() => setScope(s.id)}
                                    disabled={s.disabled}
                                    style={{ accentColor: '#007AFF' }}
                                />
                                <span style={{ fontSize: '14px' }}>{s.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Options */}
                <div style={{ marginBottom: '32px' }}>
                    <label
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer',
                            userSelect: 'none'
                        }}
                    >
                        <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '6px',
                            border: includeBackground ? 'none' : '2px solid rgba(255,255,255,0.2)',
                            background: includeBackground ? '#007AFF' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {includeBackground && <Check size={14} color="white" />}
                        </div>
                        <input
                            type="checkbox"
                            checked={includeBackground}
                            onChange={e => setIncludeBackground(e.target.checked)}
                            style={{ display: 'none' }}
                        />
                        <span style={{ fontSize: '14px' }}>Include Background</span>
                    </label>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '16px',
                            borderRadius: '12px',
                            border: 'none',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 500
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        style={{
                            flex: 2,
                            padding: '16px',
                            borderRadius: '12px',
                            border: 'none',
                            background: '#007AFF',
                            color: 'white',
                            cursor: isExporting ? 'wait' : 'pointer',
                            fontSize: '14px',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        {isExporting ? 'Exporting...' : 'Export'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ExportModal;
