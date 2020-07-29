import afEosTypes from './af-eos.types';
import api from '../../API';
import axios from 'axios';

import {
    fetchStart,
    fetchSuccess,
    fetchFailure
} from '../../helpers/helpers';

export const fetchDeptLineStartAsync = () => {
    
    return dispatch => {

        dispatch(fetchStart(afEosTypes.FETCH_DEPT_LINES_START));

        const url = 'machines/6';

        api.get(url)
        .then(response => {
            dispatch(fetchSuccess(afEosTypes.FETCH_DEPT_LINES_SUCCESS, response.data));
        })
        .catch(error => {
            
            dispatch(fetchFailure(afEosTypes.FETCH_DEPT_LINES_FAILURE, error.message));

            if (axios.isCancel(error)) {
                console.error('Request canceled', url, error.message);
            } else {
                console.error('sopmething else', url, error.message);
            }
        });
    }
}


export const fetchDeptEosStartAsync = (line, dept, shiftDate, shift) => {
    
    return dispatch => {

        dispatch(fetchStart(afEosTypes.FETCH_DEPT_EOS_START));

        const url = `kpi/eos/${line}?dept=${dept}&shiftDate=${shiftDate}&shift=${shift}`;

        api.get(url)
        .then(response => {
            dispatch(fetchSuccess(afEosTypes.FETCH_DEPT_EOS_SUCCESS, response.data));
        })
        .catch(error => {
            
            dispatch(fetchFailure(afEosTypes.FETCH_DEPT_EOS_FAILURE, error.message));

            if (axios.isCancel(error)) {
                console.error('Request canceled', url, error.message);
            } else {
                console.error('sopmething else', url, error.message);
            }
        });
    }
}

export const fetchDeptEosCollectionStartAsync = (dept, shiftDate, shift) => {
    
    return dispatch => {

        dispatch(fetchStart(afEosTypes.FETCH_DEPT_EOS_COLLECTION_START));

        const url = `kpi/eos?dept=${dept}&shiftDate=${shiftDate}&shift=${shift}`;

        api.get(url)
        .then(response => {
            dispatch(fetchSuccess(afEosTypes.FETCH_DEPT_EOS_COLLECTION_SUCCESS, response.data));
        })
        .catch(error => {
            
            dispatch(fetchFailure(afEosTypes.FETCH_DEPT_EOS_COLLECTION_FAILURE, error.message));

            if (axios.isCancel(error)) {
                console.error('Request canceled', url, error.message);
            } else {
                console.error('sopmething else', url, error.message);
            }
        });
    }
}

export const clearDeptEosResult = () => ({
    type: afEosTypes.SET_DEPT_EOS_RESULT,
    payload: null
});

export const setDeptEosCollection = (collection) => ({
    type: afEosTypes.SET_DEPT_EOS_COLLECTION,
    payload: collection
});