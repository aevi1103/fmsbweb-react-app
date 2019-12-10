import React from 'react';
import { connect } from 'react-redux';

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const StockOverviewChart = ({stockOVerviewCollection}) => {

    const { data } = stockOVerviewCollection;

    const chartData = data.map(({program, total}) => 
        (
            {
                label: program,
                value: total
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
        height: '89%',
        dataFormat: 'json',
        dataSource: dataSource
      };

    return (
        <ReactFC {...chartConfigs} />
    )
}

const mapStateToProps = ({ morningMeeting }) => ({
    stockOVerviewCollection: morningMeeting.stockOVerviewCollection,
})

export default connect(mapStateToProps)(StockOverviewChart);