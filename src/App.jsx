import React, { useState } from 'react';
import { WhiteboardProvider, useWhiteboard } from './context/WhiteboardContext';
import Whiteboard from './components/Whiteboard';
import Toolbar from './components/Toolbar';
import { EyeOff } from 'lucide-react';
import TextModal from './components/TextModal';
import BackgroundModal from './components/BackgroundModal';
import Branding from './components/Branding';
import WelcomeScreen from './components/WelcomeScreen';
import SettingsSidebar from './components/SettingsSidebar';
import SessionTimer from './components/SessionTimer';
import CommandPalette from './components/CommandPalette';
import './App.css';

const MainLayout = () => {
    const { setElements, updateBackground, setViewport, showWelcome, setShowWelcome, updateSettings, settings } = useWhiteboard();
    const focusMode = settings?.focusMode || false;

    const handleLoadFile = (data, filename) => {
        if (data.elements) setElements(data.elements);
        if (data.background) updateBackground(data.background);
        if (data.viewport) setViewport(data.viewport);
        if (data.author) updateSettings({ userName: data.author });
        setShowWelcome(false);
    };

    return (
        <>
            {showWelcome && (
                <WelcomeScreen
                    onNewCanvas={() => setShowWelcome(false)}
                    onLoadFile={handleLoadFile}
                />
            )}
            <div style={{ opacity: showWelcome ? 0 : 1, transition: 'opacity 0.5s ease' }}>
                <Whiteboard />
                <SessionTimer />
                {!focusMode && (
                    <>
                        <Toolbar />
                        <Branding />
                    </>
                )}
                <TextModal />
                <BackgroundModal />
                <SettingsSidebar />
                <CommandPalette />
                {focusMode && (
                    <button
                        onClick={() => updateSettings({ focusMode: false })}
                        style={{
                            position: 'fixed',
                            bottom: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            padding: '12px',
                            background: 'rgba(0, 0, 0, 0.6)',
                            borderRadius: '50%',
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '12px',
                            zIndex: 1000,
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                        }}
                        title="Exit Focus Mode (F)"
                    >
                        <EyeOff size={24} />
                    </button>
                )}
            </div>
        </>
    );
};

function App() {
    return (
        <WhiteboardProvider>
            <MainLayout />
        </WhiteboardProvider>
    );
}

export default App;
