import React from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral';

import { 
    Spin,
    Icon
 } from "antd";

 
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const loadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const MonthlyIncidentRateChart = ({isMonthlyIncidentRateFetching, monthlyIncidentRateCollection}) => {

    const chartData = monthlyIncidentRateCollection.map(({month, incidentRate, manHours, numberOfRecordable}) => 
        (
            {
                label: month.substr(0,3),
                value: incidentRate,
                color: month === 'YTD' ? '#ff5722' : '',
                toolText: `<b>Month: </b> ${month} <br>
                            <b>Man Hours: </b> ${numeral(manHours).format('0,0')} <br>
                            <b>Recordables: </b> ${numeral(numberOfRecordable).format('0,0')} <br>
                            <b>Incident Rate: </b> ${incidentRate} <br>`
            }
        ));
    
    const dataSource = {
        chart: {
          xAxisName: 'Months',
          yAxisName: 'Incident Rate',
          showValues: '1',
          theme: 'fusion'
        },
        data: chartData
      };
      
      const chartConfigs = {
        type: 'column2d',
        width: '100%',
        height: 400,
        dataFormat: 'json',
        dataSource: dataSource
      };

    return (
        <>
            {
                isMonthlyIncidentRateFetching ? <Spin indicator={loadingIcon} tip="loading..." /> : <ReactFC {...chartConfigs} />
            }
        </>

    )
}

const mapStateToProps = ({ morningMeeting }) => ({
    isMonthlyIncidentRateFetching: morningMeeting.isMonthlyIncidentRateFetching,
    monthlyIncidentRateCollection: morningMeeting.monthlyIncidentRateCollection,
})

export default connect(mapStateToProps)(MonthlyIncidentRateChart);