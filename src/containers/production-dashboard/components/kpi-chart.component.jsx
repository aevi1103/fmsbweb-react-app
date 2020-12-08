import React from 'react'
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../core/utilities/chart-config'
import { chartConfigDashboard } from '../service/chart-config'
import { red, green } from '../../../core/utilities/colors' 

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);


const KpiChart = ({
    data,
    target
}) => {

    if (!data) return;

    const { oae, downtimeRate, unknownRate, scrapRates } = data;
    const { oaeTarget } = target;

    const mapScrapRates = scrapRates.filter(({ qty }) => qty > 0)
                            .map(({ scrap, scrapRate, colorCode }) => ({
                                label: scrap,
                                value: scrapRate,
                                color: colorCode
                            }))


    const dataSource = {
        chart: {
            caption: 'Production Status',
            plottooltext: "<b>$label</b>: $percentValue",
            ...chartConfigDashboard,
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
        height: '280',
        dataFormat: 'json',
        dataSource: dataSource
      };

    return (
        <ReactFC {...chartConfigs} />
    )
}

export default KpiChart;