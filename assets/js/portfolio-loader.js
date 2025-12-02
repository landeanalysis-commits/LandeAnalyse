/**
 * Portfolio Loader - Dynamically loads and renders portfolio items
 * Lande Analyse - landeanalyse.no
 */

// Tag label translations
const TAG_LABELS = {
    'dataanalyse': { no: 'Dataanalyse', en: 'Data Analysis' },
    'data-cleaning': { no: 'Datarens', en: 'Data Cleaning' },
    'datastructuring': { no: 'Datastrukturering', en: 'Data Structuring' },
    'consulting': { no: 'Rådgivning', en: 'Consulting' },
    'automatisation': { no: 'Automatisering', en: 'Automatisation' },
    'website': { no: 'Nettside', en: 'Website' },
    'process-optimization': { no: 'Prosessoptimalisering', en: 'Process Optimization' },
    'inventory-management': { no: 'Lagerstyring', en: 'Inventory Management' }
};

/**
 * Load portfolio items from JSON and render them
 */
async function loadPortfolio() {
    try {
        const response = await fetch('/assets/data/portfolio.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const lang = document.documentElement.lang || 'no';

        const container = document.getElementById('portfolio-container');

        if (!container) {
            console.error('Portfolio container not found!');
            return;
        }

        // Clear loading message
        container.innerHTML = '';

        // Sort by order and render each item
        data.items
            .sort((a, b) => a.order - b.order)
            .forEach(item => {
                container.appendChild(createPortfolioCard(item, lang));
            });

    } catch (error) {
        console.error('Error loading portfolio:', error);
        const container = document.getElementById('portfolio-container');
        if (container) {
            container.innerHTML = '<p class="text-red-600 col-span-full text-center">Failed to load portfolio items. Please refresh the page.</p>';
        }
    }
}

/**
 * Create a portfolio card element from data
 * @param {Object} item - Portfolio item data
 * @param {string} lang - Current language ('no' or 'en')
 * @returns {HTMLElement} - Portfolio card element
 */
function createPortfolioCard(item, lang) {
    const card = document.createElement('div');
    card.className = 'border border-earth-200 rounded-xl p-6 hover:shadow-lg transition';

    // Create tags HTML
    const tagsHTML = item.tags.map(tag => {
        const tagLabel = getTagLabel(tag, lang);
        return `<span class="inline-block bg-earth-100 text-earth-700 text-xs px-3 py-1 rounded-full mb-4 mr-2">${tagLabel}</span>`;
    }).join('');

    // Build card HTML
    card.innerHTML = `
        ${tagsHTML}
        <h3 class="text-lg font-semibold mb-2">
            <a href="${item.url[lang]}" target="_blank" rel="noopener">
                ${item.title[lang]}
            </a>
        </h3>
        <p class="text-earth-600 text-sm mb-4">
            ${item.description[lang]}
        </p>
        <p class="text-earth-600 text-sm italic mb-4">
            <strong class="not-italic font-bold">${lang === 'no' ? 'Verktøy:' : 'Tools:'}</strong>
            ${item.tools[lang]}
        </p>
        <p class="text-earth-600 text-sm italic mb-4">
            <strong class="not-italic font-bold">${lang === 'no' ? 'Metoder:' : 'Methods:'}</strong>
            ${item.methods[lang]}
        </p>
    `;

    return card;
}

/**
 * Get translated tag label
 * @param {string} tag - Tag identifier
 * @param {string} lang - Language code
 * @returns {string} - Translated tag label
 */
function getTagLabel(tag, lang) {
    return TAG_LABELS[tag]?.[lang] || tag;
}

/**
 * Reload portfolio when language changes
 */
function reloadPortfolio() {
    loadPortfolio();
}

// Load portfolio on page load
document.addEventListener('DOMContentLoaded', loadPortfolio);

// Export for use in language switcher
if (typeof window !== 'undefined') {
    window.reloadPortfolio = reloadPortfolio;
}
