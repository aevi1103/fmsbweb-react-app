import productionDetailsTypes from './production-details.types'

const INITIAL_STATE = {

    isProductionDetailsLoading: false,
    productionDetails: null,
    productionDetailsErrorMsg : undefined,

    isDailyScrapByCodeLoading: false,
    dailyScrapByCodeCollection: null,
    dailyScrapByCodeErrorMsg : undefined,
}

const productionDetailsReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

        //prod details
        case productionDetailsTypes.FETCH_PRODUCTION_DETAILS_START:

            return {
                ...state,
                isProductionDetailsLoading: true
            }

        case productionDetailsTypes.FETCH_PRODUCTION_DETAILS_SUCCESS:

            return {
                ...state,
                isProductionDetailsLoading: false,
                productionDetails: action.payload
            }

        
        case productionDetailsTypes.FETCH_PRODUCTION_DETAILS_FAILURE:

            return {
                ...state,
                isProductionDetailsLoading: false,
                productionDetailsErrorMsg: action.payload
            }

        //daily scrap by code
        case productionDetailsTypes.FETCH_DAILY_SCRAP_BY_CODE_START:

            return {
                ...state,
                isDailyScrapByCodeLoading: true
            }

        case productionDetailsTypes.FETCH_DAILY_SCRAP_BY_CODE_SUCCESS:

            return {
                ...state,
                isDailyScrapByCodeLoading: false,
                dailyScrapByCodeCollection: action.payload
            }

        case productionDetailsTypes.FETCH_DAILY_SCRAP_BY_CODE_FAILURE:

            return {
                ...state,
                isDailyScrapByCodeLoading: false,
                dailyScrapByCodeErrorMsg: action.payload
            }
    
        default:
            return state;
    }

}

export default productionDetailsReducer;