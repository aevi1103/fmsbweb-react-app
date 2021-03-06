import React from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';
import { green, red } from '../../../core/utilities/colors'

import CustomSpinner from '../../../components/custom-spinner/custom-spinner.component';
import { tooltipStyle } from '../../../core/utilities/chart-config'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const StockOverViewSlocChart = () => {

    const stockOVerviewSlocCollection = useSelector(({ logistics }) => logistics?.stockOVerviewSlocCollection) ?? []
    const isStockOverviewSlocFetching = useSelector(({ logistics }) => logistics.isStockOverviewSlocFetching)

    const categories = stockOVerviewSlocCollection?.categories ?? [];
    const data = stockOVerviewSlocCollection?.data ?? [];

    const dataSetByKey = _.groupBy(data, o => o.program); 
        
    const dataSet = Object.keys(dataSetByKey).map(key => {
        return {
            seriesName: key,
            renderas: ((key === "Min" || key === "Max") ? "Line" : ""),
            color: (key === "Min" ? red : key === "Max" ? green : ""),
            data: dataSetByKey[key].map(({stock}) => 
                    ({
                        value: stock
                    }))
        }
    })

    const dataSource = {
        chart: {
            xAxisName: 'Program',
            yAxisName: 'Stock',
            showValues: '0',
            theme: 'fusion',
            showsum: "1",
            plottooltext: 'Program: $seriesname, SLOC: $label, Qty: $value',
            ...tooltipStyle
        },
        categories: [
            {
                category: _.orderBy(categories, o => o.slocOrder).map(c => ({ 
                    label: c.category === 'WH (0300)' ? 'WH (0400)' : c.category
                }))
            }
        ],
        dataset: dataSet
      };
      
      const chartConfigs = {
        type: 'stackedcolumn2dline',
        width: '100%',
        height: '450',
        dataFormat: 'json',
        dataSource: dataSource
      };

    return isStockOverviewSlocFetching 
        ? <CustomSpinner/>
        : <ReactFC {...chartConfigs} />
}

export default StockOverViewSlocChart;