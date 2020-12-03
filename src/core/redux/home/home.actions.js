import homeActionTypes from './home.types'

export const setSiderCollapse = collapsed => ({
    type: homeActionTypes.SET_SIDER_COLLAPSED,
    payload: collapsed
})