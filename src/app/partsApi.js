const API_URL = 'http://api.favorit-parts.ru/hs/hsprice/';
const API_KEY = '00000000-0000-0000-0000-000000000001';

const API_ERRORS = {
    'Empty key!': 'Не указан ключ покупателя',
    'Invalid key client!': 'Неверный ключ покупателя, покупатель не найден',
    'Empty number goods!': 'Не указан номер детали',
    'Request quota exceeded!': 'Вы превысили лимит запросов по грузовому ассортименту',
};

const MISSING_GOOD_ID = '00000000-0000-0000-0000-000000000000';

export function parsePartsResponse(response) {
    if (response?.error) {
        throw new Error(API_ERRORS[response.error] || 'Не удалось выполнить запрос. Попробуйте ещё раз.');
    }

    const goods = Array.isArray(response?.goods) ? response.goods : [];
    const notFound = goods.length === 1 && goods[0]?.goodsID === MISSING_GOOD_ID &&
        goods[0]?.brand === '' && goods[0]?.count === 0 && goods[0]?.name === '' &&
        goods[0]?.number === '' && goods[0]?.price === 0 && goods[0]?.rate === 0 &&
        Array.isArray(goods[0]?.warehouses) && goods[0].warehouses.length === 0;

    if (notFound) {
        throw new Error('Деталь не найдена');
    }

    return goods;
}

export const partsApi = {
    getBrands: async (article) => {
        const params = new URLSearchParams({
            key: API_KEY,
            number: article
        });

        const response = await fetch(`${API_URL}?${params}`);

        return parsePartsResponse(await response.json());
    },

    getOffers: async (article, brand) => {
        const params = new URLSearchParams({
            key: API_KEY,
            number: article,
            brand: brand,
            analogues: 'on',
        });

        const response = await fetch(`${API_URL}?${params}`);

        return parsePartsResponse(await response.json());
    }
}
