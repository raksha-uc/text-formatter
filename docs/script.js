document.addEventListener("DOMContentLoaded", function() {
    const htmlInput = document.getElementById("htmlInput");
    const preview = document.getElementById("preview");
    const renderBtn = document.getElementById("renderBtn");
    const clearBtn = document.getElementById("clearBtn");
    const formatBtn = document.getElementById("formatBtn");

    // Function to beautify HTML
    function beautifyHTML(html) {
        let formatted = '';
        let indent = 0;
        
        // Split on both line breaks and '>'
        const tags = html.replace(/\s+</g, '<')
                        .replace(/>\s+/g, '>')
                        .replace(/>([^<]*)</g, '>⊗$1<')
                        .split('⊗');

        tags.forEach(tag => {
            if (tag.match(/<\//)) {  // Closing tag
                indent--;
            }
            
            formatted += '  '.repeat(Math.max(0, indent)) + tag.trim() + '\n';
            
            if (tag.match(/<[^/]/) && !tag.match(/\/>/)) {  // Opening tag
                indent++;
            }
        });
        
        return formatted.trim();
    }

    // Function to safely render HTML
    function sanitizeHTML(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.innerHTML;
    }

    // Function to update all views
    function updateViews() {
        const input = document.getElementById('htmlInput');
        const preview = document.getElementById('preview');
        const formattedCode = document.getElementById('formattedCode');
        const html = input.value.trim();

        if (html) {
            try {
                // Update the formatted code view
                const beautified = beautifyHTML(html);
                formattedCode.textContent = beautified;
                Prism.highlightElement(formattedCode);
                
                // Update the preview
                preview.innerHTML = sanitizeHTML(html);
            } catch (error) {
                preview.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
                formattedCode.textContent = 'Error formatting HTML';
                Prism.highlightElement(formattedCode);
            }
        } else {
            preview.innerHTML = '<p class="text-gray-500">Preview will appear here...</p>';
            formattedCode.textContent = '';
            Prism.highlightElement(formattedCode);
        }
    }

    // Function to handle the format button click
    function formatHTML() {
        const input = document.getElementById('htmlInput');
        const html = input.value.trim();

        if (html) {
            try {
                // Beautify the input HTML
                const beautified = beautifyHTML(html);
                
                // Update the input with beautified HTML
                input.value = beautified;
                
                // Update the formatted view
                updateViews();
            } catch (error) {
                console.error('Formatting error:', error);
            }
        }
    }

    // Function to handle the render button click
    function renderHTML() {
        const input = document.getElementById('htmlInput');
        const preview = document.getElementById('preview');
        const html = input.value.trim();

        if (html) {
            try {
                // Update the formatted view
                updateViews();
                
                // Render the HTML in the preview
                preview.innerHTML = sanitizeHTML(html);
            } catch (error) {
                preview.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
            }
        } else {
            preview.innerHTML = '<p class="text-[#0d141c] text-base font-normal leading-normal">The rendered HTML will appear here after you click \'Render HTML\'.</p>';
        }
    }

    // Function to clear both input and preview
    function clearAll() {
        htmlInput.value = "";
        preview.innerHTML = "";
    }

    // Event listeners
    renderBtn.addEventListener("click", renderHTML);
    clearBtn.addEventListener("click", clearAll);
    formatBtn.addEventListener("click", formatHTML);

    // Auto-render as user types (with debounce)
    let timeout;
    htmlInput.addEventListener("input", function() {
        clearTimeout(timeout);
        timeout = setTimeout(renderHTML, 500);
    });

    // Add keyboard shortcut (Ctrl/Cmd + Enter)
    htmlInput.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            renderHTML();
        } else if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            formatHTML();
            e.preventDefault();
        }
    });

    // Format and render on paste
    htmlInput.addEventListener('paste', () => {
        setTimeout(() => {
            formatHTML();
            renderHTML();
        }, 0);
    });

    // Initialize views
    updateViews();
});