import types from './performance-lvl-2.types'

const INITIAL_STATE = {
    isScrapVarianceByDeptFetching: false,
    scrapVarianceByDeptCollection: null,
    scrapVarianceByDeptErrorMsg: undefined,

    isScrapVarianceByShiftFetching: false,
    scrapVarianceByShiftCollection: null,
    scrapVarianceByShiftErrorMsg: undefined,

    isOvertimeQuarterFetching: false,
    overtimeQuarterCollection: [],
    overtimeQuarterErrorMsg: undefined,

    isOvertimeShiftFetching: false,
    overtimeShiftCollection: [],
    overtimeShiftErrorMsg: undefined,
}

const reducer = (state = INITIAL_STATE, action) => { 

    switch (action.type) {

        //* scrap variance per dept
        case types.FETCH_SCRAP_VARIANCE_BY_DEPT_START:

            return {
                ...state,
                isScrapVarianceByDeptFetching: true
            };

        case types.FETCH_SCRAP_VARIANCE_BY_DEPT_SUCCESS:

            return {
                ...state,
                isScrapVarianceByDeptFetching: false,
                scrapVarianceByDeptCollection: action.payload
            };

        case types.FETCH_SCRAP_VARIANCE_BY_DEPT_FAILURE:

            return {
                ...state,
                isScrapVarianceByDeptFetching: false,
                scrapVarianceByDeptCollection: null,
                scrapVarianceByDeptErrorMsg: action.payload
            };

        //* scrap variance per shift
        case types.FETCH_SCRAP_VARIANCE_BY_SHIFT_START:

            return {
                ...state,
                isScrapVarianceByShiftFetching: true
            };

        case types.FETCH_SCRAP_VARIANCE_BY_SHIFT_SUCCESS:

            return {
                ...state,
                isScrapVarianceByShiftFetching: false,
                scrapVarianceByShiftCollection: action.payload
            };

        case types.FETCH_SCRAP_VARIANCE_BY_SHIFT_FAILURE:

            return {
                ...state,
                isScrapVarianceByShiftFetching: false,
                scrapVarianceByShiftCollection: null,
                scrapVarianceByShiftErrorMsg: action.payload
            };

        //* overtime quarter
        case types.FETCH_OVERTIME_QUARTER_START:

            return {
                ...state,
                isOvertimeQuarterFetching: true
            };

        case types.FETCH_OVERTIME_QUARTER_SUCCESS:

            return {
                ...state,
                isOvertimeQuarterFetching: false,
                overtimeQuarterCollection: action.payload
            };

        case types.FETCH_OVERTIME_QUARTER_FAILURE:

            return {
                ...state,
                isOvertimeQuarterFetching: false,
                overtimeQuarterErrorMsg: action.payload
            };

            
        //* overtime by shift
        case types.FETCH_OVERTIME_SHIFT_START:

            return {
                ...state,
                isOvertimeShiftFetching: true
            };

        case types.FETCH_OVERTIME_SHIFT_SUCCESS:

            return {
                ...state,
                isOvertimeShiftFetching: false,
                overtimeShiftCollection: action.payload
            };

        case types.FETCH_OVERTIME_SHIFT_FAILURE:

            return {
                ...state,
                isOvertimeShiftFetching: false,
                overtimeShiftErrorMsg: action.payload
            };
    
        default:
            return state
    }

}

export default reducer;