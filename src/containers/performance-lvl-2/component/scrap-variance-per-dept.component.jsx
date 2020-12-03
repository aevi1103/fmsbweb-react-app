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

const ScrapVariancePerDeptChart = () => {

    const collection = useSelector(({ performance2 }) => performance2?.scrapVarianceByDeptCollection) ?? [];
    const isScrapVarianceByDeptFetching = useSelector(({ performance2 }) => performance2.isScrapVarianceByDeptFetching);

    const chartProps = {
        showvalues: "1",
        showpercentintooltip: "0",
        enablemultislicing: "1",
        theme: "fusion",
        useDataPlotColorForLabels: "1",
        showLegend: "1",
        drawcrossline: "1",
        numberSuffix: "%"
    }

    const dataSource = {
        chart: {
            xAxisName: 'Department',
            yAxisName: 'Scrap %',
            labelDisplay: "rotate",
            slantLabel: "1",
            rotateValues: "1",
            ...chartProps,
            ...tooltipStyle
        },
        data: collection.map(({area, qty, sapGross, scrapRate}) => ({
                label: area,
                value: (scrapRate * 100).toFixed(2),
                toolText: `<b>Dept:</b> ${area} <br>
                            <b>SAP Gross:</b> ${numeral(sapGross).format('0,0')} <br>
                            <b>Scrap Qty:</b> ${numeral(qty).format('0,0')} <br>
                            <b>Scrap %:</b> ${numeral(scrapRate).format('0.00%')}`,
                link: `newchart-xml-${area.replace(' ','_')}`
            })),
            
        linkeddata: collection.map(({ area, scrapAreaNameDetails }) => ({
            id: area.replace(' ','_'),
            linkedchart: {
                chart: {
                    caption: `${area} Dept - Scrap % by Scrap Type (Drilldown)`,
                    xAxisName: 'Scrap Type',
                    yAxisName: 'Scrap %',
                    ...chartProps,
                    ...tooltipStyle
                },
                data: scrapAreaNameDetails.map(({ scrapAreaName, area, qty, scrapRate }) => ({ 
                        label: scrapAreaName,
                        value: (scrapRate * 100).toFixed(2),
                        toolText: `<b>Dept:</b> ${area} <br>
                                    <b>Scrap Type:</b> ${scrapAreaName} <br>
                                    <b>Scrap Qty:</b> ${numeral(qty).format('0,0')} <br>
                                    <b>Scrap %:</b> ${numeral(scrapRate).format('0.00%')}`,
                        link: `newchart-xml-${area.replace(' ','_')}_${scrapAreaName.replace(' ','_')}` 
                    })),

                linkeddata: scrapAreaNameDetails.map(({ area, scrapAreaName, lineDetails }) => ({
                    id: `${area.replace(' ','_')}_${scrapAreaName.replace(' ','_')}`,
                    linkedchart: {
                        chart: {
                            caption: `Dept: ${area} / Scrap Type: ${scrapAreaName} - Scrap % by Line`,
                            xAxisName: 'Line',
                            yAxisName: 'Scrap %',
                            ...chartProps,
                            ...tooltipStyle
                        },
                        data: lineDetails.map(({ line, qty, scrapRate }) => ({ 
                            label: line,
                            value: (scrapRate * 100).toFixed(2),
                            toolText: `<b>Dept:</b> ${area} <br>
                                        <b>Scrap Type:</b> ${scrapAreaName} <br>
                                        <b>Line:</b> ${line} <br>
                                        <b>Scrap Qty:</b> ${numeral(qty).format('0,0')} <br>
                                        <b>Scrap %:</b> ${numeral(scrapRate).format('0.00%')}`,
                        }))
                    }
                }))
            }
        }))
      };
      
      const chartConfigs = {
        type: 'column2d',
        width: '100%',
        height: '89%',
        dataFormat: 'json',
        dataSource: dataSource
      };

    return isScrapVarianceByDeptFetching 
            ? <CustomSpinner/> 
            : collection.length === 0 
                ? <Empty/>
                : <ReactFC {...chartConfigs} />
}


export default ScrapVariancePerDeptChart;