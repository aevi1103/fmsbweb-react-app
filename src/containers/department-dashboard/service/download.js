import fileDownload from 'js-file-download'
import api from '../../../core/utilities/api'
import {
    message
} from 'antd'

const download = async (start, end, area, 
    setDownloadLoading,
    setDownloadError,
    downloadError) => {

    try {    

        setDownloadLoading(true);
        const response = await api.get(`/exports/department?start=${start}&end=${end}&area=${area}`, {
            responseType: 'blob',
        });

        const fileName = `${area.toUpperCase()}_DATAEXPORT_${start}_to_${end}.xlsx`
        fileDownload(response.data, fileName);

        message.success('Data successfully exported!', 10);

    } catch (error) {
        setDownloadError(error);
        setDownloadLoading(false);
        message.error(error);
    } finally {
        if (!downloadError) {
            setDownloadLoading(false);
        }
    }

}

export default download;