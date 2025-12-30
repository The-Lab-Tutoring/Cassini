import { jsPDF } from 'jspdf';

/**
 * Exports the whiteboard canvas to a PDF document.
 * @param {HTMLCanvasElement} canvas - The canvas element to export.
 * @param {string} filename - Desired filename.
 */
export const exportToPDF = (canvas, filename = 'cassini-export.pdf') => {
    if (!canvas) {
        console.error('Canvas not found for PDF export');
        return;
    }

    try {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(filename);
    } catch (error) {
        console.error('PDF export failed:', error);
        alert('Failed to export PDF. Please try again.');
    }
};
