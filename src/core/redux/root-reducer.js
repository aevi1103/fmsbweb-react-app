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
import downtimeReducer from './downtime/downtime.reducer'
import performanceLevel0Reducer from './performance-lvl-0/performance-lvl-0.reducer'
import performanceLevel2Reducer from './performance-lvl-2/performance-lvl-2.reducer'

import hourlyProductionReducer from './hourly-production/houlry-production.reducer'

import qualityCheckSheetReducer from './quality-check-sheet/quality-check-sheet.reducer'
import requetsReducer from './requests/requests.reducer'
import errorsReducer from './errors/errors.reducer'

const rootReducer = combineReducers({
    home: homeReducer,
    hourlyProduction: hourlyProductionReducer,
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
    downtime: downtimeReducer,
    performance0: performanceLevel0Reducer,
    performance2: performanceLevel2Reducer,
    errors: errorsReducer
})

export default rootReducer;