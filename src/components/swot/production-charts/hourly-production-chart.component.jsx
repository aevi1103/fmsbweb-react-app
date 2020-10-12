import React from 'react'
import moment from 'moment'
import numeral from 'numeral'
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../helpers/chart-config'

import {
    chartProps,
    chartConfigProps,
    colorCodes
} from '../helper'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const HourlyProductionChart = ({
    prodData,
    line
}) => {

    if (!prodData) return;

    const { green, red } = colorCodes
    const { startDate, endDate, data } = prodData;
    const dateFormat = 'M/D';

    const dataSource = {
        chart: {
            caption: `${line} Hourly Production`,
            subCaption: `${startDate} - ${endDate}`,
            xAxisName: 'Line - Shift Date - Shift - Hour',
            yAxisName: 'Net Qty',
            rotateValues: '1',
            ...chartProps,
            ...tooltipStyle
        },
        data: data.map(({net, shiftDate, shift, hour, netRateTarget, oae, oaeTarget, totalScrap, line, hxHUrl}) => ({
                label: `${line} - ${moment(shiftDate).format(dateFormat)} - ${shift} - H${hour}`,
                value: net < 0 ? 0 : net,
                color: net < netRateTarget ? red : green,
                link: `n-${hxHUrl}`,
                toolText: `
                            <b>Line:</b> ${line}<br>
                            <b>Shift Date:</b> ${moment(shiftDate).format(dateFormat)}<br>
                            <b>Shift:</b> ${shift}<br>
                            <b>Hour:</b> ${hour}<br>
                            <b>Net Rate Target:</b> ${netRateTarget}<br>
                            <b>Net:</b> ${net}<br>
                            <b>OAE Target:</b> ${oaeTarget}<br>
                            <b>OAE:</b> ${numeral(oae).format('0%')}<br>
                            <b>Total Scrap:</b> ${totalScrap}<br><br>

                            <b>Click to open HxH</b>
                            `
            })),
        trendlines: [
            {
                line: [{
                    startvalue: `${prodData.netRateTarget}`,
                    color: green,
                    valueOnRight: '1',
                    displayvalue: `${numeral(prodData.netRateTarget).format('0,0')}`,
                    dashed: '1'
                }]
            }
        ]
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

export default HourlyProductionChart;