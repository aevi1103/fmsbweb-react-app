import React from 'react';

import { 
    Row,
    Col,
    Card
 } from "antd";

 import KpiTable from '../../../components/finance/kpi/kpi-table/kpi-table.component'
 import DeptForecastTable from '../../../components/finance/kpi/dept-forecast-table/dept-forecast-table.compoennt'
 import FlashProjectionTable from '../../../components/finance/kpi/flash-projections/flash-projections.component'

const FinanceKpi = () => (
    <Row gutter={16}>
        <Col span={24}>
            <Card 
                title="Finance Daily KPI"
                bordered={false} size="small"
                className="mb3"
                >       
                    <KpiTable/>              
            </Card>     
        </Col>
        <Col span={12}>
            <Card 
                title="Department Forecast"
                bordered={false} 
                size="small"
                className="mb3"
                >
                <DeptForecastTable/>
            </Card>
        </Col>
        <Col span={12}>
            <Card 
                title="Flash Projections"
                bordered={false}
                size="small"
                className="mb3">
                    <FlashProjectionTable/>
            </Card>
        </Col>
    </Row>
);

export default FinanceKpi;