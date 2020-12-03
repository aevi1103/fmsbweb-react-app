import types from './downtime.types'

const INITIAL_STATE = {
    isDowntimeFetching: false,
    downtimeCollection: null,
    downtimeErrorMsg: undefined,

    isDowntimeByOwnerFetching: false,
    downtimeByOwnerCollections: null,
    downtimeByOwnerErrorMsg: undefined,

    isDowntimeIconicsFetching: false,
    downtimeIconicsCollections: null,
    downtimeIconicsErrorMsg: undefined,

    downtimeByOwnerCollection: [],
    downtimeByLineCollection: [],
}

const reducer = (state = INITIAL_STATE, action) => { 

    switch (action.type) {

        //* downtime
        case types.FETCH_DOWNTIME_START:

            return {
                ...state,
                isDowntimeFetching: true
            };

        case types.FETCH_DOWNTIME_SUCCESS:

            return {
                ...state,
                isDowntimeFetching: false,
                downtimeCollection: action.payload
            };

        case types.FETCH_DOWNTIME_FAILURE:

            return {
                ...state,
                isDowntimeFetching: false,
                downtimeCollection: null,
                downtimeErrorMsg: action.payload
            };

        //* downtime by owner
        case types.FETCH_DOWNTIME_BY_OWNER_START:

            return {
                ...state,
                isDowntimeByOwnerFetching: true
            };

        case types.FETCH_DOWNTIME_BY_OWNER_SUCCESS:

            return {
                ...state,
                isDowntimeByOwnerFetching: false,
                downtimeByOwnerCollections: action.payload
            };

        case types.FETCH_DOWNTIME_BY_OWNER_FAILURE:

            return {
                ...state,
                isDowntimeByOwnerFetching: false,
                downtimeByOwnerCollections: null,
                downtimeByOwnerErrorMsg: action.payload
            };

        //* downtime by Iconics
        case types.FETCH_DOWNTIME_ICONICS_START:

            return {
                ...state,
                isDowntimeIconicsFetching: true
            };

        case types.FETCH_DOWNTIME_ICONICS_SUCCESS:

            return {
                ...state,
                isDowntimeIconicsFetching: false,
                downtimeIconicsCollections: action.payload
            };

        case types.FETCH_DOWNTIME_ICONICS_FAILURE:

            return {
                ...state,
                isDowntimeIconicsFetching: false,
                downtimeIconicsCollections: null,
                downtimeIconicsErrorMsg: action.payload
            };

        //* downtime by owner
        case types.SET_DOWNTIME_BY_OWNER:

            return {
                ...state,
                downtimeByOwnerCollection: action.payload
            };

        //* downtime by line
        case types.SET_DOWNTIME_BY_LINE:

            return {
                ...state,
                downtimeByLineCollection: action.payload
            };
    
        default:
            return state
    }

}

export default reducer;