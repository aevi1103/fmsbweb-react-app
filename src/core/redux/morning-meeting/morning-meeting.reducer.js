import morningMeetingTypes from './morning-meeting.types';

const INITIAL_STATE = {

    isHourlyProdFetching: false,
    hourlyProdCollection: null,
    hourlyProdErrorMsg: undefined,
};

const morningMeetingReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

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