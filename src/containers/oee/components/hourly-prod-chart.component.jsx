import React from 'react'
import moment from 'moment'
import { useSelector } from 'react-redux'
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../core/utilities/chart-config'
import { green, lightGray } from '../../../core/utilities/colors'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const HourlyProdChart = () => {

    const data = useSelector(({ oeeReducer }) => oeeReducer?.oee?.dataList?.prod ?? [])
    const startDate = useSelector(({ oeeReducer }) => oeeReducer.oee?.status?.startTime)
    const endDate = useSelector(({ oeeReducer }) => oeeReducer.oee?.status?.endTime)
    const line = useSelector(({ oeeReducer }) => oeeReducer.oee?.line?.line.machineName)

    const dataSource = {
        chart: {
            caption: `${line} Hourly Production`,
            subCaption: `${moment(startDate).format('lll')} - ${moment(endDate).format('lll')}`,
            showvalues: "1",
            theme: "fusion",
            bgColor: lightGray,
            paletteColors: `${green}`,
            ...tooltipStyle
        },
        data: data.map(({ label, count, date }) => ({
                label: label,
                value: count,
                tooltext: `<b>Date:</b> ${moment(date).format('M/D/YYYY')} <br>
                    <b>Hour:</b> ${label} <br>
                    <b>Count:</b> ${count}`
            }))
      };

      const chartConfigs = {
        type: 'column2d',
        width: '100%',
        height: '294',
        dataFormat: 'json',
        dataSource: dataSource
      };


    return <ReactFC {...chartConfigs} />
}

export default HourlyProdChart