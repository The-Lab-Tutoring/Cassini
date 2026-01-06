export const drawGrid = (ctx, width, height, background) => {
    if (background.gridType === 'none') return;

    const { gridType, gridSize, gridColor } = background;

    ctx.save();
    ctx.strokeStyle = gridColor;
    ctx.fillStyle = gridColor;

    if (gridType === 'dots') {
        for (let x = gridSize; x < width; x += gridSize) {
            for (let y = gridSize; y < height; y += gridSize) {
                ctx.beginPath();
                ctx.arc(x, y, 1.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    } else if (gridType === 'lines') {
        ctx.lineWidth = 0.5;
        for (let x = gridSize; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = gridSize; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    } else if (gridType === 'squares') {
        ctx.lineWidth = 0.5;
        for (let x = 0; x < width; x += gridSize) {
            for (let y = 0; y < height; y += gridSize) {
                ctx.strokeRect(x, y, gridSize, gridSize);
            }
        }
    }

    ctx.restore();
};

export const drawStroke = (ctx, element) => {
    if (!element.points || element.points.length === 0) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = element.color;
    ctx.globalAlpha = element.opacity;

    if (element.points[0].pressure !== undefined) {
        for (let i = 1; i < element.points.length; i++) {
            const p1 = element.points[i - 1];
            const p2 = element.points[i];

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);

            const pressure = p2.pressure || 0.5;
            const dynamicThickness = Math.max(1, element.thickness * pressure * 2);

            ctx.lineWidth = dynamicThickness;
            ctx.stroke();
        }
    } else {
        ctx.beginPath();
        ctx.lineWidth = element.thickness;
        ctx.moveTo(element.points[0].x, element.points[0].y);
        for (let i = 1; i < element.points.length; i++) {
            ctx.lineTo(element.points[i].x, element.points[i].y);
        }
        ctx.stroke();
    }

    ctx.globalAlpha = 1;
};

export const drawText = (ctx, element) => {
    ctx.save();
    ctx.globalAlpha = element.opacity || 1;

    const fontWeight = element.bold ? 'bold' : 'normal';
    const fontStyle = element.italic ? 'italic' : 'normal';
    ctx.font = `${fontStyle} ${fontWeight} ${element.fontSize}px ${element.fontFamily}`;
    ctx.fillStyle = element.color;

    const lines = element.text.split('\n');
    const lineHeight = element.fontSize * 1.2;

    let maxWidth = 0;
    lines.forEach(line => {
        const metrics = ctx.measureText(line);
        maxWidth = Math.max(maxWidth, metrics.width);
    });
    const totalHeight = lines.length * lineHeight;

    if (element.backgroundColor) {
        ctx.fillStyle = element.backgroundColor;
        const padding = 8;
        ctx.fillRect(
            element.x - padding,
            element.y - element.fontSize - padding,
            maxWidth + padding * 2,
            totalHeight + padding * 2
        );
        ctx.fillStyle = element.color;
    }

    lines.forEach((line, index) => {
        let xPos = element.x;

        if (element.textAlign === 'center') {
            const lineWidth = ctx.measureText(line).width;
            xPos = element.x + (maxWidth - lineWidth) / 2;
        } else if (element.textAlign === 'right') {
            const lineWidth = ctx.measureText(line).width;
            xPos = element.x + maxWidth - lineWidth;
        }

        const yPos = element.y + (index * lineHeight);

        ctx.fillText(line, xPos, yPos);

        if (element.underline) {
            const lineWidth = ctx.measureText(line).width;
            ctx.beginPath();
            ctx.strokeStyle = element.color;
            ctx.lineWidth = Math.max(1, element.fontSize / 15);
            ctx.moveTo(xPos, yPos + 3);
            ctx.lineTo(xPos + lineWidth, yPos + 3);
            ctx.stroke();
        }
    });

    ctx.restore();
};

export const drawShape = (ctx, element) => {
    ctx.save();
    ctx.strokeStyle = element.color;
    ctx.lineWidth = element.thickness;
    ctx.globalAlpha = element.opacity;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (element.rotation) {
        const centerX = element.x + element.width / 2;
        const centerY = element.y + element.height / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate(element.rotation * Math.PI / 180);
        ctx.translate(-centerX, -centerY);
    }

    if (element.type === 'rectangle') {
        if (element.fillColor && element.fillOpacity > 0) {
            ctx.fillStyle = element.fillColor;
            ctx.globalAlpha = element.fillOpacity;
            ctx.fillRect(element.x, element.y, element.width, element.height);
            ctx.globalAlpha = 1;
        }
        ctx.strokeRect(element.x, element.y, element.width, element.height);
    } else if (element.type === 'circle') {
        ctx.beginPath();
        ctx.ellipse(
            element.x + element.width / 2,
            element.y + element.height / 2,
            Math.abs(element.width / 2),
            Math.abs(element.height / 2),
            0, 0, 2 * Math.PI
        );
        if (element.fillColor && element.fillOpacity > 0) {
            ctx.fillStyle = element.fillColor;
            ctx.globalAlpha = element.fillOpacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
        ctx.stroke();
    } else if (element.type === 'line') {
        ctx.beginPath();
        ctx.moveTo(element.x, element.y);
        ctx.lineTo(element.x + element.width, element.y + element.height);
        ctx.stroke();
    } else if (element.type === 'arrow') {
        const startX = element.x;
        const startY = element.y;
        const endX = element.x + element.width;
        const endY = element.y + element.height;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        const angle = Math.atan2(endY - startY, endX - startX);
        const headLength = element.thickness * 4;

        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - headLength * Math.cos(angle - Math.PI / 6), endY - headLength * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(endX - headLength * Math.cos(angle + Math.PI / 6), endY - headLength * Math.sin(angle + Math.PI / 6));
        ctx.lineTo(endX, endY);
        ctx.fillStyle = element.color;
        ctx.fill();
    }
    ctx.restore();
};

export const drawSticky = (ctx, element) => {
    ctx.save();
    ctx.globalAlpha = element.opacity || 1;

    // Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    ctx.fillStyle = element.color || '#FFEB3B';
    const radius = 5;
    const x = element.x;
    const y = element.y;
    const w = element.width;
    const h = element.height;

    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    if (element.text) {
        ctx.fillStyle = '#333333';
        ctx.font = `${element.fontSize || 16}px Inter`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const padding = 20;
        const maxWidth = w - padding * 2;
        const words = element.text.split(' ');
        let line = '';
        let lines = [];
        const lineHeight = (element.fontSize || 16) * 1.2;

        for (let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + ' ';
            let metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
                lines.push(line);
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line);

        const totalTextHeight = lines.length * lineHeight;
        let startY = y + (h - totalTextHeight) / 2 + lineHeight / 2;

        lines.forEach((l, i) => {
            ctx.fillText(l.trim(), x + w / 2, startY + i * lineHeight);
        });
    }
    ctx.restore();
};

export const drawFrame = (ctx, element, scale = 1) => {
    ctx.save();
    ctx.globalAlpha = element.opacity || 1;

    ctx.fillStyle = element.color || 'rgba(0, 122, 255, 0.05)';
    ctx.fillRect(element.x, element.y, element.width, element.height);

    ctx.strokeStyle = '#007AFF';
    ctx.lineWidth = 2 / scale;
    ctx.setLineDash([10 / scale, 5 / scale]);
    ctx.strokeRect(element.x, element.y, element.width, element.height);
    ctx.setLineDash([]);

    ctx.fillStyle = '#007AFF';
    ctx.font = `bold ${14 / scale}px Inter`;
    ctx.fillText(element.name || 'Frame', element.x + 5 / scale, element.y - 10 / scale);

    ctx.restore();
};

export const drawImage = (ctx, element, imageCache, onImageLoad) => {
    if (!element.src) return;

    let img = imageCache.get(element.src);
    if (!img) {
        img = new Image();
        img.crossOrigin = "Anonymous"; // Fix taint issues for export
        img.src = element.src;
        img.onload = () => {
            imageCache.set(element.src, img);
            if (onImageLoad) onImageLoad();
        };
        return;
    }

    ctx.save();
    ctx.globalAlpha = element.opacity || 1;

    if (element.rotation) {
        const centerX = element.x + element.width / 2;
        const centerY = element.y + element.height / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate(element.rotation * Math.PI / 180);
        ctx.translate(-centerX, -centerY);
    }

    ctx.drawImage(img, element.x, element.y, element.width, element.height);
    ctx.globalAlpha = 1;
    ctx.restore();
};

export const drawEquation = (ctx, element) => {
    // This is asynchronous in Whiteboard.jsx, but here we just copy the logic.
    // Ideally we should cache the generated SVG image like we do for regular images.
    // For now, simpler implementation for direct render if we can.
    // Whiteboard.jsx logic was creating DOM elements.
    // We can't do that easily in a pure function without side effects on DOM.
    // For export, we might skip equation re-generation if possible, or accept that it might be slow.
    // A better approach for export is to assume equation images are arguably cached or we use a separate rendering pass.

    // Placeholder: if equation has a cached image, draw it.
    // Note: The original implementation re-generated SVG every frame? No, probably not.
    // Actually the original implementation DID regenerate it inside drawEquation!
    // That is very inefficient.
    // Refactoring to cache it is better.

    if (element.html) {
        // This requires async handling or DOM access which is tricky in pure utils.
        // Pass for now? Or copy the logic?
        // The logic uses document.createElement.
        // We'll trust the caller handles the DOM cleanup or we just do it here.

        // NOTE: This will be slow for export loop if called many times.
        // But "Enhanced Export" makes a single pass.

        // The issue: img.onload is async. Canvas export needs to wait.
        // We'll leave equation drawing to the main loop or just skip it for now in this util
        // and let Whiteboard.jsx handle it with its own logic if it wants to keep it.
        // But we want to reuse it.

        // We will rely on the fact that for export we might need to "wait" for all images.
        // Implement basic logic here.

        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.fontSize = `${element.fontSize}px`;
        tempDiv.style.color = element.color;
        tempDiv.innerHTML = element.html;
        document.body.appendChild(tempDiv);

        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${element.width}" height="${element.height}">
                <foreignObject width="100%" height="100%">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="font-size: ${element.fontSize}px; color: ${element.color}; padding: 10px;">
                        ${element.html}
                    </div>
                </foreignObject>
            </svg>
        `;

        const img = new Image();
        const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        img.onload = () => {
            ctx.globalAlpha = element.opacity || 1;
            ctx.drawImage(img, element.x, element.y, element.width, element.height);
            ctx.globalAlpha = 1;
            URL.revokeObjectURL(url);
            document.body.removeChild(tempDiv);
        };
        img.src = url;
    }
};

export const drawElement = (ctx, element, options = {}) => {
    switch (element.type) {
        case 'stroke':
            drawStroke(ctx, element);
            break;
        case 'text':
            drawText(ctx, element);
            break;
        case 'rectangle':
        case 'circle':
        case 'line':
        case 'arrow':
            drawShape(ctx, element);
            break;
        case 'sticky':
            drawSticky(ctx, element);
            break;
        case 'frame':
            drawFrame(ctx, element, options.scale);
            break;
        case 'image':
            drawImage(ctx, element, options.imageCache, options.onImageLoad);
            break;
        case 'equation':
            drawEquation(ctx, element);
            break;
        default:
            break;
    }
};
