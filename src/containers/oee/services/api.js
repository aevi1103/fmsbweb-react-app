import api from '../../../core/utilities/api.js'

export const getLine = async guid => api.get(`oee/lines/${guid}`)
export const getSummary = async lineId => api.get(`/oee/summary?lineId=${lineId}`)