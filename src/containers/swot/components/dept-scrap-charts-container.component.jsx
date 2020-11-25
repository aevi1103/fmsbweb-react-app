import React from 'react'
import { useParams } from 'react-router-dom';

import { 
    Row,
    Col,
 } from "antd";

 import ScrapByDefectChart from './scrap-by-defect-chart.component'
 import ScrapByShiftChart from './scrap-by-shift-chart.component'
 import ScrapByProgramChart from './scrap-by-program-chart.component'
 import ScrapByAreaChart from './scrap-by-area-chart.component'
 import MonthlyWeeklyChartWrapper from './monthly-weekly-scrap-chart-wrapper.component'
 import DailyScrapRateChart from './daily-scrap-rate-chart.component'

 const DeptScrapChartsContainer = ({
     data,
     filters,
     targets
 }) => {

    const { department } = useParams();

    const { 
        scrapPareto,
        scrapParetoByShift,
        scrapParetoByProgram,
        scrapParetoByArea,
        weeklyScrapRates,
        monthlyScrapRates,
        dailySbScrapRateByShift
    } = data || {}

    return (
        <Row gutter={[8,8]}>

            <Col span={6}>
                <ScrapByDefectChart 
                    scrapData={scrapPareto} 
                    line={department} 
                    filters={filters} /> 
            </Col>

            {
                dailySbScrapRateByShift?.data?.length > 0 
                    ? <Col span={12}>
                        <DailyScrapRateChart 
                                scrapData={dailySbScrapRateByShift} 
                                targets={targets} 
                                filters={filters} /> 
                        </Col>
                    : null
            }
            
            <Col span={6}>
                <ScrapByShiftChart 
                    scrapData={scrapParetoByShift} 
                    line={department} 
                    filters={filters} /> 
            </Col>

            <Col span={6}>
                <ScrapByProgramChart 
                    scrapData={scrapParetoByProgram} 
                    line={department} 
                    filters={filters} /> 
            </Col>

            {
                department !== 'Foundry' 
                    ?   <Col span={6}>
                            <ScrapByAreaChart 
                                scrapData={scrapParetoByArea} 
                                line={department} 
                                filters={filters} /> 
                        </Col>
                    : null
            }
            
            {
                weeklyScrapRates !== null || monthlyScrapRates !== null 
                    ?  <MonthlyWeeklyChartWrapper 
                            monthlyScrapRates={monthlyScrapRates}
                            weeklyScrapRates={weeklyScrapRates}
                            filters={filters}
                            line={department} />
                    : null
            }

        </Row>
    )
 }

 export default DeptScrapChartsContainer;