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

//PRODUCTION_STATUS
export const fetchProductionStatusStartAsync = (startDate, endDate, area) => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_PRODUCTION_STATUS_START))

        api.get(`sap/productiondata?start=${startDate}&end=${endDate}&area=${area}`)
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_PRODUCTION_STATUS_SUCCESS,
                response.data))

        })
        .catch(error => dispatch(fetchFailure(
            morningMeetingTypes.FETCH_PRODUCTION_STATUS_FAILURE,
            error.message)))

    }
}

//DAILY SCRAP RATE
export const fetchDailyScrapRateStartAsync = (startDate, endDate, area) => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_DAILY_SCRAP_RATE_START))

        api.get(`sap/dailyscraprate?start=${startDate}&end=${endDate}&area=${area}`)
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_DAILY_SCRAP_RATE_SUCCESS,
                response.data))

        })
        .catch(error => dispatch(fetchFailure(
            morningMeetingTypes.FETCH_DAILY_SCRAP_RATE_FAILURE,
            error.message)))

    }
}

//DAILY KPI
export const fetchDailyKpiStartAsync = (startDate, endDate, area) => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_DAILY_KPI_START))

        api.get(`sap/dailykpi?start=${startDate}&end=${endDate}&area=${area}`)
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_DAILY_KPI_SUCCESS,
                response.data))

        })
        .catch(error => dispatch(fetchFailure(
            morningMeetingTypes.FETCH_DAILY_KPI_FAILURE,
            error.message)))

    }
}

//WEEKLY LABOR HRS
export const fetchWeeklyLaborHrsStartAsync = (startDate, endDate, area) => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_WEEKLY_LABOR_HRS_START))

        api.get(`fmsb/weeklylaborhours?start=${startDate}&end=${endDate}&area=${area}`)
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_WEEKLY_LABOR_HRS_SUCCESS,
                response.data))

        })
        .catch(error => dispatch(fetchFailure(
            morningMeetingTypes.FETCH_WEEKLY_LABOR_HRS_FAILURE,
            error.message)))

    }
}

//prod scrap
export const fetchProdScrapStartAsync = (startDate, endDate, area) => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_PROD_SCRAP_START))

        api.get(`sap/prodscrap?start=${startDate}&end=${endDate}&area=${area}`)
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_PROD_SCRAP_SUCCESS,
                response.data))

        })
        .catch(error => dispatch(fetchFailure(
            morningMeetingTypes.FETCH_PROD_SCRAP_FAILURE,
            error.message)))

    }
}

//finance
export const fetchFiananceKpiStartAsync = (date) => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_FINANCE_KPI_START))

        api.get(`finance/kpi?date=${date}`)
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_FINANCE_KPI_SUCCESS,
                response.data))

            dispatch(fetchFailure(
                morningMeetingTypes.FETCH_FINANCE_KPI_FAILURE, undefined))

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                morningMeetingTypes.FETCH_FINANCE_KPI_FAILURE,
                error.message))

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_FINANCE_KPI_SUCCESS, null))
        
        })

    }
}

//quality
export const fetchQualityStartAsync = (date) => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_QUALITY_START))

        api.get(`quality/status?start=${date}&end=${date}`)
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_QUALITY_SUCCESS,
                response.data))

            dispatch(fetchFailure(
                morningMeetingTypes.FETCH_QUALITY_FAILURE, undefined))

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                morningMeetingTypes.FETCH_QUALITY_FAILURE,
                error.message))

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_QUALITY_SUCCESS, null))
        
        })

    }
}