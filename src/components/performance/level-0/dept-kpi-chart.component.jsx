import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../core/utilities/chart-config'
import CustomSpinner from '../../custom-spinner/custom-spinner.component'

import { Empty } from 'antd';

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const DeptKpiChart = ({
    deptKpiCollection,
    isDeptKpiFetching
}) => {

    const [collection, setCollection] = useState([])

    useEffect(() => {

        try {
            setCollection(deptKpiCollection ? deptKpiCollection : []); 
        } catch (error) {
            setCollection([]);
        } 
        
    },[deptKpiCollection])

    const dataSource = {
        chart: {
            showvalues: "1",
            showpercentintooltip: "0",
            enablemultislicing: "0",
            theme: "fusion",
            useDataPlotColorForLabels: "1",
            showLegend: "1",
            // paletteColors: "#19bc9c, #ffc107, #546e7a, #9E9E9E, #9E9E9E, #9C27B0, #673AB7, #3F51B5",
            // plottooltext: 'Owner: $label {br} Downtime: $value minutes',
            ...tooltipStyle
        },
        data: collection
      };
      
      const chartConfigs = {
        type: 'doughnut2d',
        width: '100%',
        height: '89%',
        dataFormat: 'json',
        dataSource: dataSource
      };

      return isDeptKpiFetching 
        ? <CustomSpinner/> 
        : collection.length === 0 
            ? <Empty/>
            : <ReactFC {...chartConfigs} />
    }

const mapStateToProps = ({ morningMeeting }) => ({
    deptKpiCollection: morningMeeting.deptKpiCollection,
    isDeptKpiFetching: morningMeeting.isDeptKpiFetching
})

export default connect(mapStateToProps)(DeptKpiChart);