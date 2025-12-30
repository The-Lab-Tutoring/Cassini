import React, { useState } from 'react';
import { X, User, Sun, Moon, Grid, Layout, Square, Type, Keyboard } from 'lucide-react';
import { useWhiteboard } from '../context/WhiteboardContext';

const SettingsSidebar = () => {
    const {
        showSettingsSidebar,
        setShowSettingsSidebar,
        settings,
        updateSettings,
        background,
        updateBackground
    } = useWhiteboard();

    const [searchQuery, setSearchQuery] = useState('');
    const isLight = settings.iconTheme === 'light';

    if (!showSettingsSidebar) return null;

    const sections = [
        { id: 'user', label: 'User Profile', tags: ['name', 'author', 'profile'] },
        { id: 'theme', label: 'Icon Theme', tags: ['dark', 'light', 'appearance'] },
        { id: 'smoothing', label: 'Stroke Smoothing', tags: ['bezier', 'lines', 'drawing'] },
        { id: 'grid', label: 'Grid Type', tags: ['background', 'dots', 'lines', 'canvas'] },
        { id: 'density', label: 'Grid Density', tags: ['size', 'spacing'] },
        { id: 'shortcuts', label: 'Keyboard Shortcuts', tags: ['keys', 'hotkeys', 'help'] }
    ];

    const isVisible = (id) => {
        if (!searchQuery) return true;
        const section = sections.find(s => s.id === id);
        return section.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            section.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    };

    return (
        <div className="settings-sidebar-overlay" style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 10000,
            display: 'flex',
            justifyContent: 'flex-end',
            transition: 'all 0.3s ease'
        }} onClick={() => setShowSettingsSidebar(false)}>
            <div className={`settings-sidebar ${isLight ? 'light-mode' : ''}`} style={{
                width: '320px',
                height: '100%',
                background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(20, 20, 20, 0.85)',
                backdropFilter: 'blur(20px)',
                borderLeft: isLight ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                padding: '24px',
                color: isLight ? '#1a1a1a' : 'white',
                fontFamily: 'Inter, sans-serif'
            }} onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0, color: isLight ? '#000000' : 'white' }}>Settings</h2>
                    <button
                        onClick={() => setShowSettingsSidebar(false)}
                        style={{ background: 'none', border: 'none', color: isLight ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)', cursor: 'pointer', padding: '4px' }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Search */}
                <div style={{ position: 'relative', marginBottom: '24px' }}>
                    <input
                        type="text"
                        placeholder="Search settings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            paddingLeft: '36px',
                            background: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(128,128,128,0.2)',
                            borderRadius: '10px',
                            color: isLight ? '#000' : '#fff',
                            fontSize: '14px',
                            outline: 'none'
                        }}
                    />
                    <X size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                </div>

                {/* User Profile */}
                <div style={{
                    background: isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, #007AFF 0%, #00C6FF 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                    }}>
                        <User size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '13px', color: isLight ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.4)', marginBottom: '2px' }}>Signed in as</div>
                        <input
                            type="text"
                            value={settings.userName}
                            onChange={(e) => updateSettings({ userName: e.target.value })}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: isLight ? '#000000' : 'white',
                                fontSize: '16px',
                                fontWeight: 500,
                                padding: '2px 0',
                                width: '100%',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>

                {/* Settings Sections */}
                <div style={{ flex: 1, overflowY: 'auto' }}>

                    {/* Icon Theme */}
                    {isVisible('theme') && (
                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={getSectionTitleStyle(isLight)}>Icon Theme</h3>
                            <div style={{ display: 'flex', gap: '8px', background: 'rgba(255, 255, 255, 0.05)', padding: '4px', borderRadius: '12px' }}>
                                <button
                                    onClick={() => updateSettings({ iconTheme: 'liquid' })}
                                    style={{ ...getToggleButtonStyle(isLight), background: settings.iconTheme === 'liquid' ? 'rgba(255, 255, 255, 0.1)' : 'transparent' }}
                                >
                                    <Moon size={16} />
                                    <span>Liquid Glass</span>
                                </button>
                                <button
                                    onClick={() => updateSettings({ iconTheme: 'light' })}
                                    style={{ ...getToggleButtonStyle(isLight), background: settings.iconTheme === 'light' ? 'rgba(255, 255, 255, 0.1)' : 'transparent' }}
                                >
                                    <Sun size={16} />
                                    <span>Light Mode</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Stroke Smoothing */}
                    {isVisible('smoothing') && (
                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={getSectionTitleStyle(isLight)}>Stroke Smoothing</h3>
                            <div style={{ display: 'flex', gap: '8px', background: isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)', padding: '4px', borderRadius: '12px' }}>
                                <button
                                    onClick={() => updateSettings({ strokeSmoothing: true })}
                                    style={{ ...getToggleButtonStyle(isLight), background: settings.strokeSmoothing ? (isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)') : 'transparent' }}
                                >
                                    <span>On</span>
                                </button>
                                <button
                                    onClick={() => updateSettings({ strokeSmoothing: false })}
                                    style={{ ...getToggleButtonStyle(isLight), background: !settings.strokeSmoothing ? (isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)') : 'transparent' }}
                                >
                                    <span>Off</span>
                                </button>
                            </div>
                            <p style={{ fontSize: '11px', color: isLight ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.4)', marginTop: '8px' }}>
                                Smoother lines using Bezier curve interpolation
                            </p>
                        </div>
                    )}

                    {/* Grid Type */}
                    {isVisible('grid') && (
                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={getSectionTitleStyle(isLight)}>Grid Type</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                                {[
                                    { id: 'none', label: 'None', icon: <Square size={16} /> },
                                    { id: 'dots', label: 'Dots', icon: <Type size={16} /> },
                                    { id: 'lines', label: 'Lines', icon: <Layout size={16} /> },
                                    { id: 'squares', label: 'Squares', icon: <Grid size={16} /> }
                                ].map(grid => (
                                    <button
                                        key={grid.id}
                                        onClick={() => updateBackground({ gridType: grid.id })}
                                        style={{
                                            ...getGridButtonStyle(isLight),
                                            background: background.gridType === grid.id ? 'rgba(0, 122, 255, 0.2)' : (isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)'),
                                            border: background.gridType === grid.id ? '1px solid #007AFF' : '1px solid transparent'
                                        }}
                                    >
                                        {grid.icon}
                                        <span>{grid.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Grid Opacity */}
                    {isVisible('density') && (
                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={getSectionTitleStyle(isLight)}>Grid Density</h3>
                            <input
                                type="range"
                                min="20"
                                max="100"
                                step="10"
                                value={background.gridSize}
                                onChange={(e) => updateBackground({ gridSize: parseInt(e.target.value) })}
                                style={{
                                    width: '100%',
                                    cursor: 'pointer',
                                    accentColor: '#007AFF'
                                }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)' }}>
                                <span>Compact</span>
                                <span>Sparse</span>
                            </div>
                        </div>
                    )}

                    {/* Keyboard Shortcuts */}
                    {isVisible('shortcuts') && (
                        <div style={{ marginBottom: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                <Keyboard size={16} color={isLight ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)'} />
                                <h3 style={{ ...getSectionTitleStyle(isLight), marginBottom: 0 }}>Keyboard Shortcuts</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <ShortcutItem label="Command Palette" keys={['Cmd', 'K']} isLight={isLight} />
                                <ShortcutItem label="Save Canvas" keys={['Ctrl', 'S']} isLight={isLight} />
                                <ShortcutItem label="Open File" keys={['Ctrl', 'O']} isLight={isLight} />
                                <ShortcutItem label="Export PNG" keys={['Ctrl', 'E']} isLight={isLight} />
                                <div style={{ height: '8px' }} />
                                <ShortcutItem label="Pen Tool" keys={['P']} isLight={isLight} />
                                <ShortcutItem label="Eraser Tool" keys={['E']} isLight={isLight} />
                                <ShortcutItem label="Select Tool" keys={['V']} isLight={isLight} />
                                <ShortcutItem label="Rectangle Tool" keys={['R']} isLight={isLight} />
                                <ShortcutItem label="Circle Tool" keys={['C']} isLight={isLight} />
                                <ShortcutItem label="Line Tool" keys={['L']} isLight={isLight} />
                                <ShortcutItem label="Arrow Tool" keys={['A']} isLight={isLight} />
                                <div style={{ height: '8px' }} />
                                <ShortcutItem label="Undo" keys={['Ctrl', 'Z']} isLight={isLight} />
                                <ShortcutItem label="Redo" keys={['Ctrl', 'Y']} isLight={isLight} />
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div style={{ borderTop: isLight ? '1px solid rgba(0, 0, 0, 0.05)' : '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '12px', color: isLight ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.3)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <img
                            src="/logo.png"
                            alt="Cassini"
                            style={{
                                height: '14px',
                                width: 'auto',
                                opacity: 0.5,
                                filter: isLight ? 'brightness(0) opacity(0.6)' : 'brightness(0) invert(1) opacity(0.6)'
                            }}
                        />
                        <span>Cassini v1.7.1</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

const ShortcutItem = ({ label, keys, isLight }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', color: isLight ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.7)' }}>{label}</span>
        <div style={{ display: 'flex', gap: '4px' }}>
            {keys.map((key, i) => (
                <kbd key={i} style={{
                    padding: '2px 6px',
                    background: isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 600,
                    color: isLight ? '#000000' : 'rgba(255, 255, 255, 0.9)',
                    border: isLight ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(255, 255, 255, 0.1)',
                    minWidth: '20px',
                    textAlign: 'center'
                }}>{key}</kbd>
            ))}
        </div>
    </div>
);

const getSectionTitleStyle = (isLight) => ({
    fontSize: '13px',
    fontWeight: 600,
    color: isLight ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '12px'
});

const getToggleButtonStyle = (isLight) => ({
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px',
    border: 'none',
    borderRadius: '10px',
    color: isLight ? '#000000' : 'white',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
});

const getGridButtonStyle = (isLight) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    border: 'none',
    borderRadius: '12px',
    color: isLight ? '#000000' : 'white',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left'
});

export default SettingsSidebar;
