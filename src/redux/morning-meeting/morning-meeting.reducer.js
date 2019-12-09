import morningMeetingTypes from './morning-meeting.types';

const INITIAL_STATE = {
    isMonthlyIncidentRateFetching: false,
    monthlyIncidentRateCollection: [],
    monthlyIncidentRateErrorMsg: undefined
}

const morningMeetingReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case morningMeetingTypes.FETCH_SAFETY_MONTHLY_INCIDENT_RATE_START:

            return {
                ...state,
                isMonthlyIncidentRateFetching: true
            }

        case morningMeetingTypes.FETCH_SAFETY_MONTHLY_INCIDENT_RATE_SUCCESS:

            return {
                ...state,
                isMonthlyIncidentRateFetching: false,
                monthlyIncidentRateCollection: action.payload
            }

        case morningMeetingTypes.FETCH_SAFETY_MONTHLY_INCIDENT_RATE_FAILURE:

            return {
                ...state,
                isMonthlyIncidentRateFetching: false,
                monthlyIncidentRateErrorMsg: action.payload
            }
    
        default:
            return state;
    }

}

export default morningMeetingReducer;