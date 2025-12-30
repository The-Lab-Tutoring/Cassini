import React from 'react';
import { useWhiteboard } from '../context/WhiteboardContext';
import { Plus, Minus, Maximize, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const ZoomControls = () => {
    const { viewport, setViewport, zoomIn, zoomOut, resetZoom, settings } = useWhiteboard();
    const isLight = settings.iconTheme === 'light';

    const zoomPercentage = Math.round(viewport.scale * 100);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(40px) saturate(180%)',
            padding: '4px',
            borderRadius: '12px',
            border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            zIndex: 1000,
            color: isLight ? '#000' : '#fff',
            fontFamily: 'Inter, sans-serif'
        }}>
            <button
                onClick={zoomOut}
                className={`glass-button ${isLight ? 'light-icons' : ''}`}
                title="Zoom Out"
                style={{ width: '32px', height: '32px', padding: '6px' }}
            >
                <Minus size={18} />
            </button>

            <button
                onClick={resetZoom}
                className={`glass-button ${isLight ? 'light-icons' : ''}`}
                title="Reset Zoom"
                style={{
                    padding: '0 8px',
                    height: '32px',
                    fontSize: '12px',
                    fontWeight: '600',
                    minWidth: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {zoomPercentage}%
            </button>

            <button
                onClick={zoomIn}
                className={`glass-button ${isLight ? 'light-icons' : ''}`}
                title="Zoom In"
                style={{ width: '32px', height: '32px', padding: '6px' }}
            >
                <Plus size={18} />
            </button>

            <div style={{ width: '1px', height: '20px', background: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)', margin: '0 4px' }} />

            <button
                onClick={toggleFullscreen}
                className={`glass-button ${isLight ? 'light-icons' : ''}`}
                title="Toggle Full Screen"
                style={{ width: '32px', height: '32px', padding: '6px' }}
            >
                <Maximize size={18} />
            </button>

            <div style={{ width: '1px', height: '20px', background: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)', margin: '0 4px' }} />

            <div style={{ display: 'flex', gap: '2px' }}>
                <button
                    onClick={() => setViewport(prev => ({ ...prev, x: prev.x + 100 }))}
                    className={`glass-button ${isLight ? 'light-icons' : ''}`}
                    title="Pan Left"
                    style={{ width: '32px', height: '32px', padding: '6px' }}
                >
                    <ArrowLeft size={18} />
                </button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <button
                        onClick={() => setViewport(prev => ({ ...prev, y: prev.y + 100 }))}
                        className={`glass-button ${isLight ? 'light-icons' : ''}`}
                        title="Pan Up"
                        style={{ width: '32px', height: '15px', padding: '0 6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <ArrowUp size={12} />
                    </button>
                    <button
                        onClick={() => setViewport(prev => ({ ...prev, y: prev.y - 100 }))}
                        className={`glass-button ${isLight ? 'light-icons' : ''}`}
                        title="Pan Down"
                        style={{ width: '32px', height: '15px', padding: '0 6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <ArrowDown size={12} />
                    </button>
                </div>
                <button
                    onClick={() => setViewport(prev => ({ ...prev, x: prev.x - 100 }))}
                    className={`glass-button ${isLight ? 'light-icons' : ''}`}
                    title="Pan Right"
                    style={{ width: '32px', height: '32px', padding: '6px' }}
                >
                    <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default ZoomControls;
