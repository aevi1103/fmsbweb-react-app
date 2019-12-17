import React from 'react';

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

const Safety = () => (
    <Row gutter={16}>
        <Col span={8} lg={8} md={24} xs={24}>
            <Card 
                title="Monthly Incident Date"
                bordered={false} size="small"
                className="mb3"
                style={cardHeightStyle}
                >                     
                <MonthlyIncidentRateChart/>
            </Card>
        </Col>
        <Col span={8} lg={8} md={24} xs={24}>
            <Card 
                title="Incident Occurence by Department"
                bordered={false} 
                size="small"
                className="mb3" 
                style={cardHeightStyle}
                >
                <IncidentByDeptChart/>
            </Card>
        </Col>
        <Col span={8} lg={8} md={24} xs={24}>
            <Card 
                title="Incidents"
                bordered={false}
                size="small"
                className="mb3"
                style={cardHeightStyle}>
                <IncidentTable/>
            </Card>
        </Col>
    </Row>
);

export default Safety;