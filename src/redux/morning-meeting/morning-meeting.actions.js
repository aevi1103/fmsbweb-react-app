import morningMeetingTypes from './morning-meeting.types';
import api from '../../API'


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

//MONTHLY_INCIDENT_RATE

export const fetchSafetyMonthlyIncidentRateStartAsync = () => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_SAFETY_MONTHLY_INCIDENT_RATE_START))

        api.get('safety/monthlyincidentrate')
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_SAFETY_MONTHLY_INCIDENT_RATE_SUCCESS,
                response.data))

        })
        .catch(error => dispatch(fetchFailure(
            morningMeetingTypes.FETCH_SAFETY_MONTHLY_INCIDENT_RATE_FAILURE,
            error.message)))

    }
}

//INCIDENTS_BY_DEPT
export const fetchSafetyIncidentByDeptStartAsync = () => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_SAFETY_INCIDENTS_BY_DEPT_START))

        api.get('safety/incidentbydepartment')
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_SAFETY_INCIDENTS_BY_DEPT_SUCCESS,
                response.data))

        })
        .catch(error => dispatch(fetchFailure(
            morningMeetingTypes.FETCH_SAFETY_INCIDENTS_BY_DEPT_FAILURE,
            error.message)))

    }
}

//INCIDENTS
export const fetchSafetyIncidentStartAsync = (startDate, endDate) => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_SAFETY_INCIDENTS_START))

        api.get(`safety/incidents?start=${startDate}&end=${endDate}&fields=dept,injuryStatus,description,incidentDate`)
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_SAFETY_INCIDENTS_SUCCESS,
                response.data))

        })
        .catch(error => dispatch(fetchFailure(
            morningMeetingTypes.FETCH_SAFETY_INCIDENTS_FAILURE,
            error.message)))

    }
}

//LOGISTICS_STOCK_OVERVIEW
export const fetchLogisticsStockOverviewStartAsync = (date) => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_LOGISTICS_STOCK_OVERVIEW_START))

        api.get(`logistics/stockoverview?date=${date}`)
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_LOGISTICS_STOCK_OVERVIEW_SUCCESS,
                response.data))

        })
        .catch(error => dispatch(fetchFailure(
            morningMeetingTypes.FETCH_LOGISTICS_STOCK_OVERVIEW_FAILURE,
            error.message)))

    }
}

//LOGISTICS_STOCK_OVERVIEW_SLOC
export const fetchLogisticsStockOverviewSlocStartAsync = (date) => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_LOGISTICS_STOCK_OVERVIEW_SLOC_START))

        api.get(`logistics/stockoverviewbysloc?date=${date}`)
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_LOGISTICS_STOCK_OVERVIEW_SLOC_SUCCESS,
                response.data))

        })
        .catch(error => dispatch(fetchFailure(
            morningMeetingTypes.FETCH_LOGISTICS_STOCK_OVERVIEW_SLOC_FAILURE,
            error.message)))

    }
}
    
//LOGISTICS_STATUS
export const fetchLogisticsStatusStartAsync = (startDate, endDate) => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_LOGISTICS_STATUS_START))

        api.get(`logistics/status?start=${startDate}&end=${endDate}`)
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_LOGISTICS_STATUS_SUCCESS,
                response.data))

        })
        .catch(error => dispatch(fetchFailure(
            morningMeetingTypes.FETCH_LOGISTICS_STATUS_FAILURE,
            error.message)))

    }
}