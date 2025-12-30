import React from 'react';
import { useWhiteboard } from '../context/WhiteboardContext';
import { Plus, Minus, Maximize } from 'lucide-react';

const ZoomControls = () => {
    const { viewport, zoomIn, zoomOut, resetZoom, settings } = useWhiteboard();
    const isLight = settings.iconTheme === 'light';

    const zoomPercentage = Math.round(viewport.scale * 100);

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: isLight ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(10px)',
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
                className="glass-button"
                title="Zoom Out"
                style={{ width: '32px', height: '32px', padding: '6px' }}
            >
                <Minus size={18} />
            </button>

            <button
                onClick={resetZoom}
                className="glass-button"
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
                className="glass-button"
                title="Zoom In"
                style={{ width: '32px', height: '32px', padding: '6px' }}
            >
                <Plus size={18} />
            </button>

            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />

            <button
                onClick={resetZoom}
                className="glass-button"
                title="Fit to Screen"
                style={{ width: '32px', height: '32px', padding: '6px' }}
            >
                <Maximize size={18} />
            </button>
        </div>
    );
};

export default ZoomControls;
