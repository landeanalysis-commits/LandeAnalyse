/**
 * Main JavaScript for Lande Analyse
 * landeanalyse.no
 * Handles language switching and UI interactions
 */

/**
 * Set the website language
 * @param {string} lang - Language code ('no' or 'en')
 */
function setLanguage(lang) {
    document.documentElement.lang = lang;

    // Update button styles
    const btnNo = document.getElementById('btn-no');
    const btnEn = document.getElementById('btn-en');

    if (lang === 'no') {
        btnNo.className = 'px-2 py-1 text-sm rounded bg-earth-700 text-white';
        btnEn.className = 'px-2 py-1 text-sm rounded text-earth-300 hover:text-white transition';
    } else {
        btnEn.className = 'px-2 py-1 text-sm rounded bg-earth-700 text-white';
        btnNo.className = 'px-2 py-1 text-sm rounded text-earth-300 hover:text-white transition';
    }

    // Save preference
    localStorage.setItem('lang', lang);

    // Reload portfolio with new language
    if (typeof window.reloadPortfolio === 'function') {
        window.reloadPortfolio();
    }
}

// Load saved language preference on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedLang = localStorage.getItem('lang') || 'no';
    setLanguage(savedLang);

    // Initialize dropdown functionality
    initDropdowns();
});

/**
 * Initialize dropdown menu functionality
 * Handles both desktop (hover) and mobile (click) behavior
 */
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');

    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const menu = dropdown.querySelector('.dropdown-menu');

        // Handle click for mobile and touch devices
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Only handle clicks on mobile/tablet
            if (window.innerWidth < 768) {
                dropdown.classList.toggle('active');
            }
        });

        // Close dropdown when clicking menu items
        const menuItems = menu.querySelectorAll('a');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                dropdown.classList.remove('active');
            });
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
}
