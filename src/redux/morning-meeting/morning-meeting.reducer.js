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

    isPpmhPerShiftFetching: false,
    ppmhPerShiftCollection: null,
    ppmhPerShiftErrorMsg: undefined,

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

    isDowntimeByOwnerFetching: false,
    downtimeByOwnerCollections: null,
    downtimeByOwnerErrorMsg: undefined,

    isDowntimeIconicsFetching: false,
    downtimeIconicsCollections: null,
    downtimeIconicsErrorMsg: undefined,

    isScrapVarianceFetching: false,
    scrapVarianceCollection: null,
    scrapVarianceErrorMsg: undefined,

    isScrapVariancePerProgramFetching: false,
    scrapVariancePerProgramCollection: null,
    scrapVariancePerProgramErrorMsg: undefined,

    isScrapVarianceByDeptFetching: false,
    scrapVarianceByDeptCollection: null,
    scrapVarianceByDeptErrorMsg: undefined,

    isScrapVarianceByShiftFetching: false,
    scrapVarianceByShiftCollection: null,
    scrapVarianceByShiftErrorMsg: undefined,

    isPpmhPerDeptVarianceFetching: false,
    ppmhPerDeptVarianceCollection: null,
    ppmhPerDeptVarianceErrorMsg: undefined,

    isPlantPpmhFetching: false,
    plantPpmhCollection: null,
    plantPpmhErrorMsg: undefined,

    isOvertimePercentPerDeptFetching: false,
    overtimePercentperDeptCollection: null,
    overtimePercentPerDeptErrorMsg: undefined,

    isOvertimePercentPerShiftFetching: false,
    overtimePercentperShiftCollection: null,
    overtimePercentPerShiftErrorMsg: undefined,

    isDeptKpiFetching: false,
    deptKpiCollection: null,
    deptKpiErrorMessage: undefined,

    isHourlyProdFetching: false,
    hourlyProdCollection: null,
    hourlyProdErrorMsg: undefined,

    startDate: previousDayFormatted,
    endDate: previousDayFormatted,

    downtimeByOwnerCollection: [],
    downtimeByLineCollection: [],

    performaceSelectedDepartment: 'Foundry Cell',
    ppmhChartType: 'ppmhByShift',
    
};

const morningMeetingReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

        //MONTHLY_INCIDENT_RATE
        case morningMeetingTypes.FETCH_SAFETY_MONTHLY_INCIDENT_RATE_START:

            return {
                ...state,
                isMonthlyIncidentRateFetching: true
            };

        case morningMeetingTypes.FETCH_SAFETY_MONTHLY_INCIDENT_RATE_SUCCESS:

            return {
                ...state,
                isMonthlyIncidentRateFetching: false,
                monthlyIncidentRateCollection: action.payload
            };

        case morningMeetingTypes.FETCH_SAFETY_MONTHLY_INCIDENT_RATE_FAILURE:

            return {
                ...state,
                isMonthlyIncidentRateFetching: false,
                monthlyIncidentRateCollection: [],
                monthlyIncidentRateErrorMsg: action.payload
            };

        //INCIDENTS_BY_DEPT
        case morningMeetingTypes.FETCH_SAFETY_INCIDENTS_BY_DEPT_START:

            return {
                ...state,
                isIncidentByDeptFetching: true
            };

        case morningMeetingTypes.FETCH_SAFETY_INCIDENTS_BY_DEPT_SUCCESS:

            return {
                ...state,
                isIncidentByDeptFetching: false,
                incidentByDeptCollection: action.payload
            };

        case morningMeetingTypes.FETCH_SAFETY_INCIDENTS_BY_DEPT_FAILURE:

            return {
                ...state,
                isIncidentByDeptFetching: false,
                incidentByDeptCollection: [],
                incidentByDeptErrorMsg: action.payload
            };

        //INCIDENTS
        case morningMeetingTypes.FETCH_SAFETY_INCIDENTS_START:

            return {
                ...state,
                isIncidentFetching: true
            };

        case morningMeetingTypes.FETCH_SAFETY_INCIDENTS_SUCCESS:

            return {
                ...state,
                isIncidentFetching: false,
                incidentCollection: action.payload
            };

        case morningMeetingTypes.FETCH_SAFETY_INCIDENTS_FAILURE:

            return {
                ...state,
                isIncidentFetching: false,
                incidentCollection: [],
                incidentErrorMsg: action.payload
            };

        //LOGISTICS_STOCK_OVERVIEW
        case morningMeetingTypes.FETCH_LOGISTICS_STOCK_OVERVIEW_START:

            return {
                ...state,
                isStockOverviewFetching: true
            };

        case morningMeetingTypes.FETCH_LOGISTICS_STOCK_OVERVIEW_SUCCESS:

            return {
                ...state,
                isStockOverviewFetching: false,
                stockOVerviewCollection: action.payload
            };

        case morningMeetingTypes.FETCH_LOGISTICS_STOCK_OVERVIEW_FAILURE:

            return {
                ...state,
                isStockOverviewFetching: false,
                stockOVerviewCollection: [],
                stockOVerviewErrorMsg: action.payload
            };

        //LOGISTICS_STOCK_OVERVIEW_SLOC
        case morningMeetingTypes.FETCH_LOGISTICS_STOCK_OVERVIEW_SLOC_START:

            return {
                ...state,
                isStockOverviewSlocFetching: true
            };

        case morningMeetingTypes.FETCH_LOGISTICS_STOCK_OVERVIEW_SLOC_SUCCESS:

            return {
                ...state,
                isStockOverviewSlocFetching: false,
                stockOVerviewSlocCollection: action.payload
            };

        case morningMeetingTypes.FETCH_LOGISTICS_STOCK_OVERVIEW_SLOC_FAILURE:

            return {
                ...state,
                isStockOverviewSlocFetching: false,
                stockOVerviewSlocCollection: [],
                stockOVerviewSlocErrorMsg: action.payload
            };

        //LOGISTICS_STATUS
        case morningMeetingTypes.FETCH_LOGISTICS_STATUS_START:

            return {
                ...state,
                isStockStatusFetching: true
            };

        case morningMeetingTypes.FETCH_LOGISTICS_STATUS_SUCCESS:

            return {
                ...state,
                isStockStatusFetching: false,
                stockStatusCollection: action.payload
            };

        case morningMeetingTypes.FETCH_LOGISTICS_STATUS_FAILURE:

            return {
                ...state,
                isStockStatusFetching: false,
                stockStatusCollection: [],
                stockStatusErrorMsg: action.payload
            };

        //PRODUCTION_STATUS
        case morningMeetingTypes.FETCH_PRODUCTION_STATUS_START:

            return {
                ...state,
                isProdStatusFetching: true
            };

        case morningMeetingTypes.FETCH_PRODUCTION_STATUS_SUCCESS:

            return {
                ...state,
                isProdStatusFetching: false,
                productionStatusCollection: action.payload
            };

        case morningMeetingTypes.FETCH_PRODUCTION_STATUS_FAILURE:

            return {
                ...state,
                isProdStatusFetching: false,
                productionStatusCollection: null,
                prodStatusErrorMsg: action.payload
            };

        //DAILY SCRAP RATE
        case morningMeetingTypes.FETCH_DAILY_SCRAP_RATE_START:

            return {
                ...state,
                isDailyScrapRateFetching: true
            };

        case morningMeetingTypes.FETCH_DAILY_SCRAP_RATE_SUCCESS:

            return {
                ...state,
                isDailyScrapRateFetching: false,
                dailyScrapRateCollection: action.payload
            };

        case morningMeetingTypes.FETCH_DAILY_SCRAP_RATE_FAILURE:

            return {
                ...state,
                isDailyScrapRateFetching: false,
                dailyScrapRateCollection: null,
                dailyScrapRateErrorMsg: action.payload
            };

        //DAILY KPI
        case morningMeetingTypes.FETCH_DAILY_KPI_START:

            return {
                ...state,
                isDailyKpiFetching: true
            };

        case morningMeetingTypes.FETCH_DAILY_KPI_SUCCESS:

            return {
                ...state,
                isDailyKpiFetching: false,
                dailyKpiCollection: action.payload
            };

        case morningMeetingTypes.FETCH_DAILY_KPI_FAILURE:

            return {
                ...state,
                isDailyKpiFetching: false,
                dailyKpiCollection: null,
                dailyKpiErrorMsg: action.payload
            };

        //WEEKLY LABOR HRS
        case morningMeetingTypes.FETCH_WEEKLY_LABOR_HRS_START:

            return {
                ...state,
                isWeeklyLaborHrsFetching: true
            };

        case morningMeetingTypes.FETCH_WEEKLY_LABOR_HRS_SUCCESS:

            return {
                ...state,
                isWeeklyLaborHrsFetching: false,
                weeklyLaborHrsCollection: action.payload
            };

        case morningMeetingTypes.FETCH_WEEKLY_LABOR_HRS_FAILURE:

            return {
                ...state,
                isWeeklyLaborHrsFetching: false,
                weeklyLaborHrsCollection: null,
                weeklyLaborHrsErrorMsg: action.payload
            };

        //PPMH per shift
        case morningMeetingTypes.FETCH_PPMH_PER_SHIFT_START:

            return {
                ...state,
                isPpmhPerShiftFetching: true
            };

        case morningMeetingTypes.FETCH_PPMH_PER_SHIFT_SUCCESS:

            return {
                ...state,
                isPpmhPerShiftFetching: false,
                ppmhPerShiftCollection: action.payload
            };

        case morningMeetingTypes.FETCH_PPMH_PER_SHIFT_FAILURE:

            return {
                ...state,
                isPpmhPerShiftFetching: false,
                ppmhPerShiftCollection: null,
                ppmhPerShiftErrorMsg: action.payload
            };

        //PROD SCRAP
        case morningMeetingTypes.FETCH_PROD_SCRAP_START:

            return {
                ...state,
                isProdScrapFetching: true
            };

        case morningMeetingTypes.FETCH_PROD_SCRAP_SUCCESS:

            return {
                ...state,
                isProdScrapFetching: false,
                prodScrapCollection: action.payload
            };

        case morningMeetingTypes.FETCH_PROD_SCRAP_FAILURE:

            return {
                ...state,
                isProdScrapFetching: false,
                prodScrapCollection: null,
                prodScrapErrorMsg: action.payload
            };

        //FIANNCE
        case morningMeetingTypes.FETCH_FINANCE_KPI_START:

            return {
                ...state,
                isFinanceKpiFetching: true
            };

        case morningMeetingTypes.FETCH_FINANCE_KPI_SUCCESS:

            return {
                ...state,
                isFinanceKpiFetching: false,
                financeKpiCollection: action.payload
            };

        case morningMeetingTypes.FETCH_FINANCE_KPI_FAILURE:

            return {
                ...state,
                isFinanceKpiFetching: false,
                financeKpiCollection: null,
                financeKpiErrorMsg: action.payload
            };

        //quality
        case morningMeetingTypes.FETCH_QUALITY_START:

            return {
                ...state,
                isQualityFetching: true
            };

        case morningMeetingTypes.FETCH_QUALITY_SUCCESS:

            return {
                ...state,
                isQualityFetching: false,
                qualityCollection: action.payload
            };

        case morningMeetingTypes.FETCH_QUALITY_FAILURE:

            return {
                ...state,
                isQualityFetching: false,
                qualityCollection: null,
                qualityErrorMsg: action.payload
            };

        //downtime
        case morningMeetingTypes.FETCH_DOWNTIME_START:

            return {
                ...state,
                isDowntimeFetching: true
            };

        case morningMeetingTypes.FETCH_DOWNTIME_SUCCESS:

            return {
                ...state,
                isDowntimeFetching: false,
                downtimeCollection: action.payload
            };

        case morningMeetingTypes.FETCH_DOWNTIME_FAILURE:

            return {
                ...state,
                isDowntimeFetching: false,
                downtimeCollection: null,
                downtimeErrorMsg: action.payload
            };

        //downtime by owner
        case morningMeetingTypes.FETCH_DOWNTIME_BY_OWNER_START:

            return {
                ...state,
                isDowntimeByOwnerFetching: true
            };

        case morningMeetingTypes.FETCH_DOWNTIME_BY_OWNER_SUCCESS:

            return {
                ...state,
                isDowntimeByOwnerFetching: false,
                downtimeByOwnerCollections: action.payload
            };

        case morningMeetingTypes.FETCH_DOWNTIME_BY_OWNER_FAILURE:

            return {
                ...state,
                isDowntimeByOwnerFetching: false,
                downtimeByOwnerCollections: null,
                downtimeByOwnerErrorMsg: action.payload
            };

        //downtime by Iconics
        case morningMeetingTypes.FETCH_DOWNTIME_ICONICS_START:

            return {
                ...state,
                isDowntimeIconicsFetching: true
            };

        case morningMeetingTypes.FETCH_DOWNTIME_ICONICS_SUCCESS:

            return {
                ...state,
                isDowntimeIconicsFetching: false,
                downtimeIconicsCollections: action.payload
            };

        case morningMeetingTypes.FETCH_DOWNTIME_ICONICS_FAILURE:

            return {
                ...state,
                isDowntimeIconicsFetching: false,
                downtimeIconicsCollections: null,
                downtimeIconicsErrorMsg: action.payload
            };

        //scrap variance
        case morningMeetingTypes.FETCH_SCRAP_VARIANCE_START:

            return {
                ...state,
                isScrapVarianceFetching: true
            };

        case morningMeetingTypes.FETCH_SCRAP_VARIANCE_SUCCESS:

            return {
                ...state,
                isScrapVarianceFetching: false,
                scrapVarianceCollection: action.payload
            };

        case morningMeetingTypes.FETCH_SCRAP_VARIANCE_FAILURE:

            return {
                ...state,
                isScrapVarianceFetching: false,
                scrapVarianceCollection: null,
                scrapVarianceErrorMsg: action.payload
            };

        //scrap variance per program
        case morningMeetingTypes.FETCH_SCRAP_VARIANCE_PER_PROGRAM_START:

            return {
                ...state,
                isScrapVariancePerProgramFetching: true
            };

        case morningMeetingTypes.FETCH_SCRAP_VARIANCE_PER_PROGRAM_SUCCESS:

            return {
                ...state,
                isScrapVariancePerProgramFetching: false,
                scrapVariancePerProgramCollection: action.payload
            };

        case morningMeetingTypes.FETCH_SCRAP_VARIANCE_PER_PROGRAM_FAILURE:

            return {
                ...state,
                isScrapVariancePerProgramFetching: false,
                scrapVariancePerProgramCollection: null,
                scrapVariancePerProgramErrorMsg: action.payload
            };

        //scrap variance per dept
        case morningMeetingTypes.FETCH_SCRAP_VARIANCE_BY_DEPT_START:

            return {
                ...state,
                isScrapVarianceByDeptFetching: true
            };

        case morningMeetingTypes.FETCH_SCRAP_VARIANCE_BY_DEPT_SUCCESS:

            return {
                ...state,
                isScrapVarianceByDeptFetching: false,
                scrapVarianceByDeptCollection: action.payload
            };

        case morningMeetingTypes.FETCH_SCRAP_VARIANCE_BY_DEPT_FAILURE:

            return {
                ...state,
                isScrapVarianceByDeptFetching: false,
                scrapVarianceByDeptCollection: null,
                scrapVarianceByDeptErrorMsg: action.payload
            };

        //scrap variance per shift
        case morningMeetingTypes.FETCH_SCRAP_VARIANCE_BY_SHIFT_START:

            return {
                ...state,
                isScrapVarianceByShiftFetching: true
            };

        case morningMeetingTypes.FETCH_SCRAP_VARIANCE_BY_SHIFT_SUCCESS:

            return {
                ...state,
                isScrapVarianceByShiftFetching: false,
                scrapVarianceByShiftCollection: action.payload
            };

        case morningMeetingTypes.FETCH_SCRAP_VARIANCE_BY_SHIFT_FAILURE:

            return {
                ...state,
                isScrapVarianceByShiftFetching: false,
                scrapVarianceByShiftCollection: null,
                scrapVarianceByShiftErrorMsg: action.payload
            };

        //ppmh variance per dept
        case morningMeetingTypes.FETCH_PPMH_PER_DEPT_START:

            return {
                ...state,
                isPpmhPerDeptVarianceFetching: true
            };

        case morningMeetingTypes.FETCH_PPMH_PER_DEPT_SUCCESS:

            return {
                ...state,
                isPpmhPerDeptVarianceFetching: false,
                ppmhPerDeptVarianceCollection: action.payload
            };

        case morningMeetingTypes.FETCH_PPMH_PER_DEPT_FAILURE:

            return {
                ...state,
                isPpmhPerDeptVarianceFetching: false,
                ppmhPerDeptVarianceCollection: null,
                ppmhPerDeptVarianceErrorMsg: action.payload
            };

        //plant ppm
        case morningMeetingTypes.FETCH_PLANT_PPMH_START:

            return {
                ...state,
                isPlantPpmhFetching: true
            };

        case morningMeetingTypes.FETCH_PLANT_PPMH_SUCCESS:

            return {
                ...state,
                isPlantPpmhFetching: false,
                plantPpmhCollection: action.payload
            };

        case morningMeetingTypes.FETCH_PLANT_PPMH_FAILURE:

            return {
                ...state,
                isPlantPpmhFetching: false,
                plantPpmhCollection: null,
                plantPpmhErrorMsg: action.payload
            };

        //dept kpi
        case morningMeetingTypes.FETCH_DEPT_KPI_START:

            return {
                ...state,
                isDeptKpiFetching: true
            };

        case morningMeetingTypes.FETCH_DEPT_KPI_SUCCESS:

            return {
                ...state,
                isDeptKpiFetching: false,
                deptKpiCollection: action.payload
            };

        case morningMeetingTypes.FETCH_DEPT_KPI_FAILURE:

            return {
                ...state,
                isDeptKpiFetching: false,
                deptKpiCollection: null,
                deptKpiErrorMessage: action.payload
            };

        //overtime percent per dept
        case morningMeetingTypes.FETCH_OVERTIME_PERCENT_PER_DEPT_START:

            return {
                ...state,
                isOvertimePercentPerDeptFetching: true
            };

        case morningMeetingTypes.FETCH_OVERTIME_PERCENT_PER_DEPT_SUCCESS:

            return {
                ...state,
                isOvertimePercentPerDeptFetching: false,
                overtimePercentperDeptCollection: action.payload
            };

        case morningMeetingTypes.FETCH_OVERTIME_PERCENT_PER_DEPT_FAILURE:

            return {
                ...state,
                isOvertimePercentPerDeptFetching: false,
                overtimePercentperDeptCollection: null,
                overtimePercentPerDeptErrorMsg: action.payload
            };

        //overtime percent per shift
        case morningMeetingTypes.FETCH_OVERTIME_PERCENT_PER_SHIFT_START:

            return {
                ...state,
                isOvertimePercentPerShiftFetching: true
            };

        case morningMeetingTypes.FETCH_OVERTIME_PERCENT_PER_SHIFT_SUCCESS:

            return {
                ...state,
                isOvertimePercentPerShiftFetching: false,
                overtimePercentperShiftCollection: action.payload
            };

        case morningMeetingTypes.FETCH_OVERTIME_PERCENT_PER_SHIFT_FAILURE:

            return {
                ...state,
                isOvertimePercentPerShiftFetching: false,
                overtimePercentperShiftCollection: null,
                overtimePercentPerShiftErrorMsg: action.payload
            };

        //set dates
        case morningMeetingTypes.SET_PRODUCTION_START_DATE:

            return {
                ...state,
                startDate: action.payload
            };

        case morningMeetingTypes.SET_PRODUCTION_END_DATE:

            return {
                ...state,
                endDate: action.payload
            };

        //downtime by owner
        case morningMeetingTypes.SET_DOWNTIME_BY_OWNER:

            return {
                ...state,
                downtimeByOwnerCollection: action.payload
            };

        //downtime by line
        case morningMeetingTypes.SET_DOWNTIME_BY_LINE:

            return {
                ...state,
                downtimeByLineCollection: action.payload
            };

        //selected department for performace page
        case morningMeetingTypes.SET_DEPARTMENT_SELECT:

            return {
                ...state,
                performaceSelectedDepartment: action.payload
            };

        //ppmh chart type
        case morningMeetingTypes.SET_PPMH_CHART_TYPE:

            return {
                ...state,
                ppmhChartType: action.payload
            };

        //hourly prod
        case morningMeetingTypes.FETCH_HOURLY_PROD_START:

            return {
                ...state,
                isHourlyProdFetching: true
            };

        case morningMeetingTypes.FETCH_HOURLY_PROD_SUCCESS:

            return {
                ...state,
                isHourlyProdFetching: false,
                hourlyProdCollection: action.payload
            };

        case morningMeetingTypes.FETCH_HOURLY_PROD_FAILURE:

            return {
                ...state,
                isHourlyProdFetching: false,
                hourlyProdCollection: null,
                hourlyProdErrorMsg: action.payload
            };
    
        default:
            return state;
    }

}

export default morningMeetingReducer;