import morningMeetingTypes from './morning-meeting.types';
import api from '../../API'

export const fetchSafetyMonthlyIncidentRateStart = () => ({
    type: morningMeetingTypes.FETCH_SAFETY_MONTHLY_INCIDENT_RATE_START
})

export const fetchSafetyMonthlyIncidentRateSuccess = data => ({
    type: morningMeetingTypes.FETCH_SAFETY_MONTHLY_INCIDENT_RATE_SUCCESS,
    payload: data
})

export const fetchSafetyMonthlyIncidentRatFailure = errorMsg => ({
    type: morningMeetingTypes.fetchSafetyMonthlyIncidentRatFailure,
    payload: errorMsg
})

export const fetchSafetyMonthlyIncidentRateStartAsync = () => {

    return dispatch => {

        dispatch(fetchSafetyMonthlyIncidentRateStart());
        api.get('safety/monthlyincidentrate')
        .then(response => {
            dispatch(fetchSafetyMonthlyIncidentRateSuccess(response.data))
        })
        .catch(error => dispatch(fetchSafetyMonthlyIncidentRatFailure(error.message)))

    }
}