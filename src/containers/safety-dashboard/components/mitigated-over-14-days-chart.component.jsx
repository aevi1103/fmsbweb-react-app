import React from 'react'
import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import { dateFormat } from '../../../core/utilities/helpers'

// Resolves charts dependancy
charts(FusionCharts);

const MitigagedOver14Days = React.memo(({ data, range }) => {

    const [start, end] = range;

    const dataSource = {
        chart: {
            caption: `# of issues open past 14 days w/o mitigation by department`,
            subcaption: `${start.format(dateFormat)} - ${end.format(dateFormat)}`,
            showvalues: "1",
            labelDisplay: "rotate",
            slantLabel: "1",
            theme: "fusion"
        },
        data: data.map(({ issuesCount, dept }) => ({
            label: dept,
            value: issuesCount
        }))
      };

    return (
        <ReactFusioncharts
            type="column2d"
            width="100%"
            height="400"
            dataFormat="JSON"
            dataSource={data ? dataSource : []}
        />
    );

})

export default MitigagedOver14Days;