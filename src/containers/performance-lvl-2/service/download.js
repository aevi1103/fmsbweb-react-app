import fileDownload from 'js-file-download'
import api from '../../../core/utilities/api'

import {
    message
} from 'antd'

export const download = async (
    setDownloadLoading,
    scrapType,
    startDate,
    endDate,
    monthStartFormart,
    monthEndFormat,
    department
) => {

    try {    

        setDownloadLoading(true);
        const isPurchasedScrap = scrapType === 'SB' ? false : true;
        const response = await api.get(`/exports/performance/level/2?start=${startDate}&end=${endDate}
                                        &area=${department}
                                        &isPurchasedScrap=${isPurchasedScrap}
                                        &monthStart=${monthStartFormart}&monthEnd=${monthEndFormat}`, {
            responseType: 'blob',
        });

        const fileName = `${department.toUpperCase()}_PERFORMANCE_LVL1&2_DATA_EXPORT_${new Date().getTime()}.xlsx`
        fileDownload(response.data, fileName);

        message.success('Data successfully exported!', 10);
        setDownloadLoading(false);

    } catch (error) {
    } finally {
        setDownloadLoading(false);
    }

}