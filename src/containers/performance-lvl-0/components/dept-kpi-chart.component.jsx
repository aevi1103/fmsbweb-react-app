import React from 'react';
import { useSelector } from 'react-redux';
import numeral from 'numeral'

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../core/utilities/chart-config'
import CustomSpinner from '../../../components/custom-spinner/custom-spinner.component'

import { Empty } from 'antd';

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const DeptKpiChart = () => {

    const deptKpi = useSelector(({ performance0 }) => performance0?.deptKpi) ?? null;
    const isDeptKpiFetching = useSelector(({ performance0 }) => performance0.isDeptKpiFetching);

    const { area, target } = deptKpi || {};

    const {
        sapOae,
        oaeColor,
        oaeTarget,
        downtimeRate,
        unkownRate,
        scrapDetails,
        totalProduction,
        sapGross
    } = deptKpi || {};

    const scrapDetailsItems = scrapDetails?.map(({ scrapAreaName, scrapRate, scrapQty, colorCode }) => ({
        label: scrapAreaName,
        color: colorCode,
        value: (scrapRate * 100).toFixed(2),
        toolText: `<b>Scrap Type</b> ${scrapAreaName} <br>
                    <b>SAP Gross</b> ${numeral(sapGross).format('0,0')} <br>
                    <b>Scrap Qty</b> ${numeral(scrapQty).format('0,0')} <br>
                    <b>Scrap %</b> ${numeral(scrapRate).format('0.00%')} <br><br>
                    <small>*Includes SB + Purchased Scrap</small>`
    })) ?? []

    const data = [
        {
            label: 'OAE %',
            value: (sapOae * 100).toFixed(2),
            color: oaeColor,
            toolText: `<b>OAE Target</b> ${numeral(oaeTarget).format('0.00%')} <br>
                        <b>SAP Net</b> ${numeral(totalProduction).format('0,0')} <br>                
                        <b>OAE %</b> ${numeral(sapOae).format('0.00%')}`
        },
        {
            label: 'Downtime %',
            color: '#5969bf',
            value: (downtimeRate * 100).toFixed(2),
        },
        {
            label: 'Unknown %',
            color: '#8598a0',
            value: (unkownRate * 100).toFixed(2)
        },
        ...scrapDetailsItems
    ]

    const dataSource = {
        chart: {
            showvalues: "1",
            showpercentintooltip: "0",
            enablemultislicing: "0",
            theme: "fusion",
            useDataPlotColorForLabels: "1",
            showLegend: "1",
            ...tooltipStyle
        },
        data: (target === 0 || area === 'Plant') ? [] : data
      };
      
      const chartConfigs = {
        type: 'doughnut2d',
        width: '100%',
        height: '89%',
        dataFormat: 'json',
        dataSource: dataSource
      };

      return isDeptKpiFetching 
        ? <CustomSpinner/> 
        : deptKpi 
            ? <ReactFC {...chartConfigs} />
            : <Empty />
}


export default DeptKpiChart;