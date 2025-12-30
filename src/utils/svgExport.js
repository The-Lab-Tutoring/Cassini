/**
 * Exports whiteboard elements to a vector SVG string.
 * @param {Array} elements - Array of whiteboard elements.
 * @param {Object} background - Background settings.
 * @returns {string|null} SVG string or null if no elements.
 */
export const exportToSVG = (elements, background) => {
    if (!elements || elements.length === 0) return null;

    // 1. Calculate bounding box of all elements to define SVG viewBox
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    elements.forEach(el => {
        let ex = el.x, ey = el.y, ew = el.width || 0, eh = el.height || 0;

        if (el.type === 'stroke') {
            el.points.forEach(p => {
                minX = Math.min(minX, p.x);
                minY = Math.min(minY, p.y);
                maxX = Math.max(maxX, p.x);
                maxY = Math.max(maxY, p.y);
            });
        } else if (el.type === 'text') {
            // Text bounds approximation
            minX = Math.min(minX, ex);
            minY = Math.min(minY, ey - el.fontSize);
            maxX = Math.max(maxX, ex + (el.text.length * el.fontSize * 0.6));
            maxY = Math.max(maxY, ey + el.fontSize);
        } else {
            // Shapes and Images
            minX = Math.min(minX, Math.min(ex, ex + ew));
            minY = Math.min(minY, Math.min(ey, ey + eh));
            maxX = Math.max(maxX, Math.max(ex, ex + ew));
            maxY = Math.max(maxY, Math.max(ey, ey + eh));
        }
    });

    const padding = 50;
    const width = (maxX - minX) + padding * 2;
    const height = (maxY - minY) + padding * 2;
    const viewBox = `${minX - padding} ${minY - padding} ${width} ${height}`;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${width}" height="${height}">\n`;

    // Background Layer
    svg += `  <rect x="${minX - padding}" y="${minY - padding}" width="${width}" height="${height}" fill="${background.backgroundColor}" />\n`;

    // Elements Layer
    elements.filter(el => el.visible !== false).forEach(el => {
        const op = el.opacity || 1;

        if (el.type === 'stroke') {
            const d = el.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
            svg += `  <path d="${d}" fill="none" stroke="${el.color}" stroke-width="${el.thickness}" stroke-linecap="round" stroke-linejoin="round" opacity="${op}" />\n`;
        }
        else if (el.type === 'rectangle') {
            const rx = Math.min(el.x, el.x + el.width);
            const ry = Math.min(el.y, el.y + el.height);
            const rw = Math.abs(el.width);
            const rh = Math.abs(el.height);

            if (el.fillColor && el.fillOpacity > 0) {
                svg += `  <rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="${el.fillColor}" fill-opacity="${el.fillOpacity}" stroke="${el.color}" stroke-width="${el.thickness}" opacity="${op}" />\n`;
            } else {
                svg += `  <rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="none" stroke="${el.color}" stroke-width="${el.thickness}" opacity="${op}" />\n`;
            }
        }
        else if (el.type === 'circle') {
            const cx = el.x + el.width / 2;
            const cy = el.y + el.height / 2;
            const rx = Math.abs(el.width / 2);
            const ry = Math.abs(el.height / 2);

            svg += `  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${el.fillColor || 'none'}" fill-opacity="${el.fillOpacity || 0}" stroke="${el.color}" stroke-width="${el.thickness}" opacity="${op}" />\n`;
        }
        else if (el.type === 'line') {
            svg += `  <line x1="${el.x}" y1="${el.y}" x2="${el.x + el.width}" y2="${el.y + el.height}" stroke="${el.color}" stroke-width="${el.thickness}" stroke-linecap="round" opacity="${op}" />\n`;
        }
        else if (el.type === 'arrow') {
            const x1 = el.x, y1 = el.y, x2 = el.x + el.width, y2 = el.y + el.height;
            const angle = Math.atan2(y2 - y1, x2 - x1);
            const headLen = el.thickness * 4;
            const arrowHead1X = x2 - headLen * Math.cos(angle - Math.PI / 6);
            const arrowHead1Y = y2 - headLen * Math.sin(angle - Math.PI / 6);
            const arrowHead2X = x2 - headLen * Math.cos(angle + Math.PI / 6);
            const arrowHead2Y = y2 - headLen * Math.sin(angle + Math.PI / 6);

            svg += `  <path d="M ${x1} ${y1} L ${x2} ${y2} M ${x2} ${y2} L ${arrowHead1X} ${arrowHead1Y} M ${x2} ${y2} L ${arrowHead2X} ${arrowHead2Y}" fill="none" stroke="${el.color}" stroke-width="${el.thickness}" stroke-linecap="round" stroke-linejoin="round" opacity="${op}" />\n`;
        }
        else if (el.type === 'text') {
            const fontWeight = el.bold ? 'bold' : 'normal';
            const fontStyle = el.italic ? 'italic' : 'normal';
            // Note: browser text rendering in SVG might differ slightly from canvas
            svg += `  <text x="${el.x}" y="${el.y}" fill="${el.color}" font-family="${el.fontFamily}" font-size="${el.fontSize}" font-weight="${fontWeight}" font-style="${fontStyle}" opacity="${op}">${el.text}</text>\n`;
        }
        else if (el.type === 'image') {
            const transform = el.rotation ? ` transform="rotate(${el.rotation} ${el.x + el.width / 2} ${el.y + el.height / 2})"` : '';
            svg += `  <image x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" href="${el.src}" opacity="${op}"${transform}/>\n`;
        }
    });

    svg += '</svg>';
    return svg;
};

/**
 * Utility to download the SVG string as a file.
 * @param {string} svgContent - The generated SVG string.
 * @param {string} filename - Desired filename.
 */
export const downloadSVG = (svgContent, filename = 'cassini-export.svg') => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
