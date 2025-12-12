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

    // Secret keyboard shortcut to reset widget (Ctrl+Shift+W)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'W') {
            localStorage.removeItem('widgetDismissed');
            localStorage.removeItem('widgetCollapsed');
            console.log('Widget: Reset flags cleared. Reload the page to see widget.');
            alert('Widget flags cleared! Refresh the page to see the widget again.');
        }
    });
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
 * Shows session time, clicks, scroll speed, and visitor count with glassmorphism design
 * Features: expand/collapse, prominent beta badge, error handling, smooth animations
 */
function initFloatingWidget() {
    try {
        console.log('Widget: Initializing session stats widget');

        // Check if user dismissed the widget
        if (localStorage.getItem('widgetDismissed')) {
            console.log('Widget: Previously dismissed by user');
            return;
        }

        // Check if widget was collapsed in previous session
        const isCollapsed = localStorage.getItem('widgetCollapsed') === 'true';

        // Create widget container with improved styling
        const widget = document.createElement('div');
        widget.id = 'session-widget';
        widget.className = `fixed bottom-5 right-5 text-white p-4 rounded-xl text-sm z-50 font-inter ${isCollapsed ? 'collapsed' : ''}`;
        widget.style.width = '220px';
        widget.style.minHeight = '170px';
        widget.style.position = 'relative';

        // Set initial HTML content with improved structure
        widget.innerHTML = `
            <!-- Beta Ribbon Badge -->
            <div class="beta-ribbon">Beta</div>

            <!-- Widget Header -->
            <div class="widget-header">
                <div class="widget-title-section">
                    <span class="font-bold text-base text-sage">Session Stats</span>
                    <button id="toggle-widget" class="widget-toggle text-earth-200 hover:text-white transition text-sm" title="Toggle widget">
                        ▼
                    </button>
                </div>
                <div class="widget-controls">
                    <button id="close-widget" class="widget-close text-earth-200 hover:text-white text-xl leading-none" title="Close widget">&times;</button>
                </div>
            </div>

            <!-- Widget Content (collapsible) -->
            <div class="widget-content">
                <div class="space-y-1">
                    <div id="session-time" class="widget-stat text-earth-100">
                        Time: <span class="font-mono">00:00:00</span>
                    </div>
                    <div id="click-count" class="widget-stat text-earth-100">
                        Clicks: <span class="font-mono">0</span>
                    </div>
                    <div id="scroll-speed" class="widget-stat text-earth-100">
                        Speed: <span class="font-mono">0 km/h</span>
                    </div>
                    <div id="visitor-count" class="widget-stat text-earth-100 widget-loading">
                        Views: <span class="font-mono">Loading...</span>
                    </div>
                </div>
            </div>
        `;

        // Append to body
        document.body.appendChild(widget);
        console.log('Widget: DOM element created');

        // ===============================================
        // EXPAND/COLLAPSE FUNCTIONALITY
        // ===============================================
        const toggleBtn = document.getElementById('toggle-widget');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                widget.classList.toggle('collapsed');
                const collapsed = widget.classList.contains('collapsed');
                localStorage.setItem('widgetCollapsed', collapsed.toString());
                console.log(`Widget: ${collapsed ? 'Collapsed' : 'Expanded'}`);
            });
        }

        // ===============================================
        // CLOSE BUTTON FUNCTIONALITY
        // ===============================================
        const closeBtn = document.getElementById('close-widget');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                widget.style.animation = 'fadeOut 0.3s ease-out forwards';
                setTimeout(() => {
                    widget.remove();
                    localStorage.setItem('widgetDismissed', 'true');
                    console.log('Widget: Dismissed by user');
                }, 300);
            });
        }

        // ===============================================
        // SESSION TIME TRACKING
        // ===============================================
        let startTime = sessionStorage.getItem('startTime');
        if (!startTime) {
            startTime = Date.now();
            sessionStorage.setItem('startTime', startTime);
            console.log('Widget: Session timer started');
        }

        function updateTime() {
            try {
                const elapsed = Math.floor((Date.now() - parseInt(startTime)) / 1000);
                const hours = Math.floor(elapsed / 3600).toString().padStart(2, '0');
                const minutes = Math.floor((elapsed % 3600) / 60).toString().padStart(2, '0');
                const seconds = (elapsed % 60).toString().padStart(2, '0');

                const timeElement = document.getElementById('session-time');
                if (timeElement) {
                    const timeSpan = timeElement.querySelector('.font-mono');
                    if (timeSpan) timeSpan.textContent = `${hours}:${minutes}:${seconds}`;
                }
            } catch (error) {
                console.error('Widget: Error updating time', error);
            }
        }

        updateTime();
        const timeInterval = setInterval(updateTime, 1000);

        // ===============================================
        // CLICK COUNTER
        // ===============================================
        let clickCount = parseInt(sessionStorage.getItem('clickCount')) || 0;
        const clickElement = document.getElementById('click-count');

        function updateClickCount() {
            if (clickElement) {
                const clickSpan = clickElement.querySelector('.font-mono');
                if (clickSpan) clickSpan.textContent = clickCount.toString();
            }
        }

        updateClickCount();

        const clickHandler = (e) => {
            // Don't count clicks on the widget itself
            if (!e.target.closest('#session-widget')) {
                clickCount++;
                sessionStorage.setItem('clickCount', clickCount);
                updateClickCount();
            }
        };

        document.addEventListener('click', clickHandler);

        // ===============================================
        // SCROLL SPEED TRACKING
        // ===============================================
        let lastScrollTime = performance.now();
        let lastScrollY = window.scrollY;
        let smoothedSpeed = 0;
        const speedElement = document.getElementById('scroll-speed');
        const alpha = 0.15; // Smoothing factor for exponential moving average

        function updateScrollSpeed() {
            try {
                const now = performance.now();
                const deltaTime = now - lastScrollTime;
                const deltaY = Math.abs(window.scrollY - lastScrollY);

                let currentSpeed = 0;
                if (deltaTime > 0 && deltaY > 0) {
                    const pixelsPerSec = (deltaY / deltaTime) * 1000;
                    // More realistic conversion: assume 100 pixels ≈ 1 km/h, cap at 500
                    currentSpeed = Math.min(Math.round((pixelsPerSec * 3.6) / 10), 500);
                }

                // Apply exponential moving average for smooth transitions
                smoothedSpeed = alpha * currentSpeed + (1 - alpha) * smoothedSpeed;

                lastScrollTime = now;
                lastScrollY = window.scrollY;

                if (speedElement) {
                    const speedSpan = speedElement.querySelector('.font-mono');
                    if (speedSpan) speedSpan.textContent = `${Math.round(smoothedSpeed)} km/h`;
                }
            } catch (error) {
                console.error('Widget: Error updating scroll speed', error);
            }
        }

        // Update scroll speed every 100ms for smooth animation
        const scrollInterval = setInterval(updateScrollSpeed, 100);

        // Reset speed to 0 after 1 second of no scrolling
        let resetTimer;
        const scrollHandler = () => {
            clearTimeout(resetTimer);
            resetTimer = setTimeout(() => {
                smoothedSpeed = 0;
                if (speedElement) {
                    const speedSpan = speedElement.querySelector('.font-mono');
                    if (speedSpan) speedSpan.textContent = '0 km/h';
                }
            }, 1000);
        };

        window.addEventListener('scroll', scrollHandler);

        // ===============================================
        // STATCOUNTER INTEGRATION WITH ERROR HANDLING
        // ===============================================
        function formatNumberWithSpaces(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        }

        function integrateStatCounter() {
            try {
                const statCounterEls = document.querySelectorAll('.statcounter');
                const visitorDiv = document.getElementById('visitor-count');

                if (statCounterEls.length > 0 && visitorDiv) {
                    // Remove loading animation
                    visitorDiv.classList.remove('widget-loading');

                    // Extract clean text from StatCounter (text mode should provide plain numbers)
                    const statElement = statCounterEls[0];
                    let statText = statElement.textContent || statElement.innerText || '';

                    // Strip any HTML tags and clean up whitespace
                    statText = statText.replace(/<[^>]*>/g, '').trim();

                    // Format numbers with spaces for readability
                    const countMatch = statText.match(/\d+/);
                    if (countMatch) {
                        const count = parseInt(countMatch[0], 10);
                        if (!isNaN(count)) {
                            statText = statText.replace(countMatch[0], formatNumberWithSpaces(count));
                        }
                    }

                    // Update visitor count display with clean, styled text
                    const visitorSpan = visitorDiv.querySelector('.font-mono');
                    if (visitorSpan) {
                        visitorSpan.textContent = statText;
                        // Ensure consistent styling
                        visitorSpan.style.color = 'inherit';
                        visitorSpan.style.fontSize = 'inherit';
                        visitorSpan.style.fontFamily = 'inherit';
                    }

                    console.log('Widget: StatCounter text integrated successfully');
                    return true;
                } else if (visitorDiv) {
                    // StatCounter failed to load
                    visitorDiv.classList.remove('widget-loading');
                    const visitorSpan = visitorDiv.querySelector('.font-mono');
                    if (visitorSpan) visitorSpan.textContent = 'Privacy Settings';
                    console.warn('Widget: StatCounter element not found');
                }
                return false;
            } catch (error) {
                console.error('Widget: Error integrating StatCounter', error);
                const visitorDiv = document.getElementById('visitor-count');
                if (visitorDiv) {
                    visitorDiv.classList.remove('widget-loading');
                    const visitorSpan = visitorDiv.querySelector('.font-mono');
                    if (visitorSpan) visitorSpan.textContent = 'Error';
                }
                return false;
            }
        }

        // Try multiple times to integrate StatCounter with exponential backoff
        const maxAttempts = 10;
        let attempts = 0;
        const integrationInterval = setInterval(() => {
            attempts++;
            if (integrateStatCounter()) {
                clearInterval(integrationInterval);
            } else if (attempts >= maxAttempts) {
                console.warn('Widget: StatCounter integration failed after max attempts');
                // Show fallback
                const visitorDiv = document.getElementById('visitor-count');
                if (visitorDiv) {
                    visitorDiv.classList.remove('widget-loading');
                    const visitorSpan = visitorDiv.querySelector('.font-mono');
                    if (visitorSpan) visitorSpan.textContent = 'Privacy Settings';
                }
                clearInterval(integrationInterval);
            }
        }, Math.min(800 + (attempts * 200), 2000)); // Exponential backoff, max 2s

        // ===============================================
        // CLEANUP ON PAGE UNLOAD
        // ===============================================
        window.addEventListener('beforeunload', () => {
            clearInterval(timeInterval);
            clearInterval(scrollInterval);
            clearInterval(integrationInterval);
            document.removeEventListener('click', clickHandler);
            window.removeEventListener('scroll', scrollHandler);
        });

    } catch (error) {
        console.error('Widget: Critical initialization error', error);
    }
}
