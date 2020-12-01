import React from 'react';
import { useSelector } from 'react-redux';
import numeral from 'numeral';
import moment from 'moment';

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import {
    tooltipStyle
} from '../../../core/utilities/chart-config'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const numberFormat = '0';

const WeeklyPpmhChart = () => {

    const weeklyLaborHrsCollection = useSelector(({ departmentDashboard }) => departmentDashboard?.weeklyLaborHrsCollection) ?? [];

    const chartData = weeklyLaborHrsCollection.map(({weekStart, weekEnd, yearWeekNumber, details: { ppmh, 
                regular, overtime, doubleTime, orientation, overAll, sapNet } }) => 
        (
            {
                label: yearWeekNumber,
                value: numeral(ppmh).format(numberFormat),
                toolText: `<b>Week Number: </b> ${yearWeekNumber} <br>
                            <b>Week Start: </b> ${moment(weekStart).format('l')} <br>
                            <b>Week End: </b> ${moment(weekEnd).format('l')} <br><br>

                            <b>Regular: </b> ${numeral(regular).format(numberFormat)} <br>
                            <b>Overtime: </b> ${numeral(overtime).format(numberFormat)} <br>
                            <b>Double TIme: </b> ${numeral(doubleTime).format(numberFormat)} <br>
                            <b>Orientation: </b> ${numeral(orientation).format(numberFormat)} <br><br>

                            <b>Overall: </b> ${numeral(overAll).format(numberFormat)} <br>
                            <b>SAP Net: </b> ${numeral(sapNet).format('0,0')} <br>
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

    return <ReactFC {...chartConfigs} />
}

export default WeeklyPpmhChart;