import React from 'react'
import { useParams } from 'react-router-dom';

import { 
    Row,
    Col,
 } from "antd";

 import ScrapByDefectChart from './scrap-charts/scrap-by-defect-chart.component'
 import ScrapByShiftChart from './scrap-charts/scrap-by-shift-chart.component'
 import ScrapByProgramChart from './scrap-charts/scrap-by-program-chart.component'
 import ScrapByAreaChart from './scrap-charts/scrap-by-area-chart.component'
 import MonthlyWeeklyChartWrapper from './scrap-charts/monthly-weekly-chart-wrapper.component'

 const DeptScrapChartsContainer = ({
     data,
     filters
 }) => {

    const { department } = useParams();

    const { 
        scrapPareto,
        scrapParetoByShift,
        scrapParetoByProgram,
        scrapParetoByArea,
        weeklyScrapRates,
        monthlyScrapRates
    } = data || {}

    return (
        <Row gutter={[8,8]}>

            <Col span={6}>
                <ScrapByDefectChart 
                    scrapData={scrapPareto} 
                    line={department} 
                    filters={filters} /> 
            </Col>

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