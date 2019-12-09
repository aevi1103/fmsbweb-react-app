import React from 'react';

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import MonthlyIncidentRateChart from './monthly-incident-rate-chart/monthly-incident-rate-chart.component'
import IncidentByDeptChart from './incident-by-dept-chart/incident-by-dept-chart.component'

import { 
    Row,
    Col,
    Card
 } from "antd";

 FusionCharts.options.creditLabel = false;
 ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const Safety = () => { 
    
    return (
        <div>
            <Row gutter={16}>
                <Col span={8} lg={8} md={24} xs={24}>
                    <Card title="Monthly Incident Date" bordered={true} size="small" className="tc">                     
                        <MonthlyIncidentRateChart/>
                    </Card>
                </Col>
                <Col span={8} lg={8} md={24} xs={24}>
                    <Card title="Incident Occurence by Department" bordered={true} size="small">
                        <IncidentByDeptChart/>
                    </Card>
                </Col>
                <Col span={8} lg={8} md={24} xs={24}>
                    <Card title="Incidents" bordered={true} size="small">
                        Card content
                    </Card>
                </Col>
            </Row>
        </div>
    ) 
};

export default Safety;