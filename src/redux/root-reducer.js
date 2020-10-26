import { combineReducers } from 'redux'

import homeReducer from './home/home.reducer'
import morningMeetingReducer from './morning-meeting/morning-meeting.reducer'
import productionDetailsReducer from './production-details/production-details.reducer'
import afEosReducer from './af-eos/af-eos.reducer'
import qualityCheckSheetReducer from './quality-check-sheet/quality-check-sheet.reducer'
import swotReducer from './swot/swot.reducer'
import requetsReducer from './requests/requests.reducer'
import productionStatusReducer from './production-status/production-status.reducer'

const rootReducer = combineReducers({
    home: homeReducer,
    morningMeeting: morningMeetingReducer,
    productionDetails: productionDetailsReducer,
    afEos: afEosReducer,
    qualityCheckSheet: qualityCheckSheetReducer,
    swot: swotReducer,
    requests: requetsReducer,
    productionStatus: productionStatusReducer
})

export default rootReducer;