import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const DowntimeByOwnerChart = ({
    downtimeByLineCollection
}) => {

    const [lineDetails, setLineDetails] = useState([])
    useEffect(() => {

        if (downtimeByLineCollection) {
            setLineDetails(downtimeByLineCollection.lineDetails);
        }

    },[downtimeByLineCollection])

    const dataSource = {
        chart: {
            showvalues: "1",
            showpercentintooltip: "0",
            enablemultislicing: "1",
            theme: "fusion",
            useDataPlotColorForLabels: "1",
            showLegend: "1"
        },
        data: lineDetails.map(({line, totalDowntime}) => ({ label: line, value: totalDowntime}))
      };
      
      const chartConfigs = {
        type: 'column2d',
        width: '100%',
        height: '89%',
        dataFormat: 'json',
        dataSource: dataSource
      };

    return (<ReactFC {...chartConfigs} />)
}

const mapStateToProps = ({ morningMeeting }) => ({
    downtimeByLineCollection: morningMeeting.downtimeByLineCollection
})


export default connect(mapStateToProps)(DowntimeByOwnerChart);