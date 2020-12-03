import requestsTypes from './requests.types'

const INITIAL_STATE = {
    totalRequests: 0,
    progress: 0
}

const requestsReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case requestsTypes.SET_TOTAL_REQUESTS:

            return {
                ...state,
                totalRequests: action.payload
            }

        case requestsTypes.SET_PROGRESS:

            return {
                ...state,
                progress: action.payload
            }
    
        default:
            return state;
    }

}

export default requestsReducer;