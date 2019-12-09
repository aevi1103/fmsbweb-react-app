import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { 
    Spin
 } from "antd";

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const IncidentByDeptChart = ({isIncidentByDeptFetching, incidentByDeptCollection}) => {

    const { categories, data } = incidentByDeptCollection;
    let chartConfigs = {};

    if (data) {
        
        let ListOfInjuries = [];
        data.forEach(({ department, injuries }) => {
            injuries.forEach(injury => {
                ListOfInjuries.push({
                    department,
                    ...injury
                })
            })
        });

        let incidents = _.groupBy(ListOfInjuries, o => o.injuryStatus);
        const dataSet = Object.keys(incidents).map(key => {
            return {
                seriesName: key,
                data: _.orderBy(incidents[key], o => o.department)                    
                        .map(({numberOfIncidents, colorCode, department}) => 
                                ({
                                    value: numberOfIncidents,
                                    color: colorCode,
                                    toolText: `<b>Dept:</b> ${department} <br>
                                                <b>Incidents:</b> ${numberOfIncidents} <br> `
                                }))
            }
        })

        const dataSource = {
            chart: {
              xAxisName: 'Months',
              yAxisName: 'Incident Rate',
              showValues: '0',
              theme: 'fusion'
            },
            categories: [
                {
                    category: _.orderBy(categories).map(c => ({label: c}))
                }
            ],
            dataset: dataSet
          };
          
          chartConfigs = {
            type: 'stackedcolumn2d',
            width: '100%',
            height: 400,
            dataFormat: 'json',
            dataSource: dataSource
          };

        console.log('IncidentByDeptChart', chartConfigs)
    }

    return (
        <>
            {
                isIncidentByDeptFetching ? <Spin/> : <ReactFC {...chartConfigs} />
            }
        </>

    )
}

const mapStateToProps = ({ morningMeeting }) => ({
    isIncidentByDeptFetching: morningMeeting.isIncidentByDeptFetching,
    incidentByDeptCollection: morningMeeting.incidentByDeptCollection,
})

export default connect(mapStateToProps)(IncidentByDeptChart);