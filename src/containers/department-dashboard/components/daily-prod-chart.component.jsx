import React from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import {
    tooltipStyle
} from '../../../core/utilities/chart-config'

import { colors } from '../../../core/utilities/colors'
const { green } = colors

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const dateFormat = 'MM/DD/YY';

const DailyProdChart = () => {

    const dailySapProd = useSelector(({ departmentDashboard }) => departmentDashboard?.prodScrap?.dailySapProd) ?? []
    const dataSource = {
        chart: {
            xAxisName: 'Shift Date',
            yAxisName: 'Production Qty',
            showValues: '0',
            theme: 'fusion',
            connectNullData: '1',
            labelDisplay: 'rotate',
            slantLabel: '1',
            palettecolors: green,

            ...tooltipStyle
        },
        data: dailySapProd.map(({shiftDate, qty}) => ({
                label: moment(shiftDate).format(dateFormat),
                value: qty
            }
        ))
      };
      
      const chartConfigs = {
        type: 'line',
        width: '100%',
        height: '86%',
        dataFormat: 'json',
        dataSource: dataSource
      };

    return <ReactFC {...chartConfigs} />
}

export default DailyProdChart;