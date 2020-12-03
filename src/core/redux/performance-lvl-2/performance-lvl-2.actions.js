import api from '../../utilities/api';
import types from './performance-lvl-2.types'

import {
    fetchStart,
    fetchSuccess,
    fetchFailure
} from '../../utilities/helpers'

//* scrap variance per program
export const fetchScrapVariancePerDeptStartAsync = (start, end, isPurchasedScrap = 'SB') => {

    return dispatch => {

        dispatch(fetchStart(types.FETCH_SCRAP_VARIANCE_BY_DEPT_START));

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
                types.FETCH_SCRAP_VARIANCE_BY_DEPT_SUCCESS,
                response.data));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                types.FETCH_SCRAP_VARIANCE_BY_DEPT_FAILURE,
                error.message));
        
        });

    };
};

//* scrap variance per shift
export const fetchScrapVariancePerShiftStartAsync = (start, end, area, isPurchasedScrap = 'SB') => {

    return dispatch => {

        dispatch(fetchStart(
            types.FETCH_SCRAP_VARIANCE_BY_SHIFT_START));

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
                types.FETCH_SCRAP_VARIANCE_BY_SHIFT_SUCCESS,
                response.data));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                types.FETCH_SCRAP_VARIANCE_BY_SHIFT_FAILURE,
                error.message));
        
        });

    };
};

//* overtime quarter
export const fetchOvertimeQuarterStartAsync = (start, end, dept) => {

    return dispatch => {

        dispatch(fetchStart(types.FETCH_OVERTIME_QUARTER_START));

        const url = 'fmsb/overtimeperdept/quarter';
            
        api.get(url, {
            params: {
                start,
                end,
                dept
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                types.FETCH_OVERTIME_QUARTER_SUCCESS,
                response.data));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                types.FETCH_OVERTIME_QUARTER_FAILURE,
                error.message));
        
        });

    };
};

//* overtime by shift
export const fetchOvertimeShiftStartAsync = (start, end, dept) => {

    return dispatch => {

        dispatch(fetchStart(types.FETCH_OVERTIME_SHIFT_START));

        const url = 'fmsb/overtimeperdept/shift';
            
        api.get(url, {
            params: {
                start,
                end,
                dept
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                types.FETCH_OVERTIME_SHIFT_SUCCESS,
                response.data));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                types.FETCH_OVERTIME_SHIFT_FAILURE,
                error.message));
        
        });

    };
};