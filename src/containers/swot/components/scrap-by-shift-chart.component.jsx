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

const ScrapByShiftChart = ({
    scrapData,
    line,
    filters,
    chartWidth,
    chartHeight
}) => {

    if (!scrapData) return;

    const { startDate, endDate, data } = scrapData;
    const { take } = filters;

    const defectCaption = (shift, scrapAreaName) => {
        return take > 0 
            ? `Shift ${shift} / ${scrapAreaName} Top ${take} Scrap Pareto by Defect`
            : `Shift ${shift} / ${scrapAreaName} Scrap Pareto by Defect`;
    } 
    
    const dataSource = {
        chart: {
            caption: `${line} Scrap Pareto by Shift`,
            subCaption: `${startDate} - ${endDate}`,
            xAxisName: 'Shift',
            yAxisName: 'Qty',
            ...chartProps,
            ...tooltipStyle
        },
        data: data.map(({shift, qty }) => ({
                label: `Shift ${shift}`,
                value: qty,
                link: `newchart-xml-${shift}`
            })),

        linkeddata: data.map(({ shift, qty, scrapAreaNameDetails }) => ({
            id: `${shift}`,
            linkedchart: {
                chart: {
                    caption: `Shift ${shift} Scrap Pareto by Scrap Type`,
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
                    link: `newchart-xml-${shift}_${scrapAreaName.replace(/\s/g, '_')}`
                })),

                linkeddata: scrapAreaNameDetails.map(({ scrapAreaName, colorCode, qty, defectDetails }) => ({
                    id: `${shift}_${scrapAreaName.replace(/\s/g, '_')}`,
                    linkedchart: {
                        chart: {
                            caption: defectCaption(shift, scrapAreaName),
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

export default connect(mapStateToProps)(ScrapByShiftChart);