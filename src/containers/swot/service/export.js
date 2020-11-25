import moment from 'moment'
import api from '../../../core/utilities/api'
import fileDownload from 'js-file-download'

import {
    message
} from 'antd'

const dateFormat = 'MM/DD/YYYY'

export const exportData = async (filters, setDownload, line, isDepartment = false) => {

    const { 
        startDate,
        endDate,
        showMonthlyCharts,
        showLastSevenDays,
        lastMonths,
        lastWeeks,
        lastDays,
        dept
    } = filters;

    try {

        setDownload(true);

        const startStr = moment(startDate).format(dateFormat);
        const endStr = moment(endDate).format(dateFormat);

        let url = `/exports/swot${isDepartment ? '/dept' : ''}?
            StartDate=${startStr}&
            EndDate=${endStr}&
            ShowMonthlyCharts=${showMonthlyCharts}&
            ShowLastSevenDays=${showLastSevenDays}&
            LastMonths=${lastMonths}&
            LastWeeks=${lastWeeks}&
            LastDays=${lastDays}&
            Take=${0}`
            .replace(/\s/g, '');

        if (!isDepartment) {
            url = url + `&Dept=${dept}&Lines=${line}`;
        } else {
            url = url + `&Dept=${dept}`;
        }
        
        const response = await api.get(url, {
            responseType: 'blob',
        });

        const fileName = !isDepartment 
            ? `${line} SWOT EXPORT (${moment(startDate).format('M.D.YY')}-${moment(endDate).format('M.D.YY')}).xlsx`
            : `${dept} SWOT EXPORT (${moment(startDate).format('M.D.YY')}-${moment(endDate).format('M.D.YY')}).xlsx`

        fileDownload(response.data, fileName);

        message.success('Data successfully exported!', 10);
        
    } catch (error) {
        alert('something went wrong!')
    } finally {
        setDownload(false);
    }

}