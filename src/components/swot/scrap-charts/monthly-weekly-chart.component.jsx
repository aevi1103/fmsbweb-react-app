import React from 'react'
import numeral from 'numeral'
import moment from 'moment'
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


const MonthWeekChart = ({
    scrapData,
    scrapAreaName,
    filters,
    line
}) => {

    if (!scrapData) return;

    const { 
        monthStart,
        monthEnd,
        weekStart,
        weekEnd,
        lastMonths,
        lastWeeks
    } = filters;

    const dateFormat = 'MM/DD/YY'
    const formatDate = date => moment(date).format(dateFormat);
    const subCaption = `Month: ${formatDate(monthStart)} - ${formatDate(monthEnd)} | Week: ${formatDate(weekStart)} - ${formatDate(weekEnd)}`

    const dataSource = {
        chart: {
            caption: `${line} Last ${lastMonths} Months & Last ${lastWeeks} Weeks ${scrapAreaName} Scrap %`,
            subCaption: subCaption,
            xAxisName: 'Month | Week',
            yAxisName: 'Scrap %',
            ...chartProps,
            ...tooltipStyle,
            numberSuffix: "%"
        },
        data: scrapData.map(({label, qty, gross, scrapRate, colorCode}) => ({
                label: label,
                value: (scrapRate * 100),
                color: colorCode,
                toolText: `
                            <b>${scrapAreaName}</b><br>
                            <b>Period:</b> ${label}<br>
                            <b>Gross:</b> ${numeral(gross).format('0,0')}<br>
                            <b>Qty:</b> ${numeral(qty).format('0,0')}<br>
                            <b>Scrap %:</b> ${numeral(scrapRate).format('0.00%')}<br>
                            `
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

export default MonthWeekChart;