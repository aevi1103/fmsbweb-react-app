import React from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral';

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const numberFormat = '0,0.00';

const MonthlyIncidentRateChart = ({weeklyLaborHrsCollection}) => {

    const chartData = !weeklyLaborHrsCollection ? [] : weeklyLaborHrsCollection.map(({weekNumber, details: { ppmh, 
                regular, overtime, doubleTime, orientation, overAll, sapGross } }) => 
        (
            {
                label: `Wk${weekNumber}`,
                value: numeral(ppmh).format(numberFormat),
                toolText: `<b>Week Number: </b> ${weekNumber} <br>
                            <b>Regular: </b> ${numeral(regular).format(numberFormat)} <br>
                            <b>Overtime: </b> ${numeral(overtime).format(numberFormat)} <br>
                            <b>Double TIme: </b> ${numeral(doubleTime).format(numberFormat)} <br>
                            <b>Orientation: </b> ${numeral(orientation).format(numberFormat)} <br>
                            <b>Overall: </b> ${numeral(overAll).format(numberFormat)} <br>
                            <b>SAP Gross: </b> ${numeral(sapGross).format('0,0')} <br>
                            <b>PPMH: </b> ${numeral(overAll).format(numberFormat)} <br>
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
            slantLabel: '1'
        },
        data: chartData
      };
      
      const chartConfigs = {
        type: 'line',
        width: '100%',
        height: '89%',
        dataFormat: 'json',
        dataSource: dataSource
      };

    return (
        <ReactFC {...chartConfigs} />
    )
}

const mapStateToProps = ({ morningMeeting }) => ({
    weeklyLaborHrsCollection: morningMeeting.weeklyLaborHrsCollection,
})

export default connect(mapStateToProps)(MonthlyIncidentRateChart);