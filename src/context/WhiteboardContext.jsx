import React, { createContext, useContext, useState, useCallback } from 'react';

const WhiteboardContext = createContext();

export const useWhiteboard = () => {
    const context = useContext(WhiteboardContext);
    if (!context) {
        throw new Error('useWhiteboard must be used within WhiteboardProvider');
    }
    return context;
};

export const WhiteboardProvider = ({ children }) => {
    // Tool state
    const [activeTool, setActiveTool] = useState('pen');
    const [toolProperties, setToolProperties] = useState({
        color: '#007AFF',
        thickness: 3,
        opacity: 1,
        fontSize: 16,
        fontFamily: 'Inter'
    });

    // Canvas elements
    const [elements, setElements] = useState([]);
    const [selectedElement, setSelectedElement] = useState(null);

    // Ruler and Protractor
    const [ruler, setRuler] = useState(null);
    const [protractor, setProtractor] = useState(null);

    // History for undo/redo
    const [history, setHistory] = useState([[]]);
    const [historyStep, setHistoryStep] = useState(0);

    // Modals
    const [showEquationModal, setShowEquationModal] = useState(false);
    const [showTextModal, setShowTextModal] = useState(false);

    // Viewport state for Infinite Canvas
    const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 1 });

    const zoomIn = useCallback(() => {
        setViewport(prev => ({ ...prev, scale: Math.min(prev.scale * 1.1, 5) }));
    }, []);

    const zoomOut = useCallback(() => {
        setViewport(prev => ({ ...prev, scale: Math.max(prev.scale / 1.1, 0.1) }));
    }, []);

    const resetZoom = useCallback(() => {
        setViewport({ x: 0, y: 0, scale: 1 });
    }, []);

    const updateToolProperty = useCallback((property, value) => {
        setToolProperties(prev => ({ ...prev, [property]: value }));
    }, []);

    const addElement = useCallback((element) => {
        setElements(prev => {
            const newElements = [...prev, element];
            setHistory(h => [...h.slice(0, historyStep + 1), newElements]);
            setHistoryStep(s => s + 1);
            return newElements;
        });
    }, [historyStep]);

    const updateElement = useCallback((id, updates) => {
        setElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
    }, []);

    const deleteElement = useCallback((id) => {
        setElements(prev => {
            const newElements = prev.filter(el => el.id !== id);
            setHistory(h => [...h.slice(0, historyStep + 1), newElements]);
            setHistoryStep(s => s + 1);
            return newElements;
        });
    }, [historyStep]);

    const undo = useCallback(() => {
        if (historyStep > 0) {
            setHistoryStep(s => s - 1);
            setElements(history[historyStep - 1]);
        }
    }, [historyStep, history]);

    const redo = useCallback(() => {
        if (historyStep < history.length - 1) {
            setHistoryStep(s => s + 1);
            setElements(history[historyStep + 1]);
        }
    }, [historyStep, history]);

    const clearCanvas = useCallback(() => {
        setElements([]);
        setHistory([[]]);
        setHistoryStep(0);
        setRuler(null);
        setProtractor(null);
    }, []);

    const value = {
        activeTool,
        setActiveTool,
        toolProperties,
        updateToolProperty,
        elements,
        setElements,
        addElement,
        updateElement,
        deleteElement,
        selectedElement,
        setSelectedElement,
        ruler,
        setRuler,
        protractor,
        setProtractor,
        history,
        historyStep,
        undo,
        redo,
        clearCanvas,
        showEquationModal,
        setShowEquationModal,
        showTextModal,
        setShowTextModal,
        viewport,
        setViewport,
        zoomIn,
        zoomOut,
        resetZoom
    };

    return (
        <WhiteboardContext.Provider value={value}>
            {children}
        </WhiteboardContext.Provider>
    );
};
