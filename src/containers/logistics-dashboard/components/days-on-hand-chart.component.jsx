import React from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../core/utilities/chart-config'
FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const DaysOnHandTableChart = () => {

    const loading = useSelector(({ morningMeeting: { isStockStatusFetching } }) => isStockStatusFetching) || false;
    const daysOnHand = useSelector(({ morningMeeting: { stockStatusCollection } }) => stockStatusCollection.daysOnHand) || [];

    const data = daysOnHand.filter(({ qty }) => qty > 0)

    const dataSource = {
            chart: {
                showValues: '1',
                theme: 'fusion',
                legendPosition: 'top',
                rotateValues: '1',
                drawcrossline: "1",
                ...tooltipStyle
            },
            categories: [
                {
                    category: data.map(({ material, program }) => ({ label: `${material} (${program})` }))
                }
            ],
            dataset: [
                {
                    seriesName: 'Stock Qty',
                    data: data.map(({ qty }) => ({ 
                        value: qty
                     })),
                },
                {
                    seriesName: 'Safety Stock',
                    data: data.map(({ safetyStock }) => ({ value: safetyStock }))
                },
                {
                    seriesName: 'Days on Hand',
                    parentyaxis: "S",
                    renderas: "line",
                    data: data.map(({ daysOnHand }) => ({ value: daysOnHand }))
                }
            ]
        };
        
    const chartConfigs = {
            type: 'scrollcombidy2d',
            width: '100%',
            height: '400',
            dataFormat: 'json',
            dataSource: dataSource
        };

    return loading 
    ? null
    : <ReactFC {...chartConfigs} />
}

export default DaysOnHandTableChart;