import React, { useState, useEffect } from 'react';
import { useWhiteboard } from '../context/WhiteboardContext';
import {
    Pen,
    Eraser,
    MousePointer,
    Ruler,
    Circle as CircleIcon,
    Type,
    Undo,
    Redo,
    Trash2,
    ChevronUp,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Square,
    Circle,
    Minus,
    ArrowRight,
    Download,
    Upload,
    Grid,
    Palette,
    Settings2,
    Shapes,
    FileText,
    Save,
    FolderOpen,
    FilePlus,
    Eye,
    Image as ImageIcon,
    Box,
    StickyNote,
    Layout
} from 'lucide-react';
import { saveWhiteboard, loadWhiteboard } from '../utils/fileUtils';

const Toolbar = () => {
    const {
        activeTool,
        setActiveTool,
        toolProperties,
        updateToolProperty,
        undo,
        redo,
        clearCanvas,
        setShowTextModal,
        exportCanvasPNG,
        exportCanvasSVG,
        exportCanvasPDF,
        importImage,
        setShowBackgroundModal,
        elements,
        background,
        viewport,
        setElements,
        updateBackground,
        setViewport,
        activeCategory,
        setActiveCategory,
        setShowSettingsSidebar,
        setShowStickyModal,
        setShowFrameModal,
        settings,
        updateSettings
    } = useWhiteboard();

    const [isCollapsed, setIsCollapsed] = useState(false);
    const isLight = settings.iconTheme === 'light';

    // Responsive sizing
    const [uiScale, setUiScale] = useState(1);

    useEffect(() => {
        const updateScale = () => {
            const width = window.innerWidth;
            if (width < 640) setUiScale(0.75);
            else if (width < 1024) setUiScale(0.9);
            else setUiScale(1);
        };
        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, []);

    const baseSize = 40 * uiScale;
    const iconSize = 20 * uiScale;
    const smallIconSize = 16 * uiScale;

    const drawingTools = [
        { id: 'pen', icon: Pen, label: 'Pen' },
        { id: 'eraser', icon: Eraser, label: 'Eraser' },
        { id: 'select', icon: MousePointer, label: 'Select' },
    ];

    const shapeTools = [
        { id: 'rectangle', icon: Square, label: 'Rectangle' },
        { id: 'circle', icon: Circle, label: 'Circle' },
        { id: 'line', icon: Minus, label: 'Line' },
        { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
        { id: 'text', icon: Type, label: 'Text', action: () => setShowTextModal(true) },
    ];

    const measureTools = [
        { id: 'ruler', icon: Ruler, label: 'Ruler' },
        { id: 'protractor', icon: CircleIcon, label: 'Protractor' },
    ];

    const organizeTools = [
        { id: 'sticky', icon: StickyNote, label: 'Sticky Note' },
        { id: 'frame', icon: Layout, label: 'Frame' },
    ];

    const colors = [
        '#007AFF', '#34C759', '#FF2D55', '#FF9500', '#BF5AF2',
        '#FFFFFF', '#000000', '#8E8E93'
    ];

    const handleToolClick = (tool) => {
        if (tool.action) {
            tool.action();
        } else {
            setActiveTool(tool.id);
        }
    };

    const ToolButton = ({ tool, size = baseSize }) => {
        const Icon = tool.icon;
        const isLight = settings.iconTheme === 'light';
        return (
            <button
                className={`glass-button ${activeTool === tool.id ? 'active' : ''} ${isLight ? 'light-icons' : ''}`}
                onClick={() => handleToolClick(tool)}
                title={tool.label}
                style={{
                    width: size,
                    height: size,
                    padding: size * 0.2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Icon size={iconSize} />
            </button>
        );
    };

    const TextToolButton = ({ tool }) => {
        const isLight = settings.iconTheme === 'light';
        return (
            <button
                className={`glass-button ${isLight ? 'light-icons' : ''}`}
                onClick={() => handleToolClick(tool)}
                style={{
                    padding: '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.3px',
                    height: baseSize,
                    minWidth: 'auto',
                    width: 'auto',
                    borderRadius: 'var(--radius-md)',
                    whiteSpace: 'nowrap'
                }}
            >
                {tool.label}
            </button>
        );
    };

    const SectionHeader = ({ label, isOpen, onToggle, icon: Icon }) => (
        <button
            className={`glass-button ${settings.iconTheme === 'light' ? 'light-icons' : ''}`}
            onClick={onToggle}
            title={`${isOpen ? 'Collapse' : 'Expand'} ${label}`}
            style={{
                width: baseSize,
                height: baseSize * 0.7,
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                fontSize: 10 * uiScale,
                background: isOpen ? 'rgba(0, 122, 255, 0.2)' : 'transparent'
            }}
        >
            <Icon size={smallIconSize} />
            {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
    );

    const Divider = () => {
        const isLight = settings.iconTheme === 'light';
        return (
            <div style={{
                width: '1px',
                height: baseSize * 0.8,
                background: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.15)',
                margin: '0 4px'
            }} />
        );
    };

    if (isCollapsed) {
        return (
            <div style={{
                position: 'absolute',
                top: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000
            }}>
                <button
                    className={`glass-button ${settings.iconTheme === 'light' ? 'light-icons' : ''}`}
                    onClick={() => setIsCollapsed(false)}
                    title="Expand Toolbar"
                    style={{
                        width: baseSize * 1.5,
                        height: baseSize,
                        padding: '8px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        color: settings.iconTheme === 'light' ? 'rgba(0, 0, 0, 0.85)' : 'white'
                    }}
                >
                    <ChevronDown size={iconSize} />
                    <span style={{ fontSize: 12 * uiScale }}>Tools</span>
                </button>
            </div>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
        }}>
            {/* Secondary Bar (Contextual) */}
            {!isCollapsed && activeCategory && (
                <div className={`glass ${settings.iconTheme === 'light' ? 'light-glass' : ''}`} style={{
                    padding: '8px',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    gap: '4px',
                    alignItems: 'center',
                    animation: 'slideUp 0.3s ease-out'
                }}>
                    {activeCategory === 'draw' && (
                        <>
                            {drawingTools.map(tool => <ToolButton key={tool.id} tool={tool} />)}
                            <Divider />
                            <div style={{ display: 'flex', gap: '8px', padding: '0 8px' }}>
                                {colors.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => updateToolProperty('color', color)}
                                        style={{
                                            width: 24,
                                            height: 24,
                                            borderRadius: '50%',
                                            background: color,
                                            border: toolProperties.color === color
                                                ? '2px solid white'
                                                : '2px solid rgba(255, 255, 255, 0.3)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                    />
                                ))}
                            </div>
                            <Divider />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 8px' }}>
                                <span style={{ fontSize: '10px', opacity: 0.6 }}>Size</span>
                                <input
                                    type="range" min="1" max="50"
                                    value={toolProperties.thickness}
                                    onChange={(e) => updateToolProperty('thickness', parseInt(e.target.value))}
                                    style={{ width: '60px', accentColor: '#007AFF' }}
                                />
                            </div>
                        </>
                    )}
                    {activeCategory === 'shapes' && (
                        <>
                            {shapeTools.map(tool => <ToolButton key={tool.id} tool={tool} />)}
                            <Divider />
                            {measureTools.map(tool => <ToolButton key={tool.id} tool={tool} />)}
                        </>
                    )}
                    {activeCategory === 'background' && (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '0 4px' }}>
                            <button className={`glass-button ${isLight ? 'light-icons' : ''}`} onClick={() => updateBackground({ gridType: 'none' })} style={{ fontSize: '10px' }}>None</button>
                            <button className={`glass-button ${isLight ? 'light-icons' : ''}`} onClick={() => updateBackground({ gridType: 'dots' })} style={{ fontSize: '10px' }}>Dots</button>
                            <button className={`glass-button ${isLight ? 'light-icons' : ''}`} onClick={() => updateBackground({ gridType: 'lines' })} style={{ fontSize: '10px' }}>Lines</button>
                            <button className={`glass-button ${isLight ? 'light-icons' : ''}`} onClick={() => updateBackground({ gridType: 'squares' })} style={{ fontSize: '10px' }}>Grid</button>
                            <Divider />
                            <div style={{ display: 'flex', gap: '4px' }}>
                                {['#1a1a1a', '#ffffff', '#f5f5f7', '#000000'].map(bg => (
                                    <button
                                        key={bg}
                                        onClick={() => updateBackground({ backgroundColor: bg })}
                                        style={{
                                            width: 20, height: 20, borderRadius: '4px', background: bg,
                                            border: background.backgroundColor === bg ? '2px solid #007AFF' : '1px solid rgba(255,255,255,0.2)',
                                            cursor: 'pointer'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    {activeCategory === 'file' && (
                        <>
                            <TextToolButton
                                tool={{
                                    id: 'new',
                                    icon: FilePlus,
                                    label: 'New',
                                    action: () => window.confirm('New canvas?') && clearCanvas()
                                }}
                            />
                            <TextToolButton
                                tool={{
                                    id: 'save',
                                    icon: Save,
                                    label: 'Save',
                                    action: () => saveWhiteboard({ elements, background, viewport, author: settings.userName }, 'whiteboard')
                                }}
                            />
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="toolbar-file-input"
                                    type="file"
                                    accept=".json"
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            try {
                                                const data = await loadWhiteboard(file);
                                                if (data.elements) setElements(data.elements);
                                                if (data.background) updateBackground(data.background);
                                                if (data.viewport) setViewport(data.viewport);
                                                if (data.author) updateSettings({ userName: data.author });
                                            } catch (error) {
                                                alert(error.message);
                                            }
                                        }
                                        e.target.value = null;
                                    }}
                                    style={{ display: 'none' }}
                                />
                                <TextToolButton
                                    tool={{
                                        id: 'open',
                                        icon: FolderOpen,
                                        label: 'Open',
                                        action: () => document.getElementById('toolbar-file-input').click()
                                    }}
                                />
                            </div>
                            <TextToolButton
                                tool={{
                                    id: 'export-png',
                                    icon: ImageIcon,
                                    label: 'Export PNG',
                                    action: exportCanvasPNG
                                }}
                            />
                            <TextToolButton
                                tool={{
                                    id: 'export-svg',
                                    icon: Box,
                                    label: 'Export SVG',
                                    action: exportCanvasSVG
                                }}
                            />
                            <TextToolButton
                                tool={{
                                    id: 'export-pdf',
                                    icon: FileText,
                                    label: 'Export PDF',
                                    action: exportCanvasPDF
                                }}
                            />
                            <TextToolButton
                                tool={{
                                    id: 'import-img',
                                    icon: Upload,
                                    label: 'Import',
                                    action: importImage
                                }}
                            />
                        </>
                    )}

                    {activeCategory === 'organize' && (
                        <>
                            {organizeTools.map(tool => (
                                <ToolButton key={tool.id} tool={tool} />
                            ))}
                        </>
                    )}
                </div>
            )}

            {/* Main Bar */}
            <div className={`glass ${settings.iconTheme === 'light' ? 'light-glass' : ''}`} style={{
                padding: '8px',
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
            }}>
                <CategoryButton id="draw" icon={Pen} label="Draw" />
                <CategoryButton id="shapes" icon={Shapes} label="Shapes" />
                <CategoryButton id="organize" icon={Layout} label="Organize" />
                <CategoryButton id="background" icon={Grid} label="Canvas" />
                <CategoryButton id="file" icon={FileText} label="File" />
                <Divider />
                <button className={`glass-button ${isLight ? 'light-icons' : ''}`} onClick={undo} title="Undo"><Undo size={iconSize} /></button>
                <button className={`glass-button ${isLight ? 'light-icons' : ''}`} onClick={redo} title="Redo"><Redo size={iconSize} /></button>
                <Divider />
                <button className={`glass-button ${isLight ? 'light-icons' : ''}`} onClick={() => setShowSettingsSidebar(true)} title="Settings"><Settings2 size={iconSize} /></button>
                <button
                    className={`glass-button ${isLight ? 'light-icons' : ''} ${settings?.focusMode ? 'active' : ''}`}
                    onClick={() => updateSettings({ focusMode: !settings?.focusMode })}
                    title="Focus Mode (F)"
                >
                    <Eye size={iconSize} />
                </button>
            </div>

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

const CategoryButton = ({ id, icon: Icon, label }) => {
    const { activeCategory, setActiveCategory, settings } = useWhiteboard();
    const isLight = settings.iconTheme === 'light';
    const isActive = activeCategory === id;

    return (
        <button
            onClick={() => setActiveCategory(prev => prev === id ? null : id)}
            style={{
                background: isActive ? (isLight ? 'rgba(0, 122, 255, 0.1)' : 'rgba(255, 255, 255, 0.1)') : 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '8px 12px',
                color: isActive ? '#007AFF' : (isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)'),
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                borderBottom: isActive ? '2px solid #007AFF' : '2px solid transparent'
            }}
            className="category-btn"
        >
            <Icon size={18} />
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.3px' }}>{label}</span>
        </button>
    );
};

export default Toolbar;
