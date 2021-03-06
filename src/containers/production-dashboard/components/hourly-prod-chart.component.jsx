import React from 'react'
import moment from 'moment'
import numeral from 'numeral'
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../core/utilities/chart-config'
import { chartConfigDashboard, chartConfigModal } from '../service/chart-config'
import { red, green } from '../../../core/utilities/colors'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);


const HourlyProductionChart = React.memo(({
    data,
    target,
    caption = 'Hourly Production',
    height = 150,
    isModal = false
}) => {

    if (!data) return;

    const chartConfig = !isModal ? chartConfigDashboard : chartConfigModal;

    const { netRate } = target;
    const dateFormat = 'M/D';

    const getLabel = (shiftDate, shift, line, cellSide, hour) => {

        const date = moment(shiftDate).format('M/D');

        if (data.length <= 8 && cellSide.toLowerCase() === 'n/a') {
            return `Hour ${hour}`;
        }

        if (data.length <= 16 && cellSide.toLowerCase() !== 'n/a') {
            return `${line} - H${hour}`;
        }

        if (cellSide.toLowerCase() !== 'n/a') {
            return `${line} - ${date} - ${shift} - H${hour}`
        } 

        return `${date} - ${shift} - H${hour}`

    }

    const dataSource = {
        chart: {
            ...chartConfig,
            ...tooltipStyle,
            caption: caption,
            legendItemFontSize: '12',
            rotateValues: data.length > 8 ? '1' : '0',
            showValues: (data.length < 24 || isModal) ? '1' : '0',
            labelDisplay: data.length > 8 ? "rotate" : '',
            // slantLabel: data.length > 8 ? '1' : '0'
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
        height: height,
        dataFormat: 'json',
        dataSource: dataSource
      };

    return (
        <ReactFC {...chartConfigs} />
    )
})

export default HourlyProductionChart;