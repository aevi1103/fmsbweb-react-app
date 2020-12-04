import React from 'react';
import { useSelector } from 'react-redux';
import numeral from 'numeral';

import { Empty } from 'antd'

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../core/utilities/chart-config';

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const numberFormat = '0,0.00';

const PpmhPerShiftChart = () => {

    const ppmhCollection = useSelector(({ departmentDashboard }) => departmentDashboard?.ppmhCollection) ?? [];
    const chartProps = {
        showvalues: "1",
        showpercentintooltip: "0",
        enablemultislicing: "1",
        theme: "fusion",
        useDataPlotColorForLabels: "1",
        showLegend: "1",
        drawcrossline: "1"
    };

    const dataSource = {
        chart: {
            xAxisName: 'Shift',
            yAxisName: 'PPMH',
            ...chartProps,
            ...tooltipStyle
        },
        data: ppmhCollection.map(({shift, sapNet, laborHours: { ppmh, regular, overtime, doubleTime, orientation, overAll }}) => ({
                label: shift,
                value: Math.round(ppmh),
                toolText: `<b>Shift: </b> ${shift} <br>
                            <b>Regular: </b> ${numeral(regular).format(numberFormat)} <br>
                            <b>Overtime: </b> ${numeral(overtime).format(numberFormat)} <br>
                            <b>Double TIme: </b> ${numeral(doubleTime).format(numberFormat)} <br>
                            <b>Orientation: </b> ${numeral(orientation).format(numberFormat)} <br>
                            <b>Overall: </b> ${numeral(overAll).format(numberFormat)} <br>
                            <b>SAP Net: </b> ${numeral(sapNet).format('0,0')} <br>
                            <b>PPMH: </b> ${numeral(ppmh).format('0,0')} <br>
                            `
            }))
            
      };
      
      const chartConfigs = {
        type: 'column2d',
        width: '100%',
        height: '86%',
        dataFormat: 'json',
        dataSource: dataSource
      };

    return ppmhCollection.length > 0 
            ? <ReactFC {...chartConfigs} /> 
            : <Empty/>
}

export default PpmhPerShiftChart;