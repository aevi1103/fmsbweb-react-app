import moment from 'moment'
import productionStatusTypes from './production-status.types'
import {
    depts,
    dateFormat
} from '../../utilities/helpers'

const INITIAL_STATE = {
    dept: depts[0],
    shift: '',
    dateRange: [moment().format(dateFormat), moment().format(dateFormat)],

    productionStatus: null,
    scrapModalVisible: false,
    downtimeModalVisible: false,
    hxhModalVisible: false,

    line: '',
    scrapCollection: [],
    downtimeByMachine: [],
    downtimeByReason: [],
    hxhCollection: [],
    target: null
}

const productionStatusReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case productionStatusTypes.SET_PROD_STATUS_DEPARTMENT:
            
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

        case productionStatusTypes.SET_SCRAP_MODAL_VISIBLE:
            
            return {
                ...state,
                scrapModalVisible: action.payload
            }

        case productionStatusTypes.SET_DOWNTIME_MODAL_VISIBLE:
            
            return {
                ...state,
                downtimeModalVisible: action.payload
            }

        case productionStatusTypes.SET_HXH_MODAL_VISIBLE:
            
            return {
                ...state,
                hxhModalVisible: action.payload
            }

        case productionStatusTypes.SET_LINE:
            
            return {
                ...state,
                line: action.payload
            }

        case productionStatusTypes.SET_SCRAP_COLLECTION:
            
            return {
                ...state,
                scrapCollection: action.payload
            }

        case productionStatusTypes.SET_DOWNTIME_BY_MACHINE_COLLECTION:
            
            return {
                ...state,
                downtimeByMachine: action.payload
            }

        case productionStatusTypes.SET_DOWNTIME_BY_REASON_COLLECTION:
            
            return {
                ...state,
                downtimeByReason: action.payload
            }

        case productionStatusTypes.SET_HXH_COLLECTION:
            
            return {
                ...state,
                hxhCollection: action.payload
            }

        case productionStatusTypes.SET_TARGET:
            
            return {
                ...state,
                target: action.payload
            }

        default:
            return state;
    }

}

export default productionStatusReducer
