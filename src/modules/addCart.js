import showToast from './toast';

export default function addCart() {
    const cards = document.querySelectorAll('.goods .card');
    const cartWrapper = document.querySelector('.cart-wrapper');
    const cartEmpty = document.getElementById('cart-empty');
    const countGoods = document.querySelector('.counter');
    const totalBynNode = document.querySelector('.cart-total-byn');
    const totalRubNode = document.querySelector('.cart-total-rub');

    if (!cartWrapper || !cards.length) {
        return;
    }

    const cartState = new Map();

    const toggleEmptyState = () => {
        if (!cartEmpty) {
            return;
        }
        if (cartState.size === 0 && !cartWrapper.contains(cartEmpty)) {
            cartWrapper.appendChild(cartEmpty);
        } else if (cartState.size > 0 && cartWrapper.contains(cartEmpty)) {
            cartEmpty.remove();
        }
    };

    const updateTotals = () => {
        let totalQty = 0;
        let sumByn = 0;
        let sumRub = 0;

        cartState.forEach((item) => {
            totalQty += item.quantity;
            sumByn += item.quantity * item.priceByn;
            sumRub += item.quantity * item.priceRub;
        });

        if (countGoods) {
            countGoods.textContent = totalQty.toString();
        }
        if (totalBynNode) {
            totalBynNode.textContent = `${sumByn.toFixed(2)} BYN`;
        }
        if (totalRubNode) {
            totalRubNode.textContent = `${sumRub.toFixed(2)} ₽`;
        }

        toggleEmptyState();
    };

    const removeEntry = (id) => {
        const entry = cartState.get(id);
        if (!entry) {
            return;
        }
        entry.node.remove();
        cartState.delete(id);
        updateTotals();
        showToast('Товар удалён из корзины', 'error');
    };

    const updateEntryView = (entry) => {
        const qtyNode = entry.node.querySelector('.cart-item__qty');
        const priceBynNode = entry.node.querySelector('.cart-item__price-byn');
        const priceRubNode = entry.node.querySelector('.cart-item__price-rub');
        if (qtyNode) {
            qtyNode.textContent = `${entry.quantity}`;
        }
        if (priceBynNode) {
            priceBynNode.textContent = `${(entry.quantity * entry.priceByn).toFixed(2)} BYN`;
        }
        if (priceRubNode) {
            priceRubNode.textContent = `${(entry.quantity * entry.priceRub).toFixed(2)} ₽`;
        }
    };

    const createCartItem = (entry) => {
        const item = document.createElement('div');
        item.className = 'cart-item';
        item.dataset.cartId = entry.id;
        item.dataset.priceByn = entry.priceByn;
        item.dataset.priceRub = entry.priceRub;
        item.innerHTML = `
            <div class="cart-item__info">
                <p class="cart-item__title">${entry.title}</p>
                <span class="cart-item__category">${entry.category}</span>
            </div>
            <div class="cart-item__controls">
                <button class="cart-item__btn" data-action="decrease" aria-label="Уменьшить количество">−</button>
                <span class="cart-item__qty">${entry.quantity}</span>
                <button class="cart-item__btn" data-action="increase" aria-label="Увеличить количество">+</button>
            </div>
            <div class="cart-item__prices">
                <span class="cart-item__price-byn">${entry.priceByn.toFixed(2)} BYN</span>
                <span class="cart-item__price-rub">${entry.priceRub.toFixed(2)} ₽</span>
                <button class="cart-item__remove" aria-label="Удалить товар">×</button>
            </div>
        `;

        item.querySelectorAll('.cart-item__btn').forEach((btn) => {
            btn.addEventListener('click', (event) => {
                const action = event.target.dataset.action;
                if (action === 'increase') {
                    entry.quantity += 1;
                    updateEntryView(entry);
                    updateTotals();
                }
                if (action === 'decrease') {
                    entry.quantity -= 1;
                    if (entry.quantity <= 0) {
                        removeEntry(entry.id);
                        return;
                    }
                    updateEntryView(entry);
                    updateTotals();
                }
            });
        });

        const removeBtn = item.querySelector('.cart-item__remove');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => removeEntry(entry.id));
        }

        return item;
    };

    const addToCart = (card) => {
        const id = card.dataset.index;
        if (!id) {
            return;
        }
        const titleNode = card.querySelector('.card-title');
        const title = titleNode ? titleNode.textContent : 'Без названия';
        const category = card.dataset.category || 'Каталог';
        const priceByn = parseFloat(card.dataset.price) || 0;
        const priceRub = parseFloat(card.dataset.priceRub) || 0;

        if (cartState.has(id)) {
            const existingEntry = cartState.get(id);
            existingEntry.quantity += 1;
            updateEntryView(existingEntry);
            updateTotals();
            showToast('Количество товара увеличено', 'success');
            return;
        }

        const entry = {
            id,
            title,
            category,
            priceByn,
            priceRub,
            quantity: 1,
            node: null
        };
        entry.node = createCartItem(entry);
        cartState.set(id, entry);
        cartWrapper.appendChild(entry.node);
        updateTotals();
        showToast('Товар добавлен в корзину', 'success');
    };

    cards.forEach((card) => {
        const btn = card.querySelector('[data-add-to-cart]');
        if (!btn) {
            return;
        }
        btn.addEventListener('click', (event) => {
            event.stopPropagation();
            addToCart(card);
        });
    });
}
