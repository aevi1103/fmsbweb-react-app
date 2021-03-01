import http from '../../../core/utilities/api'
import moment from 'moment'
import { fetchIncidents } from './safety-history.slice'
import { longDateFormat } from '../../../core/utilities/helpers'
import { message } from 'antd'

export const getIncidents = async (parameters, cancelToken) => {

    const url = `safety`
    const response = await http.get(url, {
        cancelToken,
        params: parameters
    })

    message.success({ content: `Data successfully loaded!`, duration: 2 });
    return response;

}

export const dispatchIncidentsQry = (params, dispatch) => {

    const { department, range } = params;

    const [start, end] = range;
    const startDateIso = moment(start.startOf('day').format(longDateFormat), longDateFormat).toISOString()
    const endDateIso = moment(end.endOf('day').format(longDateFormat), longDateFormat).toISOString()

    const expandQry = `BodyPart($select=BodyPart1),Injury($select=InjuryName)`
    const dateRangeFilter = `accidentDate ge ${startDateIso} and accidentDate le ${endDateIso}`
    const deptFilter = `and dept eq '${department}'`
    const filterQry = `${dateRangeFilter} ${department ? deptFilter : ''}`

    dispatch(fetchIncidents({
        '$expand': expandQry,
        '$filter': filterQry,
        '$orderby': `accidentDate desc`
    }))

}