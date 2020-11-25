import requestsTypes from './requests.types'

export const setTotalRequests = request => ({
    type: requestsTypes.SET_TOTAL_REQUESTS,
    payload: request
})

export const setProgress = (progress) => ( {
    type: requestsTypes.SET_PROGRESS,
    payload: progress
})