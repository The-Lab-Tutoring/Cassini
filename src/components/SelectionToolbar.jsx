import React from 'react';
import {
    Trash2,
    AlignLeft,
    AlignCenterHorizontal,
    AlignRight,
    AlignStartVertical,
    AlignCenterVertical,
    AlignEndVertical,
    ArrowUpToLine,
    ArrowDownToLine,
    Layers,
    GripHorizontal,
    GripVertical,
    Type,
    Package
} from 'lucide-react';
import { useWhiteboard } from '../context/WhiteboardContext';

const SelectionToolbar = ({ selectedElements, onDelete, onUpdateElements, onOCR, enableOCR }) => {
    const {
        saveSelectionAsItem,
        setShowSavedItemsPanel,
        alignElements,
        distributeElements,
        reorderElements,
        settings
    } = useWhiteboard();

    if (!selectedElements || selectedElements.length === 0) return null;

    const isLight = settings?.iconTheme === 'light';

    // Theme-aware styles
    const textColor = isLight ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)';
    const labelColor = isLight ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)';
    const dividerColor = isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)';
    const panelBg = isLight ? 'rgba(255, 255, 255, 0.85)' : undefined; // Default glass for dark
    const panelBorder = isLight ? '1px solid rgba(0, 0, 0, 0.1)' : undefined;

    const showAlignTools = selectedElements.length > 1;
    const showDistributeTools = selectedElements.length > 2;

    return (
        <div
            className="glass"
            style={{
                position: 'fixed',
                bottom: '80px',
                right: '20px',
                zIndex: 2000,
                padding: '12px 16px',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                minWidth: '200px',
                pointerEvents: 'auto',
                background: panelBg,
                border: panelBorder,
                color: textColor
            }}
        >
            {/* Header with count */}
            <div style={{
                fontSize: '12px',
                color: textColor,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <Layers size={14} />
                {selectedElements.length} element{selectedElements.length !== 1 ? 's' : ''} selected
            </div>

            {/* Alignment Tools - only show when multiple selected */}
            {showAlignTools && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '10px', color: labelColor, textTransform: 'uppercase' }}>
                        Align
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <ToolButton onClick={() => alignElements(selectedElements, 'left')} title="Align Left">
                            <AlignLeft size={16} />
                        </ToolButton>
                        <ToolButton onClick={() => alignElements(selectedElements, 'centerH')} title="Align Center">
                            <AlignCenterHorizontal size={16} />
                        </ToolButton>
                        <ToolButton onClick={() => alignElements(selectedElements, 'right')} title="Align Right">
                            <AlignRight size={16} />
                        </ToolButton>
                        <div style={{ width: '1px', background: dividerColor, margin: '0 4px' }} />
                        <ToolButton onClick={() => alignElements(selectedElements, 'top')} title="Align Top">
                            <AlignStartVertical size={16} />
                        </ToolButton>
                        <ToolButton onClick={() => alignElements(selectedElements, 'centerV')} title="Align Middle">
                            <AlignCenterVertical size={16} />
                        </ToolButton>
                        <ToolButton onClick={() => alignElements(selectedElements, 'bottom')} title="Align Bottom">
                            <AlignEndVertical size={16} />
                        </ToolButton>
                    </div>
                </div>
            )}

            {/* Distribute Tools - only show when 3+ selected */}
            {showDistributeTools && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '10px', color: labelColor, textTransform: 'uppercase' }}>
                        Distribute
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <ToolButton onClick={() => distributeElements(selectedElements, 'horizontal')} title="Distribute Horizontally">
                            <GripHorizontal size={16} />
                        </ToolButton>
                        <ToolButton onClick={() => distributeElements(selectedElements, 'vertical')} title="Distribute Vertically">
                            <GripVertical size={16} />
                        </ToolButton>
                    </div>
                </div>
            )}

            {/* Z-Order Tools */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '10px', color: labelColor, textTransform: 'uppercase' }}>
                    Order
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                    <ToolButton onClick={() => reorderElements(selectedElements, 'front')} title="Bring to Front">
                        <ArrowUpToLine size={16} />
                    </ToolButton>
                    <ToolButton onClick={() => reorderElements(selectedElements, 'back')} title="Send to Back">
                        <ArrowDownToLine size={16} />
                    </ToolButton>
                </div>
            </div>

            {/* Actions Section */}
            {selectedElements.some(el => el.type === 'stroke') && enableOCR && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '10px', color: labelColor, textTransform: 'uppercase' }}>
                        Intelligence
                    </div>
                    <button
                        className="glass-button"
                        onClick={onOCR}
                        style={{
                            width: '100%',
                            padding: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            background: 'rgba(52, 199, 89, 0.2)',
                            color: '#34C759',
                            fontWeight: 500,
                            fontSize: '13px',
                            marginBottom: '8px'
                        }}
                    >
                        <Type size={16} />
                        Convert to Text
                    </button>
                </div>
            )}

            {/* Save for Later Button */}
            <button
                className="glass-button"
                onClick={() => {
                    const name = window.prompt('Name this group:', 'Saved Item');
                    if (name) {
                        saveSelectionAsItem(selectedElements, name);
                        setShowSavedItemsPanel(true);
                    }
                }}
                title="Save for Later (Shift+S)"
                style={{
                    width: '100%',
                    padding: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: 'rgba(0, 122, 255, 0.1)',
                    color: '#007AFF',
                    fontWeight: 500,
                    fontSize: '13px',
                    marginBottom: '8px'
                }}
            >
                <Package size={16} />
                Save
            </button>

            {/* Delete Button */}
            <button
                className="glass-button"
                onClick={onDelete}
                title="Delete Selected"
                style={{
                    width: '100%',
                    padding: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: 'rgba(255, 45, 85, 0.2)',
                    color: '#FF2D55',
                    fontWeight: 500,
                    fontSize: '13px'
                }}
            >
                <Trash2 size={16} />
                Delete
            </button>
        </div>
    );
};

// Helper component for tool buttons
const ToolButton = ({ children, onClick, title, active }) => (
    <button
        className="glass-button"
        onClick={onClick}
        title={title}
        style={{
            width: '32px',
            height: '32px',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: active ? 'rgba(0, 122, 255, 0.3)' : 'transparent',
            color: 'inherit'
        }}
    >
        {children}
    </button>
);

export default SelectionToolbar;
