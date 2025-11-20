import katex from 'katex';

// Safely render LaTeX to HTML string
export function renderLatexToHtml(latex) {
    try {
        // Enable mhchem for chemistry support
        const html = katex.renderToString(latex, {
            throwOnError: false,
            errorColor: '#ff6b6b',
            strict: false,
            trust: true,
            macros: {
                "\\ce": "\\ce"  // Chemistry equations support
            }
        });
        return { success: true, html, error: null };
    } catch (error) {
        console.error('KaTeX rendering error:', error);
        return {
            success: false,
            html: null,
            error: `Invalid LaTeX: ${error.message}`
        };
    }
}

// Convert rendered LaTeX HTML to canvas image
export async function latexToCanvasImage(latex, fontSize = 24, color = '#000000') {
    return new Promise((resolve, reject) => {
        try {
            const result = renderLatexToHtml(latex);

            if (!result.success) {
                reject(new Error(result.error));
                return;
            }

            // Create temporary container to measure dimensions
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.fontSize = `${fontSize}px`;
            container.style.color = color;
            container.innerHTML = result.html;
            document.body.appendChild(container);

            // Wait for fonts to load
            setTimeout(() => {
                const bbox = container.getBoundingClientRect();
                document.body.removeChild(container);

                // Return the LaTeX and dimensions instead of dataURL to avoid tainting
                resolve({
                    latex: latex,
                    html: result.html,
                    width: bbox.width + 20,
                    height: bbox.height + 20,
                    fontSize: fontSize,
                    color: color
                });
            }, 100);
        } catch (error) {
            reject(error);
        }
    });
}

// Validate LaTeX syntax
export function validateLatex(latex) {
    try {
        katex.renderToString(latex, { throwOnError: true, strict: false });
        return { valid: true, error: null };
    } catch (error) {
        return { valid: false, error: error.message };
    }
}
