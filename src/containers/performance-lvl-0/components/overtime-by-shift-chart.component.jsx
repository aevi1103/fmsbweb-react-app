import React from 'react';
import { useSelector } from 'react-redux';
import numeral from 'numeral';

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../core/utilities/chart-config';
import CustomSpinner from '../../../components/custom-spinner/custom-spinner.component';

import { Empty } from 'antd';

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const OvertimePercentPerShiftChart = () => {

    const collection = useSelector(({ performance2 }) => performance2?.overtimeShiftCollection) ?? [];
    const loading = useSelector(({ performance2 }) => performance2.loading);

    const chartProps = {
        showvalues: "1",
        showpercentintooltip: "0",
        enablemultislicing: "1",
        theme: "fusion",
        useDataPlotColorForLabels: "1",
        showLegend: "1",
        drawcrossline: "1",
        numberSuffix: "%"
    };

    const dataSource = {
        chart: {
            xAxisName: 'Shift',
            yAxisName: 'Overtime %',
            ...chartProps,
            ...tooltipStyle
        },
        data: collection.map(({shift, overallHours, overtimeHours, overtimePercentage}) => ({
                label: shift,
                value: (overtimePercentage * 100).toFixed(2),
                toolText: `<b>Shift:</b> ${shift} <br>
                            <b>Overtime Hours:</b> ${numeral(overtimeHours).format('0,0')} <br>
                            <b>Overall Hours:</b> ${numeral(overallHours).format('0,0')} <br>
                            <b>Overtime %:</b> ${numeral(overtimePercentage).format('0.0%')} <br>`,
            }))
            
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
            : collection.length === 0 
                ? <Empty/>
                : <ReactFC {...chartConfigs} />
}

export default OvertimePercentPerShiftChart;