import productDetails from '../data/productDetails';

const detailsMap = new Map(productDetails.map((item) => [item.title, item]));

const fallbackDescription = (category) => {
    const map = {
        'Игровая приставка': 'Универсальная консоль для фильмов, совместных игр и поездок.',
        'Периферия для ПК': 'Аксессуар для комфортной работы и точного контроля в играх.',
        'Игры и софт': 'Лицензионный цифровой продукт с мгновенной активацией.'
    };
    return map[category] || 'Популярный товар с гарантией и быстрой доставкой.';
};

export default function mergeProductDetails(data) {
    if (!data || !Array.isArray(data.goods)) {
        return data;
    }

    const goods = data.goods.map((good, index) => {
        const meta = detailsMap.get(good.title) || {};
        return {
            id: meta.id || `product-${index}`,
            currency: 'RUB',
            ...good,
            shortDescription: meta.shortDescription || fallbackDescription(good.category),
            longDescription: meta.longDescription || fallbackDescription(good.category),
            highlights: meta.highlights || [],
            specs: meta.specs || []
        };
    });

    return { ...data, goods };
}
