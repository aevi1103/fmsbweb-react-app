import api from '../../../core/utilities/api.js'

export const getLine = async guid => api.get(`oee/lines/${guid}`)
export const getSummary = async lineId => api.get(`/oee/summary?lineId=${lineId}`)
export const getPrimaryReason = async () => api.get(`/downtimereasons/primary`)
export const getMachineGroup = async id => api.get(`/machine?$filter=MachineGroupId eq ${id}`)
export const getReason2 = async reason1Id => api.get(`/downtimereasons/secondary?$filter=primaryReasonId eq ${reason1Id}`)
export const getDowntimeList = async oeeId => api.get(`/downtimereasons?$filter=oeeId eq ${oeeId}`)
export const deleteRecord = (downtimeId, timestamp) => api.delete(`/downtimereasons/${downtimeId}?timestamp=${timestamp}`)