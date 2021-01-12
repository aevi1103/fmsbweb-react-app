import types from './oee.types'
import api from '../../utilities/api'
import {
    fetchStart,
    fetchSuccess,
    fetchFailure
} from '../../utilities/helpers'

export const fetchLineStartAsync = lineId => {

    return dispatch => {

        dispatch(fetchStart(types.FETCH_LINE_START));
        api.get(`oee/lines/${lineId}`)
        .then(response => {
            dispatch(fetchSuccess(types.FETCH_LINE_SUCCESS, response.data));
        })
        .catch(error => {
            dispatch(fetchFailure(types.FETCH_LINE_FAILURE, error.message));
        });

    };
};

export const postOeeStartAsync = (data) => {

    return dispatch => {

        dispatch(fetchStart(types.FETCH_OEE_START));
        api.post(`/oee`, data)
        .then(response => {
            dispatch(fetchSuccess(types.FETCH_OEE_SUCCESS, response.data));
        })
        .catch(error => {
            dispatch(fetchFailure(types.FETCH_OEE_FAILURE, error.message));
        });

    };
};

export const fetchOeeStartAsync = lineId => {

    return dispatch => {

        dispatch(fetchStart(types.FETCH_OEE_START));
        api.get(`/oee/summary?lineId=${lineId}`)
        .then(response => {
            dispatch(fetchSuccess(types.FETCH_OEE_SUCCESS, response.data));
        })
        .catch(error => {
            dispatch(fetchFailure(types.FETCH_OEE_FAILURE, error.message));
        });

    };
};

export const fetchMachinesStartAsync = machineGroupId => {

    return dispatch => {

        dispatch(fetchStart(types.FETCH_MACHINES_START));
        api.get(`/machine?$filter=MachineGroupId eq ${machineGroupId}`)
        .then(response => {
            dispatch(fetchSuccess(types.FETCH_MACHINES_SUCCESS, response.data));
        })
        .catch(error => {
            dispatch(fetchFailure(types.FETCH_MACHINES_FAILURE, error.message));
        });

    };
};

export const fetchReason1StartAsync = () => {

    return dispatch => {

        dispatch(fetchStart(types.FETCH_REASON1_START));
        api.get(`/downtimereasons/primary`)
        .then(response => {
            dispatch(fetchSuccess(types.FETCH_REASON1_SUCCESS, response.data));
        })
        .catch(error => {
            dispatch(fetchFailure(types.FETCH_REASON1_FAILURE, error.message));
        });

    };
};

export const fetchReason2StartAsync = reason1Id => {

    return dispatch => {

        dispatch(fetchStart(types.FETCH_REASON2_START));
        api.get(`/downtimereasons/secondary?$filter=primaryReasonId eq ${reason1Id}`)
        .then(response => {
            dispatch(fetchSuccess(types.FETCH_REASON2_SUCCESS, response.data));
        })
        .catch(error => {
            dispatch(fetchFailure(types.FETCH_REASON2_FAILURE, error.message));
        });

    };
};

export const setRecord = record => ({
    type: types.SET_RECORD,
    payload: record
})

export const setSubTitle = subTitle => ({
    type: types.SET_SUB_TITLE,
    payload: subTitle
})