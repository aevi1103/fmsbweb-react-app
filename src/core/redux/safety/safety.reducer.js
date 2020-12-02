import types from './safety.types'

const INITIAL_STATE = {
    isMonthlyIncidentRateFetching: false,
    monthlyIncidentRateCollection: [],
    monthlyIncidentRateErrorMsg: undefined,

    isIncidentByDeptFetching: false,
    incidentByDept: null,
    incidentByDeptErrorMsg: undefined,

    isIncidentFetching: false,
    incidentCollection: [],
    incidentErrorMsg: undefined,
}

const safetyReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

        //* MONTHLY_INCIDENT_RATE
        case types.FETCH_SAFETY_MONTHLY_INCIDENT_RATE_START:

            return {
                ...state,
                isMonthlyIncidentRateFetching: true
            };

        case types.FETCH_SAFETY_MONTHLY_INCIDENT_RATE_SUCCESS:

            return {
                ...state,
                isMonthlyIncidentRateFetching: false,
                monthlyIncidentRateCollection: action.payload
            };

        case types.FETCH_SAFETY_MONTHLY_INCIDENT_RATE_FAILURE:

            return {
                ...state,
                isMonthlyIncidentRateFetching: false,
                monthlyIncidentRateCollection: [],
                monthlyIncidentRateErrorMsg: action.payload
            };

        //* INCIDENTS_BY_DEPT
        case types.FETCH_SAFETY_INCIDENTS_BY_DEPT_START:

            return {
                ...state,
                isIncidentByDeptFetching: true
            };

        case types.FETCH_SAFETY_INCIDENTS_BY_DEPT_SUCCESS:

            return {
                ...state,
                isIncidentByDeptFetching: false,
                incidentByDept: action.payload
            };

        case types.FETCH_SAFETY_INCIDENTS_BY_DEPT_FAILURE:

            return {
                ...state,
                isIncidentByDeptFetching: false,
                incidentByDeptErrorMsg: action.payload
            };

        //* INCIDENTS
        case types.FETCH_SAFETY_INCIDENTS_START:

            return {
                ...state,
                isIncidentFetching: true
            };

        case types.FETCH_SAFETY_INCIDENTS_SUCCESS:

            return {
                ...state,
                isIncidentFetching: false,
                incidentCollection: action.payload
            };

        case types.FETCH_SAFETY_INCIDENTS_FAILURE:

            return {
                ...state,
                isIncidentFetching: false,
                incidentCollection: [],
                incidentErrorMsg: action.payload
            };
    
        default:
            return state;
    }

}

export default safetyReducer;