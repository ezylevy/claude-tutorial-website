// ===== TAB FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            switchTab(targetTab);
        });
    });

    // Make switchTab available globally
    window.switchTab = function(tabId) {
        // Remove active class from all buttons and panels
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));

        // Add active class to target button and panel
        const targetButton = document.querySelector(`[data-tab="${tabId}"]`);
        const targetPanel = document.getElementById(tabId);

        if (targetButton && targetPanel) {
            targetButton.classList.add('active');
            targetPanel.classList.add('active');

            // Scroll to top of content
            const tabsContainer = document.querySelector('.tabs-container');
            if (tabsContainer) {
                tabsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    // ===== SUB-TAB FUNCTIONALITY =====
    const subTabButtons = document.querySelectorAll('.sub-tab-btn');
    const subTabPanels = document.querySelectorAll('.sub-tab-panel');

    subTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSubTab = button.dataset.subtab;
            switchSubTab(targetSubTab);
        });
    });

    window.switchSubTab = function(subTabId) {
        // Remove active class from all sub-tab buttons and panels
        subTabButtons.forEach(btn => btn.classList.remove('active'));
        subTabPanels.forEach(panel => panel.classList.remove('active'));

        // Add active class to target sub-tab button and panel
        const targetButton = document.querySelector(`[data-subtab="${subTabId}"]`);
        const targetPanel = document.getElementById(subTabId);

        if (targetButton && targetPanel) {
            targetButton.classList.add('active');
            targetPanel.classList.add('active');

            // Scroll to sub-tabs container
            const subTabsContainer = targetButton.closest('.sub-tabs-container');
            if (subTabsContainer) {
                subTabsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    // Copy to clipboard functionality
    window.copyCode = function(button) {
        const codeBlock = button.closest('.code-block');
        const code = codeBlock.querySelector('code, pre');

        if (code) {
            const text = code.textContent;

            navigator.clipboard.writeText(text).then(() => {
                // Show success feedback
                const originalText = button.textContent;
                button.textContent = 'הועתק!';
                button.classList.add('copied');

                setTimeout(() => {
                    button.textContent = originalText;
                    button.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                // Fallback for older browsers
                fallbackCopy(text, button);
            });
        }
    };

    // Fallback copy function for older browsers
    function fallbackCopy(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
            const originalText = button.textContent;
            button.textContent = 'הועתק!';
            button.classList.add('copied');

            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('copied');
            }, 2000);
        } catch (err) {
            console.error('Fallback copy failed: ', err);
        }

        document.body.removeChild(textArea);
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.step-card, .info-card, .project-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });

    // Add animate-in class styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Keyboard navigation for tabs
    document.addEventListener('keydown', (e) => {
        if (e.target.classList.contains('tab-btn')) {
            const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
            const currentIndex = tabButtons.indexOf(e.target);

            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % tabButtons.length;
                tabButtons[nextIndex].focus();
                tabButtons[nextIndex].click();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                const prevIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
                tabButtons[prevIndex].focus();
                tabButtons[prevIndex].click();
            }
        }
    });

    // Progress indicator (optional - shows reading progress)
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%);
        z-index: 9999;
        transition: width 0.1s ease;
        width: 0%;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // Add touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    const tabsContent = document.querySelector('.tabs-content');

    if (tabsContent) {
        tabsContent.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        tabsContent.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
            const activeButton = document.querySelector('.tab-btn.active');
            const currentIndex = tabButtons.indexOf(activeButton);

            if (diff > 0) {
                // Swipe left - next tab
                const nextIndex = Math.min(currentIndex + 1, tabButtons.length - 1);
                if (nextIndex !== currentIndex) {
                    switchTab(tabButtons[nextIndex].dataset.tab);
                }
            } else {
                // Swipe right - previous tab
                const prevIndex = Math.max(currentIndex - 1, 0);
                if (prevIndex !== currentIndex) {
                    switchTab(tabButtons[prevIndex].dataset.tab);
                }
            }
        }
    }

    console.log('Claude Code Tutorial Website loaded successfully!');
});
