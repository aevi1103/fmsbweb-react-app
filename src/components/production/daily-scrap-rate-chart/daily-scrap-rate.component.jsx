import React from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral';

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';
import moment from 'moment';

import CustomSpinner from '../../custom-spinner/custom-spinner.component';
import { tooltipStyle } from '../../../helpers/chart-config'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const dateFormat = 'MM/DD/YY';

const MonthlyIncidentRateChart = ({dailyScrapRateCollection, isDailyScrapRateFetching}) => {

    const chartData = !dailyScrapRateCollection 
                        ? [] 
                        : dailyScrapRateCollection.map(({shiftDate, scrapRate, totalScrap, sapGross}) => 
        (
            {
                label: moment(shiftDate).format(dateFormat),
                value: scrapRate ? numeral(scrapRate).format('0.00%') : null,
                toolText: `<b>Shift Date: </b> ${moment(shiftDate).format(dateFormat)} <br>
                            <b>Total Scrap: </b> ${numeral(totalScrap).format('0,0')} <br>
                            <b>SAP Gross: </b> ${numeral(sapGross).format('0,0')} <br>
                            <b>Scrap Rate: </b> ${numeral(scrapRate).format('0.0%')} <br>`
            }
        ));
    
    const dataSource = {
        chart: {
            xAxisName: 'Shift Date',
            yAxisName: 'Scrap Rate',
            showValues: '0',
            theme: 'fusion',
            connectNullData: '1',
            labelDisplay: 'rotate',
            slantLabel: '1',
            palettecolors: '#ff4136',
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
                isDailyScrapRateFetching 
                    ? (<CustomSpinner/>)
                    : (<ReactFC {...chartConfigs} />)
            }   
        </>     
    )
}

const mapStateToProps = ({ morningMeeting }) => ({
    dailyScrapRateCollection: morningMeeting.dailyScrapRateCollection,
    isDailyScrapRateFetching: morningMeeting.isDailyScrapRateFetching
})

export default connect(mapStateToProps)(MonthlyIncidentRateChart);