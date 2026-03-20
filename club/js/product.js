let productSliderInterval = null;
let currentProduct = null;

const products = {
    kapriz: {
        id: 'kapriz',
        name: 'Набор «Каприз»',
        price: 1600,
        quantity: 10,
        images: [
            '../img/nubor/n11.jpg',
            '../img/nubor/n12.jpg',
            '../img/nubor/n13.jpg'
        ],
        description: 'Идеальный мини-комплимент для сладкого настроения. Нежная свежая клубника в изысканном шоколаде — маленький, но очень приятный знак внимания.',
        composition: [
            {
                icon: '🍓',
                title: 'Состав',
                text: '10 отборных сочных ягод'
            },
            {
                icon: '🍫',
                title: 'Покрытие',
                text: 'Натуральный бельгийский молочный шоколад'
            },
            {
                icon: '🎨',
                title: 'Декор',
                text: 'Стильные полоски розовым шоколадом сверху'
            },
        ]
    },
    kakaobum: {
        id: 'kakaobum',
        name: 'Набор «Какао-бум»',
        price: 1600,
        quantity: 10,
        images: [
            '../img/nubor/n21.jpg',
            '../img/nubor/n22.jpg',
            '../img/nubor/n23.jpg'
        ],
        description: 'Идеальный подарок для настоящих сладкоежек. Сочная клубника в контрастном шоколадном обрамлении с хрустящими нотками — маленькое приключение для вкуса.',
        composition: [
            {
                icon: '🍓',
                title: 'Состав',
                text: '10 отборных сочных ягод'
            },
            {
                icon: '🍫',
                title: 'Покрытие',
                text: 'Натуральный бельгийский молочный и горький шоколад'
            },
            {
                icon: '🥜',
                title: 'Декор',
                text: 'Дробленый арахис и стильные шоколадные полоски'
            },
        ]
    },
    roskosh: {
        id: 'roskosh',
        name: 'Набор «Роскошь»',
        price: 1500,
        quantity: 9,
        images: [
            '../img/nubor/n31.jpg',
            '../img/nubor/n32.jpg',
            '../img/nubor/n33.jpg'
        ],
        description: 'Идеальный набор для тех, кто ценит благородство вкуса. Отборные ягоды в драгоценном обрамлении бельгийского шоколада — маленькая роскошь для больших моментов.',
        composition: [
            {
                icon: '🍓',
                title: 'Состав',
                text: '9 отборных сочных ягод'
            },
            {
                icon: '🍫',
                title: 'Покрытие',
                text: 'Натуральный бельгийский шоколад (молочный/белый/розовый/горький)'
            },
            {
                icon: '✨',
                title: 'Декор',
                text: 'Арахис, вафельная стружка, малина и пищевой золотой шиммер'
            },
        ]
    },
    nezhnost: {
        id: 'nezhnost',
        name: 'Набор «Нежная симфония»',
        price: 2500,
        quantity: 16,
        images: [
            '../img/nubor/n51.jpg',
            '../img/nubor/n52.png'
        ],
        description: 'Изысканное сочетание спелых ягод и нежного бельгийского шоколада. Маленькое удовольствие, созданное для особенных мгновений.',
        composition: [
            {
                icon: '🍓',
                title: 'Состав',
                text: '16 отборных сочных ягод'
            },
            {
                icon: '🍫',
                title: 'Покрытие',
                text: 'Натуральный бельгийский молочный шоколад'
            },
            {
                icon: '✨',
                title: 'Декор',
                text: 'Съедобный шиммер'
            },
        ]
    },
    triumf: {
        id: 'triumf',
        name: 'Набор «Триумф»',
        price: 1900,
        quantity: 12,
        images: [
            '../img/nubor/n41.jpg',
            '../img/nubor/n42.jpg'
        ],
        description: 'Идеальный набор для уверенного жеста и яркого вкуса. Сочная клубника в идеальном балансе с благородным шоколадом — достойный выбор для любого повода.',
        composition: [
            {
                icon: '🍓',
                title: 'Состав',
                text: '12 отборных сочных ягод'
            },
            {
                icon: '🍫',
                title: 'Покрытие',
                text: 'Натуральный бельгийский молочный и белый шоколад'
            },
            {
                icon: '✨',
                title: 'Декор',
                text: 'Малина, кондитерская посыпка, арахис и съедобное золото'
            },
        ]
    }
};

