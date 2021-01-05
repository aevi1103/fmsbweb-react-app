import React from 'react'
import moment from 'moment'
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../core/utilities/chart-config'
import { red, lightGray } from '../../../core/utilities/colors'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const ScrapChart = ({ state }) => {

    const data = state.oee?.dataList?.scrap ?? [];
    const startDate = state.oee?.status?.startTime;
    const endDate = state.oee?.status?.endTime;
    const line = state.oee?.line?.line?.groupName;

    const top10Scrap = data.slice(0, 10);

    const dataSource = {
        chart: {
            caption: `${line} Top 10 Scrap Pareto`,
            subCaption: `${moment(startDate).format('lll')} - ${moment(endDate).format('lll')}`,
            showvalues: "1",
            theme: "fusion",
            bgColor: lightGray,
            labelDisplay: "rotate",
            slantLabel: "1",
            ...tooltipStyle
        },
        data: top10Scrap.map(({ scrapAreaName, scrapDesc, qty }) => ({
                label: `${scrapDesc} (${scrapAreaName})`,
                value: qty,
                color: red
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

export default ScrapChart