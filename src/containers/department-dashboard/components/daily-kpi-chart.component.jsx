import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment'
import numeral from 'numeral'

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../core/utilities/chart-config'
import { colors } from '../../../core/utilities/colors'
import { dateFormat } from '../../../core/utilities/helpers'

const {
    green,
    red,
    yellow
} = colors;

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const renderValue = ({ sapOae, scrapRate, downtimeRate }, key) => {
            
    if (key === 'OAE %') {
        if (sapOae > 1) return 1;
        if (sapOae < 0) return 0;
        return sapOae;
    }

    if (key === 'Scrap % by Dept') {
        if (scrapRate > 1) return 1;
        if (scrapRate < 0) return 0        
        return scrapRate; 
    }

    if (key === 'Downtime %') {
        if (downtimeRate > 1) return 1;
        if (downtimeRate < 0) return 0        
        return downtimeRate;
    }
    
}

const DailyKpiChart = () => {

    const dailyKpi = useSelector(({ departmentDashboard }) => departmentDashboard?.dailyKpi) ?? {}
    const series = dailyKpi?.series ?? [];
    const data = dailyKpi?.data ?? [];
    const categories = dailyKpi?.categories ?? [];

    const dataSet = series.map(key => {
        return {
            seriesName: key,
            renderas: key === "Scrap % by Dept" ? "line" : "area",
            parentyaxis: key === "Scrap % by Dept" ? "S" : "",
            data: data.map(d => 
                    ({
                        value: numeral(renderValue(d, key)).format('0.00%'),
                        anchorRadius: (key === "OAE %" && d.sapOae > 1) ? 6 : 0,
                        anchorSides: (key === "OAE %" && d.sapOae > 1) ? 3 : 0
                    }))
        }
    })

    const dataSource = {
        chart: {
            xAxisName: '%',
            yAxisName: 'OAE, Downtime and Scrap %',
            showValues: '0',
            theme: 'fusion',
            paletteColors: `${green}, ${yellow}, ${red}`,
            plottooltext: '$label: <b>$seriesname:</b> <b>$value</b>',
            connectNullData: '1',
            labelDisplay: 'rotate',
            slantLabel: '1',
            ...tooltipStyle
        },
        categories: [
            {
                category:  categories.map(c => ({label: moment(c, dateFormat).format(dateFormat)}))
            }
        ],
        dataset: dataSet
      };
      
      const chartConfigs = {
        type: 'stackedarea2d',
        width: '100%',
        height: '86%',
        dataFormat: 'json',
        dataSource: dataSource
      };

    return <ReactFC {...chartConfigs} />
}

export default DailyKpiChart;