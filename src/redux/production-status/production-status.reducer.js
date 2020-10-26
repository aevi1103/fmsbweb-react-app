import moment from 'moment'
import productionStatusTypes from './production-status.types'
import {
    depts,
    dateFormat
} from '../../helpers/helpers'

const INITIAL_STATE = {
    dept: depts[0],
    shift: '',
    dateRange: [moment().format(dateFormat), moment().format(dateFormat)],

    productionStatus: null
}

const productionStatusReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case productionStatusTypes.SET_DEPARTMENT:
            
            return {
                ...state,
                dept: action.payload
            }
    
        case productionStatusTypes.SET_SHIFT:
            
            return {
                ...state,
                shift: action.payload
            }

        case productionStatusTypes.SET_DATE_RANGE:
            
            return {
                ...state,
                dateRange: action.payload
            }

        case productionStatusTypes.SET_PRODUCTION_STATUS:
            
            return {
                ...state,
                productionStatus: action.payload
            }

        default:
            return state;
    }

}

export default productionStatusReducer
