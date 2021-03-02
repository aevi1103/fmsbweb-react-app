import React from 'react'
import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";

// Resolves charts dependancy
charts(FusionCharts);

const MonthlyIncidentRateChart = React.memo(({ data }) => {

    const yrs = data.filter(({ year }) => year > 0).map(({ year }) => year);
    const minYear = Math.min(...yrs)
    const maxYear = Math.max(...yrs)
    const ytdLabel = minYear === maxYear ? 'YTD' : `${minYear} - ${maxYear}`

    const dataSource = {
        chart: {
            caption: `${ytdLabel} Monthly Incident Rate `,
            showvalues: "1",
            theme: "fusion",
            labelDisplay: "rotate",
            slantLabel: "1",
        },
        data: data.map(({ year, monthName, rate }) => ({
            label: year > 0 ? `${monthName.substr(0,3)} ${year}` : ytdLabel,
            value: rate
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

export default MonthlyIncidentRateChart;