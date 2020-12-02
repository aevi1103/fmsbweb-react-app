import types from './quality.types'

const INITIAL_STATE = {
    isQualityFetching: false,
    qualityCollection: null,
    qualityErrorMsg: undefined,
}

const reducer = (state = INITIAL_STATE, action) => { 

    switch (action.type) {

        case types.FETCH_QUALITY_START:

            return {
                ...state,
                isQualityFetching: true
            };

        case types.FETCH_QUALITY_SUCCESS:

            return {
                ...state,
                isQualityFetching: false,
                qualityCollection: action.payload
            };

        case types.FETCH_QUALITY_FAILURE:

            return {
                ...state,
                isQualityFetching: false,
                qualityCollection: null,
                qualityErrorMsg: action.payload
            };
    
        default:
            return state
    }

}

export default reducer;