import React from 'react'
import moment from 'moment'
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../core/utilities/chart-config'
import { yellow, lightGray } from '../../../core/utilities/colors'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const DowntimeChart = ({ state }) => {

    const data = state.oee?.dataList?.downtime ?? [];
    const startDate = state.oee?.status?.startTime;
    const endDate = state.oee?.status?.endTime;
    const line = state.oee?.line?.line?.groupName;

    const dataSource = {
        chart: {
            caption: `${line} Downtime Pareto`,
            subCaption: `${moment(startDate).format('lll')} - ${moment(endDate).format('lll')}`,
            showvalues: "1",
            theme: "fusion",
            bgColor: lightGray,
            ...tooltipStyle
        },
        data: data.map(({ downtime, machine }) => ({
                label: machine,
                value: downtime,
                color: yellow
            }))
      };

      const chartConfigs = {
        type: 'column2d',
        width: '100%',
        height: '266',
        dataFormat: 'json',
        dataSource: dataSource
      };


    return <ReactFC {...chartConfigs} />
}

export default DowntimeChart