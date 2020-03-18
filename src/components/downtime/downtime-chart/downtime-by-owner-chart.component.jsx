import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import {
    setDowntimeByLine
} from '../../../redux/morning-meeting/morning-meeting.actions'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const DowntimeByOwnerChart = ({
    downtimeByOwnerCollection,
    setDowntimeByLine
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
            // exportEnabled: "1",
            // exportFileName: "Downtime by Owner"
        },
        data: ownerDetails.map(({type, totalDowntime}) => ({ label: type, value: totalDowntime}))
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
                setDowntimeByLine(ownerDetails, dept, shift, categoryLabel);
                
                console.log(categoryLabel)
            }
          }
      };

    return (<ReactFC {...chartConfigs} />)
}

const mapStateToProps = ({ morningMeeting }) => ({
    downtimeByOwnerCollection: morningMeeting.downtimeByOwnerCollection
})

const mapDispatchToProps = dispatch => ({
    setDowntimeByLine: (ownerDetails, dept, shift, owner) => dispatch(setDowntimeByLine(ownerDetails, dept, shift, owner))
})

export default connect(mapStateToProps, mapDispatchToProps)(DowntimeByOwnerChart);