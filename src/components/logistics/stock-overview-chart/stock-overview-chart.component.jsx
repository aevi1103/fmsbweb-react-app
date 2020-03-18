import React from 'react';
import { connect } from 'react-redux';

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import CustomSpinner from '../../custom-spinner/custom-spinner.component';

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const StockOverviewChart = ({stockOVerviewCollection, isStockOverviewFetching}) => {

    const { data } = stockOVerviewCollection;

    const chartData = !data ? [] : data.map(({program, total}) => 
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
            theme: 'fusion',

            toolTipBorderColor: "#001529",
            toolTipBgColor: "#001529",
            toolTipColor: "#fafafa",
            toolTipBgAlpha: "80",
            showToolTipShadow: "1",
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
        <>
            {
                isStockOverviewFetching 
                    ? (<CustomSpinner/>)
                    : (<ReactFC {...chartConfigs} />)
            }   
        </>
    )
}

const mapStateToProps = ({ morningMeeting }) => ({  
    stockOVerviewCollection: morningMeeting.stockOVerviewCollection,
    isStockOverviewFetching: morningMeeting.isStockOverviewFetching,
})

export default connect(mapStateToProps)(StockOverviewChart);