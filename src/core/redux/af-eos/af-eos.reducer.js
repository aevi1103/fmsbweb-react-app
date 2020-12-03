import afEosTypes from './af-eos.types';

const INITIAL_STATE = {
    isDeptLinesFetching: false,
    deptLinesCollection: [],
    deptLinesErrorMsg: undefined,

    isDeptEosFetching: false,
    deptEosResult: null,
    deptEosErrorMsg: undefined,

    isDeptEosCollectionFetching: false,
    deptEosCollectionResult: null,
    deptEosCollectionResultErrorMsg: undefined,

}

const afEosReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case afEosTypes.FETCH_DEPT_LINES_START:
            return {
                ...state,
                isDeptLinesFetching: true
            };

        case afEosTypes.FETCH_DEPT_LINES_SUCCESS:
            return {
                ...state,
                isDeptLinesFetching: false,
                deptLinesCollection: action.payload
            };

        case afEosTypes.FETCH_DEPT_LINES_FAILURE:
            return {
                ...state,
                isDeptLinesFetching: false,
                deptLinesCollection: [],
                deptLinesErrorMsg: action.payload
            };

        case afEosTypes.FETCH_DEPT_EOS_START:
            return {
                ...state,
                isDeptEosFetching: true
            };

        case afEosTypes.FETCH_DEPT_EOS_SUCCESS:
            return {
                ...state,
                isDeptEosFetching: false,
                deptEosResult: action.payload
            };

        case afEosTypes.FETCH_DEPT_EOS_FAILURE:
            return {
                ...state,
                isDeptEosFetching: false,
                deptEosResult: null,
                deptEosErrorMsg: action.payload
            };

        case afEosTypes.SET_DEPT_EOS_RESULT:
            return {
                ...state,
                isDeptEosFetching: false,
                deptEosResult: action.payload
            };

        case afEosTypes.SET_DEPT_EOS_COLLECTION:
            return {
                ...state,
                deptEosCollectionResult: action.payload
            };

        case afEosTypes.FETCH_DEPT_EOS_COLLECTION_START:
            return {
                ...state,
                isDeptEosCollectionFetching: true
            };

        case afEosTypes.FETCH_DEPT_EOS_COLLECTION_SUCCESS:
            return {
                ...state,
                isDeptEosCollectionFetching: false,
                deptEosCollectionResult: action.payload
            };

        case afEosTypes.FETCH_DEPT_EOS_COLLECTION_FAILURE:
            return {
                ...state,
                isDeptEosCollectionFetching: false,
                deptEosCollectionResult: null,
                deptEosCollectionResultErrorMsg: action.payload
            };

        default:
            return state;

    }

}

export default afEosReducer;