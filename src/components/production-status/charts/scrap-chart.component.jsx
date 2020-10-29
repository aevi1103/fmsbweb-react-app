import React from 'react'
import _ from 'lodash'
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../helpers/chart-config'
import { 
    chartConfigDashboard,
    chartConfigModal
 } from './chart-config'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const ScrapChart =  React.memo(({
    data,
    caption,
    height = 150,
    isModal = false,
    isDrillDown = false
}) => {

    const chartConfig = !isModal ? chartConfigDashboard : chartConfigModal;

    const dataSource = {
        chart: {
            caption: caption,
            ...chartConfig,
            ...tooltipStyle
        },
        data: data.map(({scrapDesc, colorCode, qty}) => {

                const result = {
                    label: scrapDesc,
                    value: qty,
                    color: colorCode
                }

                if (isDrillDown) {
                    result.link = `newchart-xml-${_.snakeCase(scrapDesc)}`;
                }

                return result
                
            })
      };

      if (isDrillDown) {
        dataSource.linkeddata = data.map(({scrapDesc, colorCode, lineDetails}) => ({
            id: `${_.snakeCase(scrapDesc)}`,
            linkedchart: {
                chart: {
                    caption: `${scrapDesc} Scrap by Line`,
                    ...chartConfig,
                    ...tooltipStyle
                },
                
                data: lineDetails?.map(({ line, qty }) => ({
                    label: line,
                    value: qty,
                    color: colorCode,
                    link: `newchart-xml-${_.snakeCase(scrapDesc)}_${_.snakeCase(line)}`
                })),

                linkeddata: lineDetails?.map(({ line, userDetails }) => ({
                    id: `${_.snakeCase(scrapDesc)}_${_.snakeCase(line)}`,
                    linkedchart: {
                        chart: {
                            caption: `${scrapDesc} Scrap by User at ${line}`,
                            ...chartConfig,
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

      const chartConfigs = {
        type: 'column2d',
        width: '100%',
        height: height,
        dataFormat: 'json',
        dataSource: dataSource
      };

    return (
        <ReactFC {...chartConfigs} />
    )
})

export default ScrapChart;