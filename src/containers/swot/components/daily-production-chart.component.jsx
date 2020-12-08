import React from 'react'
import { connect } from 'react-redux'
import numeral from 'numeral'
import moment from 'moment'
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../core/utilities/chart-config'

import { chartProps } from '../service/helper'
import { green } from '../../../core/utilities/colors'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const DailyProductionChart = ({
    prodData,
    line,
    filters,
    targets,
    chartWidth,
    chartHeight
}) => {

    if (!prodData) return;

    const { startDate, endDate, data } = prodData || {};
    const dateFormat = 'MM/DD/YY';
    const { lastDays } = filters || {};
    const { oaeTarget } = targets || {};

    const dataSource = {
        chart: {
            caption: `${line} Last ${lastDays} Days Daily SAP Production`,
            subCaption: `${startDate} - ${endDate}`,
            xAxisName: 'Shift Date',
            yAxisName: 'OAE %',
            numberSuffix: "%",
            ...chartProps,
            ...tooltipStyle
        },
        data: data.map(({shiftDate, qty, oae, target}) => ({
                label: moment(shiftDate).format(dateFormat),
                value: Math.round((oae * 100), 0),
                // color: oae < oaeTarget ? colorCodes.red : colorCodes.green,
                toolText: `<b>Shift Date: ${moment(shiftDate).format(dateFormat)}</b><br>
                            <b>Target: ${numeral(target).format('0,0')}</b><br>
                            <b>Net: ${numeral(qty).format('0,0')}</b><br>
                            <b>Net: ${numeral(oae).format('0%')}</b>
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
        type: 'line',
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