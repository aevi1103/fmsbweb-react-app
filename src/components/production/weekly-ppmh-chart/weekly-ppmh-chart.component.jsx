import React from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral';

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import CustomSpinner from '../../custom-spinner/custom-spinner.component';
import {
    tooltipStyle
} from '../../../helpers/chart-config'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const numberFormat = '0,0.00';

const MonthlyIncidentRateChart = ({weeklyLaborHrsCollection, isWeeklyLaborHrsFetching}) => {

    const chartData = !weeklyLaborHrsCollection ? [] : weeklyLaborHrsCollection.map(({weekNumber, yearWeekNumber, details: { ppmh, 
                regular, overtime, doubleTime, orientation, overAll, sapGross } }) => 
        (
            {
                label: yearWeekNumber,
                value: numeral(ppmh).format(numberFormat),
                toolText: `<b>Week Number: </b> ${yearWeekNumber} <br>
                            <b>Regular: </b> ${numeral(regular).format(numberFormat)} <br>
                            <b>Overtime: </b> ${numeral(overtime).format(numberFormat)} <br>
                            <b>Double TIme: </b> ${numeral(doubleTime).format(numberFormat)} <br>
                            <b>Orientation: </b> ${numeral(orientation).format(numberFormat)} <br>
                            <b>Overall: </b> ${numeral(overAll).format(numberFormat)} <br>
                            <b>SAP Gross: </b> ${numeral(sapGross).format('0,0')} <br>
                            <b>PPMH: </b> ${numeral(ppmh).format(numberFormat)} <br>
                            `
            }
        ));
    
    const dataSource = {
        chart: {
            xAxisName: 'Week Number',
            yAxisName: 'PPMH',
            showValues: '1',
            theme: 'fusion',
            labelDisplay: 'rotate',
            slantLabel: '1',
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
                isWeeklyLaborHrsFetching 
                    ? (<CustomSpinner/>)
                    : (<ReactFC {...chartConfigs} />)
            }   
        </> 
    )
}

const mapStateToProps = ({ morningMeeting }) => ({
    weeklyLaborHrsCollection: morningMeeting.weeklyLaborHrsCollection,
    isWeeklyLaborHrsFetching: morningMeeting.isWeeklyLaborHrsFetching,
})

export default connect(mapStateToProps)(MonthlyIncidentRateChart);