import React from 'react';
import { connect } from 'react-redux';

import StockOverviewTable from './stock-overview-table/stock-overview-table.component'
import StockOverviewChart from './stock-overview-chart/stock-overview-chart.component'
import StockOverViewSlocChart from './stock-overview-sloc-chart/stock-overview-sloc-chart.component'

import InventoryStatusTable from './inventory-status-table/inventory-status-table.component'
import InventoryCost from './inventory-cost-table/inventory-cost-table.component'
import CustomerComments from './customer-comments-table/customer-comments'
import DaysOnHandTable from './days-on-hand-table/days-on-hand-table.component'

import { 
    Row,
    Col,
    Card,
    Tag
 } from "antd";

const cardHeightStyle = {
    height: "500px"
}

 const Logistics = ({ isStockOverviewFetching }) => (
     <Row gutter={[12,12]}>

        <Col span={24} >
            <Card 
                title="Stock Overview By Storage Location"
                size="small"
                style={cardHeightStyle}
                className="ba b--black-10"
            >
                <StockOverViewSlocChart/>
            </Card>
        </Col>

        <Col span={24}>
            <Card 
                title="Stock Overview"
                size="small"
                className="ba b--black-10"
            >
                <StockOverviewTable/>
            </Card>
        </Col>

        <Col span={24}>
            <Card 
                title="Stock Overview By Program"
                size="small"
                className="ba b--black-10"
                style={cardHeightStyle}
                loading={isStockOverviewFetching}
            >
                <StockOverviewChart/>
            </Card>
        </Col>

        <Col span={8} lg={8} md={24} xs={24}>
            <Card 
                title="Inventory Status"
                size="small"
                className="ba b--black-10"
                style={cardHeightStyle}
            >
                <InventoryStatusTable/>
            </Card>
        </Col>

        <Col span={8} lg={8} md={24} xs={24}>
            <Card 
                title="Inventory Cost"
                size="small"
                className="ba b--black-10"
                style={cardHeightStyle}
            >
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
            <Card 
                title="Days on Hand"
                size="small"
                className="ba b--black-10"
                >
                <div className="mb2">
                    <Tag color="#e33545">DOH is between 0 and 2</Tag>
                    <Tag color="#ffc107">DOH is between 2 and 3</Tag>
                    <Tag color="#28a745">DOH is between 3 and 5</Tag>
                    <Tag color="#2196F3">DOH is greater than 5</Tag>
                </div>
                <DaysOnHandTable/>
            </Card>
        </Col>
     </Row>
 )

 const mapStateToProps = ({ morningMeeting }) => ({
    isStockOverviewFetching: morningMeeting.isStockOverviewFetching,
})

export default connect(mapStateToProps)(Logistics); 