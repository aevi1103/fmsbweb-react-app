import api from '../../utilities/api';
import types from './downtime.types'

import {
    fetchStart,
    fetchSuccess,
    fetchFailure
} from '../../utilities/helpers'

import {
    getDowntimeByOwner
} from '../../utilities/downtime-helper';

//downtime
export const fetchDowntimeStartAsync = (start, end) => {

    return dispatch => {

        dispatch(fetchStart(types.FETCH_DOWNTIME_START));
        dispatch(resetDowntimeByOwner());
        dispatch(resetDowntimeByLine());

        const url = 'fmsb/downtime';
            
        api.get(url, {
            params: {
                start,
                end
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                types.FETCH_DOWNTIME_SUCCESS,
                response.data));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                types.FETCH_DOWNTIME_FAILURE,
                error.message));
        
        });

    };
};

export const setDowntimeByOwner = (downtimeCollection, dept, shift) => ({
    type: types.SET_DOWNTIME_BY_OWNER,
    payload: getDowntimeByOwner(downtimeCollection, dept, shift)
});

export const resetDowntimeByOwner = () => ({
    type: types.SET_DOWNTIME_BY_OWNER,
    payload: {
        dept: '',
        shift: '',
        ownerTitle: 'Select Shift...',
        ownerDetails: []
    }
});

export const setDowntimeByLine = (lineDetails, dept, shift, owner) => ({
    type: types.SET_DOWNTIME_BY_LINE,
    payload: {
        dept,
        shift,
        owner,
        lineTitle: `${dept} - Shift ${shift} - ${owner} - Dowtime By Machine (Drilldown Chart)`,
        lineDetails
    }
});

export const resetDowntimeByLine = () => ({
    type: types.SET_DOWNTIME_BY_LINE,
    payload: {
        dept: '',
        shift: '',
        owner: '',
        lineTitle: `Select Owner...`,
        lineDetails: []
    }
});

//downtime by owner
export const fetchDowntimeByOwnerStartAsync = (start, end, area) => {

    var dept = area;
    switch (dept) {
        case 'Foundry Cell' :
            dept = 'Foundry';
            break;
        case 'Machine Line':
            dept = 'Machining';
            break;
        default:
            dept = area;
    }

    return dispatch => {

        dispatch(fetchStart(types.FETCH_DOWNTIME_BY_OWNER_START));

        const url = 'fmsb/downtimebyowner';
            
        api.get(url, {
            params: {
                start,
                end,
                dept
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                types.FETCH_DOWNTIME_BY_OWNER_SUCCESS,
                response.data));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                types.FETCH_DOWNTIME_BY_OWNER_FAILURE,
                error.message));
        
        });

    };
};

//downtime by Iconics
export const fetchDowntimeIconicsStartAsync = (start, end, area, minDowntimeEvent = 10, maxDowntimeEvent = null) => {

    var dept = area;
    switch (dept) {
        case 'Foundry Cell' :
            dept = 'Foundry';
            break;
        case 'Machine Line':
            dept = 'Machining';
            break;
        default:
            dept = area;
    }

    return dispatch => {

        dispatch(fetchStart(types.FETCH_DOWNTIME_ICONICS_START));

        const url = 'iconics/downtimeiconics';
            
        api.get(url, {
            params: {
                start,
                end,
                dept,
                minDowntimeEvent: !minDowntimeEvent ? 0 : minDowntimeEvent,
                maxDowntimeEvent: !maxDowntimeEvent ? null : maxDowntimeEvent
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                types.FETCH_DOWNTIME_ICONICS_SUCCESS,
                response.data));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                types.FETCH_DOWNTIME_ICONICS_FAILURE,
                error.message));
        
        });

    };
};