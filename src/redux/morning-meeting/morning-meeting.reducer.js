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
    incidentErrorMsg: undefined,

    isStockOverviewFetching: false,
    stockOVerviewCollection: [],
    stockOVerviewErrorMsg: undefined,

    isStockOverviewSlocFetching: false,
    stockOVerviewSlocCollection: [],
    stockOVerviewSlocErrorMsg: undefined,

    isStockStatusFetching: false,
    stockStatusCollection: [],
    stockStatusErrorMsg: undefined,

    isProdStatusFetching: false,
    productionStatusCollection: null,
    prodStatusErrorMsg: undefined,

    isDailyScrapRateFetching: false,
    dailyScrapRateCollection: null,
    dailyScrapRateErrorMsg: undefined,

    isDailyKpiFetching: false,
    dailyKpiCollection: null,
    dailyKpiErrorMsg: undefined,

    isWeeklyLaborHrsFetching: false,
    weeklyLaborHrsCollection: null,
    weeklyLaborHrsErrorMsg: undefined,

    isProdScrapFetching: false,
    prodScrapCollection: null,
    prodScrapErrorMsg: undefined
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

        //LOGISTICS_STOCK_OVERVIEW
        case morningMeetingTypes.FETCH_LOGISTICS_STOCK_OVERVIEW_START:

            return {
                ...state,
                isStockOverviewFetching: true
            }

        case morningMeetingTypes.FETCH_LOGISTICS_STOCK_OVERVIEW_SUCCESS:

            return {
                ...state,
                isStockOverviewFetching: false,
                stockOVerviewCollection: action.payload
            }

        case morningMeetingTypes.FETCH_LOGISTICS_STOCK_OVERVIEW_FAILURE:

            return {
                ...state,
                isStockOverviewFetching: false,
                stockOVerviewErrorMsg: action.payload
            }

        //LOGISTICS_STOCK_OVERVIEW_SLOC
        case morningMeetingTypes.FETCH_LOGISTICS_STOCK_OVERVIEW_SLOC_START:

            return {
                ...state,
                isStockOverviewSlocFetching: true
            }

        case morningMeetingTypes.FETCH_LOGISTICS_STOCK_OVERVIEW_SLOC_SUCCESS:

            return {
                ...state,
                isStockOverviewSlocFetching: false,
                stockOVerviewSlocCollection: action.payload
            }

        case morningMeetingTypes.FETCH_LOGISTICS_STOCK_OVERVIEW_SLOC_FAILURE:

            return {
                ...state,
                isStockOverviewSlocFetching: false,
                stockOVerviewSlocErrorMsg: action.payload
            }

        //LOGISTICS_STATUS
        case morningMeetingTypes.FETCH_LOGISTICS_STATUS_START:

            return {
                ...state,
                isStockStatusFetching: true
            }

        case morningMeetingTypes.FETCH_LOGISTICS_STATUS_SUCCESS:

            return {
                ...state,
                isStockStatusFetching: false,
                stockStatusCollection: action.payload
            }

        case morningMeetingTypes.FETCH_LOGISTICS_STATUS_FAILURE:

            return {
                ...state,
                isStockStatusFetching: false,
                stockStatusErrorMsg: action.payload
            }

        //PRODUCTION_STATUS
        case morningMeetingTypes.FETCH_PRODUCTION_STATUS_START:

            return {
                ...state,
                isProdStatusFetching: true
            }

        case morningMeetingTypes.FETCH_PRODUCTION_STATUS_SUCCESS:

            return {
                ...state,
                isProdStatusFetching: false,
                productionStatusCollection: action.payload
            }

        case morningMeetingTypes.FETCH_PRODUCTION_STATUS_FAILURE:

            return {
                ...state,
                isProdStatusFetching: false,
                prodStatusErrorMsg: action.payload
            }

        //DAILY SCRAP RATE
        case morningMeetingTypes.FETCH_DAILY_SCRAP_RATE_START:

            return {
                ...state,
                isDailyScrapRateFetching: true
            }

        case morningMeetingTypes.FETCH_DAILY_SCRAP_RATE_SUCCESS:

            return {
                ...state,
                isDailyScrapRateFetching: false,
                dailyScrapRateCollection: action.payload
            }

        case morningMeetingTypes.FETCH_DAILY_SCRAP_RATE_FAILURE:

            return {
                ...state,
                isDailyScrapRateFetching: false,
                dailyScrapRateErrorMsg: action.payload
            }

        //DAILY KPI
        case morningMeetingTypes.FETCH_DAILY_KPI_START:

            return {
                ...state,
                isDailyKpiFetching: true
            }

        case morningMeetingTypes.FETCH_DAILY_KPI_SUCCESS:

            return {
                ...state,
                isDailyKpiFetching: false,
                dailyKpiCollection: action.payload
            }

        case morningMeetingTypes.FETCH_DAILY_KPI_FAILURE:

            return {
                ...state,
                isDailyKpiFetching: false,
                dailyKpiErrorMsg: action.payload
            }

        //WEEKLY LABOR HRS
        case morningMeetingTypes.FETCH_WEEKLY_LABOR_HRS_START:

            return {
                ...state,
                isWeeklyLaborHrsFetching: true
            }

        case morningMeetingTypes.FETCH_WEEKLY_LABOR_HRS_SUCCESS:

            return {
                ...state,
                isWeeklyLaborHrsFetching: false,
                weeklyLaborHrsCollection: action.payload
            }

        case morningMeetingTypes.FETCH_WEEKLY_LABOR_HRS_FAILURE:

            return {
                ...state,
                isWeeklyLaborHrsFetching: false,
                weeklyLaborHrsErrorMsg: action.payload
            }

        //PROD SCRAP
        case morningMeetingTypes.FETCH_PROD_SCRAP_START:

            return {
                ...state,
                isProdScrapFetching: true
            }

        case morningMeetingTypes.FETCH_PROD_SCRAP_SUCCESS:

            return {
                ...state,
                isProdScrapFetching: false,
                prodScrapCollection: action.payload
            }

        case morningMeetingTypes.FETCH_PROD_SCRAP_FAILURE:

            return {
                ...state,
                isProdScrapFetching: false,
                prodScrapErrorMsg: action.payload
            }
    
        default:
            return state;
    }

}

export default morningMeetingReducer;