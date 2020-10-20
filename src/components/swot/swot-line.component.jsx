import React, { useState } from 'react'
import numeral from 'numeral'
import moment from 'moment'
import {
    getContentList,
    colorCodes
} from './helper'

import { 
    Card,
    Typography,
    Tooltip 
 } from "antd";

 import { 
    ArrowDownOutlined,
    ArrowUpOutlined 
} from '@ant-design/icons';

 const { Text } = Typography;
 const dateFormat = 'MM/DD/YY'

 const SwotLine = ({
     tabList,
     data,
     filters
 }) => {

    const [activeKey, setActiveKey] = useState(tabList[0].key)
    const { oae, net, swotTarget } = data || {};
    const { oaeTarget } = swotTarget || {};
    const { startDate, endDate } = filters;

    const style = {
        color: oae < oaeTarget ? colorCodes.red : colorCodes.green
    }

const title = (<Tooltip title={`Date Range: ${moment(startDate).format(dateFormat)} - ${moment(endDate).format(dateFormat)}`}>
                    <Text style={style}>{data.line}: SAP OAE: <span className="mr1">{numeral(oae).format('0%')} ~ {numeral(net).format('0,0')}</span> 
                    {oae < oaeTarget ? <ArrowDownOutlined /> : <ArrowUpOutlined />}</Text>
                </Tooltip>)

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