import React from 'react'
import ScrapChartsContainer from './scrap-charts-container.component'
import ProductionChartsContainer from './production-charts-container.component'
import DowntimeChartsContainer from './downtime-charts-container.component'

export const  getContentList = (data) => {

    const {
        line,
        filters,
        swotTarget,
        scrapCharts,
        productionCharts,
        downtimeCharts
     } = data;

    return {
        scrap: <ScrapChartsContainer data={scrapCharts} filters={filters} line={line} />,
        prod: <ProductionChartsContainer data={productionCharts} filters={filters} targets={swotTarget} line={line} />,
        dt: <DowntimeChartsContainer data={downtimeCharts} filters={filters} line={line} />,
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

export const chartConfigProps = {
    // width: '100%',
    // height: '400',
    // dataFormat: 'json'
}

export const colorCodes = {
    green: '#19A974',
    red: '#ff4136',
}