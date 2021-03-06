import React from 'react'
import moment from 'moment'

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import {
    tooltipStyle
} from '../../core/utilities/chart-config'

import { red, blue } from '../../core/utilities/colors'


FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const DailyScrapByCodeChart = React.memo(({
    chartData
}) => {

    const { trendline: { start, end }, data } = chartData

    const dateFormat = 'MM/DD/YY';
    const dataSource = {
        chart: {
            xAxisName: 'Shift Date - Shift',
            yAxisName: 'Scrap Qty',
            showValues: '1',
            theme: 'fusion',
            connectNullData: '1',
            labelDisplay: 'rotate',
            slantLabel: '1',
            palettecolors: red,
            // exportEnabled: "1",

            ...tooltipStyle
        },
        data: data.map(({shiftDate, shift, qty}) => ({
            label: `${moment(shiftDate).format(dateFormat)} - ${shift}`,
            value: qty,
            tooltext: `<b>Shift Date: </b> ${moment(shiftDate).format(dateFormat)} <br>
                        <b>Shift: </b> ${shift} <br>
                        <b>Qty: </b> ${qty}`
        })),
        trendlines: [{
            line: [{
                startvalue: start.toFixed(2),
                endValue: end.toFixed(2),
                color: blue,
                displayvalue: "",
                valueOnRight: "1",
                dashed: "1",
                thickness: "2"
            }]
        }]
    };
        
    const chartConfigs = {
        type: 'line',
        width: '100%',
        height: '82%',
        dataFormat: 'json',
        dataSource: dataSource
    };

    return <ReactFC {...chartConfigs} />

})

export default DailyScrapByCodeChart