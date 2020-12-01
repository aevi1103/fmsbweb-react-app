import types from './errors.types'


export const setErrors = errors => ({
    type: types.SET_ERRORS,
    payload: errors
})