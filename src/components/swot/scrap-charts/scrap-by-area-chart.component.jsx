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


const ScrapByAreaChart = ({
    scrapData,
    start,
    end,
    line,
    filters
}) => {

    if (!scrapData) return;

    const { scrapAreaName, qty, details } = scrapData;
    const { take } = filters;

    const caption = take > 0 
        ? `${line} ${scrapAreaName} Top ${take} Scrap Pareto`
        : `${line} ${scrapAreaName} Scrap Pareto`;

    const dataSource = {
        chart: {
            caption: caption,
            subCaption: `${start} - ${end} | Scrap Total: ${qty}`,
            xAxisName: 'Scrap Area',
            yAxisName: 'Qty',
            ...chartProps,
            ...tooltipStyle
        },
        data: details.map(({scrapDesc, qty, colorCode}) => ({
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

export default ScrapByAreaChart;