import React from 'react'
import { connect } from 'react-redux'
import numeral from 'numeral'
import moment from 'moment'
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../core/utilities/chart-config'
import { red, green } from '../../../core/utilities/colors'
import { chartProps } from '../service/helper'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);


const MonthWeekOaeChart = ({
    prodData,
    filters,
    targets,
    line,
    chartWidth,
    chartHeight
}) => {

    if (!prodData) return;

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
    const { oaeTarget } = targets || {};

    const dataSource = {
        chart: {
            caption: `${line} Last ${lastMonths} Months and Last ${lastWeeks} Weeks OAE %`,
            subCaption: subCaption,
            xAxisName: 'Month | Week',
            yAxisName: 'OAE %',
            ...chartProps,
            ...tooltipStyle,
            numberSuffix: "%"
        },
        data: prodData.map(({label, net, oae }) => ({
                label: label,
                value: Math.round((oae * 100),0),
                color: oae < oaeTarget ? red : green,
                toolText: `
                            <b>Period:</b> ${label}<br>
                            <b>OAE Target:</b> ${numeral(oaeTarget).format('0%')}<br>
                            <b>Net:</b> ${numeral(net).format('0,0')}<br>
                            <b>OAE %:</b> ${numeral(oae).format('0%')}<br>
                            `
            })),
        trendlines: [
            {
                line: [{
                    startvalue: oaeTarget * 100,
                    color: green,
                    valueOnRight: '1',
                    displayvalue: `${numeral(oaeTarget).format('0%')}`,
                    dashed: '1'
                }]
            }
        ]
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

export default connect(mapStateToProps)(MonthWeekOaeChart);