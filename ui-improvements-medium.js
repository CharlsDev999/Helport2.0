/**
 * MEDIUM-PRIORITY UI IMPROVEMENTS - JAVASCRIPT
 * Focus: Micro-interactions, Form Enhancements, Ripple Effects
 * 
 * Add this script before your closing </body> tag
 * <script src="ui-improvements-medium.js"></script>
 */

(function() {
    'use strict';

    // ============================================
    // 1. RIPPLE EFFECT FOR BUTTONS
    // ============================================
    
    function createRipple(event) {
        const button = event.currentTarget;
        
        // Remove existing ripples
        const existingRipples = button.querySelectorAll('.btn-ripple');
        existingRipples.forEach(ripple => ripple.remove());
        
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        const rect = button.getBoundingClientRect();
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - rect.left - radius}px`;
        circle.style.top = `${event.clientY - rect.top - radius}px`;
        circle.classList.add('btn-ripple');
        
        button.appendChild(circle);
        
        // Remove ripple after animation
        setTimeout(() => {
            circle.remove();
        }, 600);
    }

    // Apply ripple effect to all buttons with .btn class
    document.addEventListener('DOMContentLoaded', function() {
        const buttons = document.querySelectorAll('.btn:not(.btn-no-ripple)');
        buttons.forEach(button => {
            button.addEventListener('click', createRipple);
        });
    });

    // ============================================
    // 2. FLOATING LABEL FUNCTIONALITY
    // ============================================
    
    function initFloatingLabels() {
        const inputs = document.querySelectorAll('.floating-input');
        
        inputs.forEach(input => {
            // Add placeholder if not present (required for :placeholder-shown)
            if (!input.hasAttribute('placeholder')) {
                input.setAttribute('placeholder', ' ');
            }
            
            // Trigger label movement on input
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('is-focused');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('is-focused');
            });
        });
    }

    // ============================================
    // 3. PASSWORD TOGGLE FUNCTIONALITY
    // ============================================
    
    function initPasswordToggles() {
        const toggleButtons = document.querySelectorAll('.password-toggle');
        
        toggleButtons.forEach(button => {
            button.addEventListener('click', function() {
                const input = this.parentElement.querySelector('input[type="password"], input[type="text"]');
                
                if (!input) return;
                
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                
                // Toggle icon
                const icon = this.querySelector('svg, i');
                if (icon) {
                    if (type === 'text') {
                        // Show eye-off icon
                        icon.innerHTML = `
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1 2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                        `;
                    } else {
                        // Show eye icon
                        icon.innerHTML = `
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        `;
                    }
                }
                
                this.setAttribute('aria-label', type === 'password' ? 'Show password' : 'Hide password');
            });
        });
    }

    // ============================================
    // 4. FORM VALIDATION ENHANCEMENTS
    // ============================================
    
    function validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        const type = field.type;
        const minLength = field.minLength;
        const maxLength = field.maxLength;
        const pattern = field.pattern;
        
        let isValid = true;
        let errorMessage = '';
        
        // Required validation
        if (isRequired && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        if (isValid && type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Minimum length validation
        if (isValid && minLength > 0 && value.length < minLength) {
            isValid = false;
            errorMessage = `Minimum ${minLength} characters required`;
        }
        
        // Maximum length validation
        if (isValid && maxLength > 0 && value.length > maxLength) {
            isValid = false;
            errorMessage = `Maximum ${maxLength} characters allowed`;
        }
        
        // Pattern validation
        if (isValid && pattern && value) {
            const regex = new RegExp(pattern);
            if (!regex.test(value)) {
                isValid = false;
                errorMessage = field.dataset.patternMessage || 'Invalid format';
            }
        }
        
        return { isValid, errorMessage };
    }

    function showValidationState(field, isValid, message) {
        const formGroup = field.closest('.form-group') || field.parentElement;
        
        // Remove existing validation classes
        field.classList.remove('input-success', 'input-error', 'input-warning');
        
        // Remove existing messages
        const existingMessage = formGroup.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        if (field.value.trim() === '') {
            // Empty field - no validation state
            return;
        }
        
        if (isValid) {
            field.classList.add('input-success');
        } else {
            field.classList.add('input-error');
            
            // Add error message
            const messageEl = document.createElement('div');
            messageEl.className = 'form-message form-message-error';
            messageEl.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                ${message}
            `;
            formGroup.appendChild(messageEl);
            
            // Add shake animation
            field.classList.add('shake');
            setTimeout(() => field.classList.remove('shake'), 500);
        }
    }

    function initFormValidation() {
        const forms = document.querySelectorAll('form[data-validate]');
        
        forms.forEach(form => {
            const fields = form.querySelectorAll('input, select, textarea');
            
            fields.forEach(field => {
                // Validate on blur
                field.addEventListener('blur', () => {
                    const { isValid, errorMessage } = validateField(field);
                    showValidationState(field, isValid, errorMessage);
                });
                
                // Clear validation on input
                field.addEventListener('input', () => {
                    if (field.classList.contains('input-error')) {
                        const { isValid, errorMessage } = validateField(field);
                        if (isValid) {
                            showValidationState(field, true, '');
                        }
                    }
                });
            });
            
            // Form submit validation
            form.addEventListener('submit', function(e) {
                let hasErrors = false;
                
                fields.forEach(field => {
                    const { isValid, errorMessage } = validateField(field);
                    showValidationState(field, isValid, errorMessage);
                    
                    if (!isValid) {
                        hasErrors = true;
                    }
                });
                
                if (hasErrors) {
                    e.preventDefault();
                    
                    // Focus first invalid field
                    const firstInvalid = form.querySelector('.input-error');
                    if (firstInvalid) {
                        firstInvalid.focus();
                    }
                    
                    // Show error notification
                    showNotification('Please fix the errors in the form', 'error');
                }
            });
        });
    }

    // ============================================
    // 5. LOADING STATE MANAGEMENT
    // ============================================
    
    function setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.classList.add('btn-loading');
            button.disabled = true;
            button.dataset.originalText = button.textContent;
        } else {
            button.classList.remove('btn-loading');
            button.disabled = false;
            if (button.dataset.originalText) {
                button.textContent = button.dataset.originalText;
            }
        }
    }

    function initLoadingStates() {
        // Auto-loading for form submit buttons
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', function() {
                const submitButton = form.querySelector('button[type="submit"]');
                if (submitButton) {
                    setButtonLoading(submitButton, true);
                }
            });
        });
    }

    // ============================================
    // 6. TAB NAVIGATION
    // ============================================
    
    function initTabs() {
        const tabContainers = document.querySelectorAll('.tabs-container');
        
        tabContainers.forEach(container => {
            const tabs = container.querySelectorAll('.nav-tab');
            
            tabs.forEach(tab => {
                tab.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Remove active class from all tabs
                    tabs.forEach(t => t.classList.remove('active'));
                    
                    // Add active class to clicked tab
                    this.classList.add('active');
                    
                    // Show corresponding content
                    const targetId = this.getAttribute('data-target');
                    if (targetId) {
                        const contents = container.parentElement.querySelectorAll('.tab-content');
                        contents.forEach(content => {
                            content.classList.remove('active');
                            if (content.id === targetId) {
                                content.classList.add('active');
                                // Add fade-in animation
                                content.classList.add('fade-in');
                            }
                        });
                    }
                    
                    // Trigger custom event
                    container.dispatchEvent(new CustomEvent('tabChange', {
                        detail: { tab: this, targetId: targetId }
                    }));
                });
                
                // Keyboard navigation
                tab.addEventListener('keydown', function(e) {
                    const tabsArray = Array.from(tabs);
                    const currentIndex = tabsArray.indexOf(this);
                    
                    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                        e.preventDefault();
                        const nextTab = tabsArray[currentIndex + 1] || tabsArray[0];
                        nextTab.focus();
                    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                        e.preventDefault();
                        const prevTab = tabsArray[currentIndex - 1] || tabsArray[tabsArray.length - 1];
                        prevTab.focus();
                    } else if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.click();
                    }
                });
            });
        });
    }

    // ============================================
    // 7. TOOLTIP INITIALIZATION
    // ============================================
    
    function initTooltips() {
        const tooltips = document.querySelectorAll('.tooltip[data-tooltip]');
        
        tooltips.forEach(tooltip => {
            tooltip.setAttribute('aria-label', tooltip.dataset.tooltip);
            tooltip.setAttribute('role', 'tooltip');
        });
    }

    // ============================================
    // 8. NOTIFICATION SYSTEM
    // ============================================
    
    function showNotification(message, type = 'info', duration = 4000) {
        // Create notification container if it doesn't exist
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(container);
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `glass-card p-4 fade-in slide-in-right`;
        notification.style.cssText = `
            min-width: 300px;
            max-width: 400px;
            display: flex;
            align-items: center;
            gap: 12px;
        `;
        
        // Icon based on type
        const icons = {
            success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>`,
            error: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>`,
            warning: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>`,
            info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>`
        };
        
        notification.innerHTML = `
            ${icons[type] || icons.info}
            <span style="color: var(--neutral-100); font-size: var(--text-sm);">${message}</span>
            <button onclick="this.parentElement.remove()" style="margin-left: auto; background: none; border: none; color: var(--neutral-400); cursor: pointer; padding: 4px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;
        
        container.appendChild(notification);
        
        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                notification.style.transition = 'all 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }, duration);
        }
        
        return notification;
    }

    // Make notification function globally available
    window.showNotification = showNotification;

    // ============================================
    // 9. CIRCULAR PROGRESS ANIMATION
    // ============================================
    
    function animateCircularProgress(element, percentage) {
        const circle = element.querySelector('.circular-progress-fill');
        const text = element.querySelector('.circular-progress-text');
        
        if (!circle) return;
        
        const circumference = 283; // For r=45
        const offset = circumference - (percentage / 100) * circumference;
        
        circle.style.strokeDashoffset = offset;
        
        if (text) {
            // Animate counter
            const startValue = parseInt(text.textContent) || 0;
            const endValue = percentage;
            const duration = 1000;
            const startTime = performance.now();
            
            function animate(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out quart
                const eased = 1 - Math.pow(1 - progress, 4);
                
                const currentValue = Math.round(startValue + (endValue - startValue) * eased);
                text.textContent = `${currentValue}%`;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            }
            
            requestAnimationFrame(animate);
        }
    }

    function initCircularProgress() {
        const progressElements = document.querySelectorAll('.circular-progress');
        
        progressElements.forEach(element => {
            const percentage = parseInt(element.dataset.percentage) || 0;
            
            // Use Intersection Observer to animate when visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCircularProgress(element, percentage);
                        observer.unobserve(element);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(element);
        });
    }

    // ============================================
    // 10. SKELETON LOADER MANAGEMENT
    // ============================================
    
    function showSkeleton(container, skeletonClass) {
        container.innerHTML = '';
        const skeletonCount = container.dataset.skeletonCount || 3;
        
        for (let i = 0; i < skeletonCount; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = `skeleton ${skeletonClass}`;
            container.appendChild(skeleton);
        }
    }

    function hideSkeleton(container, content) {
        container.innerHTML = '';
        container.appendChild(content);
        container.classList.add('fade-in');
    }

    // Make skeleton functions globally available
    window.showSkeleton = showSkeleton;
    window.hideSkeleton = hideSkeleton;

    // ============================================
    // 11. INPUT CHARACTER COUNT
    // ============================================
    
    function initCharacterCount() {
        const inputs = document.querySelectorAll('textarea[data-maxlength], input[data-maxlength]');
        
        inputs.forEach(input => {
            const maxLength = input.dataset.maxlength || input.maxLength;
            if (!maxLength) return;
            
            const counter = document.createElement('div');
            counter.className = 'form-message text-muted text-xs mt-1';
            counter.style.textAlign = 'right';
            
            function updateCounter() {
                const currentLength = input.value.length;
                counter.textContent = `${currentLength} / ${maxLength}`;
                
                if (currentLength > maxLength) {
                    counter.classList.add('form-message-error');
                    counter.classList.remove('form-message-warning');
                } else if (currentLength > maxLength * 0.9) {
                    counter.classList.add('form-message-warning');
                    counter.classList.remove('form-message-error');
                } else {
                    counter.classList.remove('form-message-error', 'form-message-warning');
                }
            }
            
            input.parentElement.appendChild(counter);
            input.addEventListener('input', updateCounter);
            updateCounter();
        });
    }

    // ============================================
    // 12. AUTO-RESIZE TEXTAREA
    // ============================================
    
    function initAutoResizeTextarea() {
        const textareas = document.querySelectorAll('textarea[data-auto-resize]');
        
        textareas.forEach(textarea => {
            textarea.style.overflow = 'hidden';
            textarea.style.resize = 'none';
            
            function autoResize() {
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
            }
            
            textarea.addEventListener('input', autoResize);
            autoResize();
        });
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    
    document.addEventListener('DOMContentLoaded', function() {
        initFloatingLabels();
        initPasswordToggles();
        initFormValidation();
        initLoadingStates();
        initTabs();
        initTooltips();
        initCircularProgress();
        initCharacterCount();
        initAutoResizeTextarea();
        
        console.log('✅ Medium-priority UI improvements initialized');
    });

    // Expose utility functions globally
    window.UIUtils = {
        setButtonLoading,
        showNotification,
        validateField,
        showValidationState,
        animateCircularProgress,
        showSkeleton,
        hideSkeleton
    };

})();
