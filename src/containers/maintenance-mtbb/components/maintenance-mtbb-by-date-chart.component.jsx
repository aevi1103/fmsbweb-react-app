import React from 'react'
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ExcelExport from "fusioncharts/fusioncharts.excelexport";
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../core/utilities/chart-config'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts,ExcelExport, FusionTheme);

const MaintenanceMtbbByDateChart = React.memo(({ 
    data,
    dates,
    start,
    end,
    line,
    stackChart = false,
    showValues = true
 }) => {

    const dataSource = {
        chart: {
            caption: `${line} Daily MTBB (${start} - ${end})`,
            showvalues: showValues ? '1' : '0',
            theme: "fusion",
            xaxisname: "Dates",
            yaxisname: "Hours",
            labelDisplay: 'rotate',
            slantLabel: '1',
            connectNullData: '1',
            exportEnabled: '1',
            exportFileName: `${line}_MaintenanceMtbb`,
            // rotateValues: '1',
            ...tooltipStyle
        },
        categories: [ 
            {
                category: dates.map(date => ({ label: date }))
            }
        ],
        dataset: data.map(({ machine, mtbb }) => ({
            seriesname: machine,
            data: mtbb.map(({ mtbbMinutes, mtbbHours }) => ({
                value: mtbbHours
            }))
        }))
      };

      const chartConfigs = {
        type: stackChart ? 'stackedcolumn2d' : 'msline',
        width: '100%',
        height: '400',
        dataFormat: 'json',
        dataSource: dataSource
      };


    return <ReactFC {...chartConfigs} />

})

export default MaintenanceMtbbByDateChart