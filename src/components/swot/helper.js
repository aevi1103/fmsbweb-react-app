import React from 'react'

import ScrapChartsContainer from './scrap-charts-container.component'
import ProductionChartsContainer from './production-charts-container.component'
import DowntimeChartsContainer from './downtime-charts-container.component'

import DeptScrapChartsContainer from './dept-scrap-charts-container.component'
import DeptProductionChartsContainer from './dept-production-charts-container.component'
import DeptDowntimeChartsContainer from './dept-downtime-charts-container.component'

export const  getContentList = (data, filters) => {

    const {
        line,
        swotTarget,
        scrapCharts,
        productionCharts,
        downtimeCharts,
        oae,
        scrapRateByArea
     } = data;

     const lineKpi = {
        oae,
        scrapRateByArea
    }

    return {
        scrap: <ScrapChartsContainer 
                    data={scrapCharts} 
                    filters={filters} 
                    line={line} />,
        prod: <ProductionChartsContainer 
                data={productionCharts} 
                filters={filters} 
                targets={swotTarget} 
                line={line} />,
        dt: <DowntimeChartsContainer 
                data={downtimeCharts} 
                filters={filters} 
                line={line} 
                lineKpi={lineKpi} />
    }
}

export const  getContentListDepartment = (data, filters) => {

    const {
        targets,
        scrapCharts,
        productionCharts,
        downtimeCharts,
        oae,
        scrapRateByArea
     } = data;

     const lineKpi = {
        oae,
        scrapRateByArea
    }

    return {
        scrap: <DeptScrapChartsContainer 
                    data={scrapCharts} 
                    filters={filters} />,
        prod: <DeptProductionChartsContainer 
                    data={productionCharts} 
                    filters={filters} 
                    targets={targets} />,
        dt: <DeptDowntimeChartsContainer 
                data={downtimeCharts} 
                filters={filters} 
                lineKpi={lineKpi} />
    }
}

export const chartProps = {
    showvalues: "1",
    enablemultislicing: "1",
    theme: "fusion",
    useDataPlotColorForLabels: "1",
    showLegend: "1",
    drawcrossline: "1",
    showBorder: 1,
    borderAlpha: 9,
    labelDisplay: "rotate",
    slantLabel: "1",
    captionFontSize: 15,
    subCaptionFontSize: 13
}

export const colorCodes = {
    green: '#19A974',
    red: '#ff4136',
}