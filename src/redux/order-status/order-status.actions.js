import orderStatusTypes from './order-status.types'
import api from '../../API'
import axios from 'axios'
import { fetchStart, fetchSuccess, fetchFailure } from '../../helpers/helpers'
import moment from 'moment'
import UIDGenerator   from 'uid-generator'

export const fetchWorkCenterStartAsync = (area, cancelationToken) => {

    const uidgen = new UIDGenerator(); 

    return async dispatch => {

        dispatch(fetchStart(
            orderStatusTypes.FETCH_WORKCENTER_START))

        const url = `sap/workcenters?area=${area}`;

        api.get(url,{ cancelToken: cancelationToken })
            .then(response => {

                const token = uidgen.generateSync();

                const result = response.data.map(e => ({
                    ...e,
                    url: `sap/odata?line=${e.line}&side=${e.side}&token=${token}`,
                    lastUpdate: `Last Updated at ${moment().format('M/D/YY h:mm:ss A')}`
                }))

                dispatch(fetchSuccess(
                    orderStatusTypes.FETCH_WORKCENTER_SUCCESS,
                    result))

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
