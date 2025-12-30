import { createWorker } from 'tesseract.js';

/**
 * Converts strokes to an image and performs OCR using Tesseract.js
 * @param {Array} strokes - Array of stroke elements
 * @param {Object} bounds - collective bounds of the strokes
 * @returns {Promise<string>} - recognized text
 */
export const recognizeHandwriting = async (strokes, bounds) => {
    if (!strokes || strokes.length === 0 || !bounds) return "No strokes";

    // 1. Setup offscreen canvas
    const padding = 20;
    const canvas = document.createElement('canvas');
    canvas.width = bounds.width + padding * 2;
    canvas.height = bounds.height + padding * 2;
    const ctx = canvas.width > 0 && canvas.height > 0 ? canvas.getContext('2d') : null;

    if (!ctx) return "OCR Error: Invalid Bounds";

    // 2. Clear canvas with white background (Tesseract likes black text on white)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 3. Draw strokes
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    strokes.forEach(stroke => {
        if (!stroke.points || stroke.points.length < 2) return;

        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x - bounds.minX + padding, stroke.points[0].y - bounds.minY + padding);
        for (let i = 1; i < stroke.points.length; i++) {
            ctx.lineTo(stroke.points[i].x - bounds.minX + padding, stroke.points[i].y - bounds.minY + padding);
        }
        ctx.stroke();
    });

    // 4. Perform OCR
    try {
        const worker = await createWorker('eng');
        const ret = await worker.recognize(canvas);
        await worker.terminate();

        const text = ret.data.text.trim();
        return text || "Unrecognized";
    } catch (err) {
        console.error("OCR Engine Error:", err);
        return "OCR Failed";
    }
};
