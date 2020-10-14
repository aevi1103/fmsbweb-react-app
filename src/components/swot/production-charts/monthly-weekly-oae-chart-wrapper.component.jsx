import React from 'react'
import MonthlyWeeklyOaeChart from './monthly-weekly-oae-chart.component'

const MonthlyWeeklyOaeChartWrapper = ({
    monthlyOae,
    weeklyOae,
    filters,
    targets,
    line
}) => {

    const mapMonthlyOae = monthlyOae.data.map(({ year, monthName, target, net, oae }) => ({
        label: `${year} - ${monthName}`,
        target,
        net,
        oae
    }));

    const mapWeeklyOae = weeklyOae.data.map(({ year, weekNumber, target, net, oae }) => ({
        label: `${year} - W${weekNumber}`,
        target,
        net,
        oae
    }));

    const monthWeek = mapMonthlyOae.concat(mapWeeklyOae);

    return <MonthlyWeeklyOaeChart 
                prodData={monthWeek} 
                filters={filters} 
                targets={targets} 
                line={line} />
}

export default MonthlyWeeklyOaeChartWrapper