function showToast(message, type = 'success', duration = 3000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };
    
    const titles = {
        success: 'Успешно!',
        error: 'Ошибка!',
        info: 'Информация',
        warning: 'Внимание!'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">${icons[type] || '📌'}</div>
        <div class="toast-content">
            <div class="toast-title">${titles[type] || ''}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.closest('.toast').remove()">&times;</button>
    `;
    
    container.appendChild(toast);
    
    const timeout = setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOut 0.3s forwards';
            setTimeout(() => toast.remove(), 300);
        }
    }, duration);
    
    toast.querySelector('.toast-close').addEventListener('click', () => {
        clearTimeout(timeout);
        toast.style.animation = 'slideOut 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
    });
}

function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function renderProduct() {
    const productId = getProductIdFromUrl();
    const product = products[productId];
    const container = document.getElementById('productContainer');
    
    if (!product) {
        container.innerHTML = '<div class="error">Товар не найден</div>';
        return;
    }
    
    currentProduct = product;
    
    let imagesHtml = '';
    product.images.forEach((img, index) => {
        imagesHtml += `<img src="${img}" alt="${product.name} ${index + 1}" class="${index === 0 ? 'active' : ''}">`;
    });
    
    let dotsHtml = '';
    product.images.forEach((_, index) => {
        dotsHtml += `<span class="dot ${index === 0 ? 'active' : ''}" onclick="changeProductSlide(${index})"></span>`;
    });
    
    let compositionHtml = '';
    product.composition.forEach(item => {
        compositionHtml += `
            <div class="composition-item">
                <div class="composition-icon">${item.icon}</div>
                <div class="composition-content">
                    <strong>${item.title}</strong>
                    <span>${item.text}</span>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = `
        <div class="product-detail">
            <div class="product-gallery">
                <div class="product-image-slider" id="product-slider">
                    <div class="slider-images">
                        ${imagesHtml}
                    </div>
                    <div class="slider-dots">
                        ${dotsHtml}
                    </div>
                </div>
            </div>
            <div class="product-info-detail">
                <h1>${product.name}</h1>
                <p class="product-description">${product.description}</p>
                
                <div class="product-composition">
                    <div class="composition-title">Состав набора</div>
                    <div class="composition-list">
                        ${compositionHtml}
                    </div>
                </div>
                
                <div class="quantity-selector">
                    <label>Количество:</label>
                    <div class="quantity-control">
                        <button class="minus-btn" onclick="changeQuantity(-1)">−</button>
                        <input type="number" id="productQuantity" value="1" min="1" max="10" readonly>
                        <button class="plus-btn" onclick="changeQuantity(1)">+</button>
                    </div>
                </div>
                
                <div class="product-price-detail" id="totalPrice">${product.price} руб.</div>
                
                <div class="product-actions">
                    <button class="add-to-cart-btn" onclick="addToCartFromProduct()">В корзину</button>
                    <a href="../index.html" class="back-btn">Назад</a>
                </div>
            </div>
        </div>
    `;
    
    if (product.images.length > 1) {
        startProductSlider();
    } else {
        const dots = document.querySelectorAll('.slider-dots');
        dots.forEach(dot => dot.style.display = 'none');
    }
}

window.changeProductSlide = function(index) {
    const slider = document.getElementById('product-slider');
    if (!slider) return;
    
    const images = slider.querySelectorAll('.slider-images img');
    const dots = slider.querySelectorAll('.slider-dots .dot');
    
    if (!images.length) return;
    
    images.forEach(img => img.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (images[index]) images[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    
    window.currentSlideIndex = index;
}

function nextProductSlide() {
    const slider = document.getElementById('product-slider');
    if (!slider) return;
    
    const images = slider.querySelectorAll('.slider-images img');
    if (!images.length) return;
    
    const currentIndex = window.currentSlideIndex || 0;
    const nextIndex = (currentIndex + 1) % images.length;
    
    window.changeProductSlide(nextIndex);
}

function startProductSlider() {
    if (productSliderInterval) {
        clearInterval(productSliderInterval);
    }
    
    const slider = document.getElementById('product-slider');
    if (!slider) return;
    
    const images = slider.querySelectorAll('.slider-images img');
    if (images.length <= 1) return;
    
    window.currentSlideIndex = 0;
    
    productSliderInterval = setInterval(() => {
        nextProductSlide();
    }, 5000);
}

window.changeQuantity = function(delta) {
    const input = document.getElementById('productQuantity');
    if (!input) return;
    
    let value = parseInt(input.value) + delta;
    if (value < 1) value = 1;
    if (value > 10) value = 10;
    input.value = value;
    
    updateTotalPrice();
}

function updateTotalPrice() {
    if (!currentProduct) return;
    
    const quantity = parseInt(document.getElementById('productQuantity').value);
    const total = currentProduct.price * quantity;
    const totalPriceEl = document.getElementById('totalPrice');
    
    if (totalPriceEl) totalPriceEl.textContent = `${total} руб.`;
}

window.addToCartFromProduct = function() {
    if (!currentProduct) return;
    
    const quantityInput = document.getElementById('productQuantity');
    if (!quantityInput) return;
    
    const quantity = parseInt(quantityInput.value);
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existing = cart.find(item => item.id === currentProduct.id);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            quantity: quantity,
            maxQuantity: 10
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCartCount();
    
    showToast('Товар добавлен в корзину!', 'success');
    window.location.href = 'cart.html';
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCounters = document.querySelectorAll('.cart-badge');
    
    cartCounters.forEach(counter => {
        if (counter) counter.textContent = totalItems;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    renderProduct();
    updateCartCount();
});

window.addEventListener('beforeunload', function() {
    if (productSliderInterval) {
        clearInterval(productSliderInterval);
    }
});