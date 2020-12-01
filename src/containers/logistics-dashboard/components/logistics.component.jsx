import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import StockOverviewTable from './stock-overview-table.component'
import StockOverviewChart from './stock-overview-chart.component'
import StockOverViewSlocChart from './stock-overview-sloc-chart.component'

import InventoryStatusTable from './inventory-status-table.component'
import InventoryStatusChart from './inventory-status-chart.component'

import InventoryCost from './inventory-cost-table.component'
import InventoryCostChart from './inventory-cost-chart.component'

import DaysOnHandTable from './days-on-hand-table/days-on-hand-table.component'
import DaysOnHandTableChart from './days-on-hand-chart.component' 

import CustomerCommentsTable from './customer-comments-table'
import ProductionOrder from '../../production-order-file-upload/components/production-order.component'

import { 
    Row,
    Col,
    Card,
    Tag
 } from "antd";

const cardHeightStyle = {
    height: "100%"
}

const tabListNoTitle = [
    {
        tab: 'Days On Hand',
        key: 'doh',
    },
    {
        tab: 'Production Order',
        key: 'order',
    },
    {
        tab: 'Stock Overview By Location',
        key: 'sloc',
    },
    {
        tab: 'Stock Overview',
        key: 'overview',
    },
    {
        tab: 'Stock Overview by Program',
        key: 'prog',
    },
  ];

  const contentListNoTitle = {
    doh: <>
            <div className="mb2">
                <Tag className="pa1" color="#e33545">DOH is between 0 and 2</Tag>
                <Tag className="pa1" color="#ffc107">DOH is between 2 and 3</Tag>
                <Tag className="pa1" color="#28a745">DOH is between 3 and 5</Tag>
                <Tag className="pa1" color="#2196F3">DOH is greater than 5</Tag>
            </div>

            <DaysOnHandTableChart/>
            <DaysOnHandTable/>
         </>,
    sloc: <div className="ma2">
                <StockOverViewSlocChart/>
            </div>,
    overview: <StockOverviewTable/>,
    prog: <StockOverviewChart/>,
    order: <ProductionOrder />
  };

const Logistics = () => {

    const customerLoading = useSelector(({ morningMeeting: { isStockStatusFetching } }) => isStockStatusFetching) || false;
    const customerComments = useSelector(({ morningMeeting: { stockStatusCollection } }) => stockStatusCollection.customerComments) || [];

    const [tabKey, setTabKey] = useState('doh')

    return (
        <Row gutter={[12,12]}>

            <Col span={8} lg={8} md={24} xs={24}>
                <Card 
                    title="Inventory Status"
                    size="small"
                    className="ba b--black-10"
                    style={cardHeightStyle}
                >
                    <InventoryStatusChart/>
                    <InventoryStatusTable/>
                </Card>
            </Col>

            <Col span={8} lg={8} md={24} xs={24}>
                <Card 
                    title="Inventory Cost"
                    size="small"
                    className="ba b--black-10"
                    style={cardHeightStyle}
                    extra={
                        <Link to="/dashboard/morningmeeting/logistics/settings/cost/targets" >Adjust Targets</Link>
                    }
                >
                    <InventoryCostChart />
                    <InventoryCost/>
                </Card>
            </Col>

            <Col span={8} lg={8} md={24} xs={24}>
                <Card 
                    title="Comments"
                    size="small"
                    className="ba b--black-10"
                    style={cardHeightStyle}
                >
                    <CustomerCommentsTable customerComments={customerComments} loading={customerLoading} />
                </Card>
            </Col>

            <Col span={24}>

                <Card
                    size="small"
                    tabList={tabListNoTitle}
                    tabProps={{
                        size: 'small'
                    }}
                    activeTabKey={tabKey}
                    onTabChange={key => setTabKey(key)}
                    >
                        { contentListNoTitle[tabKey] }
                </Card>
                
            </Col>

        </Row>
    )

 }


export default Logistics; 