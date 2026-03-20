let reviewSlideIndex = 1;
let productSliders = {};
let sliderIntervals = {};

const TELEGRAM_CONFIG = {
    BOT_TOKEN: '8744924257:AAGjjGjkyJ3GeJVBJGm8ccyAPK3TanMf6GI',
    CHAT_ID: '-1003711311452'
};

function showFormPreloader(message = 'Отправка...') {
    const existingPreloader = document.querySelector('.form-preloader');
    if (existingPreloader) {
        existingPreloader.remove();
    }
    
    const preloaderHtml = `
        <div class="form-preloader" id="formPreloader">
            <div class="form-preloader-content">
                <img src="img/logo.png" alt="ShoKlu" class="form-preloader-logo">
                <div class="form-preloader-text">${message}</div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', preloaderHtml);
    
    setTimeout(() => {
        const preloader = document.getElementById('formPreloader');
        if (preloader) preloader.classList.add('show');
    }, 10);
}

function hideFormPreloader() {
    const preloader = document.getElementById('formPreloader');
    if (preloader) {
        preloader.classList.remove('show');
        setTimeout(() => {
            if (preloader.parentNode) {
                preloader.remove();
            }
        }, 300);
    }
}

function showCustomAlert(message, title = 'Успешно') {
    const alertHtml = `
        <div class="custom-alert show" id="customAlert">
            <div class="custom-alert-content">
                <span class="custom-alert-close" onclick="closeCustomAlert()">&times;</span>
                <h3>${title}</h3>
                <p>${message}</p>
                <button class="custom-alert-btn" onclick="closeCustomAlert()">ОК</button>
            </div>
        </div>
    `;
    
    const existingAlert = document.getElementById('customAlert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', alertHtml);
}

window.closeCustomAlert = function() {
    const alert = document.getElementById('customAlert');
    if (alert) {
        alert.remove();
    }
}

window.changeSlide = function(n) {
    showReviewSlide(reviewSlideIndex += n);
}

window.currentSlide = function(n) {
    showReviewSlide(reviewSlideIndex = n);
}

function showReviewSlide(n) {
    let slides = document.getElementsByClassName("review-slide");
    let dots = document.querySelectorAll('.reviews-slider .dot');
    
    if (!slides.length) return;
    
    if (n > slides.length) { reviewSlideIndex = 1; }
    if (n < 1) { reviewSlideIndex = slides.length; }
    
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }
    
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }
    
    slides[reviewSlideIndex - 1].classList.add("active");
    if (dots[reviewSlideIndex - 1]) {
        dots[reviewSlideIndex - 1].classList.add("active");
    }
}

window.changeProductSlide = function(index, productId) {
    const slider = document.getElementById(`slider-${productId}`);
    if (!slider) return;
    
    const images = slider.querySelectorAll('.slider-images img');
    const dots = slider.querySelectorAll('.slider-dots .dot');
    
    if (!images.length) return;
    
    images.forEach(img => img.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (images[index]) images[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    
    if (!productSliders[productId]) {
        productSliders[productId] = {};
    }
    productSliders[productId].currentIndex = index;
}

function nextProductSlide(productId) {
    const slider = document.getElementById(`slider-${productId}`);
    if (!slider) return;
    
    const images = slider.querySelectorAll('.slider-images img');
    if (!images.length) return;
    
    let currentIndex = productSliders[productId]?.currentIndex || 0;
    let nextIndex = (currentIndex + 1) % images.length;
    
    window.changeProductSlide(nextIndex, productId);
}

function startProductSlider(productId) {
    if (sliderIntervals[productId]) {
        clearInterval(sliderIntervals[productId]);
    }
    
    sliderIntervals[productId] = setInterval(() => {
        nextProductSlide(productId);
    }, 5000);
}

function initProductSliders() {
    const productIds = ['kapriz', 'kakaobum', 'roskosh', 'nezhnost', 'triumf'];
    
    productIds.forEach(productId => {
        const slider = document.getElementById(`slider-${productId}`);
        if (slider) {
            const images = slider.querySelectorAll('.slider-images img');
            
            productSliders[productId] = { currentIndex: 0 };
            
            if (images.length > 1) {
                startProductSlider(productId);
            } else {
                const dots = slider.querySelectorAll('.slider-dots');
                dots.forEach(dot => dot.style.display = 'none');
            }
        }
    });
}

window.addToCart = function(id, name, price, maxQty) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existing = cart.find(item => item.id === id);
    if (existing) {
        if (existing.quantity < maxQty) {
            existing.quantity++;
        } else {
            showCustomAlert(`Максимум ${maxQty} шт`, 'Ошибка');
            return;
        }
    } else {
        cart.push({ id, name, price, quantity: 1, maxQuantity: maxQty });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showCustomAlert('Товар добавлен в корзину!');
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCounters = document.querySelectorAll('.cart-badge');
    cartCounters.forEach(counter => {
        if (counter) counter.textContent = totalItems;
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

async function sendToTelegram(message) {
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                chat_id: TELEGRAM_CONFIG.CHAT_ID, 
                text: message,
                parse_mode: 'HTML'
            })
        });
        
        return response.ok;
    } catch (error) {
        console.error('Telegram send error:', error);
        return false;
    }
}

window.openReviewModal = function() {
    const modal = document.getElementById('reviewModal');
    if (modal) {
        modal.classList.add('show');
    }
}

window.closeReviewModal = function() {
    const modal = document.getElementById('reviewModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function initBurgerMenu() {
    const burgerBtn = document.getElementById('burgerBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (!burgerBtn || !navMenu) return;
    
    burgerBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    const menuLinks = navMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            burgerBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    document.addEventListener('click', function(e) {
        if (!burgerBtn.contains(e.target) && !navMenu.contains(e.target)) {
            burgerBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    initSmoothScroll();
    initProductSliders();
    initBurgerMenu();
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            const name = this.querySelector('input[placeholder="Ваше имя"]').value;
            const comment = this.querySelector('textarea').value;
            
            const message = `
<b>✉️ НОВОЕ СООБЩЕНИЕ С САЙТА</b>

👤 <b>Имя:</b> ${name}
📧 <b>Email:</b> ${email}
💬 <b>Комментарий:</b> 
<i>${comment}</i>
            `;
            
            showFormPreloader('Отправка сообщения...');
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;
            
            const success = await sendToTelegram(message);
            
            hideFormPreloader();
            
            if (success) {
                showCustomAlert('Сообщение отправлено! Мы свяжемся с вами.');
                this.reset();
            } else {
                showCustomAlert('Ошибка отправки. Попробуйте позже.', 'Ошибка');
            }
            
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }
    
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('reviewName');
            const textInput = document.getElementById('reviewText');
            
            if (!nameInput || !textInput) return;
            
            const name = nameInput.value;
            const text = textInput.value;
            
            if (!name || !text) {
                showCustomAlert('Заполните все поля', 'Ошибка');
                return;
            }
            
            const message = `
<b>⭐ НОВЫЙ ОТЗЫВ ⭐</b>

👤 <b>Имя:</b> ${name}
💬 <b>Отзыв:</b> 
<i>"${text}"</i>
            `;
            
            showFormPreloader('Отправка отзыва...');
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;
            
            const success = await sendToTelegram(message);
            
            hideFormPreloader();
            
            if (success) {
                showCustomAlert('Спасибо за отзыв!');
                closeReviewModal();
                this.reset();
            } else {
                showCustomAlert('Ошибка при отправке. Попробуйте позже.', 'Ошибка');
            }
            
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }
    
    setInterval(function() {
        if (document.getElementsByClassName("review-slide").length) {
            window.changeSlide(1);
        }
    }, 5000);
});

window.addEventListener('click', function(e) {
    const modal = document.getElementById('reviewModal');
    if (e.target === modal) {
        closeReviewModal();
    }
});

window.addEventListener('beforeunload', function() {
    Object.values(sliderIntervals).forEach(interval => {
        if (interval) clearInterval(interval);
    });
});

window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(function() {
            preloader.classList.add('hidden');
        }, 1000);
    }
});