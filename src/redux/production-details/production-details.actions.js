import productionDetailsType from './production-details.types'
import api from '../../API'
import {
    fetchStart,
    fetchSuccess,
    fetchFailure,
    mapDeptToArea
} from '../../helpers/helpers'; 

export const setTitle = title => ({
    type: productionDetailsType.SET_PRODUCTION_DETAILS_TITLE,
    payload: title
})

export const setArea = area => ({
    type: productionDetailsType.SET_PRODUCTION_DETAILS_AREA,
    payload: area
})

export const setDetailsStartDate = date => ({
    type: productionDetailsType.SET_PRODUCTION_DETAILS_START_DATE,
    payload: date
})

export const setDetailsEndDate = date => ({
    type: productionDetailsType.SET_PRODUCTION_DETAILS_END_DATE,
    payload: date
})

export const fetchProductionDetailsStartAsync = (start, end, dept, shift = '') => {

    return dispatch => {

        dispatch(fetchStart(
            productionDetailsType.FETCH_PRODUCTION_DETAILS_START))

        api.get(`sap/departmentdetails?start=${start}&end=${end}&area=${mapDeptToArea(dept)}&shift=${shift}`)
        .then(response => {

            dispatch(fetchSuccess(
                productionDetailsType.FETCH_PRODUCTION_DETAILS_SUCCESS,
                response.data))

            // dispatch(fetchFailure(
            //     productionDetailsType.FETCH_PRODUCTION_DETAILS_FAILURE, undefined))

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                productionDetailsType.FETCH_PRODUCTION_DETAILS_FAILURE,
                error.message))

            dispatch(fetchSuccess(
                productionDetailsType.FETCH_PRODUCTION_DETAILS_SUCCESS, null))
        
        })

    }
}

export const fetchDailyScrapByCodeStartAsync = (start, end, line, scrapCode, isPurchased = false, program = '', department = '') => {

    return dispatch => {

        dispatch(fetchStart(
            productionDetailsType.FETCH_DAILY_SCRAP_BY_CODE_START))

        api.get(`sap/dailyscrapbyshift?start=${start}&end=${end}&line=${line}&program=${program}&scrapcode=${scrapCode}&ispurchased=${isPurchased}&department=${department}`)
        .then(response => {

            dispatch(fetchSuccess(
                productionDetailsType.FETCH_DAILY_SCRAP_BY_CODE_SUCCESS,
                response.data))

            // dispatch(fetchFailure(
            //     productionDetailsType.FETCH_DAILY_SCRAP_BY_CODE_FAILURE, undefined))

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                productionDetailsType.FETCH_DAILY_SCRAP_BY_CODE_FAILURE,
                error.message))

            dispatch(fetchSuccess(
                productionDetailsType.FETCH_DAILY_SCRAP_BY_CODE_SUCCESS, null))
        
        })

    }
}