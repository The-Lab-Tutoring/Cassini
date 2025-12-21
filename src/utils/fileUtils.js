/**
 * File Utility Functions for Cassini
 */

/**
 * Save whiteboard elements and state to a JSON file
 * @param {Object} data - The whiteboard data to save
 * @param {string} filename - The name of the file to save
 */
export const saveWhiteboard = (data, filename = 'whiteboard.json') => {
    try {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename.endsWith('.json') ? filename : `${filename}.json`;
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return true;
    } catch (error) {
        console.error('Error saving whiteboard:', error);
        return false;
    }
};

/**
 * Load whiteboard data from a JSON file
 * @param {File} file - The file to load
 * @returns {Promise<Object>} - The parsed whiteboard data
 */
export const loadWhiteboard = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error('No file provided'));
            return;
        }

        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
            reject(new Error('Invalid file type. Please select a JSON file.'));
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                // Basic validation
                if (!data.version || !Array.isArray(data.elements)) {
                    reject(new Error('Invalid whiteboard file format'));
                    return;
                }
                resolve(data);
            } catch (error) {
                reject(new Error('Failed to parse whiteboard file'));
            }
        };

        reader.onerror = () => {
            reject(new Error('Error reading file'));
        };

        reader.readAsText(file);
    });
};

/**
 * Get recent files from localStorage
 * @returns {Array} - List of recent files metadata
 */
export const getRecentFiles = () => {
    try {
        const recent = localStorage.getItem('cassini_recent_files');
        return recent ? JSON.parse(recent) : [];
    } catch (error) {
        console.error('Error getting recent files:', error);
        return [];
    }
};

/**
 * Add a file to recent files list
 * @param {string} name - The name of the canvas
 * @param {Object} data - Minimal data preview or just metadata
 */
export const addRecentFile = (name) => {
    try {
        const recent = getRecentFiles();
        const newEntry = {
            id: Date.now().toString(),
            name,
            lastOpened: new Date().toISOString()
        };

        // Keep only last 10 files, remove duplicates if name exists
        const updated = [newEntry, ...recent.filter(f => f.name !== name)].slice(0, 10);

        localStorage.setItem('cassini_recent_files', JSON.stringify(updated));
        return updated;
    } catch (error) {
        console.error('Error adding recent file:', error);
        return [];
    }
};
