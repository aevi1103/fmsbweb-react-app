import React from 'react'
import { useParams } from 'react-router-dom';
import { 
    Row,
    Col,
 } from "antd";

 import DailyProductionChart from './daily-production-chart.component'
 import ProductionByProgramChart from './production-by-program-chart.component'
 import ProductionByShiftChart from './production-by-shift-chart.component'
 import MonthlyWeeklyOaeChartWrapper from './monthly-weekly-oae-chart-wrapper.component'

 const DeptProductionChartsContainer = ({
     data,
     filters,
     targets
 }) => {

    const { 
        dailyProduction,
        productionByShift,
        productionByProgram,
        monthlyOae,
        weeklyOae
    } = data || {}

    const { department } = useParams();

    return (
        <Row gutter={[8,8]}>

            {
                dailyProduction !== null 
                    ?  (<Col span={6}>
                            <DailyProductionChart 
                                prodData={dailyProduction} 
                                line={department} 
                                filters={filters}
                                targets={targets} />
                        </Col>)
                    : null
            }
            
            <Col span={6}>
                <ProductionByShiftChart 
                    prodData={productionByShift} 
                    line={department} 
                    targets={targets} />
            </Col>

            {
                productionByProgram?.data?.length > 0 
                    ?  <Col span={6}>
                            <ProductionByProgramChart 
                                prodData={productionByProgram} 
                                line={department} />
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
                                line={department} />
                        </Col>)
                    : null
            }
            
        </Row>
    )
 }

 export default DeptProductionChartsContainer;