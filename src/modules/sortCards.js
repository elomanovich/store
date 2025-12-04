import filter from './filter';

export default function sortCards() {
    const sortControl = document.getElementById('sort-control');
    const goodsWrapper = document.querySelector('.goods');
    const discountCheckbox = document.getElementById('discount-checkbox');

    if (!sortControl || !goodsWrapper) {
        return;
    }

    const getCardData = (column) => {
        const card = column.querySelector('.card');
        return {
            node: column,
            price: parseFloat(card.dataset.price) || 0,
            priceRub: parseFloat(card.dataset.priceRub) || 0,
            index: parseInt(card.dataset.index, 10) || 0,
            sale: card.dataset.sale === 'true'
        };
    };

    const applySort = () => {
        const columns = Array.from(goodsWrapper.children);
        const cardsData = columns.map(getCardData);
        const { value } = sortControl;

        const compare = {
            popular: (a, b) => a.index - b.index,
            cheaper: (a, b) => a.price - b.price,
            expensive: (a, b) => b.price - a.price,
            new: (a, b) => b.index - a.index,
            sale: (a, b) => {
                if (a.sale === b.sale) {
                    return a.price - b.price;
                }
                return Number(b.sale) - Number(a.sale);
            }
        }[value] || ((a, b) => a.index - b.index);

        cardsData.sort(compare).forEach((item) => {
            goodsWrapper.appendChild(item.node);
        });

        if (value === 'sale' && discountCheckbox && !discountCheckbox.checked) {
            discountCheckbox.checked = true;
            filter();
        }
    };

    sortControl.addEventListener('change', applySort);
    applySort();
}
