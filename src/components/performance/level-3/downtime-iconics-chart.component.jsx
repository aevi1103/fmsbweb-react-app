import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral';
import _ from 'lodash';

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../core/utilities/chart-config';
import CustomSpinner from '../../custom-spinner/custom-spinner.component';

import { Empty } from 'antd';

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const DowntimeIconicsChart = ({
    isDowntimeIconicsFetching,
    downtimeIconicsCollections
}) => {

    const [collection, setCollection] = useState([]);
    useEffect(() => {

        try {
            setCollection(downtimeIconicsCollections || downtimeIconicsCollections.length > 0 ? downtimeIconicsCollections : []); 
        } catch (error) {
            setCollection([]);
        }
        
    },[downtimeIconicsCollections]);

    const chartProps = {
        showvalues: "1",
        showpercentintooltip: "0",
        enablemultislicing: "1",
        theme: "fusion",
        useDataPlotColorForLabels: "1",
        showLegend: "1",
        drawcrossline: "1",
        labelDisplay: "rotate",
        slantLabel: "1",
        rotateValues: "1",
    };

    const dataSource = {
        chart: {
            xAxisName: 'Line',
            yAxisName: 'Downtime Minutes',
            ...chartProps,
            ...tooltipStyle
        },
        data: collection.map(({line, totalDowntime}) => ({
                label: line,
                value: totalDowntime,
                toolText: `<b>Line:</b> ${line} <br>
                            <b>Downtime:</b> ${numeral(totalDowntime).format('0,0')} minutes <br>
                            <b>Downtime:</b> ${numeral(totalDowntime / 60).format('0,0')} hours`,
                link: `newchart-xml-${_.camelCase(line)}`
            })),
            linkeddata: collection.map(({ line, machineDetails }) => ({
                id: _.camelCase(line),
                linkedchart: {
                    chart: {
                        caption: `${line} PLC Downtime by Machine (Drilldown)`,
                        xAxisName: 'Machine',
                        yAxisName: 'Downtime Minutes',
                        ...chartProps,
                        ...tooltipStyle
                    },
                    data: machineDetails.map(({ machineName, totalDowntime }) => ({ 
                            label: machineName,
                            value: totalDowntime,
                            toolText: `<b>Line:</b> ${line} <br>
                                        <b>Machine:</b> ${machineName} <br>
                                        <b>Downtime:</b> ${numeral(totalDowntime).format('0,0')} minutes <br>
                                        <b>Downtime:</b> ${numeral(totalDowntime / 60).format('0,0')} hours`,
                        }))
                }
            }))
      };
      
      const chartConfigs = {
        type: 'column2d',
        width: '100%',
        height: '89%',
        dataFormat: 'json',
        dataSource: dataSource
      };

    //   console.log('ScrapVariancePerProgramChart end', chartConfigs)

    return isDowntimeIconicsFetching 
            ? <CustomSpinner/> 
            : collection.length === 0 
                ? <Empty/>
                : <ReactFC {...chartConfigs} />
}

const mapStateToProps = ({ morningMeeting }) => ({
    isDowntimeIconicsFetching: morningMeeting.isDowntimeIconicsFetching,
    downtimeIconicsCollections: morningMeeting.downtimeIconicsCollections
})

export default connect(mapStateToProps)(DowntimeIconicsChart);