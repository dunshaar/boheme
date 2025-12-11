const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xanllayd';

document.addEventListener('DOMContentLoaded', function() {
    console.log('BOHEME Website Initialized');
    
    initSmoothScroll();
    initNavigation();
    initVideoPlayer();
    initBookingForm();
    initAnimations();
    initGalleryHover();
    initPhoneMask();
    initNameCapitalization();
});

function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                closeMobileMenu();
            }
        });
    });
}

function initNavigation() {
    const nav = document.querySelector('nav');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        updateActiveNavLink();
    });
    
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

function closeMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.remove('mobile-open');
}

function initVideoPlayer() {
    const videoContainer = document.getElementById('video-living-container');
    const expandBtn = document.getElementById('video-expand-btn');
    const videoModal = document.getElementById('video-modal');
    const closeModal = document.getElementById('close-video-modal');
    const fullVideo = document.querySelector('.full-video');
    const livingVideo = document.querySelector('.living-video');
    
    if (!expandBtn || !videoModal) return;
    
    if (livingVideo) {
        livingVideo.play().catch(e => {
            console.log('Autoplay prevented:', e);
        });
    }
    
    expandBtn.addEventListener('click', function() {
        videoModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            if (fullVideo) {
                fullVideo.currentTime = 0;
                fullVideo.play().catch(e => {
                    console.log('Full video play error:', e);
                });
            }
        }, 300);
    });
    
    function closeVideoModal() {
        videoModal.style.display = 'none';
        document.body.style.overflow = '';
        
        if (fullVideo) {
            fullVideo.pause();
        }
    }
    
    closeModal.addEventListener('click', closeVideoModal);
    
    videoModal.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && videoModal.style.display === 'flex') {
            closeVideoModal();
        }
    });
    
    initTimelineClicks();
}

function initTimelineClicks() {
    const timelineItems = document.querySelectorAll('.timeline-item-compact');
    
    timelineItems.forEach(item => {
        item.addEventListener('click', function() {
            const timeText = this.querySelector('.timeline-time').textContent;
            const timeInSeconds = convertTimeToSeconds(timeText);
            const fullVideo = document.querySelector('.full-video');
            
            if (fullVideo && !isNaN(timeInSeconds)) {
                if (document.getElementById('video-modal').style.display === 'flex') {
                    fullVideo.currentTime = timeInSeconds;
                } else {
                    document.getElementById('video-expand-btn').click();
                    setTimeout(() => {
                        fullVideo.currentTime = timeInSeconds;
                        fullVideo.play();
                    }, 500);
                }
            }
        });
    });
}

function convertTimeToSeconds(timeString) {
    const parts = timeString.split(':');
    if (parts.length === 2) {
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return 0;
}

function initNameCapitalization() {
    const nameInput = document.getElementById('name-input');
    
    if (nameInput) {
        nameInput.addEventListener('input', function(e) {
            const cursorPosition = this.selectionStart;
            const originalValue = this.value;
            
            if (originalValue.length > 0) {
                // Разделяем строку на слова
                const words = originalValue.split(' ');
                
                // Каждое слово с заглавной буквы
                const capitalizedWords = words.map(word => {
                    if (word.length > 0) {
                        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                    }
                    return word;
                });
                
                const newValue = capitalizedWords.join(' ');
                
                // Устанавливаем новое значение
                this.value = newValue;
                
                // Восстанавливаем позицию курсора
                const diff = newValue.length - originalValue.length;
                this.setSelectionRange(cursorPosition + diff, cursorPosition + diff);
            }
        });
        
        // Также при потере фокуса
        nameInput.addEventListener('blur', function() {
            if (this.value.trim().length > 0) {
                const words = this.value.trim().split(' ');
                const capitalizedWords = words.map(word => {
                    if (word.length > 0) {
                        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                    }
                    return word;
                });
                this.value = capitalizedWords.join(' ');
            }
        });
    }
}

function initPhoneMask() {
    const phoneInput = document.getElementById('phone-input');
    const phoneClearBtn = document.getElementById('phone-clear-btn');
    
    if (phoneInput) {
        // Маска для телефона
        phoneInput.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                // Если начинается с 7, 8 или 9
                if (value.charAt(0) === '7' || value.charAt(0) === '8') {
                    value = value.substring(1);
                }
                
                if (value.charAt(0) === '9') {
                    value = value.substring(0, 10);
                } else {
                    value = value.substring(0, 10);
                }
                
                // Форматирование
                let formattedValue = '+7 (';
                
                if (value.length > 0) {
                    formattedValue += value.substring(0, 3);
                }
                
                if (value.length >= 4) {
                    formattedValue += ') ' + value.substring(3, 6);
                }
                
                if (value.length >= 7) {
                    formattedValue += '-' + value.substring(6, 8);
                }
                
                if (value.length >= 9) {
                    formattedValue += '-' + value.substring(8, 10);
                }
                
                this.value = formattedValue;
            } else {
                this.value = '';
            }
            
            // Показываем/скрываем кнопку очистки
            if (phoneClearBtn) {
                if (this.value.length > 0) {
                    phoneClearBtn.style.opacity = '1';
                    phoneClearBtn.style.pointerEvents = 'all';
                } else {
                    phoneClearBtn.style.opacity = '0';
                    phoneClearBtn.style.pointerEvents = 'none';
                }
            }
        });
        
        // Обработка Backspace
        phoneInput.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace') {
                const cursorPosition = this.selectionStart;
                
                // Если курсор находится после символа, который нужно удалить
                if (cursorPosition <= 7 && cursorPosition > 4) { // После открывающей скобки
                    e.preventDefault();
                    const numbers = this.value.replace(/\D/g, '');
                    const newNumbers = numbers.substring(0, numbers.length - 1);
                    
                    // Перерисовываем маску с новыми числами
                    this.value = formatPhoneNumber(newNumbers);
                    
                    // Устанавливаем курсор в нужное место
                    const newPosition = Math.max(4, cursorPosition - 1);
                    this.setSelectionRange(newPosition, newPosition);
                }
            }
        });
        
        // Кнопка очистки
        if (phoneClearBtn) {
            phoneClearBtn.addEventListener('click', function() {
                phoneInput.value = '';
                phoneInput.focus();
                phoneClearBtn.style.opacity = '0';
                phoneClearBtn.style.pointerEvents = 'none';
            });
        }
        
        // При загрузке страницы проверяем, есть ли значение
        if (phoneInput.value) {
            phoneInput.value = formatPhoneNumber(phoneInput.value.replace(/\D/g, ''));
        }
    }
}

