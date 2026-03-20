let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCounters = document.querySelectorAll('.cart-badge');
    
    cartCounters.forEach(counter => {
        if (counter) counter.textContent = totalItems;
    });
}

function renderCartItems() {
    const cartItemsList = document.getElementById('cartItemsList');
    const subtotalSpan = document.getElementById('subtotalAmount');
    
    if (!cartItemsList) return;
    
    if (cart.length === 0) {
        cartItemsList.innerHTML = `
            <div class="empty-cart">
                <p>Ваша корзина пуста</p>
                <a href="../index.html" class="empty-cart-btn">Перейти в каталог</a>
                <a href="constructor.html" class="empty-cart-btn secondary">Конструктор наборов</a>
            </div>
        `;
        if (subtotalSpan) subtotalSpan.textContent = '0 руб.';
        updateTotal();
        return;
    }
    
    let html = '';
    let subtotal = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        html += `
            <div class="cart-item" data-index="${index}">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <div class="cart-item-price">${item.price} руб./шт</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="changeQuantity(${index}, -1)">−</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="changeQuantity(${index}, 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart(${index})">Удалить</button>
                </div>
            </div>
        `;
    });
    
    cartItemsList.innerHTML = html;
    if (subtotalSpan) subtotalSpan.textContent = `${subtotal} руб.`;
    updateTotal();
}

window.changeQuantity = function(index, delta) {
    const item = cart[index];
    if (!item) return;
    
    const newQuantity = item.quantity + delta;
    
    if (newQuantity < 1) {
        removeFromCart(index);
        return;
    }
    
    if (item.maxQuantity && newQuantity > item.maxQuantity) {
        showCustomAlert(`Максимальное количество: ${item.maxQuantity} шт`);
        return;
    }
    
    item.quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
    updateCartCount();
};

window.removeFromCart = function(index) {
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
    
    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 30px;
            padding: 40px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            animation: modalSlideIn 0.3s ease;
        ">
            <div style="font-size: 50px; margin-bottom: 20px;">🗑️</div>
            <h3 style="font-size: 24px; margin-bottom: 15px; color: #2c2c2c;">Удаление товара</h3>
            <p style="font-size: 16px; color: #666; margin-bottom: 30px;">Вы уверены, что хотите удалить товар из корзины?</p>
            <div style="display: flex; gap: 15px;">
                <button id="confirmDelete" style="
                    flex: 1;
                    background: #b33b3b;
                    color: white;
                    border: none;
                    padding: 14px;
                    border-radius: 40px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                ">Удалить</button>
                <button id="cancelDelete" style="
                    flex: 1;
                    background: white;
                    color: #b33b3b;
                    border: 2px solid #b33b3b;
                    padding: 14px;
                    border-radius: 40px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                ">Отмена</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('confirmDelete').addEventListener('click', function() {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartCount();
        document.body.removeChild(modal);
    });
    
    document.getElementById('cancelDelete').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
};

window.clearCart = function() {
    if (cart.length === 0) {
        showCustomAlert('Корзина уже пуста');
        return;
    }
    
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
    
    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 30px;
            padding: 40px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            animation: modalSlideIn 0.3s ease;
        ">
            <div style="font-size: 50px; margin-bottom: 20px;">🗑️</div>
            <h3 style="font-size: 24px; margin-bottom: 15px; color: #2c2c2c;">Очистить корзину</h3>
            <p style="font-size: 16px; color: #666; margin-bottom: 30px;">Вы уверены, что хотите удалить все товары из корзины?</p>
            <div style="display: flex; gap: 15px;">
                <button id="confirmClear" style="
                    flex: 1;
                    background: #b33b3b;
                    color: white;
                    border: none;
                    padding: 14px;
                    border-radius: 40px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                ">Очистить</button>
                <button id="cancelClear" style="
                    flex: 1;
                    background: white;
                    color: #b33b3b;
                    border: 2px solid #b33b3b;
                    padding: 14px;
                    border-radius: 40px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                ">Отмена</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('confirmClear').addEventListener('click', function() {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartCount();
        document.body.removeChild(modal);
    });
    
    document.getElementById('cancelClear').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
};

function updateTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let optionsTotal = 0;
    const blueberryDeco = document.getElementById('blueberryDeco');
    const blueberryChoco = document.getElementById('blueberryChoco');
    
    if (blueberryDeco && blueberryDeco.checked) optionsTotal += 150;
    if (blueberryChoco && blueberryChoco.checked) optionsTotal += 200;
    
    const deliveryRadio = document.querySelector('input[name="delivery"]:checked');
    const deliveryCost = deliveryRadio && deliveryRadio.value === 'delivery' ? 200 : 0;
    
    const subtotalSpan = document.getElementById('subtotalAmount');
    const optionsSpan = document.getElementById('optionsAmount');
    const optionsRow = document.getElementById('optionsRow');
    const deliveryRow = document.getElementById('deliveryRow');
    const totalSpan = document.getElementById('totalAmount');
    
    if (subtotalSpan) subtotalSpan.textContent = `${subtotal} руб.`;
    
    if (optionsTotal > 0) {
        if (optionsSpan) optionsSpan.textContent = `${optionsTotal} руб.`;
        if (optionsRow) optionsRow.style.display = 'flex';
    } else {
        if (optionsRow) optionsRow.style.display = 'none';
    }
    
    if (deliveryCost > 0) {
        if (deliveryRow) deliveryRow.style.display = 'flex';
    } else {
        if (deliveryRow) deliveryRow.style.display = 'none';
    }
    
    const total = subtotal + optionsTotal + deliveryCost;
    if (totalSpan) totalSpan.textContent = `${total} руб.`;
}

