import moment from 'moment'
import api from '../../../core/utilities/api'
import { longDateFormat } from '../../../core/utilities/helpers'

export const fetchData = async (params) => {

    const { start, end } = params;
    const startIso = moment(start, longDateFormat).toISOString();
    const endIso = moment(end, longDateFormat).toISOString();

    const response = api.get(`/projecttracker?$filter=dateTimeRequested ge ${startIso} and dateTimeRequested le ${endIso}&$expand=createHxH($expand=department($select=deptName),machines($select=machineName))&$orderby=dateTimeRequested desc`)
 
    return response;

}

export const postData = async (params) => {
    const response = api.post(`/projecttracker`, params)
    return response;
}

export const deleteData = async (id) => {
    const response = api.delete(`/projecttracker/${id}`)
    return response;
}