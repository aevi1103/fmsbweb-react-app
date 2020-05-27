import React from 'react';
import { connect } from 'react-redux';

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';
import moment from 'moment';

import CustomSpinner from '../../custom-spinner/custom-spinner.component';
import {
    tooltipStyle
} from '../../../helpers/chart-config'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const dateFormat = 'MM/DD/YY';

const DailyProdChart = ({prodScrapCollection, isProdScrapFetching}) => {

    const chartData = !prodScrapCollection ? [] : prodScrapCollection.dailySapProd.map(({shiftDate, qty}) => 
        (
            {
                label: moment(shiftDate).format(dateFormat),
                value: qty
            }
        ));
    
    const dataSource = {
        chart: {
            xAxisName: 'Shift Date',
            yAxisName: 'Production Qty',
            showValues: '0',
            theme: 'fusion',
            connectNullData: '1',
            labelDisplay: 'rotate',
            slantLabel: '1',
            palettecolors: '#ed5042',

            ...tooltipStyle
        },
        data: chartData
      };
      
      const chartConfigs = {
        type: 'line',
        width: '100%',
        height: '86%',
        dataFormat: 'json',
        dataSource: dataSource
      };

    return (
        <>
            {
                isProdScrapFetching 
                    ? (<CustomSpinner/>)
                    : (<ReactFC {...chartConfigs} />)
            }   
        </> 
    )
}

const mapStateToProps = ({ morningMeeting }) => ({
    prodScrapCollection: morningMeeting.prodScrapCollection,
    isProdScrapFetching: morningMeeting.isProdScrapFetching,
})

export default connect(mapStateToProps)(DailyProdChart);