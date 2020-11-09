import React, { useState } from 'react'
import numeral from 'numeral'
import moment from 'moment'
import fileDownload from 'js-file-download'
import api from '../../API'

import {
    getContentList,
    colorCodes
} from './helper'

import { 
    Card,
    Typography,
    Tooltip, 
    Button,
    message
 } from "antd";

 import { 
    ArrowDownOutlined,
    ArrowUpOutlined,
    DownloadOutlined
} from '@ant-design/icons';

 const { Text } = Typography;
 const dateFormat = 'MM/DD/YYYY'

 const SwotLine = ({
     tabList,
     data,
     filters
 }) => {

    const [activeKey, setActiveKey] = useState(tabList[0].key)
    const { oae, net, swotTarget, line } = data || {};
    const { oaeTarget } = swotTarget || {};
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

    const [download, setDownload] = useState(false)

    const style = {
        color: oae < oaeTarget ? colorCodes.red : colorCodes.green
    }

    const onDownload = async () => {

        try {

            setDownload(true);

            const startStr = moment(startDate).format(dateFormat);
            const endStr = moment(endDate).format(dateFormat);

            let url = `/exports/swot?
                StartDate=${startStr}&
                EndDate=${endStr}&
                ShowMonthlyCharts=${showMonthlyCharts}&
                ShowLastSevenDays=${showLastSevenDays}&
                LastMonths=${lastMonths}&
                LastWeeks=${lastWeeks}&
                LastDays=${lastDays}&
                Take=${0}`
                .replace(/\s/g, '');

            url = url + `&Dept=${dept}&Lines=${line}`;

            const response = await api.get(url, {
                responseType: 'blob',
            });

            const fileName = `${line} SWOT EXPORT (${moment(startDate).format('M.D.YY')}-${moment(endDate).format('M.D.YY')}).xlsx`
            fileDownload(response.data, fileName);

            message.success('Data successfully exported!', 10);
            
        } catch (error) {
            alert('something went wrong!')
        } finally {
            setDownload(false);
        }

    }

    const title = (<>
                        <Tooltip title={`Date Range: ${moment(startDate).format(dateFormat)} - ${moment(endDate).format(dateFormat)}`}>
                            <Text style={style}>{line}: OAE: <span className="mr1">{numeral(oae).format('0%')} ~ {numeral(net).format('0,0')}</span> 
                            {oae < oaeTarget ? <ArrowDownOutlined /> : <ArrowUpOutlined />}</Text>
                        </Tooltip>
                        <Button className="ml2" type="primary" onClick={onDownload} loading={download}>
                            <DownloadOutlined /> Download
                        </Button>
                    </>)

    return (
        <Card title={title} 
            tabList={tabList} 
            activeTabKey={activeKey}
            onTabChange={key => setActiveKey(key)}
            extra={<Text strong>Target OAE: {numeral(oaeTarget).format('0%')}</Text>}>

            {
                getContentList(data, filters)[activeKey]
            }

        </Card>
    )
 }

 export default SwotLine;