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

    // Initialize floating widget
    initFloatingWidget();
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

/**
 * Initialize floating session stats widget
 * Shows session time, clicks, and visitor count in bottom-right corner
 */
function initFloatingWidget() {
    // Check if user dismissed the widget
    if (localStorage.getItem('widgetDismissed')) return;

    // Create widget container
    const widget = document.createElement('div');
    widget.id = 'session-widget';
    widget.className = 'fixed bottom-5 right-5 bg-earth-800 text-white p-3 rounded shadow opacity-90 text-sm z-50 max-w-xs font-inter';

    // Set initial HTML content
    widget.innerHTML = `
        <div class="flex justify-between items-center mb-2">
            <span class="font-semibold">Session Stats</span>
            <button id="close-widget" class="text-white hover:text-earth-300 text-lg leading-none">&times;</button>
        </div>
        <div id="session-time">Time: 00:00:00</div>
        <div id="click-count">Clicks: 0</div>
        <div id="scroll-speed">Scroll Speed: 0 km/h</div>
        <div id="visitor-count">Visitors: Loading...</div>
    `;

    // Append to body
    document.body.appendChild(widget);

    // Close button functionality
    document.getElementById('close-widget').addEventListener('click', () => {
        widget.style.display = 'none';
        localStorage.setItem('widgetDismissed', 'true');
    });

    // Session time tracking
    let startTime = sessionStorage.getItem('startTime');
    if (!startTime) {
        startTime = Date.now();
        sessionStorage.setItem('startTime', startTime);
    }

    function updateTime() {
        const elapsed = Math.floor((Date.now() - parseInt(startTime)) / 1000);
        const hours = Math.floor(elapsed / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((elapsed % 3600) / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        const timeElement = document.getElementById('session-time');
        if (timeElement) timeElement.textContent = `Time: ${hours}:${minutes}:${seconds}`;
    }

    updateTime();
    setInterval(updateTime, 1000);

    // Click counter
    let clickCount = parseInt(sessionStorage.getItem('clickCount')) || 0;
    const clickElement = document.getElementById('click-count');
    if (clickElement) clickElement.textContent = `Clicks: ${clickCount}`;

    document.addEventListener('click', () => {
        clickCount++;
        sessionStorage.setItem('clickCount', clickCount);
        if (clickElement) clickElement.textContent = `Clicks: ${clickCount}`;
    });

    // Scrolling speed tracking
    let lastScrollTime = performance.now();
    let lastScrollY = window.scrollY;
    let currentSpeed = 0;
    const speedElement = document.getElementById('scroll-speed');

    function updateScrollSpeed() {
        const now = performance.now();
        const deltaTime = now - lastScrollTime;
        const deltaY = Math.abs(window.scrollY - lastScrollY);

        if (deltaTime > 0) {
            const pixelsPerSec = (deltaY / deltaTime) * 1000;
            currentSpeed = Math.round(pixelsPerSec * 3.6); // Convert to km/h (fictional)
        }

        lastScrollTime = now;
        lastScrollY = window.scrollY;

        if (speedElement) speedElement.textContent = `Scroll Speed: ${currentSpeed} km/h`;
    }

    // Update on scroll
    window.addEventListener('scroll', updateScrollSpeed);

    // Reset speed if no scroll for 1 second
    let resetTimer;
    window.addEventListener('scroll', () => {
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
            currentSpeed = 0;
            if (speedElement) speedElement.textContent = `Scroll Speed: 0 km/h`;
        }, 1000);
    });

    // Move StatCounter element into widget after it loads
    setTimeout(() => {
        const statCounterEl = document.querySelector('.statcounter');
        if (statCounterEl) {
            const visitorDiv = document.getElementById('visitor-count');
            if (visitorDiv) {
                visitorDiv.innerHTML = 'Visitors: ';
                visitorDiv.appendChild(statCounterEl);
            }
        }
    }, 2000); // Delay to ensure StatCounter loads
}
