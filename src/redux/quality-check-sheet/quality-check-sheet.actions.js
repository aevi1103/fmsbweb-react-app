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

export const fetchCsCharacteristicStartAsync = (partId, machineName) => {
    return dispatch => {
        dispatch(fetchStart(qualityCheckSheetTypes.FETCH_CS_CHARACTERISTICS_START))
        api.get(`quality/checksheets/characteristic?$filter=organizationPartId eq ${partId} and machineName eq '${machineName}'&$expand=displayAs`)
        .then(response => {

            const data = response.data
                        .sort((a, b) => a.characteristicId - b.characteristicId)
                        .map((i,key) => ({ ...i, key}));

            dispatch(fetchSuccess(qualityCheckSheetTypes.FETCH_CS_CHARACTERISTICS_SUCCESS, data))
        })
        .catch(error => {   
            dispatch(fetchFailure(qualityCheckSheetTypes.FETCH_CS_CHARACTERISTICS_FAILURE, error.message))
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

export const setReChecksCollection = collection => ({
    type: qualityCheckSheetTypes.SET_RE_CHECKS,
    payload: collection
})

export const setCheckSheetValues = collection => ({
    type: qualityCheckSheetTypes.SET_CHECK_SHEET_VALUES,
    payload: collection
})

export const setCheckSheet = collection => ({
    type: qualityCheckSheetTypes.SET_CHECK_SHEET,
    payload: collection
})

export const setCheckSheetReadOnly = readOnly => ({
    type: qualityCheckSheetTypes.SET_CHECK_SHEET_READ_ONLY,
    payload: readOnly
})

export const setCheckSheetEntry = (checkSheetEntry, checkSheetValues, status) => {

    const { checkSheetEntryId } = checkSheetEntry;

    //* remove the new item from the old collection
    const items = checkSheetValues.filter(item => item.checkSheetEntryId !== checkSheetEntryId);

    //* if status is 2 or add/update push the new item in store
    if (status === 2) {
        items.push(checkSheetEntry);
    }

    //* set the new object to redux store
    return {
        type: qualityCheckSheetTypes.SET_CHECK_SHEET_VALUES,
        payload: items
    }

}
