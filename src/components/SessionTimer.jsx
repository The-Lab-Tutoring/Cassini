import React, { useState, useEffect } from 'react';
import { useWhiteboard } from '../context/WhiteboardContext';
import { Clock } from 'lucide-react';

const SessionTimer = () => {
    const { settings } = useWhiteboard();
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(s => s + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!settings.showTimer) return null;

    const formatTime = (totalSeconds) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        const parts = [];
        if (hrs > 0) parts.push(hrs.toString().padStart(2, '0'));
        parts.push(mins.toString().padStart(2, '0'));
        parts.push(secs.toString().padStart(2, '0'));

        return parts.join(':');
    };

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
            <span style={{ minWidth: '45px' }}>{formatTime(seconds)}</span>
        </div>
    );
};

export default SessionTimer;
