import swotTypes from './swot.types'

const INITIAL_STATE = {
    isSwotFetching: false,
    swotCollection: [],
    swotErrorMsg: null,
    dept: null
}

const swotReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case swotTypes.FETCH_SWOT_START:

            return {
                ...state,
                swotErrorMsg: null,
                isSwotFetching: true
            }

        case swotTypes.FETCH_SWOT_SUCCESS:

            return {
                ...state,
                isSwotFetching: false,  
                swotCollection: action.payload
            }

        case swotTypes.FETCH_SWOT_FAILURE:

            return {
                ...state,
                isSwotFetching: false,
                swotErrorMsg: action.payload
            }

        case swotTypes.SET_DEPT:

            return {
                ...state,
                dept: action.payload
            }
    
        default:
            return state;
    }

}

export default swotReducer