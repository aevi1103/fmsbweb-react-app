import types from './department-dashboard-types'

const INITIAL_STATE = {

    isProductionDataLoading: false,
    productionData: null,
    productionDataErrorMsg: null,

    isDailyKpiLoading: false, 
    dailyKpi: null,
    dailyKpiErrorMsg: null,

    isProdScrapLoading: false,
    prodScrap: null, 
    prodScrapErrorMsg: null,

    isDailyScrapRateLoading: false,
    dailyScrapRateCollection: [], 
    dailyScrapRateErrorMsg: null, 

    isPpmhLoading: false,
    ppmhCollection: [],
    ppmhErrorMsg: null,

    isWeeklyLaborHrsLoading: false,
    weeklyLaborHrsCollection: [],
    weeklyLaborHrsErrorMsg: null,

    ppmhChartType: 'ppmhByShift',
}

const departmentDashboardReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

        //* production data
        case types.FETCH_PRODUCTION_DATA_START:
            return {
                ...state,
                isProductionDataLoading: true
            }
        case types.FETCH_PRODUCTION_DATA_SUCCESS:

            return {
                ...state,
                isProductionDataLoading: false,
                productionData: action.payload
            }
        case types.FETCH_PRODUCTION_DATA_FAILURE:

            return {
                ...state,
                isProductionDataLoading: false,
                productionDataErrorMsg: action.payload
            }

        //* daily kpi
        case types.FETCH_DAILY_KPI_START:
            return {
                ...state,
                isDailyKpiLoading: true
            }
        case types.FETCH_DAILY_KPI_SUCCESS:

            return {
                ...state,
                isDailyKpiLoading: false,
                dailyKpi: action.payload
            }
        case types.FETCH_DAILY_KPI_FAILURE:

            return {
                ...state,
                isDailyKpiLoading: false,
                dailyKpiErrorMsg: action.payload
            }

        //* prod scrap
        case types.FETCH_PROD_SCRAP_START:
            return {
                ...state,
                isProdScrapLoading: true
            }
        case types.FETCH_PROD_SCRAP_SUCCESS:

            return {
                ...state,
                isProdScrapLoading: false,
                prodScrap: action.payload
            }
        case types.FETCH_PROD_SCRAP_FAILURE:

            return {
                ...state,
                isProdScrapLoading: false,
                prodScrapErrorMsg: action.payload
            }

        //* daily scrap rate
        case types.FETCH_DAILY_SCRAP_RATE_START:
            return {
                ...state,
                isDailyScrapRateLoading: true
            }
        case types.FETCH_DAILY_SCRAP_RATE_SUCCESS:

            return {
                ...state,
                isDailyScrapRateLoading: false,
                dailyScrapRateCollection: action.payload
            }
        case types.FETCH_DAILY_SCRAP_RATE_FAILURE:

            return {
                ...state,
                isDailyScrapRateLoading: false,
                dailyScrapRateErrorMsg: action.payload
            }

        //* ppmh
        case types.FETCH_PPMH_START:
            return {
                ...state,
                isPpmhLoading: true
            }
        case types.FETCH_PPMH_SUCCESS:

            return {
                ...state,
                isPpmhLoading: false,
                ppmhCollection: action.payload
            }
        case types.FETCH_PPMH_FAILURE:

            return {
                ...state,
                isPpmhLoading: false,
                ppmhErrorMsg: action.payload
            }

        //* weekly labor hours
        case types.FETCH_WEEKLY_LABOR_HRS_START:

            return {
                ...state,
                isWeeklyLaborHrsLoading: true
            };

        case types.FETCH_WEEKLY_LABOR_HRS_SUCCESS:

            return {
                ...state,
                isWeeklyLaborHrsLoading: false,
                weeklyLaborHrsCollection: action.payload
            };

        case types.FETCH_WEEKLY_LABOR_HRS_FAILURE:

            return {
                ...state,
                isWeeklyLaborHrsLoading: false,
                weeklyLaborHrsErrorMsg: action.payload
            };

        //* ppmh chart type
        case types.SET_PPMH_CHART_TYPE:

            return {
                ...state,
                ppmhChartType: action.payload
            };
    
        default:
            return state;
    }

}

export default departmentDashboardReducer;