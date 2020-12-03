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

export const setScrapModalVisible = visible => ({
    type: productionStatusTypes.SET_SCRAP_MODAL_VISIBLE,
    payload: visible
});

export const setDowntimeModalVisible = visible => ({
    type: productionStatusTypes.SET_DOWNTIME_MODAL_VISIBLE,
    payload: visible
});

export const setHxHModalVisible = visible => ({
    type: productionStatusTypes.SET_HXH_MODAL_VISIBLE,
    payload: visible
});

export const setLine = line => ({
    type: productionStatusTypes.SET_LINE,
    payload: line
});

export const setScrapCollection = collection => ({
    type: productionStatusTypes.SET_SCRAP_COLLECTION,
    payload: collection
});

export const setDowntimeByMachineCollection = collection => ({
    type: productionStatusTypes.SET_DOWNTIME_BY_MACHINE_COLLECTION,
    payload: collection
})

export const setDowntimeByReasonCollection = collection => ({
    type: productionStatusTypes.SET_DOWNTIME_BY_REASON_COLLECTION,
    payload: collection
});

export const setHxHCollection = collection => ({
    type: productionStatusTypes.SET_HXH_COLLECTION,
    payload: collection
});

export const setTarget = target => ({
    type: productionStatusTypes.SET_TARGET,
    payload: target
});