export default function renderCards(data) {
    const goodsWrapper = document.querySelector('.goods');
    if (!goodsWrapper || !data || !Array.isArray(data.goods)) {
        return;
    }

    goodsWrapper.innerHTML = '';
    const formatRub = (value) => new Intl.NumberFormat('ru-RU').format(value);

    data.goods.forEach((good, index) => {
        const card = document.createElement('div');
        card.className = 'goods-item';
        const priceByn = good.price / 32;
        const priceBynFormatted = priceByn.toFixed(2);
        const highlights = (good.highlights || []).slice(0, 2).map((item) => `<li>${item}</li>`).join('');

        card.innerHTML = `
        <div
            class="card"
            data-category="${good.category}"
            data-index="${index}"
            data-id="${good.id}"
            data-price="${priceByn.toFixed(2)}"
            data-price-rub="${good.price}"
            data-sale="${good.sale}"
        >
            ${good.sale ? '<div class="card-sale">🔥Hot Sale🔥</div>' : ''}
            <div class="card-img-wrapper">
                <img class="card-img-top" src="${good.img}" alt="${good.title}" loading="lazy">
            </div>
            <div class="card-body">
                <div class="card-price-row">
                    <div class="card-price">${priceBynFormatted} BYN</div>
                    <span class="card-price-rub">${formatRub(good.price)} ₽</span>
                </div>
                <h5 class="card-title">${good.title}</h5>
                ${highlights ? `<ul class="card-tags">${highlights}</ul>` : ''}
                <p class="card-description">${good.shortDescription}</p>
                <div class="card-actions">
                    <button class="btn btn-primary" type="button" data-add-to-cart>В корзину</button>
                    <button class="btn btn-outline card-more" type="button" data-product-more>Подробнее</button>
                </div>
            </div>
        </div>
    `;
        goodsWrapper.appendChild(card);
    });
}
