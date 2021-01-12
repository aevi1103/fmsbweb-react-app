import types from './oee.types'

const INITIAL_STATE = {

    isLinefetching: false, 
    line: null, 
    lineErrorMsg: null,

    isOeeFetching: false, 
    oee: null, 
    oeeErrorMsg: null,

    isMachineFetching: false, 
    machineCollection: [], 
    machinesErrorMsg: null,

    isReason1Fetching: false, 
    reason1Collection: [], 
    reason1ErrorMsg: null,

    isReason2Fetching: false, 
    reason2Collection: [], 
    reason2ErrorMsg: null,

    record: null,
    subTitle: null
}


const reducer = (state = INITIAL_STATE, action) => {


    switch (action.type) {

        //* line
        case types.FETCH_LINE_START:

            return {
                ...state,
                isLinefetching: true
            };

        case types.FETCH_LINE_SUCCESS:

            return {
                ...state,
                isLinefetching: false,
                line: action.payload,
            };

        case types.FETCH_LINE_FAILURE:

            return {
                ...state,
                isLinefetching: false,
                lineErrorMsg: action.payload
            };

        //* oee
        case types.FETCH_OEE_START:

            return {
                ...state,
                isOeeFetching: true
            };

        case types.FETCH_OEE_SUCCESS:

            return {
                ...state,
                isOeeFetching: false,
                oee: action.payload,
            };

        case types.FETCH_OEE_FAILURE:

            return {
                ...state,
                isOeeFetching: false,
                oeeErrorMsg: action.payload
            };

        //* machines
        case types.FETCH_MACHINES_START:

            return {
                ...state,
                isMachineFetching: true
            };

        case types.FETCH_MACHINES_SUCCESS:

            return {
                ...state,
                isMachineFetching: false,
                machineCollection: action.payload,
            };

        case types.FETCH_MACHINES_FAILURE:

            return {
                ...state,
                isMachineFetching: false,
                machinesErrorMsg: action.payload
            };

        //* reason1
        case types.FETCH_REASON1_START:

            return {
                ...state,
                isReason1Fetching: true
            };

        case types.FETCH_REASON1_SUCCESS:

            return {
                ...state,
                isReason1Fetching: false,
                reason1Collection: action.payload,
            };

        case types.FETCH_REASON1_FAILURE:

            return {
                ...state,
                isReason1Fetching: false,
                reason1ErrorMsg: action.payload
            };

        //* reason2
        case types.FETCH_REASON2_START:

            return {
                ...state,
                isReason2Fetching: true
            };

        case types.FETCH_REASON2_SUCCESS:

            return {
                ...state,
                isReason2Fetching: false,
                reason2Collection: action.payload,
            };

        case types.FETCH_REASON2_FAILURE:

            return {
                ...state,
                isReason2Fetching: false,
                reason2ErrorMsg: action.payload
            };

        case types.SET_RECORD:

            return {
                ...state,
                record: action.payload
            };

        case types.SET_SUB_TITLE:

            return {
                ...state,
                subTitle: action.payload
            };


        default:
            return state
    }

}

export default reducer;