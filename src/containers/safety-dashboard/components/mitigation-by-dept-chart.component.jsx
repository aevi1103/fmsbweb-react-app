import React from 'react'
import numeral from 'numeral'
import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import { dateFormat } from '../../../core/utilities/helpers'

// Resolves charts dependancy
charts(FusionCharts);

const MitigationByChart = ({ data, range }) => {

    const [start, end] = range;

    const dataSource = {
        chart: {
            caption: `Average days for mitigation to occur by Department`,
            subcaption: `${start.format(dateFormat)} - ${end.format(dateFormat)}`,
            showvalues: "1",
            theme: "fusion"
        },
        data: data.map(({ avgDays, dept }) => ({
            label: dept,
            value: numeral(avgDays).format('0.00')
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

export default MitigationByChart;