import showToast from './toast';

const STORAGE_KEY = 'store-orders';

function getStoredOrders() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        console.warn('Не удалось прочитать заказы из localStorage', error);
        return [];
    }
}

function saveOrders(orders) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
        console.warn('Не удалось сохранить заказ', error);
    }
}

export default function accountPanel() {
    const accountBtn = document.getElementById('account');
    const cartConfirm = document.querySelector('.cart-confirm');
    const modal = document.querySelector('.account-modal');
    const overlay = modal ? modal.querySelector('.account-modal__overlay') : null;
    const closeControls = modal ? modal.querySelectorAll('[data-close-account]') : null;
    const form = document.getElementById('order-form');
    const ordersContainer = modal ? modal.querySelector('.orders-list') : null;
    const emptyState = modal ? modal.querySelector('.orders-empty') : null;
    const statusText = document.getElementById('order-status');
    const cartWrapper = document.querySelector('.cart-wrapper');
    const cartEmpty = document.getElementById('cart-empty');
    const totalPrice = document.querySelector('.cart-total span');
    const countGoods = document.querySelector('.counter');

    if (!modal || !form || !ordersContainer || !cartWrapper) {
        return;
    }

    let orders = getStoredOrders();

    const updateStatus = (message, type = 'muted') => {
        if (!statusText) {
            return;
        }
        statusText.textContent = message;
        statusText.className = `account-modal__status account-modal__status--${type}`;
    };

    const openModal = () => {
        modal.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
        renderOrders();
    };

    const closeModal = () => {
        modal.classList.remove('is-visible');
        document.body.style.overflow = '';
    };

    const formatDate = (timestamp) => {
        return new Intl.DateTimeFormat('ru-RU', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(new Date(timestamp));
    };

    const getCartItems = () => {
        const cartItemsNodes = cartWrapper.querySelectorAll('.cart-item');
        const result = [];

        cartItemsNodes.forEach((item) => {
            const titleNode = item.querySelector('.cart-item__title');
            const categoryNode = item.querySelector('.cart-item__category');
            const qtyNode = item.querySelector('.cart-item__qty');
            const quantityText = qtyNode ? qtyNode.textContent : '0';
            const quantity = parseInt(quantityText || '0', 10) || 0;
            const unitPrice = parseFloat(item.dataset.priceByn) || 0;

            for (let i = 0; i < quantity; i += 1) {
                result.push({
                    title: titleNode ? titleNode.textContent.trim() : 'Без названия',
                    price: unitPrice,
                    category: categoryNode ? categoryNode.textContent : '—'
                });
            }
        });
        return result;
    };

    const clearCart = () => {
        const clonedCards = cartWrapper.querySelectorAll('.card');
        clonedCards.forEach((card) => card.remove());
        if (cartEmpty && !cartWrapper.contains(cartEmpty)) {
            cartWrapper.appendChild(cartEmpty);
        }
        if (totalPrice) {
            totalPrice.textContent = '0';
        }
        if (countGoods) {
            countGoods.textContent = '0';
        }
    };

    const renderOrders = () => {
        ordersContainer.innerHTML = '';

        if (!orders.length) {
            if (emptyState) {
                emptyState.classList.remove('is-hidden');
            }
            return;
        }

        if (emptyState) {
            emptyState.classList.add('is-hidden');
        }

        orders.forEach((order) => {
            const item = document.createElement('article');
            item.className = 'order-card';
            const itemsList = order.items.map((product) => `<li><span>${product.title}</span><strong>${product.price} BYN</strong></li>`).join('');
            item.innerHTML = `
                <div class="order-card__head">
                    <div>
                        <p class="order-card__customer">${order.customer}</p>
                        <span class="order-card__date">${formatDate(order.createdAt)}</span>
                    </div>
                    <span class="order-card__sum">${order.total} BYN</span>
                </div>
                <div class="order-card__meta">${order.items.length} позиций · ${order.phone}</div>
                <ul class="order-card__list">${itemsList}</ul>
                ${order.comment ? `<p class="order-card__comment">Комментарий: ${order.comment}</p>` : ''}
            `;
            ordersContainer.appendChild(item);
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const customerValue = formData.get('customer');
        const phoneValue = formData.get('phone');
        const commentValue = formData.get('comment');
        const customer = customerValue ? customerValue.toString().trim() : '';
        const phone = phoneValue ? phoneValue.toString().trim() : '';
        const comment = commentValue ? commentValue.toString().trim() : '';
        const items = getCartItems();

        if (!items.length) {
            updateStatus('В корзине нет товаров, добавьте что-нибудь перед оформлением.', 'error');
            showToast('Добавьте товары в корзину перед заказом', 'error');
            return;
        }

        if (!customer || !phone) {
            updateStatus('Пожалуйста, заполните имя и телефон.', 'error');
            showToast('Заполните обязательные поля', 'error');
            return;
        }

        const total = items.reduce((sum, product) => sum + product.price, 0).toFixed(2);

        const order = {
            id: Date.now(),
            customer,
            phone,
            comment,
            items,
            total,
            createdAt: Date.now()
        };

        orders = [order, ...orders];
        saveOrders(orders);
        renderOrders();
        form.reset();
        clearCart();
        updateStatus('Заказ успешно оформлен! Проверить историю можно справа.', 'success');
        showToast('Заказ оформлен', 'success');
    };

    form.addEventListener('submit', handleSubmit);

    if (accountBtn) {
        accountBtn.addEventListener('click', (event) => {
            event.preventDefault();
            openModal();
        });
    }

    if (cartConfirm) {
        cartConfirm.addEventListener('click', (event) => {
            event.preventDefault();
            openModal();
        });
    }

    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }

    if (closeControls) {
        closeControls.forEach((btn) => {
            btn.addEventListener('click', closeModal);
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('is-visible')) {
            closeModal();
        }
    });

    renderOrders();
}
