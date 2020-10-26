import productionStatusTypes from './production-status.types'

export const setDepartment = dept => ({
    type: productionStatusTypes.SET_DEPARTMENT,
    payload: dept.toLowerCase() === 'skirt coat' ? 'Skirt Coat' : dept
});

export const setShift = shift => ({
    type: productionStatusTypes.SET_SHIFT,
    payload: shift
});

export const setDateRange = dateRange => ({
    type: productionStatusTypes.SET_DATE_RANGE,
    payload: dateRange
});

export const setProductionStatus = result => ({
    type: productionStatusTypes.SET_PRODUCTION_STATUS,
    payload: result
});