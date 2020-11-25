import React from 'react'
import _ from 'lodash'

import MonthlyWeeklyScrapChart from './monthly-weekly-scrap-chart.component'

import { 
    Col,
 } from "antd";

 const MonthlyWeeklyChartWrapper = ({
    monthlyScrapRates,
    weeklyScrapRates,
    filters,
    line
 }) => {

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
        <>
            {
                
                monthWeek.map(scrapData => (
                    <Col span={6} key={scrapData.key}>
                        <MonthlyWeeklyScrapChart 
                            scrapData={scrapData.data} 
                            scrapAreaName={scrapData.key} 
                            filters={filters}
                            line={line} />
                    </Col>
                ))
            }
        </>
    )
 }

export default MonthlyWeeklyChartWrapper;