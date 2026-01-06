import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { exportToSVG, downloadSVG } from '../utils/svgExport';
import { exportToPDF } from '../utils/pdfExport';

// Auto-save constants
const AUTO_SAVE_KEY = 'cassini_autosave';
const AUTO_SAVE_INTERVAL = 60000; // 60 seconds

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
    const [activeCategory, setActiveCategory] = useState('draw'); // 'draw' | 'shapes' | 'file' | 'background' | 'settings'
    const [toolProperties, setToolProperties] = useState({
        color: '#007AFF',
        fillColor: '#007AFF',
        thickness: 3,
        opacity: 1,
        fillOpacity: 0.5,
        fontSize: 16,
        fontFamily: 'Inter',
        stickyColor: '#FFEB3B' // Default yellow
    });

    // Canvas elements
    const [elements, setElements] = useState([]);
    const [ephemeralElements, setEphemeralElements] = useState([]);
    const [selectedElements, setSelectedElements] = useState([]);
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
    const [showBackgroundModal, setShowBackgroundModal] = useState(false);
    const [showStickyModal, setShowStickyModal] = useState(false);
    const [showFrameModal, setShowFrameModal] = useState(false);
    const [showSettingsSidebar, setShowSettingsSidebar] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);

    // Settings
    const [settings, setSettings] = useState({
        userName: 'User',
        iconTheme: 'liquid', // 'liquid' | 'light'
        strokeSmoothing: true,
        focusMode: false,
        gridSnapping: false,
        showClock: true,
        isMultiSelectMode: false // Tablet mode
    });

    // Creative Intelligence Settings
    const [ciSettings, setCiSettings] = useState({
        laserPointer: false,
        enableOCR: false
    });

    // Viewport state for Infinite Canvas
    const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 1 });

    // Canvas reference for export
    const [canvasRef, setCanvasRef] = useState(null);

    // Clipboard for copy/paste
    const [clipboard, setClipboard] = useState([]);

    // Background and grid settings
    const [background, setBackground] = useState({
        gridType: 'none', // 'none' | 'dots' | 'lines' | 'squares'
        gridSize: 40,
        gridColor: 'rgba(200, 200, 200, 0.3)',
        backgroundColor: '#1a1a1a' // Dark background to match Liquid Glass aesthetic
    });

    const zoomIn = useCallback(() => {
        setViewport(prev => {
            const newScale = Math.min(prev.scale * 1.1, 5);
            const zoomFactor = newScale / prev.scale;
            const centerScreen = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
            return {
                x: centerScreen.x - (centerScreen.x - prev.x) * zoomFactor,
                y: centerScreen.y - (centerScreen.y - prev.y) * zoomFactor,
                scale: newScale
            };
        });
    }, []);

    const zoomOut = useCallback(() => {
        setViewport(prev => {
            const newScale = Math.max(prev.scale / 1.1, 0.1);
            const zoomFactor = newScale / prev.scale;
            const centerScreen = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
            return {
                x: centerScreen.x - (centerScreen.x - prev.x) * zoomFactor,
                y: centerScreen.y - (centerScreen.y - prev.y) * zoomFactor,
                scale: newScale
            };
        });
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

    const addEphemeralElement = useCallback((element) => {
        setEphemeralElements(prev => [...prev, element]);
    }, []);

    const removeEphemeralElement = useCallback((id) => {
        setEphemeralElements(prev => prev.filter(el => el.id !== id));
    }, []);

    const updateElement = useCallback((id, updates) => {
        setElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
    }, []);

    const bulkUpdateElements = useCallback((updatesMap) => {
        setElements(prev => prev.map(el => updatesMap[el.id] ? { ...el, ...updatesMap[el.id] } : el));
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

    const exportCanvasPNG = useCallback(() => {
        if (!canvasRef) return;

        // Create a temporary canvas to export
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvasRef.width;
        tempCanvas.height = canvasRef.height;
        const tempCtx = tempCanvas.getContext('2d');

        // Fill white background
        tempCtx.fillStyle = '#FFFFFF';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Copy current canvas
        tempCtx.drawImage(canvasRef, 0, 0);

        // Trigger download
        const link = document.createElement('a');
        link.download = `cassini-${settings.userName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
    }, [canvasRef, settings.userName]);

    const exportCanvasSVG = useCallback(() => {
        const svgContent = exportToSVG(elements, background);
        if (svgContent) {
            const filename = `cassini-${settings.userName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.svg`;
            downloadSVG(svgContent, filename);
        }
    }, [elements, background, settings.userName]);

    const exportCanvasPDF = useCallback(() => {
        if (!canvasRef) return;
        const filename = `cassini-${settings.userName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`;
        exportToPDF(canvasRef, filename);
    }, [canvasRef, settings.userName]);

    const importImage = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    addElement({
                        id: Date.now(),
                        type: 'image',
                        src: event.target.result,
                        x: 100,
                        y: 100,
                        width: img.width,
                        height: img.height,
                        originalWidth: img.width,
                        originalHeight: img.height,
                        opacity: 1,
                        rotation: 0
                    });
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        };
        input.click();
    }, [addElement]);

    // Clipboard operations
    const copyElements = useCallback((elementsToCopy) => {
        setClipboard(elementsToCopy.map(el => ({ ...el })));
    }, []);

    const pasteElements = useCallback(() => {
        if (clipboard.length === 0) return;

        const pastedElements = clipboard.map(el => ({
            ...el,
            id: Date.now() + Math.random(), // New ID
            x: el.x + 20, // Offset for visibility
            y: el.y + 20
        }));

        setElements(prev => {
            const newElements = [...prev, ...pastedElements];
            setHistory(h => [...h.slice(0, historyStep + 1), newElements]);
            setHistoryStep(s => s + 1);
            return newElements;
        });

        return pastedElements;
    }, [clipboard, historyStep]);

    const duplicateElements = useCallback((elementsToDup) => {
        const duplicated = elementsToDup.map(el => ({
            ...el,
            id: Date.now() + Math.random(),
            x: el.x + 20,
            y: el.y + 20
        }));

        setElements(prev => {
            const newElements = [...prev, ...duplicated];
            setHistory(h => [...h.slice(0, historyStep + 1), newElements]);
            setHistoryStep(s => s + 1);
            return newElements;
        });

        return duplicated;
    }, [historyStep]);

    const selectAll = useCallback(() => {
        return elements;
    }, [elements]);

    const deselectAll = useCallback(() => {
        return [];
    }, []);

    const updateBackground = useCallback((settings) => {
        setBackground(prev => ({ ...prev, ...settings }));
    }, []);

    const updateSettings = useCallback((newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    }, []);

    const updateCiSettings = useCallback((newSettings) => {
        setCiSettings(prev => ({ ...prev, ...newSettings }));
    }, []);

    // Sync background color with icon theme
    // Sync background color with icon theme ONLY when theme changes
    const prevThemeRef = useRef(settings.iconTheme);

    useEffect(() => {
        if (prevThemeRef.current !== settings.iconTheme) {
            if (settings.iconTheme === 'light') {
                updateBackground({ backgroundColor: '#ffffff', gridColor: 'rgba(0, 0, 0, 0.1)' });
            } else {
                updateBackground({ backgroundColor: '#1a1a1a', gridColor: 'rgba(200, 200, 200, 0.3)' });
            }
            prevThemeRef.current = settings.iconTheme;
        }
    }, [settings.iconTheme, updateBackground]);

    // Auto-save logic
    const autoSaveRef = useRef(null);

    useEffect(() => {
        // Don't auto-save if on welcome screen or no elements
        if (showWelcome) return;

        autoSaveRef.current = setInterval(() => {
            if (elements.length > 0) {
                const saveData = {
                    version: '1.8.0',
                    elements,
                    background,
                    viewport,
                    timestamp: Date.now(),
                    userName: settings.userName
                };
                localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(saveData));
                console.log('Auto-saved at', new Date().toLocaleTimeString());
            }
        }, AUTO_SAVE_INTERVAL);

        return () => {
            if (autoSaveRef.current) {
                clearInterval(autoSaveRef.current);
            }
        };
    }, [showWelcome, elements, background, viewport, settings.userName]);

    // Saved Items (Save for Later)
    const [savedItems, setSavedItems] = useState(() => {
        const saved = localStorage.getItem('cassini_saved_items');
        return saved ? JSON.parse(saved) : [];
    });

    const [showSavedItemsPanel, setShowSavedItemsPanel] = useState(false);

    // Persist bookmarks & saved items
    useEffect(() => {
        // bookmarks persistence handled elsewhere or passed in props if needed
    }, []);

    useEffect(() => {
        localStorage.setItem('cassini_saved_items', JSON.stringify(savedItems));
    }, [savedItems]);

    // Saved Items helpers
    const saveSelectionAsItem = useCallback((selectedElements, name) => {
        if (!selectedElements || selectedElements.length === 0) return;

        // Calculate bounds to normalize positions (make 0,0 top-left)
        let minX = Infinity, minY = Infinity;
        selectedElements.forEach(el => {
            if (el.points) {
                el.points.forEach(p => {
                    minX = Math.min(minX, p.x);
                    minY = Math.min(minY, p.y);
                });
            } else {
                minX = Math.min(minX, el.x);
                minY = Math.min(minY, el.y);
            }
        });

        const normalizedElements = selectedElements.map(el => {
            const newEl = { ...el };
            if (newEl.points) {
                newEl.points = newEl.points.map(p => ({ ...p, x: p.x - minX, y: p.y - minY }));
            } else {
                newEl.x = newEl.x - minX;
                newEl.y = newEl.y - minY;
            }
            return newEl;
        });

        const newItem = {
            id: Date.now().toString(),
            name: name || `Saved Item ${savedItems.length + 1}`,
            elements: normalizedElements,
            createdAt: Date.now()
        };

        setSavedItems(prev => [...prev, newItem]);
    }, [savedItems.length]);

    const deleteSavedItem = useCallback((id) => {
        setSavedItems(prev => prev.filter(item => item.id !== id));
    }, []);

    const hasAutoSave = useCallback(() => {
        return localStorage.getItem(AUTO_SAVE_KEY) !== null;
    }, []);

    const loadAutoSave = useCallback(() => {
        const savedData = localStorage.getItem(AUTO_SAVE_KEY);
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                if (data.elements) setElements(data.elements);
                if (data.background) setBackground(prev => ({ ...prev, ...data.background }));
                if (data.viewport) setViewport(data.viewport);
                if (data.userName) setSettings(prev => ({ ...prev, userName: data.userName }));
                return data;
            } catch (e) {
                console.error('Failed to load auto-save:', e);
                return null;
            }
        }
        return null;
    }, []);

    const clearAutoSave = useCallback(() => {
        localStorage.removeItem(AUTO_SAVE_KEY);
    }, []);

    // Helper to get bounds of elements
    const getBounds = (elements) => {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        elements.forEach(el => {
            const x = el.x || (el.points ? Math.min(...el.points.map(p => p.x)) : 0);
            const y = el.y || (el.points ? Math.min(...el.points.map(p => p.y)) : 0);
            const width = el.width || (el.points ? Math.max(...el.points.map(p => p.x)) - x : 0);
            const height = el.height || (el.points ? Math.max(...el.points.map(p => p.y)) - y : 0);

            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x + width);
            maxY = Math.max(maxY, y + height);
        });
        return { minX, minY, maxX, maxY };
    };

    const alignElements = useCallback((selectedElements, type) => {
        if (!selectedElements || selectedElements.length < 2) return;

        const bounds = getBounds(selectedElements);
        const selectedIds = selectedElements.map(el => el.id);
        const centerX = (bounds.minX + bounds.maxX) / 2;
        const centerY = (bounds.minY + bounds.maxY) / 2;

        setElements(prev => prev.map(el => {
            if (!selectedIds.includes(el.id)) return el;

            let newX = el.x;
            let newY = el.y;
            let newPoints = el.points;

            if (el.points) {
                const elBounds = getBounds([el]);
                const elCenterX = (elBounds.minX + elBounds.maxX) / 2;
                const elCenterY = (elBounds.minY + elBounds.maxY) / 2;

                let offsetX = 0;
                let offsetY = 0;

                switch (type) {
                    case 'left': offsetX = bounds.minX - elBounds.minX; break;
                    case 'centerH': offsetX = centerX - elCenterX; break;
                    case 'right': offsetX = bounds.maxX - elBounds.maxX; break;
                    case 'top': offsetY = bounds.minY - elBounds.minY; break;
                    case 'centerV': offsetY = centerY - elCenterY; break;
                    case 'bottom': offsetY = bounds.maxY - elBounds.maxY; break;
                }

                newPoints = el.points.map(p => ({ x: p.x + offsetX, y: p.y + offsetY }));
                return { ...el, points: newPoints };
            } else {
                const elWidth = el.width || 0;
                const elHeight = el.height || 0;

                switch (type) {
                    case 'left': newX = bounds.minX; break;
                    case 'centerH': newX = centerX - elWidth / 2; break;
                    case 'right': newX = bounds.maxX - elWidth; break;
                    case 'top': newY = bounds.minY; break;
                    case 'centerV': newY = centerY - elHeight / 2; break;
                    case 'bottom': newY = bounds.maxY - elHeight; break;
                }
                return { ...el, x: newX, y: newY };
            }
        }));
    }, []);

    const distributeElements = useCallback((selectedElements, type) => {
        if (!selectedElements || selectedElements.length < 3) return;

        const elementsWithBounds = selectedElements.map(el => ({ ...el, bounds: getBounds([el]) }));

        if (type === 'horizontal') {
            elementsWithBounds.sort((a, b) => a.bounds.minX - b.bounds.minX);
            const totalBounds = getBounds(selectedElements);
            const totalWidth = elementsWithBounds.reduce((sum, el) => sum + (el.bounds.maxX - el.bounds.minX), 0);
            const spacing = (totalBounds.maxX - totalBounds.minX - totalWidth) / (elementsWithBounds.length - 1);

            let currentX = totalBounds.minX;
            const updates = {};
            elementsWithBounds.forEach(el => {
                updates[el.id] = currentX - el.bounds.minX;
                currentX += (el.bounds.maxX - el.bounds.minX) + spacing;
            });

            setElements(prev => prev.map(el => {
                if (updates[el.id] === undefined) return el;
                const offset = updates[el.id];
                if (el.points) return { ...el, points: el.points.map(p => ({ ...p, x: p.x + offset })) };
                return { ...el, x: (el.x || 0) + offset };
            }));
        } else { // vertical
            elementsWithBounds.sort((a, b) => a.bounds.minY - b.bounds.minY);
            const totalBounds = getBounds(selectedElements);
            const totalHeight = elementsWithBounds.reduce((sum, el) => sum + (el.bounds.maxY - el.bounds.minY), 0);
            const spacing = (totalBounds.maxY - totalBounds.minY - totalHeight) / (elementsWithBounds.length - 1);

            let currentY = totalBounds.minY;
            const updates = {};
            elementsWithBounds.forEach(el => {
                updates[el.id] = currentY - el.bounds.minY;
                currentY += (el.bounds.maxY - el.bounds.minY) + spacing;
            });

            setElements(prev => prev.map(el => {
                if (updates[el.id] === undefined) return el;
                const offset = updates[el.id];
                if (el.points) return { ...el, points: el.points.map(p => ({ ...p, y: p.y + offset })) };
                return { ...el, y: (el.y || 0) + offset };
            }));
        }
    }, []);

    const reorderElements = useCallback((selectedElements, type) => {
        if (!selectedElements || selectedElements.length === 0) return;
        const selectedIds = selectedElements.map(el => el.id);

        setElements(prev => {
            const other = prev.filter(el => !selectedIds.includes(el.id));
            const selected = prev.filter(el => selectedIds.includes(el.id));
            return type === 'front' ? [...other, ...selected] : [...selected, ...other];
        });
    }, []);

    const value = {
        activeTool,
        setActiveTool,
        activeCategory,
        setActiveCategory,
        toolProperties,
        updateToolProperty,
        elements,
        setElements,
        addElement,
        updateElement,
        bulkUpdateElements,
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
        resetZoom,
        canvasRef,
        setCanvasRef,
        exportCanvasPNG,
        exportCanvasSVG,
        exportCanvasPDF,
        importImage,
        copyElements,
        pasteElements,
        duplicateElements,
        selectAll,
        deselectAll,
        background,
        updateBackground,
        showBackgroundModal,
        setShowBackgroundModal,
        showStickyModal,
        setShowStickyModal,
        showFrameModal,
        setShowFrameModal,
        settings,
        updateSettings,
        showSettingsSidebar,
        setShowSettingsSidebar,
        showSavedItemsPanel,
        setShowSavedItemsPanel,
        showExportModal,
        setShowExportModal,
        savedItems,
        saveSelectionAsItem,
        deleteSavedItem,
        showWelcome,
        setShowWelcome,
        hasAutoSave,
        loadAutoSave,
        clearAutoSave,
        ciSettings,
        updateCiSettings,
        ephemeralElements,
        addEphemeralElement,
        removeEphemeralElement,
        selectedElements,
        setSelectedElements,
        alignElements,
        distributeElements,
        reorderElements
    };

    return (
        <WhiteboardContext.Provider value={value}>
            {children}
        </WhiteboardContext.Provider>
    );
};
