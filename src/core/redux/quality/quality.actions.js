import api from '../../utilities/api';
import types from './quality.types'

import {
    fetchStart,
    fetchSuccess,
    fetchFailure
} from '../../utilities/helpers'

export const fetchQualityStartAsync = (date) => {

    return dispatch => {

        dispatch(fetchStart(
            types.FETCH_QUALITY_START));

        const url = 'quality/status';
        api.get(url, {
            params: {
                start: date,
                end: date
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                types.FETCH_QUALITY_SUCCESS,
                response.data));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                types.FETCH_QUALITY_FAILURE,
                error.message));
        
        });

    };
};