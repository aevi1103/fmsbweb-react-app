import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import CustomSpinner from '../custom-spinner/custom-spinner.component';
import { tooltipStyle } from '../../core/utilities/chart-config'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const StockOverViewSlocChart = ({stockOVerviewSlocCollection, isStockOverviewSlocFetching}) => {

    const { categories, data } = stockOVerviewSlocCollection;
    let chartConfigs = {};
    
    if (data) {
        
        //group array by key
        const dataSetByKey = _.groupBy(data, o => o.program); 
        
        // transform datasetbykey to a object that fusion chart understands
        const dataSet = Object.keys(dataSetByKey).map(key => {
            return {
                seriesName: key,
                renderas: ((key === "Min" || key === "Max") ? "Line" : ""),
                color: (key === "Min" ? "#dc3545" : key === "Max" ? "#28a745" : ""),
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
          
          chartConfigs = {
            type: 'stackedcolumn2dline',
            width: '100%',
            height: '450',
            dataFormat: 'json',
            dataSource: dataSource
          };

    }

    return (
        <>
            {
                isStockOverviewSlocFetching 
                    ? (<CustomSpinner/>)
                    : (<ReactFC {...chartConfigs} />)
            }   
        </>
    )
}

const mapStateToProps = ({ morningMeeting }) => ({
    stockOVerviewSlocCollection: morningMeeting.stockOVerviewSlocCollection,
    isStockOverviewSlocFetching: morningMeeting.isStockOverviewSlocFetching,
})

export default connect(mapStateToProps)(StockOverViewSlocChart);