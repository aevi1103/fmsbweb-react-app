import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components'

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import {
    setDowntimeByLine,
    resetDowntimeByLine
} from '../../../redux/morning-meeting/morning-meeting.actions'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const Container = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 400px;
    font-size: 2.5rem;
`

const DowntimeByOwnerChart = ({
    downtimeByOwnerCollection,
    setDowntimeByLine,
    resetDowntimeByLine
}) => {

    const [ownerDetails, setOwnerDetails] = useState([])

    useEffect(() => {

        try {
            if (downtimeByOwnerCollection) {
                if (downtimeByOwnerCollection.ownerDetails.length > 0) {
                    setOwnerDetails(downtimeByOwnerCollection.ownerDetails);  
                }
            }
        } catch (error) {
            setOwnerDetails([]);
        } 
        
    },[downtimeByOwnerCollection])

    const dataSource = {
        chart: {
            showvalues: "1",
            showpercentintooltip: "0",
            enablemultislicing: "0",
            theme: "fusion",
            useDataPlotColorForLabels: "1",
            showLegend: "1",
            plottooltext: 'Owner: $label {br} Downtime: $value minutes',
            toolTipBorderColor: "#001529",
            toolTipBgColor: "#001529",
            toolTipColor: "#fafafa",
            toolTipBgAlpha: "80",
            showToolTipShadow: "1",
            // paletteColors: "#F44336, #03A9F4, #4CAF50, #FFC107, #795548"
            // exportEnabled: "1",
            // exportFileName: "Downtime by Owner"
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
                //categoryLabel = selected owner
                const { categoryLabel } = evt.data;  
                const {dept, shift, ownerDetails } = downtimeByOwnerCollection;

                resetDowntimeByLine();
                setDowntimeByLine(ownerDetails, dept, shift, categoryLabel);
            }
          }
      };

    return ownerDetails.length > 0 ? <ReactFC {...chartConfigs} /> : <Container>Select Shift Downtime To Display Data</Container>
}

const mapStateToProps = ({ morningMeeting }) => ({
    downtimeByOwnerCollection: morningMeeting.downtimeByOwnerCollection
})

const mapDispatchToProps = dispatch => ({
    setDowntimeByLine: (ownerDetails, dept, shift, owner) => dispatch(setDowntimeByLine(ownerDetails, dept, shift, owner)),
    resetDowntimeByLine: () => dispatch(resetDowntimeByLine())
})

export default connect(mapStateToProps, mapDispatchToProps)(DowntimeByOwnerChart);