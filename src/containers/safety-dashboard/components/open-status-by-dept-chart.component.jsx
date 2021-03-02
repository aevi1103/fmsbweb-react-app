import React from 'react'
import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import { dateFormat } from '../../../core/utilities/helpers'

// Resolves charts dependancy
charts(FusionCharts);

const OpenStatusChart = ({ data, range }) => {

    const [start, end] = range;

    const dataSource = {
        chart: {
            caption: `Open Status Incidents`,
            subcaption: `${start.format(dateFormat)} - ${end.format(dateFormat)}`,
            showvalues: "1",
            theme: "fusion"
        },
        data: data.map(({ count, dept }) => ({
            label: dept,
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

}

export default OpenStatusChart;