import React from 'react'
import { connect } from 'react-redux'
import numeral from 'numeral'
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../core/utilities/chart-config'

import {
    chartProps,
    colorCodes
} from '../service/helper'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const ProductionByShiftChart = ({
    prodData,
    line,
    targets,
    chartWidth,
    chartHeight
}) => {

    if (!prodData) return;

    const { startDate, endDate, data } = prodData || {};
    const { oaeTarget } = targets || {};

    const dataSource = {
        chart: {
            caption: `${line} SAP Production by Shift`,
            subCaption: `${startDate} - ${endDate}`,
            xAxisName: 'Shift',
            yAxisName: 'OAE %',
            numberSuffix: "%",
            ...chartProps,
            ...tooltipStyle
        },
        data: data.map(({shift, qty, oae, target}) => ({
                label: `Shift ${shift}`,
                value: Math.round((oae * 100), 0),
                color: oae < oaeTarget ? colorCodes.red : colorCodes.green,
                toolText: `<b>Shift: ${shift}</b><br>
                            <b>Target: ${numeral(target).format('0,0')}</b><br>
                            <b>Net: ${numeral(qty).format('0,0')}</b><br>
                            <b>Net: ${numeral(oae).format('0%')}</b>
                            `
            })),
        trendlines: [
            {
                line: [{
                    startvalue: oaeTarget * 100,
                    color: colorCodes.green,
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

export default connect(mapStateToProps)(ProductionByShiftChart);