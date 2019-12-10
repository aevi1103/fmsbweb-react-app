import React from 'react';
import { connect } from 'react-redux';

import StockOverviewTable from './stock-overview-table/stock-overview-table.component'
import StockOverviewChart from './stock-overview-chart/stock-overview-chart.component'
import StockOverViewSlocChart from './stock-overview-sloc-chart/stock-overview-sloc-chart.component'

import { 
    Row,
    Col,
    Card
 } from "antd";

const cardHeightStyle = {
    height: "500px"
}

 const Logistics = ({ isStockOverviewFetching }) => (
     <Row gutter={16}>

        <Col span={24} >
            <Card 
                title="Stock Overview By Storage Location"
                bordered={false} size="small"
                style={cardHeightStyle}
                className="tc mb3"
            >
                <StockOverViewSlocChart/>
            </Card>
        </Col>

        <Col span={24}>
            <Card 
                title="Stock Overview"
                bordered={false} size="small"
                className="tc mb3"
            >
                <StockOverviewTable/>
            </Card>
        </Col>

        <Col span={24}>
            <Card 
                title="Stock Overview By Program"
                bordered={false} size="small"
                className="tc mb3"
                style={cardHeightStyle}
                loading={isStockOverviewFetching}
            >
                <StockOverviewChart/>
            </Card>
        </Col>

        <Col span={8} lg={8} md={24} xs={24}>
            <Card 
                title="Inventory Status"
                bordered={false} size="small"
                className="tc mb3"
            >

            </Card>
        </Col>

        <Col span={8} lg={8} md={24} xs={24}>
            <Card 
                title="Inventory Cost"
                bordered={false} size="small"
                className="tc mb3"
            >

            </Card>
        </Col>

        <Col span={8} lg={8} md={24} xs={24}>
            <Card 
                title="Comments"
                bordered={false} size="small"
                className="tc mb3"
            >

            </Card>
        </Col>

        <Col span={24}>
            <Card 
                title="Days on Hand"
                bordered={false} size="small"
                className="tc mb3"
            >

            </Card>
        </Col>
     </Row>
 )

 const mapStateToProps = ({ morningMeeting }) => ({
    isStockOverviewFetching: morningMeeting.isStockOverviewFetching,
})

export default connect(mapStateToProps)(Logistics); 