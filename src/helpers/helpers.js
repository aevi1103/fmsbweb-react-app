
import numeral from 'numeral';

export const numberSorter = (a, b) => (numeral(a).format('0') - numeral(b).format('0'));

export const percentSorter = (a, b) => (parseFloat(a) - parseFloat(b));

export const fetchStart = (actionType) => ({
    type: actionType
})

export const fetchSuccess = (actionType, data) => ({
    type: actionType,
    payload: data
})

export const fetchFailure = (actionType, errorMsg) => ({
    type: actionType,
    payload: errorMsg
})