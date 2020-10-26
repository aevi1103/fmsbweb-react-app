import React from 'react'
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../helpers/chart-config';
import { chartConfig } from './chart-config'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);


const DowntimeChart = ({
    data
}) => {

    const dataSource = {
        chart: {
            ...chartConfig,
            ...tooltipStyle
        },
        data: data.map(({label, downtimeLoss}) => ({
                label: label,
                value: downtimeLoss
            }))
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

export default DowntimeChart;