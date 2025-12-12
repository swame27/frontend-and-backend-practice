// ===== ПЕРЕКЛЮЧЕНИЕ ТЕМЫ =====
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация темы
    initTheme();
    
    // Инициализация анимаций
    initAnimations();
    
    // Инициализация навигации
    initNavigation();
    
    // Инициализация модальных окон
    initModals();
});

// Инициализация темы
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    // Проверяем сохраненную тему или системные настройки
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    // Устанавливаем тему
    setTheme(currentTheme);
    
    // Обработчик клика
    themeToggle.addEventListener('click', function() {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
    
    // Слушатель изменения системной темы
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

// Установка темы
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Обновляем иконку кнопки
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon';
        }
    }
    
    // Обновляем мета-тег для мобильных устройств
    updateThemeMeta(theme);
}

// Обновление мета-тега темы
function updateThemeMeta(theme) {
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
        themeColor.content = theme === 'dark' ? '#121212' : '#4361ee';
    }
}

// Инициализация анимаций
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами с анимацией
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// Инициализация навигации
function initNavigation() {
    // Подсветка активной страницы
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (linkHref.includes(currentPage) && currentPage !== 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Инициализация модальных окон
function initModals() {
    // Автоматическое закрытие при клике на фон
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                const modalInstance = bootstrap.Modal.getInstance(this);
                if (modalInstance) {
                    modalInstance.hide();
                }
            }
        });
    });
    
    // Обработка клавиши Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                const modalInstance = bootstrap.Modal.getInstance(openModal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            }
        }
    });
}

// ===== ФУНКЦИИ ДЛЯ СКАЧИВАНИЯ РЕЗЮМЕ =====
function downloadResume(format) {
    const resumeUrl = format === 'pdf' ? 'assets/resume.pdf' : 'assets/resume.docx';
    const link = document.createElement('a');
    
    // Показываем индикатор загрузки
    const button = event.target.closest('a');
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Скачивание...';
    button.disabled = true;
    
    // Имитация загрузки (в реальном проекте здесь будет реальная загрузка)
    setTimeout(() => {
        // Создаем временную ссылку для скачивания
        link.href = resumeUrl;
        link.download = `resume_${format === 'pdf' ? 'pdf' : 'docx'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Возвращаем кнопку в исходное состояние
        button.innerHTML = originalText;
        button.disabled = false;
        
        // Показываем уведомление
        showNotification(`Резюме успешно скачано в формате ${format.toUpperCase()}!`, 'success');
    }, 1000);
}

// Показ уведомления
function showNotification(message, type = 'success') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification alert alert-${type} alert-dismissible fade show`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Автоматическое скрытие через 4 секунды
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
    
    // Добавляем стили для анимации если их нет
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
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
            .notification {
                animation: slideInRight 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== КОРЗИНА =====
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId, productName, productPrice) {
    // Находим существующий товар
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }
    
    // Сохраняем в localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Обновляем отображение
    updateCartDisplay();
    
    // Показываем уведомление
    showNotification(`${productName} добавлен в корзину!`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    showNotification('Товар удален из корзины', 'info');
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartCount || !cartItems) return;
    
    // Обновляем счетчик
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Обновляем список товаров в корзине
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center text-muted py-5">Корзина пуста</p>';
        if (cartTotal) cartTotal.textContent = '0 ₽';
        return;
    }
    
    let itemsHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        itemsHTML += `
            <div class="cart-item mb-3 p-3 border rounded">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-1">${item.name}</h6>
                        <small class="text-muted">${item.price} ₽ × ${item.quantity}</small>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <span class="text-primary fw-bold">${itemTotal} ₽</span>
                        <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${item.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartItems.innerHTML = itemsHTML;
    if (cartTotal) cartTotal.textContent = `${total.toLocaleString()} ₽`;
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Корзина пуста!', 'warning');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Показываем модальное окно оформления заказа
    showCheckoutModal(total);
}

function showCheckoutModal(total) {
    const modalHTML = `
        <div class="modal fade" id="checkoutModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Оформление заказа</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>Общая сумма: <strong class="text-primary">${total.toLocaleString()} ₽</strong></p>
                        <p>Для завершения покупки заполните форму:</p>
                        
                        <form id="checkoutForm">
                            <div class="mb-3">
                                <label class="form-label">Имя</label>
                                <input type="text" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Телефон</label>
                                <input type="tel" class="form-control" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button type="button" class="btn btn-primary" onclick="processCheckout()">Оформить заказ</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Добавляем модальное окно в DOM
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstElementChild);
    
    // Показываем модальное окно
    const modal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    modal.show();
    
    // Удаляем модальное окно после закрытия
    document.getElementById('checkoutModal').addEventListener('hidden.bs.modal', function() {
        this.parentNode.removeChild(this);
    });
}

function processCheckout() {
    const form = document.getElementById('checkoutForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Имитация отправки данных
    setTimeout(() => {
        // Очищаем корзину
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        
        // Закрываем модальное окно
        const modal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
        modal.hide();
        
        // Показываем уведомление об успехе
        showNotification('Заказ успешно оформлен! Спасибо за покупку!', 'success');
    }, 1500);
}

// Инициализация корзины при загрузке
if (document.querySelector('[data-page="cart"]')) {
    updateCartDisplay();
}

// ===== ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ =====

// Копирование текста в буфер обмена
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Скопировано в буфер обмена!', 'success');
    }).catch(err => {
        console.error('Ошибка копирования: ', err);
        showNotification('Не удалось скопировать', 'error');
    });
}

// Форматирование цены
function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0
    }).format(price);
}

// Проверка мобильного устройства
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Плавное появление элементов
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(el => observer.observe(el));
}

// Инициализация всех функций при загрузке
window.addEventListener('load', () => {
    animateOnScroll();
    
    // Обновляем корзину если есть
    if (typeof updateCartDisplay === 'function') {
        updateCartDisplay();
    }
});

// Экспорт функций для глобального использования
window.downloadResume = downloadResume;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartDisplay = updateCartDisplay;
window.checkout = checkout;
window.copyToClipboard = copyToClipboard;