function showCustomAlert(message) {
    const alert = document.getElementById('customAlert');
    const alertMessage = document.getElementById('alertMessage');
    
    alertMessage.textContent = message;
    alert.classList.add('show');
    
    setTimeout(() => {
        alert.classList.remove('show');
    }, 3000);
}

function showFormPreloader(message = 'Отправка заказа...') {
    const existingPreloader = document.querySelector('.form-preloader');
    if (existingPreloader) {
        existingPreloader.remove();
    }
    
    const preloaderHtml = `
        <div class="form-preloader" id="formPreloader">
            <div class="form-preloader-content">
                <img src="../img/logo.png" alt="ShoKlu" class="form-preloader-logo">
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

window.closeAlert = function() {
    document.getElementById('customAlert').classList.remove('show');
};

function initDeliveryToggle() {
    const deliveryRadios = document.querySelectorAll('input[name="delivery"]');
    const addressBlock = document.getElementById('addressBlock');
    const deliveryAddress = document.getElementById('deliveryAddress');
    
    deliveryRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'delivery') {
                addressBlock.style.display = 'block';
                if (deliveryAddress) deliveryAddress.required = true;
            } else {
                addressBlock.style.display = 'none';
                if (deliveryAddress) deliveryAddress.required = false;
            }
            updateTotal();
        });
    });
}

function getFullAddress() {
    const deliveryAddress = document.getElementById('deliveryAddress')?.value || '';
    const entrance = document.getElementById('entrance')?.value;
    const floor = document.getElementById('floor')?.value;
    const apartment = document.getElementById('apartment')?.value;
    const courierComment = document.getElementById('courierComment')?.value;
    
    let fullAddress = deliveryAddress;
    const details = [];
    
    if (entrance) details.push(`подъезд ${entrance}`);
    if (floor) details.push(`этаж ${floor}`);
    if (apartment) details.push(`кв/офис ${apartment}`);
    
    if (details.length > 0) {
        fullAddress += ` (${details.join(', ')})`;
    }
    
    return {
        full: fullAddress,
        comment: courierComment
    };
}

async function submitOrder(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('fullName')?.value;
    const phone = document.getElementById('phone')?.value;
    const date = document.getElementById('deliveryDate')?.value;
    const delivery = document.querySelector('input[name="delivery"]:checked')?.value;
    const deliveryAddress = document.getElementById('deliveryAddress')?.value;
    
    if (!fullName || !phone || !date) {
        showCustomAlert('Пожалуйста, заполните все поля');
        return;
    }
    
    if (delivery === 'delivery' && !deliveryAddress) {
        showCustomAlert('Пожалуйста, укажите адрес доставки');
        return;
    }
    
    if (cart.length === 0) {
        showCustomAlert('Корзина пуста');
        return;
    }
    
    const TELEGRAM_BOT_TOKEN = '8744924257:AAGjjGjkyJ3GeJVBJGm8ccyAPK3TanMf6GI';
    const TELEGRAM_CHAT_ID = '-1003711311452';
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const blueberryDeco = document.getElementById('blueberryDeco')?.checked ? 150 : 0;
    const blueberryChoco = document.getElementById('blueberryChoco')?.checked ? 200 : 0;
    const optionsTotal = blueberryDeco + blueberryChoco;
    const deliveryCost = delivery === 'delivery' ? 200 : 0;
    const total = subtotal + optionsTotal + deliveryCost;
    
    const itemsDetails = cart.map(item => {
        if (item.id && item.id.startsWith('custom_')) {
            let details = `  • ${item.name} — ${item.quantity} шт × ${item.price} руб. = ${item.price * item.quantity} руб.`;
            
            if (item.details) {
                details += `\n    📦 Состав:`;
                if (item.details.quantity) {
                    details += `\n    • Всего ягод: ${item.details.quantity} шт`;
                }
                if (item.details.chocolateCounts) {
                    const chocolates = Object.entries(item.details.chocolateCounts)
                        .map(([type, count]) => {
                            const typeNames = {
                                'горький': 'Горький',
                                'розовый': 'Розовый',
                                'молочный': 'Молочный',
                                'голубой': 'Голубой',
                                'жёлтый': 'Жёлтый',
                                'зелёный': 'Зелёный'
                            };
                            return `      ${typeNames[type] || type}: ${count} шт`;
                        })
                        .join('\n');
                    details += `\n    • Шоколад:\n${chocolates}`;
                }
                if (item.details.toppings && item.details.toppings.length > 0) {
                    details += `\n    • Посыпка: ${item.details.toppings.join(', ')}`;
                }
            }
            return details;
        } else {
            return `  • ${item.name} — ${item.quantity} шт × ${item.price} руб. = ${item.price * item.quantity} руб.`;
        }
    }).join('\n\n');
    
    let optionsText = '';
    if (optionsTotal > 0) {
        const options = [];
        if (blueberryDeco > 0) options.push('• Голубика в оформлении (+150 руб.)');
        if (blueberryChoco > 0) options.push('• Голубика в шоколаде (+200 руб.)');
        optionsText = `\n✨ ДОПОЛНИТЕЛЬНЫЕ ОПЦИИ:\n${options.join('\n')}`;
    }
    
    let addressInfo = '';
    if (delivery === 'delivery') {
        const address = getFullAddress();
        addressInfo = `\n📍 АДРЕС ДОСТАВКИ:\n${address.full}`;
        if (address.comment) {
            addressInfo += `\n📝 Комментарий: ${address.comment}`;
        }
    }
    
    const message = `
🍓 НОВЫЙ ЗАКАЗ ИЗ КОРЗИНЫ 🍓

━━━━━━━━━━━━━━━━
👤 ФИО: ${fullName}
📞 Телефон: ${phone}
📅 Дата: ${date}
🚚 Доставка: ${delivery === 'pickup' ? 'Самовывоз (ул. Фейгина, 17)' : 'Доставка по Владимиру (+200 руб.)'}${addressInfo}

━━━━━━━━━━━━━━━━
🛍 ТОВАРЫ:

${itemsDetails}
${optionsText}

━━━━━━━━━━━━━━━━
💰 ИТОГО: ${total} руб.
    `;
    
    showFormPreloader('Отправка заказа...');
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });
        
        const result = await response.json();
        
        hideFormPreloader();
        
        if (result.ok) {
            showCustomAlert('Заказ успешно отправлен! Мы свяжемся с вами для подтверждения.');
            
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCartItems();
            updateCartCount();
            
            const form = document.getElementById('orderForm');
            if (form) form.reset();
            
            const blueberryDeco = document.getElementById('blueberryDeco');
            const blueberryChoco = document.getElementById('blueberryChoco');
            if (blueberryDeco) blueberryDeco.checked = false;
            if (blueberryChoco) blueberryChoco.checked = false;
            
            const dateInput = document.getElementById('deliveryDate');
            if (dateInput) {
                const today = new Date().toISOString().split('T')[0];
                dateInput.value = today;
            }
            
            document.querySelector('input[name="delivery"][value="pickup"]').checked = true;
            
            const addressBlock = document.getElementById('addressBlock');
            if (addressBlock) addressBlock.style.display = 'none';
            
        } else {
            throw new Error('Ошибка отправки');
        }
    } catch (error) {
        hideFormPreloader();
        showCustomAlert('Ошибка при отправке заказа. Пожалуйста, попробуйте позже.');
        console.error('Telegram error:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    renderCartItems();
    updateCartCount();
    
    const dateInput = document.getElementById('deliveryDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
        dateInput.min = today;
    }
    
    const form = document.getElementById('orderForm');
    if (form) form.addEventListener('submit', submitOrder);
    
    const blueberryDeco = document.getElementById('blueberryDeco');
    const blueberryChoco = document.getElementById('blueberryChoco');
    const deliveryRadios = document.querySelectorAll('input[name="delivery"]');
    
    if (blueberryDeco) blueberryDeco.addEventListener('change', updateTotal);
    if (blueberryChoco) blueberryChoco.addEventListener('change', updateTotal);
    
    deliveryRadios.forEach(radio => {
        radio.addEventListener('change', updateTotal);
    });
    
    initDeliveryToggle();
    
    const cartHeader = document.querySelector('.cart-header');
    if (cartHeader && !document.getElementById('clearCartBtn')) {
        const clearBtn = document.createElement('button');
        clearBtn.id = 'clearCartBtn';
        clearBtn.innerHTML = 'Очистить корзину';
        clearBtn.style.cssText = `
            background: white;
            color: #b33b3b;
            border: 2px solid #b33b3b;
            padding: 12px 25px;
            border-radius: 40px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s;
            margin-left: 15px;
        `;
        clearBtn.onmouseover = function() {
            this.style.background = '#b33b3b';
            this.style.color = 'white';
        };
        clearBtn.onmouseout = function() {
            this.style.background = 'white';
            this.style.color = '#b33b3b';
        };
        clearBtn.onclick = clearCart;
        cartHeader.appendChild(clearBtn);
    }
});