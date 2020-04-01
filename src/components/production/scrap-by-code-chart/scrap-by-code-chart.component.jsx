import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral';

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';
import { tooltipStyle } from '../../../helpers/chart-config';
import { Empty } from 'antd';

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const ScrapByCodeChart = ({
    chartData
}) => {

    console.log('ScrapByCodeChart', chartData)

    const chartProps = {
        showvalues: "1",
        showpercentintooltip: "0",
        enablemultislicing: "1",
        theme: "fusion",
        useDataPlotColorForLabels: "1",
        showLegend: "1",
        drawcrossline: "1",
        labelDisplay: 'rotate',
        slantLabel: '1',
    };

    const dataSource = {
        chart: {
            xAxisName: 'Scrap Description',
            yAxisName: 'Qty',
            ...chartProps,
            ...tooltipStyle
        },
        data: chartData.map(({scrapDesc, scrapCode, qty }) => ({
                label: `${scrapDesc} (${scrapCode})`,
                value: qty
            }))
            
      };
      
      const chartConfigs = {
        type: 'column2d',
        width: '100%',
        height: '95%',
        dataFormat: 'json',
        dataSource: dataSource
      };

    return chartData.length === 0 
                ? <Empty/>
                : <ReactFC {...chartConfigs} />
}

export default ScrapByCodeChart;