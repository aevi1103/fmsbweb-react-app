import types from './department-dashboard-types'
import api from '../../utilities/api'
import axios from 'axios'
import {
    fetchStart,
    fetchSuccess,
    fetchFailure,
    mapDeptToArea
} from '../../utilities/helpers'; 

export const fetchProductionDataStartAsync = (start, end, area, cancelTokenSrc) => {

    return dispatch => {

        dispatch(fetchStart(types.FETCH_PRODUCTION_DATA_START));

        api.get(`sap/productiondata`, { 
            params: {
                start,
                end,
                area
            },
            cancelToken: cancelTokenSrc.token
         })
        .then(response => {

            dispatch(fetchSuccess(types.FETCH_PRODUCTION_DATA_SUCCESS, response.data));

        })
        .catch(error => {
            
            if (axios.isCancel(error)) {
                console.error('Request canceled', error.message);
            } else {
                dispatch(fetchFailure(types.FETCH_PRODUCTION_DATA_FAILURE, error.message));
            }
        
        });

    };
}

export const fetchDailyKpiStartAsync = (start, end, area, cancelTokenSrc) => {

    return dispatch => {

        dispatch(fetchStart(types.FETCH_DAILY_KPI_START));

        const url = `sap/dailykpi`;

        api.get(url, { 
            cancelToken: cancelTokenSrc.token,
            params: {
                start,
                end,
                area
            }
        })
        .then(response => {

            dispatch(fetchSuccess(types.FETCH_DAILY_KPI_SUCCESS, response.data));

        })
        .catch(error => {
        
            if (axios.isCancel(error)) {
                console.error('Request canceled', url, error.message);
            } else {
                dispatch(fetchFailure(types.FETCH_DAILY_KPI_FAILURE, error.message));
            }

        });

    };
};

export const fetchProdScrapStartAsync = (start, end, area, cancelTokenSrc) => {

    return dispatch => {

        dispatch(fetchStart(types.FETCH_PROD_SCRAP_START));

        const url = `sap/prodscrap`;
        api.get(url, { 
            cancelToken: cancelTokenSrc.token,
            params: {
                start,
                end,
                area
            }
         })
        .then(response => {

            dispatch(fetchSuccess(types.FETCH_PROD_SCRAP_SUCCESS, response.data));

        })
        .catch(error => {

            if (axios.isCancel(error)) {
                console.error('Request canceled', url, error.message);
            } else {
                dispatch(fetchFailure(types.FETCH_PROD_SCRAP_FAILURE, error.message));
            }
        
        });

    };
};

export const fetchDailyScrapRateStartAsync = (start, end, area, cancelTokenSrc) => {

    return dispatch => {

        dispatch(fetchStart(types.FETCH_DAILY_SCRAP_RATE_START));

        const url = `sap/dailyscraprate`;
        api.get(url, { 
            cancelToken: cancelTokenSrc.token,
            params: {
                start,
                end,
                area
            }
         })
        .then(response => {

            dispatch(fetchSuccess(types.FETCH_DAILY_SCRAP_RATE_SUCCESS, response.data));

        })
        .catch(error => {
            
            if (axios.isCancel(error)) {
                console.error('Request canceled', url, error.message);
            } else {
                dispatch(fetchFailure(types.FETCH_DAILY_SCRAP_RATE_FAILURE, error.message));
            }
        
        });

    };
};

export const fetchPpmhStartAsync = (start, end, area, cancelTokenSrc) => {

    return dispatch => {

        dispatch(fetchStart(types.FETCH_PPMH_START));

        const url = `ppmh/shift`;
        api.get(url, { 
            cancelToken: cancelTokenSrc.token,
            params: {
                start,
                end,
                area
            }
         })
        .then(response => {

            dispatch(fetchSuccess(types.FETCH_PPMH_SUCCESS, response.data));

        })
        .catch(error => {
            
            if (axios.isCancel(error)) {
                console.error('Request canceled', url, error.message);
            } else {
                console.error('sopmething else', url, error.message);
                dispatch(fetchFailure(types.FETCH_PPMH_FAILURE, error.message));
            }
        
        });

    };
};

export const fetchWeeklyLaborHrsStartAsync = (start, end, area, cancelTokenSrc) => {

    return dispatch => {

        dispatch(fetchStart(types.FETCH_WEEKLY_LABOR_HRS_START));

        const url = `fmsb/weeklylaborhours`;
        api.get(url, { 
            cancelToken: cancelTokenSrc.token,
            params: {
                start,
                end,
                area
            }
         })
        .then(response => {

            dispatch(fetchSuccess(types.FETCH_WEEKLY_LABOR_HRS_SUCCESS,response.data));

        })
        .catch(error => {
            
            if (axios.isCancel(error)) {
                console.error('Request canceled', url, error.message);
            } else {
                console.error('sopmething else', url, error.message);
                dispatch(fetchFailure(types.FETCH_WEEKLY_LABOR_HRS_FAILURE, error.message));
            }
        
        });

    };
};

export const setPpmhChartType = chartType => ({
    type: types.SET_PPMH_CHART_TYPE,
    payload: chartType
});