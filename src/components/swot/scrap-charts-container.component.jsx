import React from 'react'
import _ from 'lodash'

import { 
    Row,
    Col,
 } from "antd";

 import ScrapByDefectChart from './scrap-charts/scrap-by-defect-chart.component'
 import ScrapByAreaChart from './scrap-charts/scrap-by-area-chart.component'
 import MonthWeekChart from './scrap-charts/monthly-weekly-chart.component'

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

    const mapMonthScrapRates = monthlyScrapRates.data.map(d => ({
        scrapAreaName: d.scrapAreaName,
        details: d.monthlyScrapDetails.map(({ scrapAreaName,
            colorCode,
            year,
            monthName,
            gross,
            qty,
            scrapRate
         }) => ({
            scrapAreaName,
            colorCode,
            label: `${year} - ${monthName}`,
            gross,
            qty,
            scrapRate
        }))
    }));

    const mapWeekScrapRates = weeklyScrapRates.data.map(d => ({
        scrapAreaName: d.scrapAreaName,
        details: d.weeklyScrapDetails.map(({ scrapAreaName,
            colorCode,
            year,
            weekNumber,
            gross,
            qty,
            scrapRate
         }) => ({
            scrapAreaName,
            colorCode,
            label: `${year} - W${weekNumber}`,
            gross,
            qty,
            scrapRate
        }))
    }));

    const groupByAreas = _.groupBy([...mapMonthScrapRates, ...mapWeekScrapRates], 'scrapAreaName')
    const monthWeek = Object.keys(groupByAreas).map(k => {
        const res = [];
        groupByAreas[k].forEach(({ details }) => res.push(...details));
        return {
            data: res,
            key: k
        }
    })

    return (
        <Row gutter={[8,8]}>

            <Col span={6}>
                <ScrapByDefectChart scrapData={scrapPareto} line={line} filters={filters} /> 
            </Col>

            {
                
                scrapParetoByArea.data.map(scrapData => (
                    <Col span={6} key={scrapData.scrapAreaName}>
                        <ScrapByAreaChart scrapData={scrapData} 
                                start={scrapParetoByArea.startDate}
                                end={scrapParetoByArea.endDate}
                                line={line}
                                filters={filters}  />
                    </Col>
                ))
            }

            {
                
                monthWeek.map(scrapData => (
                    <Col span={6} key={scrapData.key}>
                        <MonthWeekChart 
                            scrapData={scrapData.data} 
                            scrapAreaName={scrapData.key} 
                            filters={filters}
                            line={line} />
                    </Col>
                ))
            }


        </Row>
    )
 }

 export default ScrapChartsContainer;