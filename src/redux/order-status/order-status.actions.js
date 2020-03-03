import orderStatusTypes from './order-status.types'
import api from '../../API'
import axios from 'axios'
import { fetchStart, fetchSuccess, fetchFailure } from '../../helpers/helpers'

export const fetchWorkCenterStartAsync = (area, cancelationToken) => {

    return dispatch => {

        dispatch(fetchStart(
            orderStatusTypes.FETCH_WORKCENTER_START))

        const url = `sap/workcenters?area=${area}`;

        api.get(url,{
            cancelToken: cancelationToken
          })
            .then(response => {

                dispatch(fetchSuccess(
                    orderStatusTypes.FETCH_WORKCENTER_SUCCESS,
                    response.data))

            })
            .catch(error => {
                
                dispatch(fetchFailure(
                    orderStatusTypes.FETCH_WORKCENTER_FAILURE,
                    error.message))

                    if (axios.isCancel(error)) {
                        console.error('Request canceled', url, error.message);
                    } else {
                        console.error('sopmething else', url, error.message)
                    }
            })

    }
}
