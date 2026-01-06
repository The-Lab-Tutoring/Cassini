import React, { useState } from 'react';
import { Package, X, Trash2, Plus, GripVertical } from 'lucide-react';
import { useWhiteboard } from '../context/WhiteboardContext';

const SavedItems = () => {
    const {
        savedItems,
        deleteSavedItem,
        addElement,
        viewport,
        showSavedItemsPanel,
        setShowSavedItemsPanel,
        settings
    } = useWhiteboard();

    const [draggedItem, setDraggedItem] = useState(null);
    const isLight = settings?.iconTheme === 'light';

    if (!showSavedItemsPanel) return null;

    const handleInsert = (item) => {
        if (!item.elements || item.elements.length === 0) {
            setShowSavedItemsPanel(false);
            return;
        }

        // 1. Calculate the bounding box of the saved elements
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        item.elements.forEach(el => {
            const x = el.x;
            const y = el.y;
            // Approximate width/height for strokes if not basic shapes
            const w = el.width || 0;
            const h = el.height || 0;

            // For strokes, we might need more complex logic, but usually x/y/width/height are set
            // If it's a stroke, el.points might be used, but let's assume bounding box properties exist on elements
            // (Standard behavior for this app)

            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x + w);
            maxY = Math.max(maxY, y + h);
        });

        // 2. Calculate center of that group
        const groupCenterX = (minX + maxX) / 2;
        const groupCenterY = (minY + maxY) / 2;

        // 3. Calculate center of current viewport in CANVAS coordinates
        // Viewport x/y is the storage of the top-left offset? Or transform?
        // Usually: screenX = (canvasX + viewport.x) * viewport.scale
        // So: canvasX = (screenX / viewport.scale) - viewport.x
        // Center of screen is (window.innerWidth/2, window.innerHeight/2)
        const viewportCenterX = (window.innerWidth / 2) / viewport.scale - viewport.x;
        const viewportCenterY = (window.innerHeight / 2) / viewport.scale - viewport.y;

        // 4. Calculate delta
        const dx = viewportCenterX - groupCenterX;
        const dy = viewportCenterY - groupCenterY;

        // 5. Apply delta to new elements
        const newElements = item.elements.map(el => ({
            ...el,
            id: Date.now() + Math.random(),
            x: el.x + dx,
            y: el.y + dy
        }));

        newElements.forEach(el => addElement(el));
        setShowSavedItemsPanel(false);
    };

    const handleDragStart = (e, item) => {
        e.dataTransfer.setData('application/json', JSON.stringify({
            type: 'saved-item',
            elements: item.elements
        }));
        setDraggedItem(item);
    };

    return (
        <div style={{
            position: 'fixed',
            top: '80px', // Below toolbar
            right: '20px',
            width: '280px',
            maxHeight: 'calc(100vh - 120px)',
            background: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(30, 30, 30, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: isLight ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            color: isLight ? '#000000' : '#FFFFFF'
        }} className="glass-panel">
            <div style={{
                padding: '16px',
                borderBottom: isLight ? '1px solid rgba(0, 0, 0, 0.05)' : '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Saved Items</h3>
                <button
                    onClick={() => setShowSavedItemsPanel(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: 'inherit' }}
                >
                    <X size={16} opacity={0.5} />
                </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                {savedItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px 16px', opacity: 0.5, fontSize: '13px' }}>
                        <Package size={32} style={{ marginBottom: 8, opacity: 0.5 }} />
                        <p>No saved items yet.</p>
                        <p style={{ fontSize: '11px', marginTop: 4 }}>Select elements and press Shift+S to save.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {savedItems.map(item => (
                            <div
                                key={item.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, item)}
                                style={{
                                    background: isLight ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    border: isLight ? '1px solid rgba(0,0,0,0.05)' : '1px solid rgba(255,255,255,0.05)',
                                    cursor: 'grab'
                                }}
                            >
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    background: isLight ? 'rgba(0, 122, 255, 0.1)' : 'rgba(0, 122, 255, 0.2)',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#007AFF'
                                }}>
                                    <Package size={16} />
                                </div>
                                <div style={{ flex: 1 }} onClick={() => handleInsert(item)}>
                                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{item.name}</div>
                                    <div style={{ fontSize: '11px', opacity: 0.5 }}>{item.elements.length} elements</div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (window.confirm('Delete this saved item?')) deleteSavedItem(item.id);
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        color: '#FF2D55',
                                        opacity: 0.6
                                    }}
                                    className="delete-btn"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedItems;
