import React from 'react';
import { connect } from 'react-redux';

import MonthlyIncidentRateChart from './monthly-incident-rate-chart/monthly-incident-rate-chart.component'
import IncidentByDeptChart from './incident-by-dept-chart/incident-by-dept-chart.component'
import IncidentTable from './incidents-table.component.jsx/incidents-table'

import { 
    Row,
    Col,
    Card
 } from "antd";

const cardHeightStyle = {
    height: "500px"
}

const Safety = ({isIncidentByDeptFetching, isMonthlyIncidentRateFetching}) => (
    <Row gutter={16}>
        <Col span={8} lg={8} md={24} xs={24}>
            <Card 
                title="Monthly Incident Date"
                bordered={false} size="small"
                className="tc mb3"
                style={cardHeightStyle}
                loading={isIncidentByDeptFetching}
                >                     
                <MonthlyIncidentRateChart/>
            </Card>
        </Col>
        <Col span={8} lg={8} md={24} xs={24}>
            <Card 
                title="Incident Occurence by Department"
                bordered={false} 
                size="small"
                className="tc mb3" 
                style={cardHeightStyle}
                loading={isMonthlyIncidentRateFetching}
                >
                <IncidentByDeptChart/>
            </Card>
        </Col>
        <Col span={8} lg={8} md={24} xs={24}>
            <Card 
                title="Incidents"
                bordered={false}
                size="small"
                className="tc mb3"
                style={cardHeightStyle}>
                <IncidentTable/>
            </Card>
        </Col>
    </Row>
);

const mapStateToProps = ({ morningMeeting }) => ({
    isIncidentByDeptFetching: morningMeeting.isIncidentByDeptFetching,
    isMonthlyIncidentRateFetching: morningMeeting.isMonthlyIncidentRateFetching,
})

export default connect(mapStateToProps)(Safety);