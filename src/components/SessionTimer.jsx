import React, { useState, useEffect } from 'react';
import { useWhiteboard } from '../context/WhiteboardContext';
import { Clock } from 'lucide-react';

const SessionTimer = () => {
    const { settings } = useWhiteboard();
    const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!settings.showClock) return null;

    const isLight = settings.iconTheme === 'light';

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: isLight ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(10px)',
            padding: '8px 12px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: isLight ? '#000' : '#fff',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            fontWeight: '600',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            zIndex: 100,
            pointerEvents: 'none',
            border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)',
            letterSpacing: '0.02em'
        }}>
            <Clock size={14} style={{ opacity: 0.7 }} />
            <span style={{ minWidth: '45px' }}>{time}</span>
        </div>
    );
};

export default SessionTimer;
