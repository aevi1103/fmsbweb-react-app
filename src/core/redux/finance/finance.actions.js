import api from '../../utilities/api';
import types from './finance.types'

import {
    fetchStart,
    fetchSuccess,
    fetchFailure
} from '../../utilities/helpers'

export const fetchFiananceKpiStartAsync = (date) => {

    return dispatch => {

        dispatch(fetchStart(types.FETCH_FINANCE_KPI_START));

        const url = 'finance/kpi';
        api.get(url, {
            params: {
                date
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                types.FETCH_FINANCE_KPI_SUCCESS,
                response.data));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                types.FETCH_FINANCE_KPI_FAILURE,
                error.message));
        
        });

    };
};