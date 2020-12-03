import React from 'react'
import { connect } from 'react-redux'
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../core/utilities/chart-config'

import {
    chartProps
} from '../service/helper'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const ScrapByProgramChart = ({
    scrapData,
    line,
    filters,
    chartWidth,
    chartHeight
}) => {

    if (!scrapData) return;

    const { startDate, endDate, data } = scrapData;
    const { take } = filters;

    const defectCaption = (program, scrapAreaName) => {
        return take > 0 
            ? `${program} / ${scrapAreaName} Top ${take} Scrap Pareto by Defect`
            : `${program} / ${scrapAreaName} Scrap Pareto by Defect`;
    } 

    const dataSource = {
        chart: {
            caption: `${line} Scrap Pareto by Program`,
            subCaption: `${startDate} - ${endDate}`,
            xAxisName: 'Program',
            yAxisName: 'Qty',
            ...chartProps,
            ...tooltipStyle
        },
        data: data.map(({program, qty }) => ({
                label: program,
                value: qty,
                link: `newchart-xml-${program}`
            })),

        linkeddata: data.map(({ program, qty, scrapAreaNameDetails }) => ({
            id: `${program}`,
            linkedchart: {
                chart: {
                    caption: `${program} Scrap Pareto by Scrap Type`,
                    subCaption: `Total Scrap: ${qty}`,
                    xAxisName: 'Scrap Type',
                    yAxisName: 'Qty',
                    ...chartProps,
                    ...tooltipStyle
                },
                
                data: scrapAreaNameDetails.map(({ scrapAreaName, colorCode, qty }) => ({
                    label: scrapAreaName,
                    value: qty,
                    color: colorCode,
                    link: `newchart-xml-${program}_${scrapAreaName.replace(/\s/g, '_')}`
                })),

                linkeddata: scrapAreaNameDetails.map(({ scrapAreaName, colorCode, qty, defectDetails }) => ({
                    id: `${program}_${scrapAreaName.replace(/\s/g, '_')}`,
                    linkedchart: {
                        chart: {
                            caption: defectCaption(program, scrapAreaName),
                            subCaption: `Total Scrap: ${qty}`,
                            xAxisName: 'Defect',
                            yAxisName: 'Qty',
    
                            ...chartProps,
                            ...tooltipStyle
                        },
                        data: defectDetails.map(({ scrapDesc, qty }) => ({
                            label: scrapDesc,
                            value: qty,
                            color: colorCode
                        })),
                        
                    }
                }))
            }
        }))
      };

    const chartConfigs = {
        type: 'column2d',
        width: chartWidth,
        height: chartHeight,
        dataFormat: 'json',
        dataSource: dataSource
      };

    return (
        <ReactFC {...chartConfigs} />
    )
}

const mapStateToProps = ({ swot }) => ({
    chartWidth: swot.chartWidth,
    chartHeight: swot.chartHeight
})

export default connect(mapStateToProps)(ScrapByProgramChart);