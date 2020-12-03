import React from 'react';
import numeral from 'numeral';

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import CustomSpinner from '../../../components/custom-spinner/custom-spinner.component';
import { tooltipStyle } from '../../../core/utilities/chart-config'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const MonthlyIncidentRateChart = React.memo(({ data, loading}) => {

    const dataSource = {
        chart: {
          xAxisName: 'Months',
          yAxisName: 'Incident Rate',
          showValues: '1',
          theme: 'fusion',
          ...tooltipStyle
        },
        data: data.map(({month, incidentRate, manHours, numberOfRecordable}) => ({
                label: month.substr(0,3),
                value: incidentRate,
                color: month === 'YTD' ? '#ff5722' : '',
                toolText: `<b>Month: </b> ${month} <br>
                            <b>Man Hours: </b> ${numeral(manHours).format('0,0')} <br>
                            <b>Recordables: </b> ${numeral(numberOfRecordable).format('0,0')} <br>
                            <b>Incident Rate: </b> ${incidentRate} <br>`
            }
        ))
      };
      
      const chartConfigs = {
        type: 'column2d',
        width: '100%',
        height: '89%',
        dataFormat: 'json',
        dataSource: dataSource
      };

    return loading 
      ? <CustomSpinner/>
      : <ReactFC {...chartConfigs} />
})

export default MonthlyIncidentRateChart;