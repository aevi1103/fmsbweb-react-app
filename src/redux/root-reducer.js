import { combineReducers } from 'redux'

import homeReducer from './home/home.reducer'
import morningMeetingReducer from './morning-meeting/morning-meeting.reducer'

const rootReducer = combineReducers({
    home: homeReducer,
    morningMeeting: morningMeetingReducer
})

export default rootReducer;