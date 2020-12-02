import React from 'react';
import _ from 'lodash';

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import CustomSpinner from '../../../components/custom-spinner/custom-spinner.component';
import { tooltipStyle } from '../../../core/utilities/chart-config'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const IncidentByDeptChart = React.memo(({ incidentData, loading }) => {

    const categories = incidentData?.categories ?? []
    const series = incidentData?.series ?? []
    const data = incidentData?.data ?? []

    let ListOfInjuries = [];

    data.forEach(({ department, injuries }) => {
        injuries.forEach(injury => {
            ListOfInjuries.push({
                department,
                ...injury
            })
        })
    });

    const incidents = _.groupBy(ListOfInjuries, o => o.injuryStatus);
    const dataSet = Object.keys(incidents).map(key => {
        return {
            seriesName: key,
            color: series.find(({ injuryStatus }) => injuryStatus === key).colorCode,
            data: _.orderBy(incidents[key], o => o.department)                    
                    .map(({numberOfIncidents, colorCode }) => 
                            ({
                                value: numberOfIncidents,
                                color: colorCode
                            }))
        }
    })

    const dataSource = {
        chart: {
          xAxisName: 'Months',
          yAxisName: 'Incident Rate',
          showValues: '0',
          theme: 'fusion',
          ...tooltipStyle
        },
        categories: [
            {
                category: _.orderBy(categories).map(c => ({label: c}))
            }
        ],
        dataset: dataSet
    };
      
    const chartConfigs = {
        type: 'stackedcolumn2d',
        width: '100%',
        height: '89%',
        dataFormat: 'json',
        dataSource: dataSource
    };

    return loading 
        ? <CustomSpinner/>
        : <ReactFC {...chartConfigs} />
})

export default IncidentByDeptChart;