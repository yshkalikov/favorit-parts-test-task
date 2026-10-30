import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    article: '',
    brands: [],
    selectedBrand: null,
    offers: [],
    loadingBrands: false,
    loadingOffers: false,
    loading: false,
    error: {brands: null, offers: null}
};

const partsSlice = createSlice({
    name: 'parts',
    initialState,
    reducers: {
        setArticle(state, action) {
            state.article = action.payload;
        },
        setBrands(state, action) {
            state.brands = action.payload;
            state.offers = [];
        },
        setSelectedBrand(state, action) {
            state.selectedBrand = action.payload;
            state.offers = [];
        },
        setOffers(state, action) {
            state.offers = action.payload;
        },
        setLoadingBrands(state, action) {
            state.loadingBrands = action.payload;
        },
        setLoadingOffers(state, action) {
            state.loadingOffers = action.payload;
        },
        setError(state, action) {
            state.error[action.payload.request] = action.payload.message;
        },
    },
});

export const {
    setArticle,
    setBrands,
    setSelectedBrand,
    setOffers,
    setLoadingBrands,
    setLoadingOffers,
    setError
} = partsSlice.actions;
export default partsSlice.reducer;
