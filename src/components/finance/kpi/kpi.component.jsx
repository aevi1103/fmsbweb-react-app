import React from 'react';

import { 
    Row,
    Col,
    Card
 } from "antd";

 import KpiTable from '../../../components/finance/kpi/kpi-table/kpi-table.component'
 import DeptForecastTable from '../../../components/finance/kpi/dept-forecast-table/dept-forecast-table.compoennt'
 import FlashProjectionTable from '../../../components/finance/kpi/flash-projections/flash-projections.component'

 const responsiveProps = {
    xs: 24,
    xl: 12
}

const FinanceKpi = () => (
    <Row gutter={[12,12]}>
        <Col span={24}>
            <Card 
                title="Finance Daily KPI"
                size="small"
                className="ba b--black-10"
                >       
                    <KpiTable/>              
            </Card>     
        </Col>
        <Col {...responsiveProps}>
            <Card 
                title="Department Forecast"
                size="small"
                className="ba b--black-10"
                >
                <DeptForecastTable/>
            </Card>
        </Col>
        <Col {...responsiveProps}>
            <Card 
                title="Flash Projections"
                size="small"
                className="ba b--black-10">
                    <FlashProjectionTable/>
            </Card>
        </Col>
    </Row>
);

export default FinanceKpi;