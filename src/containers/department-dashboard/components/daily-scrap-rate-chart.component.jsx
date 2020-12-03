import React from 'react';
import { useSelector } from 'react-redux';
import numeral from 'numeral';

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';
import moment from 'moment';

import { tooltipStyle } from '../../../core/utilities/chart-config'
import { dateFormat } from '../../../core/utilities/helpers'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const DailyScrapRateChart = () => {

    const dailyScrapRateCollection = useSelector(({ departmentDashboard }) => departmentDashboard?.dailyScrapRateCollection) ?? []

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
        data: dailyScrapRateCollection.map(({shiftDate, scrapRate, totalScrap, sapGross}) => ({
            label: moment(shiftDate).format(dateFormat),
            value: scrapRate ? numeral(scrapRate).format('0.00%') : null,
            toolText: `<b>Shift Date: </b> ${moment(shiftDate).format(dateFormat)} <br>
                        <b>Total Scrap: </b> ${numeral(totalScrap).format('0,0')} <br>
                        <b>SAP Gross: </b> ${numeral(sapGross).format('0,0')} <br>
                        <b>Scrap Rate: </b> ${numeral(scrapRate).format('0.0%')} <br>`
        }))
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

export default DailyScrapRateChart;