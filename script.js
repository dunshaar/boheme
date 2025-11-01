// =============================================
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И НАСТРОЙКИ
// =============================================

// 🔧 НАСТРОЙКА FORMSPREE - ЗАМЕНИТЕ НА ВАШ РЕАЛЬНЫЙ ID
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xanllayd';

// =============================================
// ОСНОВНАЯ ИНИЦИАЛИЗАЦИЯ
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('BOHEME Website Initialized');
    
    // Инициализация всех модулей
    initSmoothScroll();
    initNavigation();
    initVideoPlayer();
    initBookingForm();
    initAnimations();
    initGalleryHover();
});

// =============================================
// ПЛАВНАЯ ПРОКРУТКА
// =============================================

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
                
                // Закрываем мобильное меню если открыто
                closeMobileMenu();
            }
        });
    });
}

// =============================================
// НАВИГАЦИЯ И МОБИЛЬНОЕ МЕНЮ
// =============================================

function initNavigation() {
    const nav = document.querySelector('nav');
    const navLinks = document.querySelector('.nav-links');
    
    // Highlight активного раздела при скролле
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        updateActiveNavLink();
    });
    
    // Мобильное меню (можно добавить бургер-кнопку позже)
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
    // Функция для закрытия мобильного меню (если будет добавлено)
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.remove('mobile-open');
}

// =============================================
// ВИДЕО ПЛЕЙЕР
// =============================================

function initVideoPlayer() {
    const videoContainer = document.getElementById('video-living-container');
    const expandBtn = document.getElementById('video-expand-btn');
    const videoModal = document.getElementById('video-modal');
    const closeModal = document.getElementById('close-video-modal');
    const fullVideo = document.querySelector('.full-video');
    const livingVideo = document.querySelector('.living-video');
    
    if (!expandBtn || !videoModal) return;
    
    // Автовоспроизведение loop видео
    if (livingVideo) {
        livingVideo.play().catch(e => {
            console.log('Autoplay prevented:', e);
        });
    }
    
    // Открытие модального окна
    expandBtn.addEventListener('click', function() {
        videoModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Запуск полноэкранного видео
        setTimeout(() => {
            if (fullVideo) {
                fullVideo.currentTime = 0;
                fullVideo.play().catch(e => {
                    console.log('Full video play error:', e);
                });
            }
        }, 300);
    });
    
    // Закрытие модального окна
    function closeVideoModal() {
        videoModal.style.display = 'none';
        document.body.style.overflow = '';
        
        if (fullVideo) {
            fullVideo.pause();
        }
    }
    
    closeModal.addEventListener('click', closeVideoModal);
    
    // Закрытие по клику на оверлей
    videoModal.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });
    
    // Закрытие по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && videoModal.style.display === 'flex') {
            closeVideoModal();
        }
    });
    
    // Обработка таймкодов
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
                // Если модальное окно открыто - перематываем
                if (document.getElementById('video-modal').style.display === 'flex') {
                    fullVideo.currentTime = timeInSeconds;
                } else {
                    // Иначе открываем модальное и перематываем
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

// =============================================
// ФОРМА БРОНИРОВАНИЯ
// =============================================

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
        
        // Валидация формы
        if (!validateForm(this)) {
            showNotification('Пожалуйста, заполните все обязательные поля правильно', 'error');
            return;
        }
        
        // Показываем загрузку
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
                // Успешная отправка
                showNotification('✅ Заявка отправлена! Мы свяжемся с вами в течение 2 часов.', 'success');
                
                // Сброс формы
                this.reset();
                
                // Восстановление кнопки
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
            
            // Восстановление кнопки при ошибке
            submitBtn.querySelector('.btn-text').textContent = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Валидация в реальном времени
    initFormValidation(form);
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            highlightFieldError(field, true);
        } else {
            highlightFieldError(field, false);
        }
    });
    
    // Валидация email
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            isValid = false;
            highlightFieldError(emailField, true);
        }
    }
    
    return isValid;
}

function initFormValidation(form) {
    const fields = form.querySelectorAll('input, textarea, select');
    
    fields.forEach(field => {
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
    });
}

function highlightFieldError(field, isError) {
    if (isError) {
        field.classList.add('error');
    } else {
        field.classList.remove('error');
    }
}

// =============================================
// УВЕДОМЛЕНИЯ
// =============================================

function showNotification(message, type = 'info') {
    // Удаляем предыдущие уведомления
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Создаем новое уведомление
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Стили для уведомления
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
    
    // Автоматическое удаление через 5 секунд
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

// =============================================
// АНИМАЦИИ И ЭФФЕКТЫ
// =============================================

function initAnimations() {
    // Анимация появления элементов при скролле
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
    
    // Запускаем при загрузке и при скролле
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Первоначальная проверка
    
    // Анимация для герой секции
    initHeroAnimations();
}

function initHeroAnimations() {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add('loaded');
        }, 100);
    }
    
    // Индикатор скролла
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

// =============================================
// CSS АНИМАЦИИ (добавляем в стили)
// =============================================

// Добавьте эти стили в ваш CSS файл
const additionalStyles = `
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

.animate-in {
    animation: fadeInUp 0.6s ease forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.hero-content {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.8s ease;
}

.hero-content.loaded {
    opacity: 1;
    transform: translateY(0);
}

.form-input.error {
    border-color: #f44336 !important;
    box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.1) !important;
}

.notification-content {
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
}

.notification-close {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.3s ease;
}

.notification-close:hover {
    background: rgba(255,255,255,0.2);
}
`;

// Добавляем дополнительные стили
function injectAdditionalStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = additionalStyles;
    document.head.appendChild(styleSheet);
}

// Инициализируем дополнительные стили
injectAdditionalStyles();

// =============================================
// ОБРАБОТЧИКИ ОШИБОК
// =============================================

window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

// Делаем функции глобальными для обработчиков событий в HTML
window.showNotification = showNotification;