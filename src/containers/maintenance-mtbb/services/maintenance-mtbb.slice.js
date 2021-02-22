import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { getData } from './api'

export const fetchData = createAsyncThunk(
    'maintenanceMtbb/fetchData',
    async (params, {  rejectWithValue, signal }) => {

        try {

            const source = axios.CancelToken.source()

            // cancel request when abnorted
            signal.addEventListener('abort', () => {
                source.cancel()
            })

            const { data } = await getData(params, source.token);

            return data;
            
        } catch (err) {
            return rejectWithValue(err.response.data)
        } 

    }
)

const initialState = {
    mtbbCollection: [],
    dates: [],
    isLoading: false,
    error: null
}

const maintenanceMtbbSlice = createSlice({
    name: 'maintenanceMtbb',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchData.pending]: (state, action) => {
            state.isLoading = true;
        },
        [fetchData.fulfilled]: (state, action) => {

            const { dates, summary } = action.payload;

            state.error = null;
            state.isLoading = false;
            state.mtbbCollection = summary;
            state.dates = dates;

        },
        [fetchData.rejected]: (state, action) => {
            state.isLoading = false;
            state.error = action.error;
        }
    }
})

export default maintenanceMtbbSlice.reducer;