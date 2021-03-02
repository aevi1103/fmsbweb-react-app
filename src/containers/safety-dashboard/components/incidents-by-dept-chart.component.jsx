import React from 'react'
import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import { dateFormat } from '../../../core/utilities/helpers'

// Resolves charts dependancy
charts(FusionCharts);

const IncidentsByDept = ({ data, range }) => {

    const [start, end] = range;
    const injuries = data?.flatMap(({ injuries }) => injuries) ?? [];
    const distinctInjuries = [...new Set(injuries.map(({ injuryStatId }) => injuryStatId))]

    const dataSource = {
        chart: {
            caption: 'Incidents by Departments',
            subcaption: `${start.format(dateFormat)} - ${end.format(dateFormat)}`,
            showsum: "1",
            theme: "fusion",
            drawcrossline: "1"
        },
        categories: [
            {
                category: data?.map(({ dept }) => ({ label: dept }))
            }
        ],
        dataset: distinctInjuries.map(injuryStatId => ({
            seriesname: injuryStatId,
            data: injuries
                .filter(item => item.injuryStatId === injuryStatId)
                .map(({ count, color }) => ({
                    value: count,
                    color
                }))
        }))
    };

    return (
        <ReactFusioncharts
            type="stackedcolumn2d"
            width="100%"
            height="400"
            dataFormat="JSON"
            dataSource={data ? dataSource : []}
        />
    );

}

export default IncidentsByDept;