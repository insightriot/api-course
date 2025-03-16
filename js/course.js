// Module content cache to prevent unnecessary fetches
const moduleContentCache = {};

// Module file paths mapping
const moduleFiles = {
  1: 'content/module1_api_fundamentals.md',
  2: 'content/module2_api_types.md',
  3: 'content/module3_ai_apis.md',
  4: 'content/module4_authentication.md',
  5: 'content/module5_vector_stores.md',
  6: 'content/module6_python_api_calls.md',
  7: 'content/module7_practical_applications.md'
};

// Function to convert markdown to HTML with sanitization
function markdownToHtml(markdown) {
  // Configure marked for security
  marked.setOptions({
    sanitize: true,
    gfm: true
  });
  return marked.parse(markdown);
}

// Function to load module content
async function loadModuleContent(moduleNumber) {
  try {
    // Check if content is already in cache
    if (moduleContentCache[moduleNumber]) {
      console.log(`Using cached content for module ${moduleNumber}`);
      return moduleContentCache[moduleNumber];
    }
    
    // Get the file path from our mapping
    const filePath = moduleFiles[moduleNumber];
    
    // If module number is invalid
    if (!filePath) {
      return `# Module ${moduleNumber}\n\nContent for this module could not be loaded. Please check that the file exists.`;
    }
    
    console.log(`Fetching content for module ${moduleNumber} from ${filePath}`);
    const response = await fetch(filePath);
    
    if (response.ok) {
      const content = await response.text();
      // Store in cache for future use
      moduleContentCache[moduleNumber] = content;
      return content;
    } else {
      throw new Error(`Failed to load module ${moduleNumber}: ${response.status} ${response.statusText}`);
    }
    
  } catch (error) {
    console.error('Error loading module content:', error);
    return `# Error Loading Module ${moduleNumber}\n\nThere was an error loading the content for this module. Please try again later.`;
  }
}

// Function to open module content
async function openModule(moduleNumber) {
  const moduleModal = document.getElementById('module-modal');
  const moduleContent = document.getElementById('module-content');
  
  // Show loading indicator
  moduleContent.innerHTML = '<div style="text-align: center; padding: 20px;"><div class="loading-spinner"></div><p>Loading module content...</p></div>';
  moduleModal.style.display = 'block';
  
  try {
    // Load the module content
    const markdown = await loadModuleContent(moduleNumber);
    
    // Convert markdown to HTML
    const html = markdownToHtml(markdown);
    
    // Display the content
    moduleContent.innerHTML = `
      <h2 id="module-title">Module ${moduleNumber}</h2>
      <div class="module-content-container">
        ${html}
      </div>
      <div style="margin-top: 20px;">
        <button class="btn" onclick="markModuleComplete(${moduleNumber})">Mark as Complete</button>
      </div>
    `;
    
    // Save the current module number to localStorage
    localStorage.setItem('last-viewed-module', moduleNumber);
    
  } catch (error) {
    console.error('Error displaying module content:', error);
    moduleContent.innerHTML = `
      <h2>Error</h2>
      <p>There was an error loading the module content. Please try again later.</p>
      <p>Error details: ${error.message}</p>
    `;
  }
}

// Close module modal
function closeModuleModal() {
  document.getElementById('module-modal').style.display = 'none';
}

// Show login modal
function showLoginModal() {
  document.getElementById('login-modal').style.display = 'block';
}

// Close login modal
function closeLoginModal() {
  document.getElementById('login-modal').style.display = 'none';
}

// Mark module as complete
function markModuleComplete(moduleNumber) {
  const progressModule = document.getElementById(`progress-module-${moduleNumber}`);
  progressModule.classList.remove('in-progress');
  progressModule.classList.add('completed');
  
  // Save completion status to localStorage
  localStorage.setItem(`module-${moduleNumber}-complete`, 'true');
  
  updateProgress();
  
  // Close the modal
  closeModuleModal();
}

// Update overall progress
function updateProgress() {
  const totalModules = 7;
  let completedModules = 0;
  
  for (let i = 1; i <= totalModules; i++) {
    if (document.getElementById(`progress-module-${i}`).classList.contains('completed')) {
      completedModules++;
    }
  }
  
  const progressPercentage = (completedModules / totalModules) * 100;
  document.getElementById('overall-progress').style.width = `${progressPercentage}%`;
}

// Load saved progress from localStorage
function loadSavedProgress() {
  for (let i = 1; i <= 7; i++) {
    if (localStorage.getItem(`module-${i}-complete`) === 'true') {
      document.getElementById(`progress-module-${i}`).classList.add('completed');
    }
  }
  
  updateProgress();
  
  // Check if there was a last viewed module and highlight it
  const lastViewedModule = localStorage.getItem('last-viewed-module');
  if (lastViewedModule) {
    const moduleElement = document.getElementById(`progress-module-${lastViewedModule}`);
    if (moduleElement && !moduleElement.classList.contains('completed')) {
      moduleElement.classList.add('in-progress');
    }
  }
}

// Handle login form submission
document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // In a real application, this would authenticate with a server
  // For this demo, we'll just close the modal and show a success message
  alert('Login successful! Your progress will now be tracked.');
  closeLoginModal();
});

// Add keyboard navigation for modals
document.addEventListener('keydown', function(e) {
  // Close modals with Escape key
  if (e.key === 'Escape') {
    closeLoginModal();
    closeModuleModal();
  }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  loadSavedProgress();
});

// Close modals when clicking outside
window.onclick = function(event) {
  if (event.target == document.getElementById('login-modal')) {
    closeLoginModal();
  }
  if (event.target == document.getElementById('module-modal')) {
    closeModuleModal();
  }
}
