import types from './logistics.types'

const INITIAL_STATE = {
    isStockOverviewFetching: false,
    stockOVerviewCollection: [],
    stockOVerviewErrorMsg: undefined,

    isStockOverviewSlocFetching: false,
    stockOVerviewSlocCollection: [],
    stockOVerviewSlocErrorMsg: undefined,

    isStockStatusFetching: false,
    stockStatus: null,
    stockStatusErrorMsg: undefined,
}

const reducer = (state = INITIAL_STATE, action) => { 

    switch (action.type) {

        //* LOGISTICS_STOCK_OVERVIEW
        case types.FETCH_LOGISTICS_STOCK_OVERVIEW_START:

            return {
                ...state,
                isStockOverviewFetching: true
            };

        case types.FETCH_LOGISTICS_STOCK_OVERVIEW_SUCCESS:

            return {
                ...state,
                isStockOverviewFetching: false,
                stockOVerviewCollection: action.payload
            };

        case types.FETCH_LOGISTICS_STOCK_OVERVIEW_FAILURE:

            return {
                ...state,
                isStockOverviewFetching: false,
                stockOVerviewCollection: [],
                stockOVerviewErrorMsg: action.payload
            };

        //* LOGISTICS_STOCK_OVERVIEW_SLOC
        case types.FETCH_LOGISTICS_STOCK_OVERVIEW_SLOC_START:

            return {
                ...state,
                isStockOverviewSlocFetching: true
            };

        case types.FETCH_LOGISTICS_STOCK_OVERVIEW_SLOC_SUCCESS:

            return {
                ...state,
                isStockOverviewSlocFetching: false,
                stockOVerviewSlocCollection: action.payload
            };

        case types.FETCH_LOGISTICS_STOCK_OVERVIEW_SLOC_FAILURE:

            return {
                ...state,
                isStockOverviewSlocFetching: false,
                stockOVerviewSlocCollection: [],
                stockOVerviewSlocErrorMsg: action.payload
            };

        //* LOGISTICS_STATUS
        case types.FETCH_LOGISTICS_STATUS_START:

            return {
                ...state,
                isStockStatusFetching: true
            };

        case types.FETCH_LOGISTICS_STATUS_SUCCESS:

            return {
                ...state,
                isStockStatusFetching: false,
                stockStatus: action.payload
            };

        case types.FETCH_LOGISTICS_STATUS_FAILURE:

            return {
                ...state,
                isStockStatusFetching: false,
                stockStatus: [],
                stockStatusErrorMsg: action.payload
            };
    
        default:
            return state
    }

}

export default reducer;