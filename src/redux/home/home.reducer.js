import homeActionTypes from './home.types'

const INITIAL_STATE = {
    collapsed: true
}

const homeReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case homeActionTypes.SET_SIDER_COLLAPSED:

            return {
                ...state,
                collapsed: action.payload
            }
    
        default:
            return state;
    }

}

export default homeReducer;