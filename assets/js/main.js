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
});
