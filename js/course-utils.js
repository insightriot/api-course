// Markdown parser
const marked = window.marked;

// Function to load module content
async function loadModuleContent(moduleNumber) {
    try {
        const response = await fetch(`content/module${moduleNumber}_api_fundamentals.md`);
        if (moduleNumber === 1) {
            const response = await fetch('content/module1_api_fundamentals.md');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.text();
        } else if (moduleNumber === 2) {
            const response = await fetch('content/module2_api_types.md');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.text();
        } else if (moduleNumber === 3) {
            const response = await fetch('content/module3_ai_apis.md');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.text();
        } else if (moduleNumber === 4) {
            const response = await fetch('content/module4_authentication.md');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.text();
        } else if (moduleNumber === 5) {
            const response = await fetch('content/module5_vector_stores.md');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.text();
        } else if (moduleNumber === 6) {
            const response = await fetch('content/module6_python_api_calls.md');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.text();
        } else if (moduleNumber === 7) {
            const response = await fetch('content/module7_practical_applications.md');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.text();
        } else {
            throw new Error('Invalid module number');
        }
    } catch (error) {
        console.error('Error loading module content:', error);
        return `# Error Loading Module ${moduleNumber}\n\nThere was an error loading the content for this module. Please try again later or contact support.`;
    }
}

// Function to render markdown content
function renderMarkdown(markdown) {
    return marked.parse(markdown);
}

// Export functions
window.courseUtils = {
    loadModuleContent,
    renderMarkdown
};
