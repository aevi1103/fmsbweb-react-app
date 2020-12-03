import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import {
    setDowntimeByOwner,
    resetDowntimeByLine
} from '../../../core/redux/downtime/downtime.actions'

import {
    tooltipStyle
} from '../../../core/utilities/chart-config'

import CustomSpinner from '../../../components/custom-spinner/custom-spinner.component'
import { Empty } from 'antd';

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const DowntimeChart = ({
    isDrillDown = true
}) => {

    const dispatch = useDispatch();

    const downtimeCollection = useSelector(({ downtime }) => downtime?.downtimeCollection) ?? [];
    const isDowntimeFetching = useSelector(({ downtime }) => downtime.isDowntimeFetching);

    const categoriesSet = downtimeCollection?.categories ?? [];
    const chartData = downtimeCollection?.chartData ?? [];

    const dataSet = chartData.map(({ seriesname, data }) => ({
        seriesname,
        data: data.map(({totalDowntime}) => ({ value: totalDowntime }))
    }));

    const dataSource = {
        chart: {
            xAxisName: 'Department',
            yAxisName: 'Minutes',
            theme: 'fusion',
            drawcrossline: "1",
            showsum: "1",
            labelDisplay: "rotate",
            slantLabel: "1",
            plottooltext: 'Shift: $seriesname, Department: $label, Downtime: $value minutes',
            
            ...tooltipStyle
        },
        categories: [
            {
              category: categoriesSet.map(({ dept }) => ({ label: dept }))
            }
          ],
        dataset: dataSet
      };
      
      const chartConfigs = {
        type: 'stackedcolumn2dline',
        width: '100%',
        height: '89%',
        dataFormat: 'json',
        dataSource: dataSource,
        events: {
            dataplotClick: function(evt) {

                if (isDrillDown) {
                    const { categoryLabel, datasetName } = evt.data;        
                    dispatch(setDowntimeByOwner(downtimeCollection, categoryLabel, datasetName))
                    dispatch(resetDowntimeByLine())
                }

            }
          }
      };

      return isDowntimeFetching 
                ? <CustomSpinner/> 
                : chartData.length === 0 
                    ? <Empty/>
                    : <ReactFC {...chartConfigs} />
}


export default DowntimeChart;