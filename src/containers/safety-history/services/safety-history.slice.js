import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { getIncidents } from './api'

export const fetchIncidents = createAsyncThunk(
    'incidents/fetchIncidents',
    async (params, {  rejectWithValue, signal }) => {

        try {

            const source = axios.CancelToken.source()
            signal.addEventListener('abort', () => source.cancel())
            const { data } = await getIncidents(params, source.token);
            return data;
            
        } catch (err) {
            return rejectWithValue(err.response.data)
        } 

    }
)

const initialState = {
    incidents: [],
    isLoading: false,
    error: null,

    departments: [],
    bodyParts: [],
    injuries: [],
    status: [],

}

const safetyHistorySlice = createSlice({
    name: 'safetyHistory',
    initialState,
    reducers: {
        setDropdowns(state, action) {

            const { departments, bodyParts, injuries, status } = action.payload;
            state.departments = departments;
            state.bodyParts = bodyParts;
            state.injuries = injuries;
            state.status = status;

        }
    },
    extraReducers: {
        [fetchIncidents.pending]: (state, action) => {
            state.isLoading = true;
        },
        [fetchIncidents.fulfilled]: (state, action) => {
            state.error = null;
            state.isLoading = false;
            state.incidents = action.payload;
        },
        [fetchIncidents.rejected]: (state, action) => {
            state.isLoading = false;
            state.error = action.error;
        }
    }
})

export const { setDropdowns } = safetyHistorySlice.actions;
export default safetyHistorySlice.reducer;