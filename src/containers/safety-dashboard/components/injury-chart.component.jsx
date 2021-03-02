import React from 'react'
import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import { dateFormat } from '../../../core/utilities/helpers'

// Resolves charts dependancy
charts(FusionCharts);

const InjuryChart = React.memo(({ data, range, department }) => {

    const [start, end] = range;

    const dataSource = {
        chart: {
            caption: `${department} Department Injury Incidents`,
            subcaption: `${start.format(dateFormat)} - ${end.format(dateFormat)}`,
            showvalues: "1",
            labelDisplay: "rotate",
            slantLabel: "1",
            theme: "fusion"
        },
        data: data.map(({ count, injuryName }) => ({
            label: injuryName,
            value: count
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

export default InjuryChart;