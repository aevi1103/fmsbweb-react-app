import { combineReducers } from 'redux'

import homeReducer from './home/home.reducer'
import swotReducer from './swot/swot.reducer'
import productionStatusReducer from './production-status/production-status.reducer'
import productionDetailsReducer from './production-details/production-details.reducer'
import afEosReducer from './af-eos/af-eos.reducer'
import departmentDashboardReducer from './department-dashboard/department-dashboard.reducer'
import safetyreducer from './safety/safety.reducer'
import qualityReducer from './quality/quaity.reducer'
import logisticsReducer from './logistics/logistics.reducer'
import financeReducer from './finance/finance.reducer'

import morningMeetingReducer from './morning-meeting/morning-meeting.reducer'

import qualityCheckSheetReducer from './quality-check-sheet/quality-check-sheet.reducer'
import requetsReducer from './requests/requests.reducer'
import errorsReducer from './errors/errors.reducer'

const rootReducer = combineReducers({
    home: homeReducer,
    morningMeeting: morningMeetingReducer,
    productionDetails: productionDetailsReducer,
    afEos: afEosReducer,
    qualityCheckSheet: qualityCheckSheetReducer,
    swot: swotReducer,
    requests: requetsReducer,
    productionStatus: productionStatusReducer,
    departmentDashboard: departmentDashboardReducer,
    safety: safetyreducer,
    quality: qualityReducer,
    logistics: logisticsReducer,
    finance: financeReducer,
    errors: errorsReducer
})

export default rootReducer;