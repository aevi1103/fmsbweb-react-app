import http from '../../../core/utilities/api'
import { message } from 'antd'

export const getOvertimeList = async (parameters, cancelToken) => {

    const url = `overtime`
    const key = 'overtimeLoading'

    try {

        message.loading({ content: 'Loading...', key, duration: 0 })

        const response = await http.get(url, {
            cancelToken,
            params: parameters
        })

        message.success({ content: `Data successfully loaded!`, key, duration: 2 });

        return response;
        
    } catch (error) {

        const errMsg = error?.request?.response ?? 'Something went wrong while updating the record!';
        message.error({ content: errMsg, duration: 5, key })
        
    }

}

export const AddOrUpdate = (params) => {

    const url = `overtime`
    const key = 'overtimeAddOrUpdateLoading'

    try {

        message.loading({ content: 'Updating record...', key, duration: 0 })

        const response = http.post(url, params)

        message.success({ content: `Record successfully updated!`, key, duration: 2 });

        return response;
        
    } catch (error) {

        const errMsg = error?.request?.response ?? 'Something went wrong while updating the record!';
        message.error({ content: errMsg, duration: 5, key })
        
    }

}

export const deleteRecord = (id) => {

    const key = 'overtimeDeleteLoading'

    try {

        message.loading({ content: 'Deleting record...', key, duration: 0 })

        const response = http.delete(`overtime/${id}`)

        message.success({ content: `Record successfully deleted!`, key, duration: 2 });

        return response;
        
    } catch (error) {

        const errMsg = error?.request?.response ?? 'Something went wrong while updating the record!';
        message.error({ content: errMsg, duration: 5, key })
        
    }

}