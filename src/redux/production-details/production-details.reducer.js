import productionDetailsTypes from './production-details.types'

const INITIAL_STATE = {
    title: "",
    area: "",

    isProductionDetailsLoading: false,
    productionDetailsCollection: null,
    productionDetailsErrorMsg : undefined
}

const productionDetailsReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case productionDetailsTypes.SET_PRODUCTION_DETAILS_TITLE:

            return {
                ...state,
                title: action.payload
            }

        case productionDetailsTypes.SET_PRODUCTION_DETAILS_AREA:

            return {
                ...state,
                area: action.payload
            }

        case productionDetailsTypes.FETCH_PRODUCTION_DETAILS_START:

            return {
                ...state,
                isProductionDetailsLoading: true
            }

        case productionDetailsTypes.FETCH_PRODUCTION_DETAILS_SUCCESS:

            return {
                ...state,
                isProductionDetailsLoading: false,
                productionDetailsCollection: action.payload
            }

        case productionDetailsTypes.FETCH_PRODUCTION_DETAILS_FAILURE:

            return {
                ...state,
                isProductionDetailsLoading: false,
                productionDetailsErrorMsg: action.payload
            }
    
        default:
            return state;
    }

}

export default productionDetailsReducer;