import morningMeetingTypes from './morning-meeting.types';
import api from '../../utilities/api';

import {
    fetchStart,
    fetchSuccess,
    fetchFailure
} from '../../utilities/helpers'

//finance
export const fetchFiananceKpiStartAsync = (date) => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_FINANCE_KPI_START));

        const url = 'finance/kpi';
        api.get(url, {
            params: {
                date
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_FINANCE_KPI_SUCCESS,
                response.data));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                morningMeetingTypes.FETCH_FINANCE_KPI_FAILURE,
                error.message));
        
        });

    };
};

//scrap variance per program
export const fetchScrapVariancePerDeptStartAsync = (start, end, isPurchasedScrap = 'SB') => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_SCRAP_VARIANCE_BY_DEPT_START));

        const url = 'sap/scrapvarianceperdept';
        api.get(url, {
            params: {
                start,
                end,
                isPurchasedScrap: isPurchasedScrap === 'SB' ? false : true
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_SCRAP_VARIANCE_BY_DEPT_SUCCESS,
                response.data));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                morningMeetingTypes.FETCH_SCRAP_VARIANCE_BY_DEPT_FAILURE,
                error.message));
        
        });

    };
};

//scrap variance per shift
export const fetchScrapVariancePerShiftStartAsync = (start, end, area, isPurchasedScrap = 'SB') => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_SCRAP_VARIANCE_BY_SHIFT_START));

        const url = 'sap/scrapvariancepershift';
        api.get(url, {
            params: {
                start,
                end,
                area,
                isPurchasedScrap: isPurchasedScrap === 'SB' ? false : true
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_SCRAP_VARIANCE_BY_SHIFT_SUCCESS,
                response.data));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                morningMeetingTypes.FETCH_SCRAP_VARIANCE_BY_SHIFT_FAILURE,
                error.message));
        
        });

    };
};

//overtime per dept
export const fetchOvertimePercentPerDeptStartAsync = (start, end, dept) => {

    return dispatch => {

        dispatch(fetchStart(morningMeetingTypes.FETCH_OVERTIME_PERCENT_PER_DEPT_START));

        const url = 'fmsb/overtimeperdept';
            
        api.get(url, {
            params: {
                start,
                end,
                dept
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_OVERTIME_PERCENT_PER_DEPT_SUCCESS,
                response.data.quarterSummary));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                morningMeetingTypes.FETCH_OVERTIME_PERCENT_PER_DEPT_FAILURE,
                error.message));
        
        });

    };
};

//overtime per shift
export const fetchOvertimePercentPerShiftStartAsync = (start, end, dept) => {

    return dispatch => {

        dispatch(fetchStart(morningMeetingTypes.FETCH_OVERTIME_PERCENT_PER_SHIFT_START));

        const url = 'fmsb/overtimeperdept';
            
        api.get(url, {
            params: {
                start,
                end,
                dept
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_OVERTIME_PERCENT_PER_SHIFT_SUCCESS,
                response.data.shiftSummary));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                morningMeetingTypes.FETCH_OVERTIME_PERCENT_PER_SHIFT_FAILURE,
                error.message));
        
        });

    };
};

export const setStartDate = date => ({
    type: morningMeetingTypes.SET_PRODUCTION_START_DATE,
    payload: date
});

export const setEndDate = date => ({
    type: morningMeetingTypes.SET_PRODUCTION_END_DATE,
    payload: date
});

export const setPpmhChartType = chartType => ({
    type: morningMeetingTypes.SET_PPMH_CHART_TYPE,
    payload: chartType
});

export const fetchHourlyProdStartAsync = (dept, shiftDate) => {

    return dispatch => {
        dispatch(fetchStart(morningMeetingTypes.FETCH_HOURLY_PROD_START));
        dept = dept.toLowerCase() === 'finishing' ? 'skirt coat' : dept;
        const url = `kpi/hourlyproduction/${dept}?shiftDate=${shiftDate}`;    
        api.get(url, {
            params: {
                dept,
                shiftDate
            }
        })
        .then(response => {
            dispatch(fetchSuccess(morningMeetingTypes.FETCH_HOURLY_PROD_SUCCESS, response.data));
        })
        .catch(error => {        
            dispatch(fetchFailure(morningMeetingTypes.FETCH_HOURLY_PROD_FAILURE, error.message)); 
        });
    };
};
