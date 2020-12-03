import morningMeetingTypes from './morning-meeting.types';

import moment from 'moment';

const dateFormat = 'MM/DD/YYYY';
const previousDay = moment().add(-1, 'd');
const previousDayFormatted = previousDay.format(dateFormat);

const INITIAL_STATE = {

    isScrapVarianceByDeptFetching: false,
    scrapVarianceByDeptCollection: null,
    scrapVarianceByDeptErrorMsg: undefined,

    isScrapVarianceByShiftFetching: false,
    scrapVarianceByShiftCollection: null,
    scrapVarianceByShiftErrorMsg: undefined,

    isOvertimePercentPerDeptFetching: false,
    overtimePercentperDeptCollection: null,
    overtimePercentPerDeptErrorMsg: undefined,

    isOvertimePercentPerShiftFetching: false,
    overtimePercentperShiftCollection: null,
    overtimePercentPerShiftErrorMsg: undefined,


    isHourlyProdFetching: false,
    hourlyProdCollection: null,
    hourlyProdErrorMsg: undefined,

    startDate: previousDayFormatted,
    endDate: previousDayFormatted,

    ppmhChartType: 'ppmhByShift',

    
};

const morningMeetingReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

        //scrap variance per dept
        case morningMeetingTypes.FETCH_SCRAP_VARIANCE_BY_DEPT_START:

            return {
                ...state,
                isScrapVarianceByDeptFetching: true
            };

        case morningMeetingTypes.FETCH_SCRAP_VARIANCE_BY_DEPT_SUCCESS:

            return {
                ...state,
                isScrapVarianceByDeptFetching: false,
                scrapVarianceByDeptCollection: action.payload
            };

        case morningMeetingTypes.FETCH_SCRAP_VARIANCE_BY_DEPT_FAILURE:

            return {
                ...state,
                isScrapVarianceByDeptFetching: false,
                scrapVarianceByDeptCollection: null,
                scrapVarianceByDeptErrorMsg: action.payload
            };

        //scrap variance per shift
        case morningMeetingTypes.FETCH_SCRAP_VARIANCE_BY_SHIFT_START:

            return {
                ...state,
                isScrapVarianceByShiftFetching: true
            };

        case morningMeetingTypes.FETCH_SCRAP_VARIANCE_BY_SHIFT_SUCCESS:

            return {
                ...state,
                isScrapVarianceByShiftFetching: false,
                scrapVarianceByShiftCollection: action.payload
            };

        case morningMeetingTypes.FETCH_SCRAP_VARIANCE_BY_SHIFT_FAILURE:

            return {
                ...state,
                isScrapVarianceByShiftFetching: false,
                scrapVarianceByShiftCollection: null,
                scrapVarianceByShiftErrorMsg: action.payload
            };

        //overtime percent per dept
        case morningMeetingTypes.FETCH_OVERTIME_PERCENT_PER_DEPT_START:

            return {
                ...state,
                isOvertimePercentPerDeptFetching: true
            };

        case morningMeetingTypes.FETCH_OVERTIME_PERCENT_PER_DEPT_SUCCESS:

            return {
                ...state,
                isOvertimePercentPerDeptFetching: false,
                overtimePercentperDeptCollection: action.payload
            };

        case morningMeetingTypes.FETCH_OVERTIME_PERCENT_PER_DEPT_FAILURE:

            return {
                ...state,
                isOvertimePercentPerDeptFetching: false,
                overtimePercentperDeptCollection: null,
                overtimePercentPerDeptErrorMsg: action.payload
            };

        //overtime percent per shift
        case morningMeetingTypes.FETCH_OVERTIME_PERCENT_PER_SHIFT_START:

            return {
                ...state,
                isOvertimePercentPerShiftFetching: true
            };

        case morningMeetingTypes.FETCH_OVERTIME_PERCENT_PER_SHIFT_SUCCESS:

            return {
                ...state,
                isOvertimePercentPerShiftFetching: false,
                overtimePercentperShiftCollection: action.payload
            };

        case morningMeetingTypes.FETCH_OVERTIME_PERCENT_PER_SHIFT_FAILURE:

            return {
                ...state,
                isOvertimePercentPerShiftFetching: false,
                overtimePercentperShiftCollection: null,
                overtimePercentPerShiftErrorMsg: action.payload
            };

        //set dates
        case morningMeetingTypes.SET_PRODUCTION_START_DATE:

            return {
                ...state,
                startDate: action.payload
            };

        case morningMeetingTypes.SET_PRODUCTION_END_DATE:

            return {
                ...state,
                endDate: action.payload
            };

        //ppmh chart type
        case morningMeetingTypes.SET_PPMH_CHART_TYPE:

            return {
                ...state,
                ppmhChartType: action.payload
            };

        //hourly prod
        case morningMeetingTypes.FETCH_HOURLY_PROD_START:

            return {
                ...state,
                isHourlyProdFetching: true,
            };

        case morningMeetingTypes.FETCH_HOURLY_PROD_SUCCESS:

            return {
                ...state,
                isHourlyProdFetching: false,
                hourlyProdCollection: action.payload
            };

        case morningMeetingTypes.FETCH_HOURLY_PROD_FAILURE:

            return {
                ...state,
                isHourlyProdFetching: false,
                hourlyProdCollection: null,
                hourlyProdErrorMsg: action.payload
            };

    
        default:
            return state;
    }

}

export default morningMeetingReducer;