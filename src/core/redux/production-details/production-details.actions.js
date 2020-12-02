import productionDetailsType from './production-details.types'
import api from '../../utilities/api'
import {
    fetchStart,
    fetchSuccess,
    fetchFailure,
    mapDeptToArea
} from '../../utilities/helpers'; 

export const fetchProductionDetailsStartAsync = (start, end, dept, shift = '') => {

    return dispatch => {

        dispatch(fetchStart(productionDetailsType.FETCH_PRODUCTION_DETAILS_START))

        api.get(`sap/departmentdetails?start=${start}&end=${end}&area=${mapDeptToArea(dept)}&shift=${shift}`)
        .then(response => {
            dispatch(fetchSuccess(productionDetailsType.FETCH_PRODUCTION_DETAILS_SUCCESS, response.data))
        })
        .catch(error => { 
            dispatch(fetchFailure(productionDetailsType.FETCH_PRODUCTION_DETAILS_FAILURE,  error.message))
        })

    }
}

export const fetchDailyScrapByCodeStartAsync = (start, end, line, scrapCode, isPurchased = false, program = '', department = '') => {

    return dispatch => {

        dispatch(fetchStart(productionDetailsType.FETCH_DAILY_SCRAP_BY_CODE_START))
        
        api.get(`sap/dailyscrapbyshift?start=${start}&end=${end}&line=${line}&program=${program}&scrapcode=${scrapCode}&ispurchased=${isPurchased}&department=${department}`)
        .then(response => {
            dispatch(fetchSuccess(productionDetailsType.FETCH_DAILY_SCRAP_BY_CODE_SUCCESS, response.data))
        })
        .catch(error => {
            dispatch(fetchFailure(productionDetailsType.FETCH_DAILY_SCRAP_BY_CODE_FAILURE, error.message))
        })

    }
}