import morningMeetingTypes from './morning-meeting.types';

import moment from 'moment';

const dateFormat = 'MM/DD/YYYY';
const previousDay = moment().add(-1, 'd');
const previousDayFormatted = previousDay.format(dateFormat);

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
    prodScrapErrorMsg: undefined,

    isFinanceKpiFetching: false,
    financeKpiCollection: null,
    financeKpiErrorMsg: undefined,

    isQualityFetching: false,
    qualityCollection: null,
    qualityErrorMsg: undefined,

    isDowntimeFetching: false,
    downtimeCollection: null,
    downtimeErrorMsg: undefined,

    isScrapVarianceFetching: false,
    scrapVarianceCollection: null,
    scrapVarianceErrorMsg: undefined,

    startDate: previousDayFormatted,
    endDate: previousDayFormatted,

    downtimeByOwnerCollection: [],
    downtimeByLineCollection: []
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
                monthlyIncidentRateCollection: [],
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
                incidentByDeptCollection: [],
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
                incidentCollection: [],
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
                stockOVerviewCollection: [],
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
                stockOVerviewSlocCollection: [],
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
                stockStatusCollection: [],
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
                productionStatusCollection: null,
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
                dailyScrapRateCollection: null,
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
                dailyKpiCollection: null,
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
                weeklyLaborHrsCollection: null,
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
                prodScrapCollection: null,
                prodScrapErrorMsg: action.payload
            }

        //FIANNCE
        case morningMeetingTypes.FETCH_FINANCE_KPI_START:

            return {
                ...state,
                isFinanceKpiFetching: true
            }

        case morningMeetingTypes.FETCH_FINANCE_KPI_SUCCESS:

            return {
                ...state,
                isFinanceKpiFetching: false,
                financeKpiCollection: action.payload
            }

        case morningMeetingTypes.FETCH_FINANCE_KPI_FAILURE:

            return {
                ...state,
                isFinanceKpiFetching: false,
                financeKpiCollection: null,
                financeKpiErrorMsg: action.payload
            }

        //quality
        case morningMeetingTypes.FETCH_QUALITY_START:

            return {
                ...state,
                isQualityFetching: true
            }

        case morningMeetingTypes.FETCH_QUALITY_SUCCESS:

            return {
                ...state,
                isQualityFetching: false,
                qualityCollection: action.payload
            }

        case morningMeetingTypes.FETCH_QUALITY_FAILURE:

            return {
                ...state,
                isQualityFetching: false,
                qualityCollection: null,
                qualityErrorMsg: action.payload
            }

        //downtime
        case morningMeetingTypes.FETCH_DOWNTIME_START:

            return {
                ...state,
                isDowntimeFetching: true
            }

        case morningMeetingTypes.FETCH_DOWNTIME_SUCCESS:

            return {
                ...state,
                isDowntimeFetching: false,
                downtimeCollection: action.payload
            }

        case morningMeetingTypes.FETCH_DOWNTIME_FAILURE:

            return {
                ...state,
                isDowntimeFetching: false,
                downtimeCollection: null,
                downtimeErrorMsg: action.payload
            }

        //scrap variance
        case morningMeetingTypes.FETCH_SCRAP_VARIANCE_START:

            return {
                ...state,
                isScrapVarianceFetching: true
            }

        case morningMeetingTypes.FETCH_SCRAP_VARIANCE_SUCCESS:

            return {
                ...state,
                isScrapVarianceFetching: false,
                scrapVarianceCollection: action.payload
            }

        case morningMeetingTypes.FETCH_SCRAP_VARIANCE_FAILURE:

            return {
                ...state,
                isScrapVarianceFetching: false,
                scrapVarianceCollection: null,
                scrapVarianceErrorMsg: action.payload
            }

        //set dates
        case morningMeetingTypes.SET_PRODUCTION_START_DATE:

            return {
                ...state,
                startDate: action.payload
            }

        case morningMeetingTypes.SET_PRODUCTION_END_DATE:

            return {
                ...state,
                endDate: action.payload
            }

        //downtime by owner
        case morningMeetingTypes.SET_DOWNTIME_BY_OWNER:

            return {
                ...state,
                downtimeByOwnerCollection: action.payload
            }

        //downtime by line
        case morningMeetingTypes.SET_DOWNTIME_BY_LINE:

            return {
                ...state,
                downtimeByLineCollection: action.payload
            }
    
        default:
            return state;
    }

}

export default morningMeetingReducer;