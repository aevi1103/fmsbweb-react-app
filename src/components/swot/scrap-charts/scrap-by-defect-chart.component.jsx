import React from 'react'

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../helpers/chart-config'

import {
    chartProps,
    chartConfigProps
} from '../helper'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const ScrapByDefectChart = ({
    scrapData,
    line,
    filters
}) => {

    if (!scrapData) return;
    const { startDate, endDate, data } = scrapData;
    const { take } = filters;

    const caption = take > 0 
        ? `${line} Top ${take} Scrap Pareto by Defect`
        : `${line} Scrap Pareto by Defect`;

    const dataSource = {
        chart: {
            caption: caption,
            subCaption: `${startDate} - ${endDate}`,
            xAxisName: 'Defects',
            yAxisName: 'Qty',
            ...chartProps,
            ...tooltipStyle
        },
        data: data.map(({scrapDesc, qty, colorCode}) => ({
                label: scrapDesc,
                value: qty,
                color: colorCode
            }))
      };

    const chartConfigs = {
        type: 'column2d',
        ...chartConfigProps,
        dataSource: dataSource
      };

    return (
        <ReactFC {...chartConfigs} />
    )
}

export default ScrapByDefectChart;