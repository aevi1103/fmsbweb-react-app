import React from 'react'
import { connect } from 'react-redux'
import numeral from 'numeral'
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../core/utilities/chart-config'

import {
    chartProps
} from '../service/helper'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const DowntimeParetoByMachineChart = ({
    downtimeData,
    line,
    filters,
    subCaption = '',
    calculatedDateRange,
    chartWidth,
    chartHeight
}) => {

    if (!downtimeData) return;
    const { startDate, endDate, data } = downtimeData;
    const { take, lastDays } = filters;

    const lastDaysCaption = calculatedDateRange ? `Last ${lastDays} Days ` : ''
    const caption = take > 0 
        ? `${line} ${lastDaysCaption}Top ${take} Downtime Pareto by Machine (${startDate} - ${endDate})`
        : `${line} ${lastDaysCaption}Downtime Pareto by Machine (${startDate} - ${endDate})`

    const dataSource = {
        chart: {
            caption: caption,
            subCaption: subCaption,
            xAxisName: 'Machine',
            yAxisName: 'Downtime (minutes)',
            ...chartProps,
            ...tooltipStyle
        },
        
        data: data.map(({ machine, downtime }) => ({
                label: machine,
                value: downtime,
                link: `newchart-xml-${machine.replace(/\s/g, '_')}`
            })),

        linkeddata: data.map(({ machine, downtime, reasonDetails }) => ({
            id: machine.replace(/\s/g, '_'),
            linkedchart: {
                chart: {
                    caption: `${machine} Downtime Pareto by Reason`,
                    subCaption: `Total Downtime: ${numeral(downtime).format('0,0')}`,
                    xAxisName: 'Reason',
                    yAxisName: 'Downtime (minutes)',
                    ...chartProps,
                    ...tooltipStyle
                },
                data: reasonDetails.map(({ reason2, downtime }) => ({
                    label: reason2,
                    value: downtime
                }))
            }
        }))
      };

      const chartConfigs = {
        type: 'column2d',
        width: chartWidth,
        height: chartHeight,
        dataFormat: 'json',
        dataSource: dataSource
      };


    return (
        <ReactFC {...chartConfigs} />
    )
}

const mapStateToProps = ({ swot }) => ({
    chartWidth: swot.chartWidth,
    chartHeight: swot.chartHeight
})

export default connect(mapStateToProps)(DowntimeParetoByMachineChart);