import morningMeetingTypes from './hourly-production.types';

const INITIAL_STATE = {

    isHourlyProdFetching: false,
    hourlyProduction: null,
    hourlyProdErrorMsg: undefined,
};

const reducer = (state = INITIAL_STATE, action) => {

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
                hourlyProduction: action.payload
            };

        case morningMeetingTypes.FETCH_HOURLY_PROD_FAILURE:

            return {
                ...state,
                isHourlyProdFetching: false,
                hourlyProduction: null,
                hourlyProdErrorMsg: action.payload
            };

    
        default:
            return state;
    }

}

export default reducer;