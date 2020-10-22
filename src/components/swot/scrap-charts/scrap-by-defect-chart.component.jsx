import React from 'react'
import { connect } from 'react-redux'
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../helpers/chart-config'

import {
    chartProps
} from '../helper'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const ScrapByDefectChart = ({
    scrapData,
    line,
    filters,
    subCaption = '',
    chartWidth,
    chartHeight
}) => {

    if (!scrapData) return;
    const { startDate, endDate, data } = scrapData || {};
    const { take } = filters || {};

    const dateRange = `(${startDate} - ${endDate})`;
    const caption = take > 0 
        ? `${line} Top ${take} Scrap Pareto by Defect ${dateRange}`
        : `${line} Scrap Pareto by Defect ${dateRange}`;

    const dataSource = {
        chart: {
            caption: caption,
            subCaption: subCaption,
            xAxisName: 'Defects',
            yAxisName: 'Qty',
            ...chartProps,
            ...tooltipStyle
        },
        data: data?.map(({scrapDesc, qty, colorCode}) => ({
                label: scrapDesc,
                value: qty,
                color: colorCode
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

export default connect(mapStateToProps)(ScrapByDefectChart);