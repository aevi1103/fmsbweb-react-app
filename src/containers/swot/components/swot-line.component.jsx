import React, { useState } from 'react'
import numeral from 'numeral'
import moment from 'moment'
import { exportData } from '../service/export'

import {
    getContentList,
    colorCodes
} from '../service/helper'

import { 
    Card,
    Typography,
    Tooltip, 
    Button
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
        endDate
    } = filters;

    const [download, setDownload] = useState(false)

    const style = {
        color: oae < oaeTarget ? colorCodes.red : colorCodes.green
    }

    const onDownload = () => exportData(filters, setDownload, line);

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