import types from './finance.types'

const INITIAL_STATE = {
    isFinanceKpiFetching: false,
    financeKpi: null,
    financeKpiErrorMsg: undefined,
}

const reducer = (state = INITIAL_STATE, action) => { 

    switch (action.type) {

        case types.FETCH_FINANCE_KPI_START:

            return {
                ...state,
                isFinanceKpiFetching: true
            };

        case types.FETCH_FINANCE_KPI_SUCCESS:

            return {
                ...state,
                isFinanceKpiFetching: false,
                financeKpi: action.payload
            };

        case types.FETCH_FINANCE_KPI_FAILURE:

            return {
                ...state,
                isFinanceKpiFetching: false,
                financeKpiErrorMsg: action.payload
            };
    
        default:
            return state
    }

}

export default reducer;