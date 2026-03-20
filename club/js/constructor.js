let selectedQuantity = 0;
let chocolateCounts = {};

const PRICE_PER_BERRY = {
    4: 175,
    10: 160,
    12: 158.33,
    16: 156.25,
    20: 150,
    25: 144
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

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCounters = document.querySelectorAll('.cart-badge');
    
    cartCounters.forEach(counter => {
        if (counter) counter.textContent = totalItems;
    });
}

function resetConstructor() {
    selectedQuantity = 0;
    chocolateCounts = {};
    
    document.querySelectorAll('.quantity-circle').forEach(c => c.classList.remove('selected'));
    
    const selectedQuantityEl = document.getElementById('selectedQuantity');
    if (selectedQuantityEl) selectedQuantityEl.textContent = 'Выбрано: 0 ягод';
    
    const chocolateSection = document.getElementById('chocolateSection');
    if (chocolateSection) chocolateSection.style.display = 'none';
    
    const toppingsSection = document.getElementById('toppingsSection');
    if (toppingsSection) toppingsSection.style.display = 'none';
    
    const optionsSection = document.getElementById('optionsSection');
    if (optionsSection) optionsSection.style.display = 'none';
    
    const constructorTotal = document.getElementById('constructorTotal');
    if (constructorTotal) constructorTotal.style.display = 'none';
    
    resetChocolateCounters();
    resetToppings();
    resetOptions();
    
    const remainingCount = document.getElementById('remainingCount');
    if (remainingCount) remainingCount.textContent = '0';
}

document.querySelectorAll('.quantity-circle').forEach(circle => {
    circle.addEventListener('click', function() {
        document.querySelectorAll('.quantity-circle').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        
        selectedQuantity = parseInt(this.dataset.quantity);
        
        const selectedQuantityEl = document.getElementById('selectedQuantity');
        if (selectedQuantityEl) {
            selectedQuantityEl.textContent = `Выбрано: ${selectedQuantity} ягод`;
        }
        
        const chocolateSection = document.getElementById('chocolateSection');
        if (chocolateSection) chocolateSection.style.display = 'block';
        
        const toppingsSection = document.getElementById('toppingsSection');
        if (toppingsSection) toppingsSection.style.display = 'none';
        
        const optionsSection = document.getElementById('optionsSection');
        if (optionsSection) optionsSection.style.display = 'none';
        
        const constructorTotal = document.getElementById('constructorTotal');
        if (constructorTotal) constructorTotal.style.display = 'none';
        
        resetChocolateCounters();
        resetToppings();
        resetOptions();
        
        updateRemaining();
    });
});

function resetChocolateCounters() {
    chocolateCounts = {};
    document.querySelectorAll('.chocolate-item').forEach(item => {
        item.classList.remove('selected');
        item.classList.remove('disabled');
        const counter = item.querySelector('.chocolate-counter');
        if (counter) {
            counter.style.display = 'none';
            const input = counter.querySelector('.counter-input');
            if (input) {
                input.value = 0;
                input.readOnly = false;
            }
        }
    });
}

function resetToppings() {
    document.querySelectorAll('.topping-checkbox').forEach(cb => {
        cb.checked = false;
        cb.closest('.topping-item')?.classList.remove('selected');
    });
}

function resetOptions() {
    document.querySelectorAll('.option-input').forEach(cb => cb.checked = false);
}

function isChocolateAvailable() {
    const totalSelected = Object.values(chocolateCounts).reduce((a, b) => a + b, 0);
    return totalSelected < selectedQuantity;
}

function addChocolate(type, item) {
    if (!isChocolateAvailable()) {
        return;
    }
    
    if (!item.classList.contains('selected')) {
        item.classList.add('selected');
        const counter = item.querySelector('.chocolate-counter');
        if (counter) counter.style.display = 'flex';
    }
    
    const input = item.querySelector('.counter-input');
    if (!input) return;
    
    let value = parseInt(input.value) + 1;
    
    const totalSelected = Object.values(chocolateCounts).reduce((a, b) => a + b, 0);
    
    if (totalSelected < selectedQuantity) {
        input.value = value;
        chocolateCounts[type] = value;
        updateRemaining();
    }
}

document.querySelectorAll('.chocolate-item').forEach(item => {
    item.addEventListener('click', function(e) {
        if (e.target.classList.contains('counter-btn') || 
            e.target.classList.contains('counter-input')) {
            return;
        }
        
        if (!isChocolateAvailable()) {
            return;
        }
        
        const type = this.dataset.type;
        addChocolate(type, this);
    });
});

document.querySelectorAll('.plus').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        
        if (!isChocolateAvailable()) {
            return;
        }
        
        const item = this.closest('.chocolate-item');
        const type = item.dataset.type;
        const input = this.parentElement.querySelector('.counter-input');
        if (!input) return;
        
        let value = parseInt(input.value);
        
        value++;
        input.value = value;
        chocolateCounts[type] = value;
        updateRemaining();
    });
});

