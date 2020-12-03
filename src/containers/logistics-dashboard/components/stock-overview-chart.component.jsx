import React from 'react';
import { useSelector } from 'react-redux';

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import CustomSpinner from '../../../components/custom-spinner/custom-spinner.component';
import { tooltipStyle } from '../../../core/utilities/chart-config'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const StockOverviewChart = () => {

    const stockOVerviewCollection = useSelector(({ logistics }) => logistics?.stockOVerviewCollection) ?? []
    const isStockOverviewFetching = useSelector(({ logistics }) => logistics?.isStockOverviewFetching)
    const data= stockOVerviewCollection?.data ?? [];

    const dataSource = {
        chart: {
            xAxisName: 'Months',
            yAxisName: 'Incident Rate',
            showValues: '1',
            theme: 'fusion',
            ...tooltipStyle
        },
        data: data.map(({program, total}) => ({
            label: program,
            value: total
        }
    ))
      };
      
      const chartConfigs = {
        type: 'column2d',
        width: '100%',
        height: '450',
        dataFormat: 'json',
        dataSource: dataSource
      };

    return isStockOverviewFetching 
        ? <CustomSpinner/>
        : <ReactFC {...chartConfigs} />
}

export default StockOverviewChart;