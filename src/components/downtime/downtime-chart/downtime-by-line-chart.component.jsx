import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment'
import styled from 'styled-components'

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../helpers/chart-config'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const Container = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 400px;
    font-size: 2.5rem;
`;

const DowntimeByOwnerChart = ({
    downtimeByLineCollection
}) => {

    const [lineDetails, setLineDetails] = useState([]);

    useEffect(() => {

        try {
            if (downtimeByLineCollection) {
                setLineDetails(downtimeByLineCollection.lineDetails);  
            }
        } catch (error) {
            setLineDetails([]);
        }
        
    },[downtimeByLineCollection])

    const dataSource = {
        chart: {
            xAxisName: 'Line',
            yAxisName: 'Minutes',
            showvalues: "1",
            showpercentintooltip: "0",
            enablemultislicing: "1",
            theme: "fusion",
            useDataPlotColorForLabels: "1",
            showLegend: "1",
            drawcrossline: "1",
            plottooltext: 'Line: $label {br} Downtime: $value minutes',
            labelDisplay: "rotate",
            slantLabel: "1",
            ...tooltipStyle
        },
        data: lineDetails.map(({line, typeColor, totalDowntime}) => ({
            label: line,
            value: totalDowntime,
            color: typeColor,
            link: `newchart-xml-${line.replace(' ','_')}`
        })),
        linkeddata: lineDetails.map(({ line, reason2Details }) => ({
                        id: line.replace(' ','_'),
                        linkedchart: {
                            chart: {
                                caption: `${line} Downtime by Reason (Drilldown)`,
                                xAxisName: 'Reason',
                                yAxisName: 'Minutes',
                                showvalues: "1",
                                showpercentintooltip: "0",
                                enablemultislicing: "1",
                                theme: "fusion",
                                useDataPlotColorForLabels: "1",
                                showLegend: "1",
                                drawcrossline: "1",
                                plottooltext: 'Reason: $label {br} Downtime: $value minutes',           
                                ...tooltipStyle
                            },
                            data: reason2Details.map(({ reason2, typeColor, totalDowntime }) => ({ 
                                    label: reason2,
                                    value: totalDowntime,
                                    color: typeColor,
                                    link: `newchart-xml-${line.replace(' ','_')}_${reason2.replace(' ','_')}` 
                                })),
                            linkeddata: reason2Details.map(({ reason2, dailyDetails }) => ({
                                id: `${line.replace(' ','_')}_${reason2.replace(' ','_')}`,
                                linkedchart: {
                                    chart: {
                                        caption: `${line} / ${reason2} Downtime by Shift Date`,
                                        xAxisName: 'Shift Date',
                                        yAxisName: 'Minutes',
                                        showvalues: "1",
                                        showpercentintooltip: "0",
                                        enablemultislicing: "1",
                                        theme: "fusion",
                                        useDataPlotColorForLabels: "1",
                                        showLegend: "1",
                                        drawcrossline: "1",
                                        plottooltext: 'Shift Date: $label {br} Downtime: $value minutes',           
                                        ...tooltipStyle
                                    },
                                    data: dailyDetails.map(({ shifDate, typeColor, totalDowntime }) => ({ 
                                        label: moment(shifDate).format('MM/DD/YYYY'),
                                        value: totalDowntime,
                                        color: typeColor
                                    }))
                                }
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

    //   console.log(chartConfigs)

    return lineDetails.length > 0 ? <ReactFC {...chartConfigs} /> : <Container>Select Owner Downtime To Display Data</Container>
}

const mapStateToProps = ({ morningMeeting }) => ({
    downtimeByLineCollection: morningMeeting.downtimeByLineCollection
})

export default connect(mapStateToProps)(DowntimeByOwnerChart);