document.querySelectorAll('.minus').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const item = this.closest('.chocolate-item');
        const type = item.dataset.type;
        const input = this.parentElement.querySelector('.counter-input');
        if (!input) return;
        
        let value = parseInt(input.value);
        
        if (value > 0) {
            value--;
            input.value = value;
            
            if (value === 0) {
                item.classList.remove('selected');
                const counter = item.querySelector('.chocolate-counter');
                if (counter) counter.style.display = 'none';
                delete chocolateCounts[type];
            } else {
                chocolateCounts[type] = value;
            }
            
            updateRemaining();
        }
    });
});


document.querySelectorAll('.counter-input').forEach(input => {
    input.readOnly = false;
    input.removeAttribute('readonly');
    
    input.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    input.addEventListener('keydown', function(e) {
        e.stopPropagation();
        
        // Разрешаем только цифры, backspace, delete, стрелки
        if (!/^\d$/.test(e.key) && 
            e.key !== 'Backspace' && 
            e.key !== 'Delete' && 
            e.key !== 'ArrowLeft' && 
            e.key !== 'ArrowRight' && 
            e.key !== 'Tab' &&
            e.key !== 'Home' &&
            e.key !== 'End') {
            e.preventDefault();
        }
    });
    
    input.addEventListener('input', function(e) {
        const item = this.closest('.chocolate-item');
        const type = item.dataset.type;
        let value = parseInt(this.value);
        
        if (isNaN(value) || value < 0) {
            value = 0;
            this.value = 0;
        }
        
        const totalSelected = Object.values(chocolateCounts).reduce((a, b) => a + b, 0) - (chocolateCounts[type] || 0);
        const maxAllowed = selectedQuantity - totalSelected;
        
        if (value > maxAllowed) {
            value = maxAllowed;
            this.value = value;
        }
        
        if (value > 0) {
            if (!item.classList.contains('selected')) {
                item.classList.add('selected');
                const counter = item.querySelector('.chocolate-counter');
                if (counter) counter.style.display = 'flex';
            }
            chocolateCounts[type] = value;
        } else {
            if (item.classList.contains('selected')) {
                item.classList.remove('selected');
                const counter = item.querySelector('.chocolate-counter');
                if (counter) counter.style.display = 'none';
            }
            delete chocolateCounts[type];
        }
        
        updateRemaining();
    });
    
    input.addEventListener('blur', function(e) {
        if (this.value === '' || parseInt(this.value) === 0) {
            this.value = 0;
            const item = this.closest('.chocolate-item');
            const type = item.dataset.type;
            
            if (item.classList.contains('selected')) {
                item.classList.remove('selected');
                const counter = item.querySelector('.chocolate-counter');
                if (counter) counter.style.display = 'none';
            }
            delete chocolateCounts[type];
            updateRemaining();
        }
    });
});

function updateRemaining() {
    const totalSelected = Object.values(chocolateCounts).reduce((a, b) => a + b, 0);
    const remaining = selectedQuantity - totalSelected;
    
    const remainingCount = document.getElementById('remainingCount');
    if (remainingCount) remainingCount.textContent = remaining;
    
    const toppingsSection = document.getElementById('toppingsSection');
    const optionsSection = document.getElementById('optionsSection');
    const constructorTotal = document.getElementById('constructorTotal');
    
    if (totalSelected === selectedQuantity && selectedQuantity > 0) {
        if (toppingsSection) toppingsSection.style.display = 'block';
        if (optionsSection) optionsSection.style.display = 'block';
        if (constructorTotal) constructorTotal.style.display = 'block';
        calculateTotal();
    } else {
        if (toppingsSection) toppingsSection.style.display = 'none';
        if (optionsSection) optionsSection.style.display = 'none';
        if (constructorTotal) constructorTotal.style.display = 'none';
    }
}

document.querySelectorAll('.topping-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const item = this.closest('.topping-item');
        if (item) {
            if (this.checked) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        }
        calculateTotal();
    });
});

document.querySelectorAll('.option-input').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        calculateTotal();
    });
});

function calculateTotal() {
    const pricePerBerry = PRICE_PER_BERRY[selectedQuantity] || 160;
    const basePrice = Math.round(selectedQuantity * pricePerBerry);
    
    const basePriceEl = document.getElementById('basePrice');
    if (basePriceEl) basePriceEl.textContent = `${basePrice} руб.`;
    
    let optionsTotal = 0;
    document.querySelectorAll('.option-input:checked').forEach(checkbox => {
        optionsTotal += parseInt(checkbox.dataset.price);
    });
    
    const optionsRow = document.getElementById('optionsTotalRow');
    const optionsPrice = document.getElementById('optionsPrice');
    
    if (optionsTotal > 0) {
        if (optionsRow) optionsRow.style.display = 'flex';
        if (optionsPrice) optionsPrice.textContent = `${optionsTotal} руб.`;
    } else {
        if (optionsRow) optionsRow.style.display = 'none';
    }
    
    const finalPrice = basePrice + optionsTotal;
    const finalPriceEl = document.getElementById('finalPrice');
    if (finalPriceEl) finalPriceEl.textContent = `${finalPrice} руб.`;
}

