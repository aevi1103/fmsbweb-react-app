import React from 'react'
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../helpers/chart-config'
import { chartConfig } from './chart-config'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const ScrapChart = ({
    data,
    caption,
    height = '150'
}) => {

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
        dataSource: data.length > 0 ? dataSource : null
      };

    return (
        <ReactFC {...chartConfigs} />
    )
}

export default ScrapChart;