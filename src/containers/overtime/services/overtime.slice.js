import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { getOvertimeList } from './api'

export const fetchOvertimeDataList = createAsyncThunk(
    'overtime/fetchOvertimeDataList',
    async (params, {  rejectWithValue, signal }) => {

        try {

            const source = axios.CancelToken.source()

            // cancel request when abnorted
            signal.addEventListener('abort', () => {
                source.cancel()
            })

            const { data } = await getOvertimeList(params, source.token);

            return data;
            
        } catch (err) {
            return rejectWithValue(err.response.data)
        } 

    }
)

const initialState = {
    overtimeCollection: [],
    overtimeByEmployeeCollection: [],
    isLoading: false,
    error: null
}

const overtimeSlice = createSlice({
    name: 'overtime',
    initialState,
    reducers: {
        setOvertimeCollection(state, action) {
            state.overtimeCollection = action.payload
        }
    },
    extraReducers: {
        [fetchOvertimeDataList.pending]: (state, action) => {
            state.isLoading = true;
        },
        [fetchOvertimeDataList.fulfilled]: (state, action) => {
            state.error = null;
            state.isLoading = false;
            state.overtimeCollection = action.payload;
        },
        [fetchOvertimeDataList.rejected]: (state, action) => {
            state.isLoading = false;
            state.error = action.error;
        }
    }
})

export const { setOvertimeCollection } = overtimeSlice.actions;
export default overtimeSlice.reducer;