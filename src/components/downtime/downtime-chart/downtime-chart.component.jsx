import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import {
    setDowntimeByOwner,
    resetDowntimeByLine
} from '../../../redux/morning-meeting/morning-meeting.actions'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const DowntimeChart = ({
    downtimeCollection,
    setDowntimeByOwner,
    resetDowntimeByLine
}) => {

    const [categoriesSet, setCategoriesSet] = useState([])
    const [chartData, setchartData] = useState([])

    useEffect(() => {

        if (downtimeCollection) {
            setCategoriesSet(downtimeCollection.categories);
            setchartData(downtimeCollection.chartData);
        }

    },[])

    // transform datasetbykey to a object that fusion chart understands
    const dataSet = chartData.map(({ seriesname, data }) => {
        return {
            seriesname,
            data: data.map(({totalDowntime}) => ({ value: totalDowntime }))
        }
    });

    const dataSource = {
        chart: {
            xAxisName: 'Department',
            yAxisName: 'Minutes',
            showValues: '1',
            theme: 'fusion',
            drawcrossline: "1",
            // formatNumberScale: "0",
            showsum: "1",
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
                //categoryLabel = dept, datasetName = shift
                const { categoryLabel, datasetName } = evt.data;              
                setDowntimeByOwner(downtimeCollection, categoryLabel, datasetName);
                resetDowntimeByLine();
            }
          }
      };

    return (<ReactFC {...chartConfigs} />)
}

const mapStateToProps = ({ morningMeeting }) => ({
    isDowntimeFetching: morningMeeting.isDowntimeFetching,
    downtimeCollection: morningMeeting.downtimeCollection
})

const mapDispatchToProps = dispatch => ({
    setDowntimeByOwner: (downtimeCollection, dept, shift) => dispatch(setDowntimeByOwner(downtimeCollection, dept, shift)),
    resetDowntimeByLine: () => dispatch(resetDowntimeByLine())
})

export default connect(mapStateToProps, mapDispatchToProps)(DowntimeChart);