import qualityCheckSheetTypes from './quality-check-sheet.types'
import api from '../../API';
import {
    fetchStart,
    fetchSuccess,
    fetchFailure,
    oDataQryString
} from '../../helpers/helpers';


export const fetchLineStartAsync = (odataQry = '') => {
    return dispatch => {
        dispatch(fetchStart(qualityCheckSheetTypes.FETCH_LINE_START))
        api.get(`quality/checksheets/line${oDataQryString(odataQry)}`)
        .then(response => {
            dispatch(fetchSuccess(qualityCheckSheetTypes.FETCH_LINE_SUCCESS, response.data))
        })
        .catch(error => {   
            dispatch(fetchFailure(qualityCheckSheetTypes.FETCH_LINE_FAILURE, error.message))
        })
    }
}

export const fetchMachineStartAsync = (odataQry = '') => {
    return dispatch => {
        dispatch(fetchStart(qualityCheckSheetTypes.FETCH_MACHINE_START))
        api.get(`quality/checksheets/machine${oDataQryString(odataQry)}`)
        .then(response => {
            dispatch(fetchSuccess(qualityCheckSheetTypes.FETCH_MACHINE_SUCCESS, response.data))
        })
        .catch(error => {   
            dispatch(fetchFailure(qualityCheckSheetTypes.FETCH_MACHINE_FAILURE, error.message))
        })
    }
}

export const fetchSubMachineStartAsync = (odataQry = '') => {
    return dispatch => {
        dispatch(fetchStart(qualityCheckSheetTypes.FETCH_SUB_MACHINE_START))
        api.get(`quality/checksheets/submachine${oDataQryString(odataQry)}`)
        .then(response => {
            dispatch(fetchSuccess(qualityCheckSheetTypes.FETCH_SUB_MACHINE_SUCCESS, response.data))
        })
        .catch(error => {   
            dispatch(fetchFailure(qualityCheckSheetTypes.FETCH_SUB_MACHINE_FAILURE, error.message))
        })
    }
}

export const fetchPartStartAsync = (odataQry = '') => {
    return dispatch => {
        dispatch(fetchStart(qualityCheckSheetTypes.FETCH_PART_START))
        api.get(`quality/checksheets/organizationpart${oDataQryString(odataQry)}`)
        .then(response => {
            dispatch(fetchSuccess(qualityCheckSheetTypes.FETCH_PART_SUCCESS, response.data))
        })
        .catch(error => {   
            dispatch(fetchFailure(qualityCheckSheetTypes.FETCH_PART_FAILURE, error.message))
        })
    }
}

export const fetchCharacteristicStartAsync = (odataQry = '') => {
    return dispatch => {
        dispatch(fetchStart(qualityCheckSheetTypes.FETCH_CHARACTERISTICS_START))
        api.get(`quality/checksheets/characteristic${oDataQryString(odataQry)}`)
        .then(response => {
            dispatch(fetchSuccess(qualityCheckSheetTypes.FETCH_CHARACTERISTICS_SUCCESS, response.data))
        })
        .catch(error => {   
            dispatch(fetchFailure(qualityCheckSheetTypes.FETCH_CHARACTERISTICS_FAILURE, error.message))
        })
    }
}

export const setControlMethod = value => ({
    type: qualityCheckSheetTypes.SET_CONTROL_METHOD,
    payload: value
})

export const setPart = value => ({
    type: qualityCheckSheetTypes.SET_PART,
    payload: value
})

export const setMachine = value => ({
    type: qualityCheckSheetTypes.SET_MACHINE,
    payload: value
})

export const setCheckSheetPart = value => ({
    type: qualityCheckSheetTypes.SET_CHECK_SHEET_PART,
    payload: value
})

export const setCheckSheetSubMachine = value => ({
    type: qualityCheckSheetTypes.SET_CHECK_SHEET_SUB_MACHINE,
    payload: value
})

export const setCheckSheetMachineName = value => ({
    type: qualityCheckSheetTypes.SET_CHECK_SHEET_MACHINE_NAME,
    payload: value
})