import morningMeetingTypes from './morning-meeting.types';

const INITIAL_STATE = {
    isMonthlyIncidentRateFetching: false,
    monthlyIncidentRateCollection: [],
    monthlyIncidentRateErrorMsg: undefined,

    isIncidentByDeptFetching: false,
    incidentByDeptCollection: [],
    incidentByDeptErrorMsg: undefined,

    isIncidentFetching: false,
    incidentCollection: [],
    incidentErrorMsg: undefined
}

const morningMeetingReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

        //MONTHLY_INCIDENT_RATE
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

        //INCIDENTS_BY_DEPT
        case morningMeetingTypes.FETCH_SAFETY_INCIDENTS_BY_DEPT_START:

            return {
                ...state,
                isIncidentByDeptFetching: true
            }

        case morningMeetingTypes.FETCH_SAFETY_INCIDENTS_BY_DEPT_SUCCESS:

            return {
                ...state,
                isIncidentByDeptFetching: false,
                incidentByDeptCollection: action.payload
            }

        case morningMeetingTypes.FETCH_SAFETY_INCIDENTS_BY_DEPT_FAILURE:

            return {
                ...state,
                isIncidentByDeptFetching: false,
                incidentByDeptErrorMsg: action.payload
            }

        //INCIDENTS
        case morningMeetingTypes.FETCH_SAFETY_INCIDENTS_START:

            return {
                ...state,
                isIncidentFetching: true
            }

        case morningMeetingTypes.FETCH_SAFETY_INCIDENTS_SUCCESS:

            return {
                ...state,
                isIncidentFetching: false,
                incidentCollection: action.payload
            }

        case morningMeetingTypes.FETCH_SAFETY_INCIDENTS_FAILURE:

            return {
                ...state,
                isIncidentFetching: false,
                incidentErrorMsg: action.payload
            }

    
        default:
            return state;
    }

}

export default morningMeetingReducer;