import React from 'react'
import numeral from 'numeral'
import moment from 'moment'
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

const DailyDowntimeByReasonChart = ({
    downtimeData,
    line,
    filters,
    calculatedDateRange
}) => {

    if (!downtimeData) return;
    const { startDate, endDate, data } = downtimeData;
    const { lastDays } = filters;
    const lastDaysCaption = calculatedDateRange ? `Last ${lastDays} Days ` : ''

    const dataSource = {
        chart: {
            caption: `${line} ${lastDaysCaption}Daily Downtime by Machine Drilldown`,
            subCaption: `${startDate} - ${endDate}`,
            xAxisName: 'Shift Date',
            yAxisName: 'Downtime (minutes)',
            rotateValues: '1',
            ...chartProps,
            ...tooltipStyle
        },

        data: data.map(({ shifDate, downtime }) => ({
            label: moment(shifDate).format('MM/DD/YYYY'),
            value: downtime,
            link: `newchart-xml-${moment(shifDate).format('MMDDYY')}`
        })),

        linkeddata: data.map(({ shifDate, downtime, machineDetails }) => ({
            id: moment(shifDate).format('MMDDYY'),
            linkedchart: {
                chart: {
                    caption: `${moment(shifDate).format('MM/DD/YYYY')} Downtime Pareto by Machine`,
                    subCaption: `Total Downtime: ${numeral(downtime).format('0,0')}`,
                    xAxisName: 'Machine',
                    yAxisName: 'Downtime (minutes)',
                    rotateValues: '1',
                    ...chartProps,
                    ...tooltipStyle
                },
                
                data: machineDetails.map(({ machine, downtime }) => ({
                    label: machine,
                    value: downtime,
                    link: `newchart-xml-${machine.replace(/\s/g, '_')}`
                })),
                
                linkeddata: machineDetails.map(({ machine, downtime, reasonDetails }) => ({
                    id: machine.replace(/\s/g, '_'),
                    linkedchart: {
                        chart: {
                            caption: `${moment(shifDate).format('MM/DD/YYYY')} / ${machine} Downtime Pareto by Reason`,
                            subCaption: `Total Downtime: ${numeral(downtime).format('0,0')}`,
                            xAxisName: 'Reason',
                            yAxisName: 'Downtime (minutes)',
                            rotateValues: '1',
                            ...chartProps,
                            ...tooltipStyle
                        },
                        data: reasonDetails.map(({ reason2, downtime }) => ({
                            label: reason2,
                            value: downtime
                        })),
                        
                    }
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

export default DailyDowntimeByReasonChart;