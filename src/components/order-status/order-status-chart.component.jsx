import React from 'react';
import moment from 'moment'
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import {
    tooltipStyle
} from '../../core/utilities/chart-config'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const OrderStatusChart = ({ 
    data
}) => {

    const { line, orders } = data;
    const category = orders.map(({ orderNumber, material }) => ({ label: `${orderNumber} (${material})` }));
    const target = orders.map(({ target }) => ({ value: target }));
    const actual = orders.map(({ trueActual }) => ({ value: trueActual }));

    const dataSource = {
        chart: {
            caption: `${line} Active Production Order`,
            subCaption: `${moment().format('lll')}`,
            placevaluesinside: "1",
            showvalues: "1",
            theme: "fusion",
            paletteColors: "#015eaa, #19bc9c",
            valueFontColor: "#000000",
            valueBgColor: "#FFFFFF",
            valueBgAlpha: "50",
            formatNumberScale: "0",
            ...tooltipStyle
        },
        categories: [
            {
                category: category
            }
        ],
        dataset: [
            {
                seriesname: "Target",
                data: target
            },
            {
                seriesname: "Actual",
                data: actual
            }
        ]
    }

    const config = {
        type: 'msbar2d',
        width: '100%',
        height: '84%',
        dataFormat: 'json',
        dataSource: dataSource
    }

    return <ReactFC {...config} />

}

export default OrderStatusChart;