import React from 'react'
import _ from 'lodash'
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

import ReactFC from 'react-fusioncharts';
import { tooltipStyle } from '../../../core/utilities/chart-config'
import { chartConfigDashboard } from '../service/chart-config'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const ScrapByTypeChart = ({
    data,
    dept
}) => {


    const dataSource = {
        chart: {
            caption: `${dept} Dept Scrap by Type`,
            ...chartConfigDashboard,
            ...tooltipStyle
        },
        data: data?.map(({scrapAreaName, colorCode, qty }) => ({
                label: scrapAreaName,
                value: qty,
                color: colorCode,
                link: `newchart-xml-${_.snakeCase(scrapAreaName)}`
            })),

        linkeddata: data?.map(({ scrapAreaName, defects }) => ({
            id: _.snakeCase(scrapAreaName),
            linkedchart: {
                chart: {
                    caption: `${scrapAreaName} Top 5 Scrap by Defect `,
                    ...chartConfigDashboard,
                    ...tooltipStyle
                },
                
                data: defects.map(({ scrapDesc, colorCode, qty }) => ({
                    label: scrapDesc,
                    value: qty,
                    color: colorCode,
                    link: `newchart-xml-${_.snakeCase(scrapAreaName)}_${_.snakeCase(scrapDesc)}`
                })),

                linkeddata: defects?.map(({ scrapDesc, lineDetails, colorCode }) => ({
                    id: `${_.snakeCase(scrapAreaName)}_${_.snakeCase(scrapDesc)}`,
                    linkedchart: {
                        chart: {
                            caption: `${scrapAreaName} / ${scrapDesc} Scrap by Line`,
                            ...chartConfigDashboard,
                            ...tooltipStyle
                        },
                        
                        data: lineDetails.map(({ line, qty }) => ({
                            label: line,
                            value: qty,
                            color: colorCode,
                            link: `newchart-xml-${_.snakeCase(scrapAreaName)}_${_.snakeCase(scrapDesc)}_${_.snakeCase(line)}`
                        })),

                        linkeddata: lineDetails?.map(({ line, userDetails }) => ({
                            id: `${_.snakeCase(scrapAreaName)}_${_.snakeCase(scrapDesc)}_${_.snakeCase(line)}`,
                            linkedchart: {
                                chart: {
                                    caption: `${scrapDesc} / ${line} Scrap by User`,
                                    ...chartConfigDashboard,
                                    ...tooltipStyle
                                },
                                
                                data: userDetails?.map(({ user, qty }) => ({
                                    label: user,
                                    value: qty,
                                    color: colorCode
                                }))
                            }
                        }))
                    }
                }))
            }
        }))
      };

    const chartConfigs = {
        type: 'column2d',
        width: '100%',
        height: '180',
        dataFormat: 'json',
        dataSource: dataSource
      };

    return (
        <ReactFC {...chartConfigs} />
    )
}


export default ScrapByTypeChart;