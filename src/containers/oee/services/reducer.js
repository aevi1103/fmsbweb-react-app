export const initialState = {
    loading: false,
    oee: null,
    line: null,
    primaryReason: [],
    subTitle: null,

    counterConnection: null,
    downtimeConnection: null, 
    scrapConnection: null, 

    startLoading: false,
    startButtonDisabled: false
}

export const reducer = (state = initialState, action) => {

    switch (action.type) {

        case 'SET_LOADING':
            return { ...state,  loading: action.payload }

        case 'SET_OEE':
            return { ...state,  oee: action.payload }

        case 'SET_LINE':
            return { ...state,  line: action.payload }

        case 'SET_PRIMARY_REASON':
            return { ...state,  primaryReason: action.payload }

        case 'SET_SUB_TITLE':
            return { ...state,  subTitle: action.payload }

        case 'SET_COUNTER_CONN':
            return { ...state,  counterConnection: action.payload }

        case 'SET_DOWNTIME_CONN':
            return { ...state,  downtimeConnection: action.payload }

        case 'SET_SCRAP_CONN':
            return { ...state,  scrapConnection: action.payload }

        case 'SET_START_LOADING':
            return { ...state,  startLoading: action.payload }

        case 'SET_START_BUTTON_DISABLE':
            return { ...state,  startButtonDisabled: action.payload }



        default:
            return state;
    }

}
