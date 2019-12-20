import productionDetailsTypes from './production-details.types'
import moment from 'moment';

const dateFormat = 'MM/DD/YYYY';
const previousDay = moment().add(-1, 'd');
const previousDayFormatted = previousDay.format(dateFormat);

const INITIAL_STATE = {
    title: null,
    area: "",
    detailsStartDate: previousDayFormatted,
    detailsEndDate: previousDayFormatted,

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

        case productionDetailsTypes.SET_PRODUCTION_DETAILS_START_DATE:

            return {
                ...state,
                detailsStartDate: action.payload
            }

        case productionDetailsTypes.SET_PRODUCTION_DETAILS_END_DATE:

            return {
                ...state,
                detailsEndDate: action.payload
            }
    
        default:
            return state;
    }

}

export default productionDetailsReducer;