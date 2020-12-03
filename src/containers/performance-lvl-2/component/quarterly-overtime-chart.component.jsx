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

const QuarterlyOvertimeChart = () => {

    const collection = useSelector(({ performance2 }) => performance2?.overtimeQuarterCollection) ?? [];
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
            xAxisName: 'Quarter',
            yAxisName: 'Overtime %',
            ...chartProps,
            ...tooltipStyle
        },
        data: collection.map(({dept, year, quarter, overallHours, overtimeHours, overtimePercentage}) => ({
                label: `${year}-Q${quarter}`,
                value: (overtimePercentage * 100).toFixed(2),
                toolText: `<b>Dept:</b> ${dept} <br>
                            <b>Year:</b> ${year} <br>
                            <b>Quarter:</b> ${quarter} <br>
                            <b>Overtime Hours:</b> ${numeral(overtimeHours).format('0,0')} <br>
                            <b>Overall Hours:</b> ${numeral(overallHours).format('0,0')} <br>
                            <b>Overtime %:</b> ${numeral(overtimePercentage).format('0.0%')} <br>`,
                link: `newchart-xml-${year}_${quarter}`
            })),

            linkeddata: collection.map(({ dept, year, quarter, monthDetails }) => ({
                id: `${year}_${quarter}`,
                linkedchart: {
                    chart: {
                        caption: `${dept} Year: ${year} Quarter: ${quarter} - Overtime % by Month`,
                        xAxisName: 'Month',
                        yAxisName: 'Overtime %',
                        ...chartProps,
                        ...tooltipStyle
                    },
                    data: monthDetails.map(({ year, monthName, overallHours, overtimeHours, overtimePercentage }) => ({ 
                            label: `${year}-${monthName}`,
                            value: (overtimePercentage * 100).toFixed(2),
                            toolText: `<b>Dept:</b> ${dept} <br>
                                        <b>Year:</b> ${year} <br>
                                        <b>Quarter:</b> ${quarter} <br>
                                        <b>Month:</b> ${monthName} <br>
                                        <b>Overtime Hours:</b> ${numeral(overtimeHours).format('0,0')} <br>
                                        <b>Overall Hours:</b> ${numeral(overallHours).format('0,0')} <br>
                                        <b>Overtime %:</b> ${numeral(overtimePercentage).format('0.0%')} <br>`
                        })),
                }
            }))
            
      };
      
      const chartConfigs = {
        type: 'line',
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


export default QuarterlyOvertimeChart;