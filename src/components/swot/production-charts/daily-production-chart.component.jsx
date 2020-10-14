import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../helpers/chart-config'

import {
    chartProps,
    colorCodes
} from '../helper'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const DailyProductionChart = ({
    prodData,
    line,
    filters,
    chartWidth,
    chartHeight
}) => {

    if (!prodData) return;

    const { startDate, endDate, data } = prodData;
    const dateFormat = 'MM/DD/YY';
    const { lastDays } = filters;

    const dataSource = {
        chart: {
            caption: `${line} Last ${lastDays} Days Production`,
            subCaption: `${startDate} - ${endDate}`,
            xAxisName: 'Shift Date',
            yAxisName: 'Net Qty',
            rotateValues: '1',
            ...chartProps,
            ...tooltipStyle
        },
        data: data.map(({shiftDate, qty}) => ({
                label: moment(shiftDate).format(dateFormat),
                value: qty,
                color: colorCodes.green
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

export default connect(mapStateToProps)(DailyProductionChart);