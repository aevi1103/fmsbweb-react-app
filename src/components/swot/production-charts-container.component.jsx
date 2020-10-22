import React from 'react'
import { 
    Row,
    Col,
 } from "antd";

 import HourlyProductionChart from '../../components/swot/production-charts/hourly-production-chart.component'
 import DailyProductionChart from '../../components/swot/production-charts/daily-production-chart.component'
 import ProductionByProgramChart from '../../components/swot/production-charts/production-by-program-chart.component'
 import ProductionByShiftChart from '../../components/swot/production-charts/production-by-shift-chart.component'
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
        productionByShift,
        productionByProgram,
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
                    ?  (<Col span={6}>
                            <DailyProductionChart 
                                prodData={dailyProduction} 
                                line={line} 
                                filters={filters}
                                targets={targets} />
                        </Col>)
                    : null
            }
            
            <Col span={6}>
                <ProductionByShiftChart 
                    prodData={productionByShift} 
                    line={line} 
                    targets={targets} />
            </Col>

            {
                productionByProgram?.data?.length > 0 
                    ?  <Col span={6}>
                            <ProductionByProgramChart 
                                prodData={productionByProgram} 
                                line={line} />
                        </Col>
                    : null
            }

            {
                monthlyOae !== null || weeklyOae !== null 
                    ? (<Col span={6}>
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