const addToCartBtn = document.getElementById('addToCartBtn');
if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function() {
        if (selectedQuantity === 0) {
            showToast('Выберите количество ягод', 'warning');
            return;
        }
        
        const totalSelected = Object.values(chocolateCounts).reduce((a, b) => a + b, 0);
        if (totalSelected !== selectedQuantity) {
            showToast('Распределите все ягоды по видам шоколада', 'warning');
            return;
        }
        
        const chocolateDetails = Object.entries(chocolateCounts)
            .filter(([_, count]) => count > 0)
            .map(([type, count]) => {
                const typeNames = {
                    'горький': 'Горький',
                    'розовый': 'Розовый',
                    'молочный': 'Молочный',
                    'голубой': 'Голубой',
                    'жёлтый': 'Жёлтый',
                    'зелёный': 'Зелёный'
                };
                return `${typeNames[type] || type}: ${count} шт`;
            })
            .join('\n'); // Каждый с новой строки
        
        const selectedToppings = [];
        document.querySelectorAll('.topping-checkbox:checked').forEach(checkbox => {
            const toppingName = checkbox.closest('.topping-item')?.querySelector('span')?.textContent || 'посыпка';
            selectedToppings.push(toppingName);
        });
        
        let optionsTotal = 0;
        document.querySelectorAll('.option-input:checked').forEach(checkbox => {
            optionsTotal += parseInt(checkbox.dataset.price);
        });
        
        const pricePerBerry = PRICE_PER_BERRY[selectedQuantity] || 160;
        const basePrice = Math.round(selectedQuantity * pricePerBerry);
        const finalPrice = basePrice + optionsTotal;
        
        const customSet = {
            id: 'custom_' + Date.now(),
            name: 'Набор "Конструктор"',
            price: finalPrice,
            quantity: 1,
            maxQuantity: 1,
            details: {
                quantity: selectedQuantity,
                chocolateDetails: chocolateDetails,
                chocolateCounts: chocolateCounts,
                toppings: selectedToppings,
                basePrice: basePrice,
                optionsTotal: optionsTotal
            }
        };
        
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(customSet);
        localStorage.setItem('cart', JSON.stringify(cart));
        
        updateCartCount();
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            font-family: 'Montserrat', sans-serif;
        `;
        
        const chocolateText = Object.entries(chocolateCounts)
            .filter(([_, count]) => count > 0)
            .map(([type, count]) => {
                const typeNames = {
                    'горький': 'Горький',
                    'розовый': 'Розовый',
                    'молочный': 'Молочный',
                    'голубой': 'Голубой',
                    'жёлтый': 'Жёлтый',
                    'зелёный': 'Зелёный'
                };
                return `${typeNames[type] || type}: ${count} шт`;
            })
            .join('\n'); // Каждый с новой строки
        
        const toppingsText = selectedToppings.length > 0 
            ? `\nПосыпка:\n• ${selectedToppings.join('\n• ')}`
            : '';
        
        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 30px;
                padding: 40px;
                max-width: 450px;
                width: 90%;
                text-align: left;
                animation: modalSlideIn 0.3s ease;
                max-height: 80vh;
                overflow-y: auto;
            ">
                <div style="font-size: 50px; text-align: center; margin-bottom: 20px;">🍓</div>
                <h3 style="font-size: 24px; margin-bottom: 20px; color: #2c2c2c; text-align: center;">Набор добавлен!</h3>
                
                <div style="background: #f9f5f0; border-radius: 16px; padding: 20px; margin-bottom: 25px; white-space: pre-line;">
                    <p style="margin-bottom: 10px;"><b>📦 Состав набора:</b></p>
                    <p><b>Ягоды:</b> ${selectedQuantity} шт</p>
                    <p><b>Шоколад:</b><br>${chocolateText}</p>
                    ${selectedToppings.length > 0 ? `<p><b>Посыпка:</b><br>• ${selectedToppings.join('<br>• ')}</p>` : ''}
                    <p style="margin-top: 15px; font-size: 20px; color: #b33b3b;"><b>Сумма: ${finalPrice} руб.</b></p>
                </div>
                
                <div style="display: flex; gap: 15px;">
                    <button id="goToCart" style="
                        flex: 1;
                        background: #b33b3b;
                        color: white;
                        border: none;
                        padding: 14px;
                        border-radius: 40px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                    ">Перейти в корзину</button>
                    <button id="continueShopping" style="
                        flex: 1;
                        background: white;
                        color: #b33b3b;
                        border: 2px solid #b33b3b;
                        padding: 14px;
                        border-radius: 40px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                    ">Продолжить</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('goToCart').addEventListener('click', function() {
            window.location.href = 'cart.html';
        });
        
        document.getElementById('continueShopping').addEventListener('click', function() {
            document.body.removeChild(modal);
            resetConstructor();
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
                resetConstructor();
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    document.querySelectorAll('.counter-input').forEach(input => {
        input.readOnly = false;
        input.removeAttribute('readonly');
    });
});