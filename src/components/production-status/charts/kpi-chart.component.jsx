import React from 'react'
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


const KpiChart = ({
    data,
    target
}) => {

    if (!data) return;

    const { oae, downtimeRate, unknownRate, scrapRates } = data;
    const { oaeTarget } = target;
    const { green, red } = colorCodes;

    const mapScrapRates = scrapRates.filter(({ qty }) => qty > 0)
                            .map(({ scrap, scrapRate, colorCode }) => ({
                                label: scrap,
                                value: scrapRate,
                                color: colorCode
                            }))

    console.log(mapScrapRates)

    const dataSource = {
        chart: {
            plottooltext: "<b>$label</b>: $percentValue",
            ...chartConfig,
            ...tooltipStyle
        },
        data: [
            {
                label: "OAE",
                value: oae,
                color: oae < oaeTarget ? red : green
            },
            {
                label: "Downtime",
                value: downtimeRate,
                color: '#4c56c9'
            },
            {
                label: "Unknown",
                value: unknownRate,
                color: '#727272'
            },
            ...mapScrapRates
        ]
      };

      const chartConfigs = {
        type: 'pie2d',
        width: '100%',
        height: '306',
        dataFormat: 'json',
        dataSource: dataSource
      };

    return (
        <ReactFC {...chartConfigs} />
    )
}

export default KpiChart;