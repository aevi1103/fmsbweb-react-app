import React from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../helpers/chart-config'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const InventoryCostChart = () => {

    const loading = useSelector(({ morningMeeting: { isStockStatusFetching } }) => isStockStatusFetching) || false;
    const inventoryCost = useSelector(({ morningMeeting: { stockStatusCollection } }) => stockStatusCollection.inventoryCost) || [];

    const dataSource = {
            chart: {
                showValues: '1',
                theme: 'fusion',
                legendPosition: 'top',
                drawcrossline: "1",
                ...tooltipStyle
            },
            categories: [
                {
                    category: inventoryCost.map(({ costType }) => ({ label: costType }))
                }
            ],
            dataset: [
                {
                    seriesName: 'Cost',
                    data: inventoryCost.map(({ cost }) => ({ value: cost }))
                },
                {
                    seriesName: 'Target',
                    data: inventoryCost.map(({ target }) => ({ value: target }))
                }
            ]
        };
        
    const chartConfigs = {
            type: 'mscolumn2d',
            width: '100%',
            height: '200',
            dataFormat: 'json',
            dataSource: dataSource
        };

    return loading 
    ? null
    : <ReactFC {...chartConfigs} />
}

export default InventoryCostChart;