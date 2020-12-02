import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components'

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import {
    setDowntimeByLine,
} from '../../../core/redux/downtime/downtime.actions'

import { tooltipStyle } from '../../../core/utilities/chart-config'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const Container = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 400px;
    font-size: 2.5rem;
`

const DowntimeByOwnerChart = () => {

    const dispatch = useDispatch();
    const ownerDetails = useSelector(({ downtime }) => downtime?.downtimeByOwnerCollection?.ownerDetails) ?? [];
    const downtimeByOwnerCollection = useSelector(({ downtime }) => downtime?.downtimeByOwnerCollection) ?? {};
    
    const dataSource = {
        chart: {
            showvalues: "1",
            showpercentintooltip: "0",
            enablemultislicing: "0",
            theme: "fusion",
            useDataPlotColorForLabels: "1",
            showLegend: "1",
            plottooltext: 'Owner: $label {br} Downtime: $value minutes',
            ...tooltipStyle
        },
        data: ownerDetails.map(({type, typeColor, totalDowntime}) => ({ label: type, value: totalDowntime, color: typeColor}))
      };
      
      const chartConfigs = {
        type: 'pie2d',
        width: '100%',
        height: '89%',
        dataFormat: 'json',
        dataSource: dataSource,
        events: {
            dataplotClick: function(evt) {
                const { categoryLabel } = evt.data;  
                const { dept, shift, ownerDetails } = downtimeByOwnerCollection;
                const { lineDetails } = ownerDetails.find(({ type }) => type === categoryLabel);
                dispatch(setDowntimeByLine(lineDetails, dept, shift, categoryLabel))
            }
          }
      };

    return ownerDetails.length > 0 
            ? <ReactFC {...chartConfigs} /> 
            : <Container>Select Shift Downtime To Display Data</Container>
}


export default DowntimeByOwnerChart;