import React from 'react'
import numeral from 'numeral'
import { useParams } from 'react-router-dom';

import { 
    Row,
    Col,
 } from "antd";

import ScrapByDefectChart from './scrap-charts/scrap-by-defect-chart.component'
import ScrapByShiftChart from './scrap-charts/scrap-by-shift-chart.component'
import ScrapByProgramChart from './scrap-charts/scrap-by-program-chart.component'
import ScrapByAreaChart from './scrap-charts/scrap-by-area-chart.component'
import ScrapByAreaDefectChartWrapper from './scrap-charts/scrap-by-area-defect-chart-wrapper.component'
import MonthlyWeeklyChartWrapper from './scrap-charts/monthly-weekly-chart-wrapper.component'
import DailyScrapRateChart from './scrap-charts/daily-scrap-rate-chart.component'

 const ScrapChartsContainer = ({
     data,
     filters,
     line,
     lineKpi,
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
        dailyScrapRateByShift
    } = data || {}

    const {
        oae,
        scrapRateByArea
    } = lineKpi;

    const scrapRatesStr = scrapRateByArea.map(({ scrapAreaName, scrapRate }) => (`${scrapAreaName}: ${numeral(scrapRate).format('0.00%')}`)).join(' | ');
    const subCaption = `OAE: ${numeral(oae).format('0%')} | ${scrapRatesStr}`

    return (
        <Row gutter={[8,8]}>

            <Col span={6}>
                <ScrapByDefectChart 
                    scrapData={scrapPareto} 
                    line={line} 
                    filters={filters}
                    subCaption={subCaption} /> 
            </Col>

            {
                dailyScrapRateByShift?.data?.length > 0 
                    ? <Col span={12}>
                        <DailyScrapRateChart 
                            scrapData={dailyScrapRateByShift} 
                            targets={targets} 
                            filters={filters} /> 
                        </Col>
                    : null
            }
            
            <Col span={6}>
                <ScrapByShiftChart 
                    scrapData={scrapParetoByShift} 
                    line={line} 
                    filters={filters} /> 
            </Col>

            <Col span={6}>
                <ScrapByProgramChart 
                    scrapData={scrapParetoByProgram} 
                    line={line} 
                    filters={filters} /> 
            </Col>

            {
                department !== 'Foundry' 
                    ?   <Col span={6}>
                            <ScrapByAreaChart 
                                scrapData={scrapParetoByArea} 
                                line={line} 
                                filters={filters} /> 
                        </Col>
                    : null
            }
            
            <ScrapByAreaDefectChartWrapper 
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