function formatPhoneNumber(numbers) {
    numbers = numbers.replace(/\D/g, '');
    
    if (numbers.length > 0) {
        if (numbers.charAt(0) === '7' || numbers.charAt(0) === '8') {
            numbers = numbers.substring(1);
        }
        
        numbers = numbers.substring(0, 10);
        
        let formattedValue = '+7 (';
        
        if (numbers.length > 0) {
            formattedValue += numbers.substring(0, 3);
        }
        
        if (numbers.length >= 4) {
            formattedValue += ') ' + numbers.substring(3, 6);
        }
        
        if (numbers.length >= 7) {
            formattedValue += '-' + numbers.substring(6, 8);
        }
        
        if (numbers.length >= 9) {
            formattedValue += '-' + numbers.substring(8, 10);
        }
        
        return formattedValue;
    }
    
    return '';
}

function initBookingForm() {
    const form = document.getElementById('booking-form');
    
    if (!form) {
        console.warn('Booking form not found');
        return;
    }
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.querySelector('.btn-text').textContent;
        
        if (!validateForm(this)) {
            showNotification('Пожалуйста, заполните все обязательные поля правильно', 'error');
            return;
        }
        
        submitBtn.querySelector('.btn-text').textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: new FormData(this),
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showNotification('✅ Заявка отправлена! Мы свяжемся с вами в течение 2 часов.', 'success');
                
                this.reset();
                
                setTimeout(() => {
                    submitBtn.querySelector('.btn-text').textContent = originalText;
                    submitBtn.disabled = false;
                }, 3000);
                
            } else {
                throw new Error('Form submission failed');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            showNotification('❌ Ошибка отправки. Пожалуйста, позвоните нам: +7 (926) 418-41-19', 'error');
            
            submitBtn.querySelector('.btn-text').textContent = originalText;
            submitBtn.disabled = false;
        }
    });
    
    initFormValidation(form);
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (field.type === 'checkbox') {
            if (!field.checked) {
                isValid = false;
                highlightFieldError(field.closest('.agreement-checkbox'), true);
            } else {
                highlightFieldError(field.closest('.agreement-checkbox'), false);
            }
        } else if (!field.value.trim()) {
            isValid = false;
            highlightFieldError(field, true);
        } else {
            highlightFieldError(field, false);
        }
    });
    
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            isValid = false;
            highlightFieldError(emailField, true);
        }
    }
    
    const phoneField = form.querySelector('.phone-input');
    if (phoneField && phoneField.value) {
        const phoneNumbers = phoneField.value.replace(/\D/g, '');
        if (phoneNumbers.length < 10) {
            isValid = false;
            highlightFieldError(phoneField, true);
            showNotification('Введите полный номер телефона', 'error');
        }
    }
    
    return isValid;
}

function initFormValidation(form) {
    const fields = form.querySelectorAll('input, textarea, select');
    
    fields.forEach(field => {
        if (field.type === 'checkbox') {
            field.addEventListener('change', function() {
                highlightFieldError(this.closest('.agreement-checkbox'), false);
            });
        } else {
            field.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    highlightFieldError(this, true);
                } else {
                    highlightFieldError(this, false);
                }
            });
            
            field.addEventListener('input', function() {
                highlightFieldError(this, false);
            });
        }
    });
}

function highlightFieldError(element, isError) {
    if (element.classList.contains('agreement-checkbox')) {
        if (isError) {
            element.classList.add('error');
        } else {
            element.classList.remove('error');
        }
    } else if (isError) {
        element.classList.add('error');
    } else {
        element.classList.remove('error');
    }
}

function showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 0;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

function initAnimations() {
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.format-card, .review-card, .team-member, .gallery-item');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate-in');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
    
    initHeroAnimations();
}

function initHeroAnimations() {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add('loaded');
        }, 100);
    }
    
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        });
    }
}

function initGalleryHover() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

window.showNotification = showNotification;