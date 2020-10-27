import React from 'react'
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../helpers/chart-config'
import { chartConfig } from './chart-config'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const ScrapByTypeChart = ({
    data,
    dept
}) => {


    const dataSource = {
        chart: {
            caption: `${dept} Dept Scrap Pareto by Type`,
            ...chartConfig,
            ...tooltipStyle
        },
        data: data?.map(({scrapAreaName, colorCode, qty }) => ({
                label: scrapAreaName,
                value: qty,
                color: colorCode,
                link: `newchart-xml-${scrapAreaName.replace(/\s/g, '_')}`
            })),

        linkeddata: data?.map(({ scrapAreaName, qty, defects }) => ({
            id: scrapAreaName.replace(/\s/g, '_'),
            linkedchart: {
                chart: {
                    caption: `${scrapAreaName} Top 5 Scrap Pareto by Defect`,
                    ...chartConfig,
                    ...tooltipStyle
                },
                
                data: defects.map(({ scrapDesc, colorCode, qty }) => ({
                    label: scrapDesc,
                    value: qty,
                    color: colorCode
                }))
            }
        }))
      };

    const chartConfigs = {
        type: 'column2d',
        width: '100%',
        height: '180',
        dataFormat: 'json',
        dataSource: dataSource
      };

    return (
        <ReactFC {...chartConfigs} />
    )
}


export default ScrapByTypeChart;