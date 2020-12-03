import morningMeetingTypes from './morning-meeting.types';
import api from '../../utilities/api';

import {
    fetchStart,
    fetchSuccess,
    fetchFailure
} from '../../utilities/helpers'

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
