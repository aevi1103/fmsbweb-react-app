import fileDownload from 'js-file-download'
import api from '../../../core/utilities/api'
import {
    message
} from 'antd'

export const download = async (
    setDownloadLoading,
    scrapVariancePerProgScrapType,
    performaceSelectedDepartment,
    startDate,
    endDate,
    monthStartFormart,
    monthEndFormat
) => {

    try {    

        setDownloadLoading(true);

        const isPurchasedScrap = scrapVariancePerProgScrapType === 'SB' ? false : true;
        const isPlantTotal = performaceSelectedDepartment === 'Plant' ? true : false;
        const response = await api.get(`/exports/performance/level/0?start=${startDate}&end=${endDate}
                                        &area=${performaceSelectedDepartment}
                                        &isPurchasedScrap=${isPurchasedScrap}
                                        &isPlantTotal=${isPlantTotal}
                                        &monthStart=${monthStartFormart}&monthEnd=${monthEndFormat}`, {
            responseType: 'blob',
        });

        const fileName = `${performaceSelectedDepartment.toUpperCase()}_PERFORMANCE_LVL0&1_DATA_EXPORT_${new Date().getTime()}.xlsx`
        fileDownload(response.data, fileName);

        message.success('Data successfully exported!', 10);
        setDownloadLoading(false);

    } catch (error) {
        console.erro(error)
    } finally {
        setDownloadLoading(false);
    }
}