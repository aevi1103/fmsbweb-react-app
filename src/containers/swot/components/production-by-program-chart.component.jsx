import React from 'react'
import { connect } from 'react-redux'
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../core/utilities/chart-config'
import { green } from '../../../core/utilities/colors'
import { chartProps } from '../service/helper'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const ProductionByProgramChart = ({
    prodData,
    line,
    chartWidth,
    chartHeight
}) => {

    if (!prodData) return;

    const { startDate, endDate, data } = prodData;

    const dataSource = {
        chart: {
            caption: `${line} SAP Production by Shift`,
            subCaption: `${startDate} - ${endDate}`,
            xAxisName: 'Program',
            yAxisName: 'Qty',
            ...chartProps,
            ...tooltipStyle
        },
        data: data.map(({program, qty}) => ({
                label: program,
                value: qty,
                color: green
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

export default connect(mapStateToProps)(ProductionByProgramChart);