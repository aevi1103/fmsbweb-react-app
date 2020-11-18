import React from 'react';
import { Link } from 'react-router-dom'

import StockOverviewTable from './stock-overview-table/stock-overview-table.component'
import StockOverviewChart from './stock-overview-chart/stock-overview-chart.component'
import StockOverViewSlocChart from './stock-overview-sloc-chart/stock-overview-sloc-chart.component'

import InventoryStatusTable from './inventory-status/inventory-status-table.component'
import InventoryStatusChart from './inventory-status/inventory-status-chart.component'

import InventoryCost from './inventory-cost/inventory-cost-table.component'
import InventoryCostChart from './inventory-cost/inventory-cost-chart.component'

import DaysOnHandTable from './days-on-hand/days-on-hand-table.component'
import DaysOnHandTableChart from './days-on-hand/days-on-hand-chart.component' 

import CustomerComments from './customer-comments-table/customer-comments'


import { 
    Row,
    Col,
    Card,
    Tag,
    Collapse 
 } from "antd";

const { Panel } = Collapse;
const cardHeightStyle = {
    height: "100%"
}

 const Logistics = () => (

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
                <CustomerComments/>
            </Card>
        </Col>

        <Col span={24}>

            <Collapse defaultActiveKey={['1']}>

                <Panel header="Days On Hand" key="1">

                    <div className="mb2">
                        <Tag className="pa1" color="#e33545">DOH is between 0 and 2</Tag>
                        <Tag className="pa1" color="#ffc107">DOH is between 2 and 3</Tag>
                        <Tag className="pa1" color="#28a745">DOH is between 3 and 5</Tag>
                        <Tag className="pa1" color="#2196F3">DOH is greater than 5</Tag>
                    </div>

                    <DaysOnHandTableChart/>
                    <DaysOnHandTable/>

                </Panel>

                <Panel header="Stock Overview By Location" key="2" >
                
                    <div className="ma2">
                        <StockOverViewSlocChart/>
                    </div>
                    
                </Panel>

                <Panel header="Stock Overview" key="3" >
                
                    <StockOverviewTable/>

                </Panel>

                <Panel header="Stock Overview by Program" key="4">
                
                    <StockOverviewChart/>

                </Panel>

            </Collapse>
            
        </Col>

     </Row>
 )


export default Logistics; 