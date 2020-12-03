import React from 'react';
import { useSelector } from 'react-redux';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../core/utilities/chart-config'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const InventoryStatusChart = () => {

    const loading = useSelector(({ logistics: { isStockStatusFetching } }) => isStockStatusFetching) || false;
    const inventoryStatus = useSelector(({ logistics: { stockStatusCollection } }) => stockStatusCollection.inventoryStatus) || [];

    const dataSource = {
        chart: {
            theme: 'fusion',
            showValues: '1',
            drawcrossline: "1",
            ...tooltipStyle
        },
        data: inventoryStatus.map(({ sloc, qty }) => ({
                label: sloc,
                value: qty
            }))
      };

    const chartConfigs = {
        type: 'column2d',
        width: '100%',
        height: '200',
        dataFormat: 'json',
        dataSource: dataSource
      };

    return loading 
        ? null
        : <ReactFC {...chartConfigs} />
}


export default InventoryStatusChart;