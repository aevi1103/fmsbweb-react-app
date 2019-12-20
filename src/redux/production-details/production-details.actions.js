import productionDetailsType from './production-details.types'
import api from '../../API'

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

const fetchStart = (actionType) => ({
    type: actionType
})

const fetchSuccess = (actionType, data) => ({
    type: actionType,
    payload: data
})

const fetchFailure = (actionType, errorMsg) => ({
    type: actionType,
    payload: errorMsg
})

export const fetchProductionDetailsStartAsync = (start, end, area) => {

    return dispatch => {

        dispatch(fetchStart(
            productionDetailsType.FETCH_PRODUCTION_DETAILS_START))

        api.get(`sap/departmentdetails?start=${start}&end=${end}&area=${area}`)
        .then(response => {

            dispatch(fetchSuccess(
                productionDetailsType.FETCH_PRODUCTION_DETAILS_SUCCESS,
                response.data))

            dispatch(fetchFailure(
                productionDetailsType.FETCH_PRODUCTION_DETAILS_FAILURE, undefined))

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