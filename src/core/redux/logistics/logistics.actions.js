import api from '../../utilities/api';
import types from './logistics.types'

import {
    fetchStart,
    fetchSuccess,
    fetchFailure
} from '../../utilities/helpers'

//* LOGISTICS_STOCK_OVERVIEW
export const fetchLogisticsStockOverviewStartAsync = (date) => {

    return dispatch => {

        dispatch(fetchStart(types.FETCH_LOGISTICS_STOCK_OVERVIEW_START));

        const url = `logistics/stockoverview`;
        api.get(url, {
            params: {
                date
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                types.FETCH_LOGISTICS_STOCK_OVERVIEW_SUCCESS,
                response.data));

        })
        .catch(error => dispatch(fetchFailure(
            types.FETCH_LOGISTICS_STOCK_OVERVIEW_FAILURE,
            error.message)));

    };
};

//* LOGISTICS_STOCK_OVERVIEW_SLOC
export const fetchLogisticsStockOverviewSlocStartAsync = (date) => {

    return dispatch => {

        dispatch(fetchStart(
            types.FETCH_LOGISTICS_STOCK_OVERVIEW_SLOC_START));

        const url = `logistics/stockoverviewbysloc`;
        api.get(url, {
            params: {
                date
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                types.FETCH_LOGISTICS_STOCK_OVERVIEW_SLOC_SUCCESS,
                response.data));

        })
        .catch(error => dispatch(fetchFailure(
            types.FETCH_LOGISTICS_STOCK_OVERVIEW_SLOC_FAILURE,
            error.message)));

    };
};
    
//* LOGISTICS_STATUS
export const fetchLogisticsStatusStartAsync = (date) => {

    return dispatch => {

        dispatch(fetchStart(types.FETCH_LOGISTICS_STATUS_START));
        
        api.get(`logistics/stat?datetime=${date}`)
        .then(response => {
            dispatch(fetchSuccess(types.FETCH_LOGISTICS_STATUS_SUCCESS,response.data));
        })
        .catch(error => dispatch(fetchFailure(
            types.FETCH_LOGISTICS_STATUS_FAILURE,
            error.message)));

    };
};