export default function productModal(data) {
    const goodsWrapper = document.querySelector('.goods');
    const modal = document.querySelector('.product-modal');

    if (!goodsWrapper || !modal) {
        return;
    }

    const overlay = modal.querySelector('.product-modal__overlay');
    const closeButtons = modal.querySelectorAll('[data-close-modal]');
    const mainImage = modal.querySelector('.product-modal__image');
    const secondaryImage = modal.querySelector('.product-modal__thumb');
    const title = modal.querySelector('.product-modal__title');
    const category = modal.querySelector('.product-modal__category');
    const pricePrimary = modal.querySelector('.product-modal__price');
    const priceSecondary = modal.querySelector('.product-modal__price-rub');
    const descriptionNode = modal.querySelector('.product-modal__description');
    const propertiesWrapper = modal.querySelector('.product-modal__props');
    const modalAddButton = modal.querySelector('[data-modal-add]');
    let activeProductIndex = null;

    const formatRub = (value) => new Intl.NumberFormat('ru-RU').format(value);

    const openModal = () => {
        modal.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('is-visible');
        document.body.style.overflow = '';
        activeProductIndex = null;
        modal.dataset.productIndex = '';
    };

    const fillModal = (product, index) => {
        activeProductIndex = index;
        modal.dataset.productIndex = typeof index === 'number' ? `${index}` : '';
        if (mainImage) {
            mainImage.style.backgroundImage = `url('${product.img}')`;
            mainImage.setAttribute('aria-label', product.title);
        }

        if (secondaryImage) {
            if (product.hoverImg) {
                secondaryImage.style.backgroundImage = `url('${product.hoverImg}')`;
                secondaryImage.classList.remove('is-hidden');
            } else {
                secondaryImage.classList.add('is-hidden');
            }
        }

        if (title) {
            title.textContent = product.title;
        }

        if (category) {
            category.textContent = product.category;
        }

        if (pricePrimary) {
            pricePrimary.textContent = `${(product.price / 32).toFixed(2)} BYN`;
        }

        if (priceSecondary) {
            priceSecondary.textContent = `${formatRub(product.price)} ₽`;
        }

        if (descriptionNode) {
            const paragraphs = (product.longDescription || '').split(/\n+/).filter(Boolean);
            if (paragraphs.length) {
                descriptionNode.innerHTML = paragraphs.map((text) => `<p>${text.trim()}</p>`).join('');
            } else {
                descriptionNode.textContent = 'Подробное описание появится позже.';
            }
        }

        if (propertiesWrapper) {
            propertiesWrapper.innerHTML = '';
            const fallbackProps = [
                { label: 'Категория', value: product.category },
                { label: 'Акция', value: product.sale ? 'Есть' : 'Нет' },
                { label: 'Гарантия', value: '12 месяцев' },
                { label: 'Оплата', value: 'Картой или при получении' }
            ];
            const properties = product.specs && product.specs.length ? product.specs : fallbackProps;
            properties.forEach((prop) => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${prop.label}</span><strong>${prop.value}</strong>`;
                propertiesWrapper.appendChild(li);
            });
        }
    };

    goodsWrapper.addEventListener('click', (event) => {
        const addToCartButton = event.target.closest('[data-add-to-cart]');
        if (addToCartButton) {
            return;
        }
        const detailButton = event.target.closest('[data-product-more]');
        const targetCard = detailButton ? detailButton.closest('.card') : event.target.closest('.card');

        if (!targetCard) {
            return;
        }

        const { index } = targetCard.dataset;
        const product = data.goods[index];

        if (!product) {
            return;
        }

        fillModal(product, parseInt(index, 10));
        openModal();
    });

    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }

    closeButtons.forEach((btn) => {
        btn.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('is-visible')) {
            closeModal();
        }
    });

    if (modalAddButton) {
        modalAddButton.addEventListener('click', () => {
            if (activeProductIndex === null) {
                return;
            }
            const card = goodsWrapper.querySelector(`.card[data-index="${activeProductIndex}"]`);
            const addButton = card ? card.querySelector('[data-add-to-cart]') : null;
            if (addButton) {
                addButton.click();
            }
        });
    }
}
