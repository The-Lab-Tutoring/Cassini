// Geometry utility functions for ruler and protractor interactions

export function lineIntersectsRect(x1, y1, x2, y2, rect) {
    // Check if line segment (x1,y1)-(x2,y2) intersects rectangle
    const { x, y, width, height } = rect;

    // Check if line intersects any of the four sides of the rectangle
    return (
        lineIntersectsLine(x1, y1, x2, y2, x, y, x + width, y) ||
        lineIntersectsLine(x1, y1, x2, y2, x + width, y, x + width, y + height) ||
        lineIntersectsLine(x1, y1, x2, y2, x + width, y + height, x, y + height) ||
        lineIntersectsLine(x1, y1, x2, y2, x, y + height, x, y)
    );
}

export function lineIntersectsLine(x1, y1, x2, y2, x3, y3, x4, y4) {
    // Check if line segment (x1,y1)-(x2,y2) intersects line segment (x3,y3)-(x4,y4)
    const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (denom === 0) return false;

    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
    const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;

    return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
}

export function pointInRect(x, y, rect) {
    return (
        x >= rect.x &&
        x <= rect.x + rect.width &&
        y >= rect.y &&
        y <= rect.y + rect.height
    );
}

export function distanceToLine(px, py, x1, y1, x2, y2) {
    // Calculate distance from point (px,py) to line segment (x1,y1)-(x2,y2)
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;

    if (param < 0) {
        xx = x1;
        yy = y1;
    } else if (param > 1) {
        xx = x2;
        yy = y2;
    } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
}

export function snapToRulerEdge(x, y, ruler, threshold = 10) {
    // Snap point to nearest ruler edge if within threshold
    if (!ruler) return { x, y };

    const edges = [
        { x1: ruler.x, y1: ruler.y, x2: ruler.x + ruler.width, y2: ruler.y },
        { x1: ruler.x + ruler.width, y1: ruler.y, x2: ruler.x + ruler.width, y2: ruler.y + ruler.height },
        { x1: ruler.x + ruler.width, y1: ruler.y + ruler.height, x2: ruler.x, y2: ruler.y + ruler.height },
        { x1: ruler.x, y1: ruler.y + ruler.height, x2: ruler.x, y2: ruler.y }
    ];

    let minDist = Infinity;
    let snapPoint = { x, y };

    edges.forEach(edge => {
        const dist = distanceToLine(x, y, edge.x1, edge.y1, edge.x2, edge.y2);
        if (dist < minDist && dist < threshold) {
            minDist = dist;
            // Calculate closest point on edge
            const A = x - edge.x1;
            const B = y - edge.y1;
            const C = edge.x2 - edge.x1;
            const D = edge.y2 - edge.y1;
            const dot = A * C + B * D;
            const lenSq = C * C + D * D;
            const param = Math.max(0, Math.min(1, dot / lenSq));
            snapPoint = {
                x: edge.x1 + param * C,
                y: edge.y1 + param * D
            };
        }
    });

    return snapPoint;
}

export function pointInArc(px, py, protractor) {
    // Check if point is within protractor arc
    if (!protractor) return false;

    const { x, y, radius, startAngle, endAngle } = protractor;
    const dx = px - x;
    const dy = py - y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > radius) return false;

    let angle = Math.atan2(dy, dx);
    if (angle < 0) angle += 2 * Math.PI;

    return angle >= startAngle && angle <= endAngle;
}

export function calculateAngle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}

export function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}
