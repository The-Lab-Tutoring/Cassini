import React from 'react';

const Branding = () => {
    return (
        <div style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            zIndex: 1000,
            fontFamily: 'var(--font-primary)',
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.6)',
            userSelect: 'none',
            letterSpacing: '0.5px'
        }}>
            The Lab <span style={{ fontWeight: 700 }}>Whiteboard</span>
        </div>
    );
};

export default Branding;
