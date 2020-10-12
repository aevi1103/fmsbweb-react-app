import React from 'react'
import numeral from 'numeral'
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../helpers/chart-config'

import {
    chartProps,
    chartConfigProps
} from '../helper'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const DowntimeParetoByReasonChart = ({
    downtimeData,
    line,
    filters,
    calculatedDateRange
}) => {

    if (!downtimeData) return;
    const { startDate, endDate, data } = downtimeData;
    const { take, lastDays } = filters;

    const lastDaysCaption = calculatedDateRange ? `Last ${lastDays} Days ` : ''
    const caption = take > 0 
        ? `${line} ${lastDaysCaption}Top ${take} Downtime Pareto by Reason`
        : `${line} ${lastDaysCaption}Downtime Pareto by Reason`

    const dataSource = {
        chart: {
            caption: caption,
            subCaption: `${startDate} - ${endDate}`,
            xAxisName: 'Reason',
            yAxisName: 'Downtime (minutes)',
            rotateValues: '1',
            ...chartProps,
            ...tooltipStyle
        },
        data: data.map(({ reason2, downtime }) => ({
                label: reason2,
                value: downtime,
                link: `newchart-xml-${reason2.replace(/\s/g, '_')}`
            })),
        linkeddata: data.map(({ reason2, downtime, machineDetails }) => ({
            id: reason2.replace(/\s/g, '_'),
            linkedchart: {
                chart: {
                    caption: `${reason2} Downtime Pareto by Machine`,
                    subCaption: `Total Downtime: ${numeral(downtime).format('0,0')}`,
                    xAxisName: 'Machine',
                    yAxisName: 'Downtime (minutes)',
                    rotateValues: '1',
                    ...chartProps,
                    ...tooltipStyle
                },
                data: machineDetails.map(({ machine, downtime }) => ({
                    label: machine,
                    value: downtime
                }))
            }
        }))
      };

    const chartConfigs = {
        type: 'column2d',
        ...chartConfigProps,
        dataSource: dataSource
      };

    return (
        <ReactFC {...chartConfigs} />
    )
}

export default DowntimeParetoByReasonChart;