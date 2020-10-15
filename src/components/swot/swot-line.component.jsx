import React, { useState } from 'react'

import {
    getContentList
} from './helper'

import { 
    Card,
 } from "antd";

 const SwotLine = ({
     tabList,
     data,
     filters
 }) => {

    const [activeKey, setActiveKey] = useState(tabList[0].key)

    return (
        <Card title={data.line} 
            tabList={tabList} 
            activeTabKey={activeKey}
            onTabChange={key => setActiveKey(key)}>

            {
                getContentList(data, filters)[activeKey]
            }

        </Card>
    )
 }

 export default SwotLine;