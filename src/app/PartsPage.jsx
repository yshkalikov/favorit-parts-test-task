import {useDispatch, useSelector} from 'react-redux'
import {
    setArticle,
    setBrands,
    setError,
    setLoadingBrands,
    setLoadingOffers,
    setOffers,
    setSelectedBrand
} from './partsSlice.js'
import {partsApi} from './partsApi.js'
import './PartsPage.css'

export default function PartsPage() {
    const dispatch = useDispatch();
    const {
        article,
        brands,
        selectedBrand,
        offers,
        loadingBrands,
        loadingOffers,
        error
    } = useSelector((state) => state.parts);

    const handleBrandSearch = async () => {
        dispatch(setBrands([]));
        dispatch(setSelectedBrand(null));
        dispatch(setOffers([]));
        dispatch(setError({request: 'brands', message: null}));
        dispatch(setLoadingBrands(true));

        await partsApi.getBrands(article).then(result => {
            dispatch(setBrands(result));
        }).catch(requestError => {
            dispatch(setError({
                request: 'brands',
                message: requestError.message || 'Не удалось загрузить производителей'
            }));
        }).finally(() => {
            dispatch(setLoadingBrands(false));
        });
    }

    const handleBrandSelect = async (brand) => {
        dispatch(setSelectedBrand(brand));
        dispatch(setOffers([]));
        dispatch(setError({request: 'offers', message: null}));
        dispatch(setLoadingOffers(true));

        await partsApi.getOffers(article, brand).then(result => {
            dispatch(setOffers(result));
        }).catch(requestError => {
            dispatch(setError({
                request: 'offers',
                message: requestError.message || 'Не удалось загрузить предложения'
            }));
        }).finally(() => {
            dispatch(setLoadingOffers(false));
        });
    }

    return (
        <main className="page-container">
            <header className="page-header">
                <p className="eyebrow">КАТАЛОГ ЗАПЧАСТЕЙ</p>
                <h1>Поиск автозапчастей</h1>
                <p className="muted">Введите артикул, чтобы найти производителей и предложения.</p>
            </header>
            <section className="panel">
                <label htmlFor="article">Артикул</label>
                <div className="search-row">
                    <input
                        id="article"
                        value={article}
                        onChange={(event) => dispatch(setArticle(event.target.value))}
                        placeholder="Например, 000000000"
                    />
                    <button
                        className="primary-button"
                        type="button"
                        disabled={!article.trim()}
                        onClick={handleBrandSearch}
                    >
                        Найти
                    </button>
                </div>
                {error.brands && <div className="error" role="alert">{error.brands}</div>}
            </section>
            <section className="panel">
                <h2>Производители</h2>
                {error.offers && <div className="error" role="alert">{error.offers}</div>}
                {loadingBrands ? <p className="muted status">Загрузка производителей…</p> : brands.length ?
                    <div className="brand-list">
                        {
                            brands.map((item) =>
                                <button
                                    key={item.brand}
                                    type="button"
                                    className={`brand-button ${selectedBrand === item.brand ? 'selected' : ''}`}
                                    onClick={() => handleBrandSelect(item.brand)}
                                >
                                    {item.brand}
                                </button>)
                        }
                    </div> :
                    <p className="muted">Результаты поиска производителей появятся здесь.</p>}
            </section>
            {brands.length ? <section className="panel">
                <h2>Предложения{selectedBrand ? ` — ${selectedBrand}` : ''}</h2>
                {loadingOffers ? <p className="muted status">Загрузка предложений…</p> : offers.length ?
                    <ul className="offer-list">{
                        offers.map((offer) => (
                            <li key={offer.goodsID}>
                                <strong>Основной товар</strong>
                                <div className="offer-field">Бренд: {offer.brand} </div>
                                <div className="offer-field">Артикул: {offer.number}</div>
                                <div className="offer-field">Название: {offer.name}</div>
                                <div className="offer-field">Наличие: {offer.count}</div>
                                {offer.warehouses?.length > 0 ? (
                                    <ul>{offer.warehouses.map((warehouse, index) => (
                                        <li key={`${offer.goodsID}-${warehouse.code}-${index}`}>
                                            {warehouse.code}: {warehouse.price} руб, {warehouse.stock} шт.
                                        </li>
                                    ))}</ul>
                                ) : <div>Нет наличия на складах</div>}
                                {offer.analogues?.length > 0 && <>
                                    <strong>Аналоги</strong>
                                    <ul>{offer.analogues.map((analogue, index) => (
                                        <li key={`${offer.goodsID}-analogue-${index}`}>
                                            <div className="offer-field">Бренд: {analogue.brand} </div>
                                            <div className="offer-field">Артикул: {analogue.number}</div>
                                            <div className="offer-field">Название: {analogue.name}</div>
                                            <div className="offer-field">Наличие: {analogue.count}</div>
                                            {analogue.warehouses?.length > 0 ? (
                                                <ul>{analogue.warehouses.map((warehouse, warehouseIndex) => (
                                                    <li key={`${offer.goodsID}-analogue-${index}-${warehouse.code}-${warehouseIndex}`}>
                                                        {warehouse.code}: {warehouse.price} руб, {warehouse.stock} шт.
                                                    </li>
                                                ))}</ul>
                                            ) : <div>Нет наличия на складах</div>}
                                        </li>
                                    ))}</ul>
                                </>}
                            </li>
                        ))
                    }</ul> :
                    <p className="muted">Выберите производителя, чтобы увидеть предложения.</p>}
            </section> : undefined}
        </main>
    )
}
