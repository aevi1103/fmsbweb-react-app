import axios from 'axios';
import types from './safety.types'
import api from '../../utilities/api'

import {
    fetchStart,
    fetchSuccess,
    fetchFailure
} from '../../utilities/helpers'

//* MONTHLY_INCIDENT_RATE
export const fetchSafetyMonthlyIncidentRateStartAsync = () => {

    return dispatch => {

        dispatch(fetchStart(
            types.FETCH_SAFETY_MONTHLY_INCIDENT_RATE_START));

        const url = 'safety/monthlyincidentrate';

        api.get(url)
        .then(response => {

            dispatch(fetchSuccess(
                types.FETCH_SAFETY_MONTHLY_INCIDENT_RATE_SUCCESS,
                response.data));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                types.FETCH_SAFETY_MONTHLY_INCIDENT_RATE_FAILURE,
                error.message));

            if (axios.isCancel(error)) {
                console.error('Request canceled', url, error.message);
            } else {
                console.error('sopmething else', url, error.message);
            }

        });

    };
};

//* INCIDENTS_BY_DEPT
export const fetchSafetyIncidentByDeptStartAsync = () => {

    return dispatch => {

        dispatch(fetchStart(
            types.FETCH_SAFETY_INCIDENTS_BY_DEPT_START));

        api.get('safety/incidentbydepartment')
        .then(response => {

            dispatch(fetchSuccess(
                types.FETCH_SAFETY_INCIDENTS_BY_DEPT_SUCCESS,
                response.data));

        })
        .catch(error => dispatch(fetchFailure(
            types.FETCH_SAFETY_INCIDENTS_BY_DEPT_FAILURE,
            error.message)));

    };
};

//* INCIDENTS
export const fetchSafetyIncidentStartAsync = (startDate, endDate) => {

    return dispatch => {

        dispatch(fetchStart(
            types.FETCH_SAFETY_INCIDENTS_START));

        const url = `safety/incidents`;
        api.get(url, {
            params: {
                start: startDate,
                end: endDate,
                fields: 'dept,injuryStatus,description,incidentDate'
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                types.FETCH_SAFETY_INCIDENTS_SUCCESS,
                response.data));

        })
        .catch(error => dispatch(fetchFailure(
            types.FETCH_SAFETY_INCIDENTS_FAILURE,
            error.message)));

    };
};