import React from 'react'
import _ from 'lodash'

import { 
    Row,
    Col,
 } from "antd";

 import ScrapByDefectChart from './scrap-charts/scrap-by-defect-chart.component'
 import ScrapByAreaChartWrapper from './scrap-charts/scrap-by-area-chart-wrapper.component'
 import MonthlyWeeklyChartWrapper from './scrap-charts/monthly-weekly-chart-wrapper.component'

 const ScrapChartsContainer = ({
     data,
     filters,
     line
 }) => {

    const { 
        scrapPareto,
        scrapParetoByArea,
        weeklyScrapRates,
        monthlyScrapRates
    } = data || {}

    return (
        <Row gutter={[8,8]}>

            <Col span={6}>
                <ScrapByDefectChart 
                    scrapData={scrapPareto} 
                    line={line} 
                    filters={filters} /> 
            </Col>

            <ScrapByAreaChartWrapper 
                scrapParetoByArea={scrapParetoByArea}
                line={line} 
                filters={filters} />
            
            {
                weeklyScrapRates !== null || monthlyScrapRates !== null 
                    ?  <MonthlyWeeklyChartWrapper 
                            monthlyScrapRates={monthlyScrapRates}
                            weeklyScrapRates={weeklyScrapRates}
                            filters={filters}
                            line={line} />
                    : null
            }

        </Row>
    )
 }

 export default ScrapChartsContainer;