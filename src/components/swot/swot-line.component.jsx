import React, { useState } from 'react'

import {
    getContentList
} from './helper'

import { 
    Card,
 } from "antd";

 const SwotLine = ({
     tabList,
     data
 }) => {

    const [activeKey, setActiveKey] = useState(tabList[0].key)

    return (
        <Card title={data.line} 
            tabList={tabList} 
            activeTabKey={activeKey}
            onTabChange={key => setActiveKey(key)}>

            {
                getContentList(data)[activeKey]
            }

        </Card>
    )
 }

 export default SwotLine;