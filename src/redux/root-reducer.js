import { combineReducers } from 'redux'

import homeReducer from './home/home.reducer'
import morningMeetingReducer from './morning-meeting/morning-meeting.reducer'
import productionDetailsReducer from './production-details/production-details.reducer'
import orderStatusReducer from './order-status/order-status.reducer'
import afEosReducer from './af-eos/af-eos.reducer'
import qualityCheckSheetReducer from './quality-check-sheet/quality-check-sheet.reducer'

const rootReducer = combineReducers({
    home: homeReducer,
    morningMeeting: morningMeetingReducer,
    productionDetails: productionDetailsReducer,
    orderStatus: orderStatusReducer,
    afEos: afEosReducer,
    qualityCheckSheet: qualityCheckSheetReducer
})

export default rootReducer;