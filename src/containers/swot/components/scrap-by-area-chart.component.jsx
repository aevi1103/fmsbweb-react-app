import React from 'react'
import { connect } from 'react-redux'
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../core/utilities/chart-config'

import {
    chartProps
} from '../service/helper'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const ScrapByAreaChart = ({
    scrapData,
    line,
    filters,
    chartWidth,
    chartHeight
}) => {

    if (!scrapData) return;

    const { startDate, endDate, data } = scrapData;
    const { take } = filters;

    const defectCaption = (scrapType) => {
        return take > 0 
            ? `${scrapType} Top ${take} Scrap Pareto by Defect`
            : `${scrapType} Scrap Pareto by Defect`;
    } 

    const dataSource = {
        chart: {
            caption: `${line} Scrap Pareto by Scrap Type`,
            subCaption: `${startDate} - ${endDate}`,
            xAxisName: 'Scrap Type',
            yAxisName: 'Qty',
            ...chartProps,
            ...tooltipStyle
        },
        data: data.map(({scrapAreaName, colorCode, qty }) => ({
                label: scrapAreaName,
                value: qty,
                color: colorCode,
                link: `newchart-xml-${scrapAreaName.replace(/\s/g, '_')}`
            })),

        linkeddata: data.map(({ scrapAreaName, qty, details }) => ({
            id: scrapAreaName.replace(/\s/g, '_'),
            linkedchart: {
                chart: {
                    caption: defectCaption(scrapAreaName),
                    subCaption: `Total Scrap: ${qty}`,
                    xAxisName: 'Defects',
                    yAxisName: 'Qty',
                    ...chartProps,
                    ...tooltipStyle
                },
                
                data: details.map(({ scrapDesc, colorCode, qty }) => ({
                    label: scrapDesc,
                    value: qty,
                    color: colorCode
                }))
            }
        }))
      };

    const chartConfigs = {
        type: 'column2d',
        width: chartWidth,
        height: chartHeight,
        dataFormat: 'json',
        dataSource: dataSource
      };

    return (
        <ReactFC {...chartConfigs} />
    )
}

const mapStateToProps = ({ swot }) => ({
    chartWidth: swot.chartWidth,
    chartHeight: swot.chartHeight
})

export default connect(mapStateToProps)(ScrapByAreaChart);