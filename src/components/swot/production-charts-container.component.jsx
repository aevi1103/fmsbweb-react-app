import React from 'react'
import { 
    Row,
    Col,
 } from "antd";

 import HourlyProductionChart from '../../components/swot/production-charts/hourly-production-chart.component'
 import DailyProductionChart from '../../components/swot/production-charts/daily-production-chart.component'
 import MonthlyWeeklyOaeChartWrapper from '../../components/swot/production-charts/monthly-weekly-oae-chart-wrapper.component'

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

    return (
        <Row gutter={[8,8]}>

            <Col span={24}>
                <HourlyProductionChart prodData={hourlyProduction} line={line} />
            </Col>

            {
                dailyProduction !== null 
                    ?  (<Col span={12}>
                            <DailyProductionChart prodData={dailyProduction} line={line} filters={filters} />
                        </Col>)
                    : null
            }
            
            {
                monthlyOae !== null || weeklyOae !== null 
                    ? (<Col span={12}>
                            <MonthlyWeeklyOaeChartWrapper 
                                monthlyOae={monthlyOae} 
                                weeklyOae={weeklyOae} 
                                filters={filters} 
                                targets={targets} 
                                line={line} />
                        </Col>)
                    : null
            }
            
        </Row>
    )
 }

 export default ProductionChartsContainer;