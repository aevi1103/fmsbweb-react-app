import React from 'react'
import _ from 'lodash'

import { 
    Row,
    Col,
 } from "antd";

 import HourlyProductionChart from '../../components/swot/production-charts/hourly-production-chart.component'
 import DailyProductionChart from '../../components/swot/production-charts/daily-production-chart.component'
 import MonthlyWeeklyOaeChart from '../../components/swot/production-charts/monthly-weekly-oae-chart.component'

 const ProductionChartsContainer = ({
     data,
     filters,
     targets,
     line
 }) => {

    const { 
        hourlyProduction,
        dailyProduction,
        monthlyOae,
        weeklyOae
    } = data || {}

    const mapMonthlyOae = monthlyOae.data.map(({ year, monthName, target, net, oae }) => ({
        label: `${year} - ${monthName}`,
        target,
        net,
        oae
    }));

    const mapWeeklyOae = weeklyOae.data.map(({ year, weekNumber, target, net, oae }) => ({
        label: `${year} - W${weekNumber}`,
        target,
        net,
        oae
    }));

    const monthWeek = mapMonthlyOae.concat(mapWeeklyOae);

    return (
        <Row gutter={[8,8]}>

            <Col span={24}>
                <HourlyProductionChart prodData={hourlyProduction} line={line} />
            </Col>

            <Col span={12}>
                <DailyProductionChart prodData={dailyProduction} line={line} filters={filters} />
            </Col>

            <Col span={12}>
                <MonthlyWeeklyOaeChart prodData={monthWeek} filters={filters} targets={targets} line={line} />
            </Col>

        </Row>
    )
 }

 export default ProductionChartsContainer;