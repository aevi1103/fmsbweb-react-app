import types from './errors.types'

const INITIAL_STATE = {
    errorCollection: []
}

const errorsReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case types.SET_ERRORS:

            return {
                ...state,
                errorCollection: action.payload
            }

        default:
            return state;
    }

}

export default errorsReducer