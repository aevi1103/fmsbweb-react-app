import orderStatusTypes from './order-status.types';

const INITIAL_STATE = {

    isWorkCenterFetching: false,
    workCenterCollection: [],
    workCenterErrorMsg: undefined
}

const orderStatusReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

        //work centers
        case orderStatusTypes.FETCH_WORKCENTER_START:

            return {
                ...state,
                isWorkCenterFetching: true
            }

        case orderStatusTypes.FETCH_WORKCENTER_SUCCESS:

            return {
                ...state,
                isWorkCenterFetching: false,
                workCenterCollection: action.payload
            }

        case orderStatusTypes.FETCH_WORKCENTER_FAILURE:

            return {
                ...state,
                isWorkCenterFetching: false,
                workCenterErrorMsg: action.payload
            }
    
        default:
            return state;
    }

}

export default orderStatusReducer;