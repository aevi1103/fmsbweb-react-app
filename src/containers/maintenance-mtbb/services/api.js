import http from '../../../core/utilities/api'
import { message } from 'antd'

export const getData = async (parameters, cancelToken) => {

    const url = `maintenancealert`
    const key = 'maintenanceLoading'

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