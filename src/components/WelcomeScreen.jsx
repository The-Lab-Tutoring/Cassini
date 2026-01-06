import React, { useState, useEffect } from 'react';
import { FilePlus, FolderOpen, Clock, ChevronRight, User, RotateCcw } from 'lucide-react';
import { loadWhiteboard, getRecentFiles } from '../utils/fileUtils';
import { useWhiteboard } from '../context/WhiteboardContext';

const WelcomeScreen = ({ onNewCanvas, onLoadFile }) => {
    const { settings, updateSettings, hasAutoSave, loadAutoSave, clearAutoSave } = useWhiteboard();
    const [recentFiles, setRecentFiles] = useState([]);
    const [isExiting, setIsExiting] = useState(false);
    const [error, setError] = useState('');
    const [hasRecovery, setHasRecovery] = useState(false);

    useEffect(() => {
        setRecentFiles(getRecentFiles());
        setHasRecovery(hasAutoSave());
    }, [hasAutoSave]);

    const handleNewCanvas = () => {
        clearAutoSave();
        setIsExiting(true);
        setTimeout(onNewCanvas, 500);
    };

    const handleRecoverSession = () => {
        loadAutoSave();
        setIsExiting(true);
        setTimeout(onNewCanvas, 500);
    };

    const handleOpenFile = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const data = await loadWhiteboard(file);
                setIsExiting(true);
                setTimeout(() => onLoadFile(data, file.name), 500);
            } catch (error) {
                alert(error.message);
            }
        }
    };

    const handleOpenRecent = (fileMeta) => {
        document.getElementById('welcome-file-input').click();
    };

    return (
        <div
            className={`welcome-screen ${isExiting ? 'fade-out' : ''}`}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: '#0a0a0a',
                zIndex: 9999,
                display: 'flex',
                color: 'white',
                fontFamily: 'Inter, sans-serif',
                overflow: 'hidden'
            }}
        >
            {/* Left Panel - Actions (40%) */}
            <div style={{
                width: '40%',
                height: '100%',
                background: '#0a0a0a',
                boxSizing: 'border-box',
                padding: '64px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                position: 'relative',
                zIndex: 2
            }}>
                <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>

                    {/* Header */}
                    <div style={{ marginBottom: '48px' }}>
                        <h1 style={{
                            fontSize: '64px',
                            fontWeight: 700,
                            letterSpacing: '-1px',
                            marginBottom: '16px',
                            background: 'linear-gradient(to right, #fff, #888)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            margin: '0 0 16px 0'
                        }}>
                            Cassini
                        </h1>
                        <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '16px', lineHeight: '1.5', margin: 0 }}>
                            Advanced whiteboard for creative flow.
                        </p>
                    </div>

                    {/* Primary Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px' }}>
                        <button
                            className="grok-btn primary"
                            onClick={handleNewCanvas}
                        >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <FilePlus size={20} />
                                New Canvas
                            </span>
                            <ChevronRight size={16} style={{ opacity: 0.5 }} />
                        </button>

                        <div style={{ position: 'relative' }}>
                            <input
                                id="welcome-file-input"
                                type="file"
                                accept=".json"
                                onChange={handleOpenFile}
                                style={{ display: 'none' }}
                            />
                            <button
                                className="grok-btn secondary"
                                onClick={() => document.getElementById('welcome-file-input').click()}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <FolderOpen size={20} />
                                    Open File
                                </span>
                                <ChevronRight size={16} style={{ opacity: 0.5 }} />
                            </button>
                        </div>

                        {hasRecovery && (
                            <button
                                className="grok-btn secondary"
                                onClick={handleRecoverSession}
                                style={{ borderColor: 'rgba(255, 149, 0, 0.3)', color: '#FF9500' }}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <RotateCcw size={20} />
                                    Recover Session
                                </span>
                                <ChevronRight size={16} style={{ opacity: 0.5 }} />
                            </button>
                        )}
                    </div>

                    {/* Recent Files */}
                    <div>
                        <h3 style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            color: 'rgba(255, 255, 255, 0.3)',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: '20px'
                        }}>
                            Recent
                        </h3>
                        <div style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '8px' }}>
                            {recentFiles.length > 0 ? (
                                recentFiles.map(file => (
                                    <div
                                        key={file.id}
                                        className="grok-recent-item"
                                        onClick={() => handleOpenRecent(file)}
                                    >
                                        <Clock size={14} style={{ opacity: 0.4 }} />
                                        <span style={{ fontSize: '14px', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {file.name}
                                        </span>
                                        <span style={{ fontSize: '12px', opacity: 0.3 }}>
                                            {new Date(file.lastOpened).toLocaleDateString()}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div style={{ color: 'rgba(255, 255, 255, 0.2)', fontSize: '13px', fontStyle: 'italic' }}>
                                    No recent canvases.
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Footer Brand */}
                <div style={{
                    position: 'absolute',
                    bottom: '48px',
                    left: '64px',
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.2)',
                    fontWeight: 500,
                    letterSpacing: '0.5px'
                }}>
                    Orama 2026, Rights Reserved
                </div>
            </div>

            {/* Right Panel - Brand (60%) */}
            <div style={{
                width: '60%',
                height: '100%',
                background: 'radial-gradient(circle at center, #1a1a1a 0%, #000000 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 70%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)'
                }} />

                <img
                    src="/logo.png"
                    alt="Logo"
                    style={{
                        width: '255px',
                        height: 'auto',
                        filter: 'brightness(0) invert(1) drop-shadow(0 0 30px rgba(255,255,255,0.2))',
                        position: 'relative',
                        zIndex: 10
                    }}
                />
            </div>

            <style>{`
                .grok-btn {
                    width: 100%;
                    padding: 20px 24px;
                    border-radius: 999px; /* Pill shape */
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 16px;
                    font-weight: 500;
                    transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
                    text-align: left;
                    font-family: 'Inter', sans-serif;
                }
                .grok-btn.primary {
                    background: white;
                    color: black;
                }
                .grok-btn.primary:hover {
                    transform: scale(1.02);
                    box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
                }
                .grok-btn.secondary {
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .grok-btn.secondary:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.2);
                }
                .grok-recent-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    border-radius: 12px;
                    cursor: pointer;
                    color: rgba(255, 255, 255, 0.7);
                    transition: all 0.2s ease;
                }
                .grok-recent-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                }
                .fade-out {
                    opacity: 0;
                    transition: opacity 0.5s ease-out;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
};

export default WelcomeScreen;
