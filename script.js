document.addEventListener('DOMContentLoaded', () => {
  const table = document.getElementById('periodic-table');
  const searchInput = document.getElementById('search');
  const darkToggle = document.getElementById('dark-mode-toggle');
  const modal = document.getElementById('element-modal');
  const modalBody = document.getElementById('modal-body');
  const closeBtn = modal.querySelector('.modal-close');
  const loadingTemplate = document.getElementById('loading-template');
  const errorTemplate = document.getElementById('error-template');

  let allElements = [];
  let lastFocused = null;

  // Theme management
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  const savedTheme = localStorage.getItem('theme') || 
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(savedTheme);

  darkToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

 // Updated category classification function
function getElementCategory(element) {
  // 1) Normalize any JSON‐provided category
  if (element.category) {
    const cat = element.category.toLowerCase();
    if (cat === 'lanthanoid') return 'lanthanide';
    if (cat === 'actinoid')   return 'actinide';
    if (cat.includes('nonmetal')) return 'reactive nonmetal';
    return cat;  // alkali metal, alkaline earth metal, transition metal, post-transition metal, metalloid, noble gas
  }

  // 2) Fallback by atomic number (identical to your old logic)
  const n = element.number;
  if (n >= 57 && n <= 71)   return 'lanthanide';
  if (n >= 89 && n <= 103)  return 'actinide';
  if ([2,10,18,36,54,86,118].includes(n)) return 'noble gas';
  if ([3,11,19,37,55,87].includes(n))      return 'alkali metal';
  if ([4,12,20,38,56,88].includes(n))      return 'alkaline earth metal';
  if ([5,14,32,33,51,52].includes(n))      return 'metalloid';
  if ([13,31,49,50,81,82,83,84,113,114,115,116].includes(n)) 
    return 'post-transition metal';
  if ((n >= 21 && n <= 30) || (n >= 39 && n <= 48) ||
      (n >= 72 && n <= 80) || (n >= 104 && n <= 112))
    return 'transition metal';
  if ([1,6,7,8,9,15,16,17,34,35,53,85,117].includes(n))
    return 'reactive nonmetal';
  return 'unknown';
}

  // Loading states
  function showLoading() {
    table.innerHTML = '';
    table.appendChild(loadingTemplate.content.cloneNode(true));
  }

  function showError() {
    table.innerHTML = '';
    const errorNode = errorTemplate.content.cloneNode(true);
    table.appendChild(errorNode);
    const retryButton = table.querySelector('#retry-button');
    retryButton.addEventListener('click', loadElements);
  }

  function hideLoading() {
    const loading = table.querySelector('.loading');
    if (loading) loading.remove();
  }

  // Element loading
  function loadElements() {
    showLoading();
    fetch('elements.json')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        allElements = Array.isArray(data) ? data : data.elements;
        renderTable(allElements);
      })
      .catch(err => {
        console.error('Error loading elements:', err);
        showError();
      });
  }

  // Table rendering
  function renderTable(elements) {
    hideLoading();
    table.innerHTML = '';

    // Create empty grid
    for (let row = 1; row <= 9; row++) {
      for (let col = 1; col <= 18; col++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'empty-cell';
        emptyCell.style.gridColumn = col;
        emptyCell.style.gridRow = row;
        table.appendChild(emptyCell);
      }
    }

    // Add elements
    elements.forEach(el => {
      const category = getElementCategory(el);
      const cell = document.createElement('div');
      cell.className = 'element';
      cell.dataset.category = category;
      cell.style.gridColumn = el.xpos || 1;
      cell.style.gridRow = el.ypos || 1;
      cell.setAttribute('role', 'gridcell');
      cell.setAttribute('aria-label', `${el.name} (${el.symbol}), ${category}`);
      cell.tabIndex = 0;
      
      cell.innerHTML = `
        <div class="number">${el.number}</div>
        <div class="symbol">${el.symbol}</div>
        <div class="name">${el.name}</div>
      `;
      
      // Special handling for lanthanides and actinides
      if (el.number >= 57 && el.number <= 71) {
        cell.style.gridRow = 8;
        cell.style.gridColumn = el.number - 54;
      } else if (el.number >= 89 && el.number <= 103) {
        cell.style.gridRow = 9;
        cell.style.gridColumn = el.number - 86;
      }
      
      cell.addEventListener('click', () => openModal(el, category));
      cell.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(el, category);
        }
      });
      
      table.appendChild(cell);
    });

    // Add animations
    setTimeout(() => {
      document.querySelectorAll('.element').forEach((el, i) => {
        setTimeout(() => {
          el.classList.add('animate-in');
        }, i * 20);
      });
    }, 100);
  }

  // Modal functions
  function openModal(element, category) {
    lastFocused = document.activeElement;
    
    modalBody.innerHTML = `
      <div class="modal-header">
        <div class="modal-symbol" data-category="${category}">${element.symbol}</div>
        <div class="modal-title">
          <h2>${element.name}</h2>
          <p>${element.number} | ${category}</p>
        </div>
      </div>
      <div class="modal-details">
        <div class="detail-item">
          <h3>Atomic Mass</h3>
          <p>${element.atomic_mass ? element.atomic_mass.toFixed(3) : '—'}</p>
        </div>
        <div class="detail-item">
          <h3>Electron Config</h3>
          <p>${element.electron_configuration_semantic || element.electron_configuration || '—'}</p>
        </div>
        <div class="detail-item">
          <h3>Electronegativity</h3>
          <p>${element.electronegativity_pauling || '—'}</p>
        </div>
        <div class="detail-item">
          <h3>Phase at STP</h3>
          <p>${element.phase ? element.phase.charAt(0).toUpperCase() + element.phase.slice(1) : '—'}</p>
        </div>
        <div class="detail-item">
          <h3>Melting Point</h3>
          <p>${element.melt ? `${element.melt} K` : '—'}</p>
        </div>
        <div class="detail-item">
          <h3>Boiling Point</h3>
          <p>${element.boil ? `${element.boil} K` : '—'}</p>
        </div>
        <div class="detail-item">
          <h3>Density</h3>
          <p>${element.density ? `${element.density} g/cm³` : '—'}</p>
        </div>
        <div class="detail-item">
          <h3>Discovered</h3>
          <p>${element.discovered_by || 'Unknown'}</p>
        </div>
      </div>
      <div class="modal-summary">
        <p>${element.summary || 'No summary available.'}</p>
      </div>
    `;
    
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    if (lastFocused) lastFocused.focus();
  }

  // Event listeners
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });

// Search functionality (starts-with, case-insensitive)
searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = query
    ? allElements.filter(el => 
        el.name.toLowerCase().startsWith(query) ||
        el.symbol.toLowerCase().startsWith(query) ||
        el.number.toString().startsWith(query)
      )
    : allElements;
  
  renderTable(filtered);
  
  if (query) {
    document.querySelectorAll('.element').forEach(el => {
      const symbol = el.querySelector('.symbol').textContent.toLowerCase();
      const name   = el.querySelector('.name').textContent.toLowerCase();
      if (symbol.startsWith(query) || name.startsWith(query)) {
        el.style.animation = 'pulse 0.5s';
        setTimeout(() => el.style.animation = '', 500);
      }
    });
  }
});

  loadElements();
});
