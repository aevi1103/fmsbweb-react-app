import swotTypes from './swot.types'
import api from '../../API'
import moment from 'moment'
import { fetchStart, fetchSuccess, fetchFailure } from '../../helpers/helpers'

export const fetchSwotStartAsync = (values, fnSuccess = () => {}) => {

    return async dispatch => {

        dispatch(fetchStart(swotTypes.FETCH_SWOT_START));

        const { 
            dateRange,
            dept,
            lastDays,
            lastMonths,
            lastWeeks,
            lines,
            showMonthlyCharts,
            showLastSevenDays,
            take
        } = values;

        const dateFormat = 'MM/DD/YYYY';
        const [start, end] = dateRange;
        const startStr = moment(start, dateFormat).format(dateFormat);
        const endStr = moment(end, dateFormat).format(dateFormat)
        const linesStr = lines?.join(',') ?? '';

        let url = `/swot?
            StartDate=${startStr}&
            EndDate=${endStr}&
            ShowMonthlyCharts=${showMonthlyCharts}&
            ShowLastSevenDays=${showLastSevenDays}&
            LastMonths=${lastMonths}&
            LastWeeks=${lastWeeks}&
            LastDays=${lastDays}&
            Take=${take ?? 0}`
            .replace(/\s/g, '');

        url = url + `&Dept=${dept}&Lines=${linesStr}`;

        api.get(url)
            .then(response => {
                dispatch(fetchSuccess(swotTypes.FETCH_SWOT_SUCCESS, response.data));
                fnSuccess()
            })
            .catch(error => {           
                dispatch(fetchFailure(swotTypes.FETCH_SWOT_FAILURE, error.message))
            })

    }
}


export const setDept = dept => ({
    type: swotTypes.SET_DEPT,
    payload: dept
});