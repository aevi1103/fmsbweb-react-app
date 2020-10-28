import React from 'react'
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../helpers/chart-config'
import { 
    chartConfigDashboard,
    chartConfigModal
 } from './chart-config'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const ScrapChart =  React.memo(({
    data,
    caption,
    height = 150,
    isModal = false
}) => {

    const chartConfig = !isModal ? chartConfigDashboard : chartConfigModal;

    const dataSource = {
        chart: {
            caption: caption,
            ...chartConfig,
            ...tooltipStyle
        },
        data: data.map(({scrapDesc, colorCode, qty}) => ({
                label: scrapDesc,
                value: qty,
                color: colorCode
            }))
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

export default ScrapChart;