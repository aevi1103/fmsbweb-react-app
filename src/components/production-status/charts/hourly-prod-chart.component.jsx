import React from 'react'
import moment from 'moment'
import numeral from 'numeral'
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../helpers/chart-config'
import { chartConfig } from './chart-config'

import {
    colorCodes
} from '../../swot/helper'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);


const HourlyProductionChart = ({
    data,
    target
}) => {

    if (!data) return;

    const { netRate } = target;
    const { green, red } = colorCodes;
    const dateFormat = 'M/D';

    const getLabel = (shiftDate, shift, line, cellSide, hour) => {

        if (cellSide.toLowerCase() !== 'n/a') {
            return `${line} - ${moment(shiftDate).format('M/D')} - ${shift} - H${hour}`
        } else {
            return `${moment(shiftDate).format('M/D')} - ${shift} - H${hour}`
        }

    }

    const dataSource = {
        chart: {
            caption: 'Hourly Production',
            legendItemFontSize: '12',
            ...chartConfig,
            ...tooltipStyle
        },
        data: data.map(({net, shiftDate, shift, hour, swotTarget, oae, totalScrap, line, cellSide}) => ({
                label: getLabel(shiftDate, shift, line, cellSide, hour),
                value: net < 0 ? 0 : net,
                color: net < swotTarget.netRate ? red : green,
                toolText: `
                            <b>Line:</b> ${line}<br>
                            <b>Shift Date:</b> ${moment(shiftDate).format(dateFormat)}<br>
                            <b>Shift:</b> ${shift}<br>
                            <b>Hour:</b> ${hour}<br>
                            <b>Net Rate Target:</b> ${swotTarget.netRate}<br>
                            <b>Net:</b> ${net}<br>
                            <b>OAE Target:</b> ${swotTarget.oaeTarget}<br>
                            <b>OAE:</b> ${numeral(oae).format('0%')}<br>
                            <b>Total Scrap:</b> ${totalScrap}<br>`
            })),
        trendlines: [
            {
                line: [
                    {
                        startvalue: `${netRate}`,
                        color: green,
                        valueOnRight: '1',
                        dashed: '1'
                    }
                ]
            }
        ]
      };

      const chartConfigs = {
        type: 'column2d',
        width: '100%',
        height: '150',
        dataFormat: 'json',
        dataSource: dataSource
      };

    return (
        <ReactFC {...chartConfigs} />
    )
}

export default HourlyProductionChart;