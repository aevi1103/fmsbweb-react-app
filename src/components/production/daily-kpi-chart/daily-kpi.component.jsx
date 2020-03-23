import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment'
import numeral from 'numeral'

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import CustomSpinner from '../../custom-spinner/custom-spinner.component';
import { tooltipStyle } from '../../../helpers/chart-config'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const DailyKpiChart = ({dailyKpiCollection, isDailyKpiFetching}) => {

    let chartConfigs = {};

    if (dailyKpiCollection) {

        const { categories, series, data } = dailyKpiCollection;
        const green = "#28a745";
        const red = "#dc3545";
        const yellow = "#ffc107";
        
        const renderValue = ({ sapOae, scrapRate, downtimeRate }, key) => {
            
            if (key === 'OAE %') {
                if (sapOae > 1) return 1;
                if (sapOae < 0) return 0;
                return sapOae;
            }

            if (key === 'Scrap % by Dept') {
                if (scrapRate > 1) return 1;
                if (scrapRate < 0) return 0        
                return scrapRate; 
            }

            if (key === 'Downtime %') {
                if (downtimeRate > 1) return 1;
                if (downtimeRate < 0) return 0        
                return downtimeRate;
            }
            
        }

        // transform datasetbykey to a object that fusion chart understands
        const dataSet = series.map(key => {
            return {
                seriesName: key,
                renderas: key === "Scrap % by Dept" ? "line" : "area",
                parentyaxis: key === "Scrap % by Dept" ? "S" : "",
                data: data.map(d => 
                        ({
                            value: numeral(renderValue(d, key)).format('0.00%'),
                            anchorRadius: (key === "OAE %" && d.sapOae > 1) ? 6 : 0,
                            anchorSides: (key === "OAE %" && d.sapOae > 1) ? 3 : 0
                        }))
            }
        })

        const dataSource = {
            chart: {
                xAxisName: '%',
                yAxisName: 'OAE and Downtime %',
                showValues: '0',
                theme: 'fusion',
                paletteColors: `${green}, ${yellow}, ${red}`,
                plottooltext: '$label: <b>$seriesname:</b> <b>$value</b>',
                connectNullData: '1',
                labelDisplay: 'rotate',
                slantLabel: '1',
                ...tooltipStyle
            },
            categories: [
                {
                    category: !categories 
                                ? [] 
                                : categories.map(c => ({label: moment(c, 'MM/DD/YYYY').format('MM/DD/YY')}))
                }
            ],
            dataset: dataSet
          };
          
          chartConfigs = {
            type: 'stackedarea2d',
            width: '100%',
            height: '86%',
            dataFormat: 'json',
            dataSource: dataSource
          };

    }

    return (
        <>
            {
                isDailyKpiFetching 
                    ? (<CustomSpinner/>)
                    : (<ReactFC {...chartConfigs} />)
            }   
        </>  
    )
}

const mapStateToProps = ({ morningMeeting }) => ({
    dailyKpiCollection: morningMeeting.dailyKpiCollection,
    isDailyKpiFetching: morningMeeting.isDailyKpiFetching,
})

export default connect(mapStateToProps)(DailyKpiChart);