import React, { useState, useEffect } from 'react';
import { useWhiteboard } from '../context/WhiteboardContext';
import { Clock, Sparkles } from 'lucide-react';

const SessionTimer = () => {
    const { settings, ciSettings } = useWhiteboard();
    const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!settings.showClock) return null;

    const isLight = settings.iconTheme === 'light';
    const ciActive = ciSettings.laserPointer || ciSettings.enableOCR;

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '8px',
            zIndex: 100,
            pointerEvents: 'none'
        }}>
            <div style={{
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
                border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)',
                letterSpacing: '0.02em'
            }}>
                <Clock size={14} style={{ opacity: 0.7 }} />
                <span style={{ minWidth: '45px' }}>{time}</span>
            </div>

            {ciActive && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    background: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.4)',
                    color: isLight ? '#000000' : '#ffffff',
                    borderRadius: '20px',
                    fontSize: '10px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    backdropFilter: 'blur(10px)',
                    border: isLight ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(255, 255, 255, 0.08)',
                    animation: 'fadeIn 0.3s ease',
                    boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.3)'
                }}>
                    <img
                        src="/ci-logo.png"
                        alt="CI"
                        style={{
                            height: '12px',
                            width: 'auto',
                            filter: isLight ? 'brightness(0) opacity(0.6)' : 'brightness(0) invert(1) opacity(0.8)'
                        }}
                    />
                    <span>Creative intelligence v1</span>
                </div>
            )}
        </div>
    );
};

export default SessionTimer;
