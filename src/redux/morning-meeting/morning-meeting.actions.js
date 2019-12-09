import morningMeetingTypes from './morning-meeting.types';
import api from '../../API'

//MONTHLY_INCIDENT_RATE
export const fetchSafetyMonthlyIncidentRateStart = () => ({
    type: morningMeetingTypes.FETCH_SAFETY_MONTHLY_INCIDENT_RATE_START
})

export const fetchSafetyMonthlyIncidentRateSuccess = data => ({
    type: morningMeetingTypes.FETCH_SAFETY_MONTHLY_INCIDENT_RATE_SUCCESS,
    payload: data
})

export const fetchSafetyMonthlyIncidentRateFailure = errorMsg => ({
    type: morningMeetingTypes.FETCH_SAFETY_MONTHLY_INCIDENT_RATE_FAILURE,
    payload: errorMsg
})

export const fetchSafetyMonthlyIncidentRateStartAsync = () => {

    return dispatch => {

        dispatch(fetchSafetyMonthlyIncidentRateStart());
        api.get('safety/monthlyincidentrate')
        .then(response => {
            dispatch(fetchSafetyMonthlyIncidentRateSuccess(response.data))
        })
        .catch(error => dispatch(fetchSafetyMonthlyIncidentRateFailure(error.message)))

    }
}

//INCIDENTS_BY_DEPT
export const fetchSafetyIncidentByDeptStart = () => ({
    type: morningMeetingTypes.FETCH_SAFETY_INCIDENTS_BY_DEPT_START
})

export const fetchSafetyIncidentByDeptSuccess = data => ({
    type: morningMeetingTypes.FETCH_SAFETY_INCIDENTS_BY_DEPT_SUCCESS,
    payload: data
})

export const fetchSafetyIncidentByDeptFailure = errorMsg => ({
    type: morningMeetingTypes.FETCH_SAFETY_INCIDENTS_BY_DEPT_FAILURE,
    payload: errorMsg
})

export const fetchSafetyIncidentByDeptStartAsync = () => {

    return dispatch => {

        dispatch(fetchSafetyIncidentByDeptStart());
        api.get('safety/incidentbydepartment')
        .then(response => {
            dispatch(fetchSafetyIncidentByDeptSuccess(response.data))
        })
        .catch(error => dispatch(fetchSafetyIncidentByDeptFailure(error.message)))

    }
}

//INCIDENTS
export const fetchSafetyIncidentStart = () => ({
    type: morningMeetingTypes.FETCH_SAFETY_INCIDENTS_START
})

export const fetchSafetyIncidentSuccess = data => ({
    type: morningMeetingTypes.FETCH_SAFETY_INCIDENTS_SUCCESS,
    payload: data
})

export const fetchSafetyIncidentFailure = errorMsg => ({
    type: morningMeetingTypes.FETCH_SAFETY_INCIDENTS_FAILURE,
    payload: errorMsg
})

export const fetchSafetyIncidentStartAsync = (startDate, endDate) => {

    return dispatch => {

        dispatch(fetchSafetyIncidentStart());

        api.get(`safety/incidents?start=${startDate}&end=${endDate}&fields=dept,injuryStatus,description,incidentDate`)
        .then(response => {
            dispatch(fetchSafetyIncidentSuccess(response.data))
        })
        .catch(error => dispatch(fetchSafetyIncidentFailure(error.message)))

    }
}