import React from 'react';
import { useSelector } from 'react-redux';
import numeral from 'numeral';
import moment from 'moment';

import CustomSpinner from '../../../components/custom-spinner/custom-spinner.component'
import { tooltipStyle } from '../../../core/utilities/chart-config'

import { Empty } from 'antd';

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const hoursFormat = '0,0.00';

const ScrapVarianceChart = () => {

    const collection = useSelector(({ performance0 }) => performance0?.ppmhPerDeptVarianceCollection) ?? [];
    const isPpmhPerDeptVarianceFetching = useSelector(({ performance0 }) => performance0.isPpmhPerDeptVarianceFetching);

    const chartProps = {
        showValues: '1',
        theme: 'fusion',
        drawcrossline: "1",
        showsum: "1",
    }

    const targetLineProps = {
        anchorRadius: "0",
        dashed: "1",
        showValue: "0"
    }

    const ppmhToolText = (laborHours, key) => {

        if (!laborHours) return '';
        const { ppmh, regular, overtime, doubleTime, orientation, overAll, sapNet } = laborHours;

        return `<b>Period: ${key}</b><br><br>
                <b>Hours: </b><br>
                <b>Regular: </b> ${numeral(regular).format(hoursFormat)}<br>
                <b>Overtime: </b> ${numeral(overtime).format(hoursFormat)}<br>
                <b>Double Time: </b> ${numeral(doubleTime).format(hoursFormat)}<br>
                <b>Orientation: </b> ${numeral(orientation).format(hoursFormat)}<br>
                <b>Overall: </b> ${numeral(overAll).format(hoursFormat)}<br><br>

                <b>SAP Net: </b> ${numeral(sapNet).format('0,0')} <br>
                <b>PPMH: </b> ${numeral(ppmh).format(hoursFormat)}`
    }

    const dataSource = {
        chart: {
            xAxisName: 'Quarter',
            yAxisName: 'PPMH',
            plottooltext: '$seriesname, Quarter: $label, PPMH: $value',   
            ...chartProps,  
            ...tooltipStyle
        },
        categories: [
            {
              category: collection.map(({ key }) => ({ label: key }))
            }
          ],
        dataset: [
            {
                seriesname: "PPMH",
                data: collection.map(({ laborHours, key }) => ({ 
                    value: Math.round(laborHours.ppmh),
                    link: `newchart-xml-${key}`,
                    toolText: ppmhToolText(laborHours, key)
                }))
            },
            {
              seriesname: "Target",
              color: "#18bc9c",
              data: collection.map(({ target }) => ({ 
                    value: target.toFixed(2),
                    ...targetLineProps
                }))
            }          
        ],
        linkeddata: collection.map(({ key, monthDetails }) => ({
            id: key,
            linkedchart: {
                chart: {
                    caption: `${key} Monthly PPMH`,
                    xAxisName: 'Month',
                    yAxisName: 'PPMH',
                    plottooltext: '$seriesname, Month: $label, PPMH: $value',             
                    ...chartProps,
                    ...tooltipStyle
                },
                categories: [
                    {
                      category: monthDetails.map(({ month }) => ({ label: moment().month(month-1).format('MMM') }))
                    }
                  ],
                dataset: [
                    {
                        seriesname: "PPMH",
                        data: monthDetails.map(({ laborHours, key }) => ({ 
                            value: Math.round(laborHours.ppmh),
                            toolText: ppmhToolText(laborHours, key),
                            link: `newchart-xml-${key}`
                        }))
                    },
                    {
                        seriesname: "Target",
                        color: "#18bc9c",
                        data: monthDetails.map(({ target }) => ({ 
                            value: target.toFixed(1),
                            ...targetLineProps
                        }))
                    }
                ],
                linkeddata: monthDetails.map(({ key, month, weekDetails }) => ({
                    id: key,
                    linkedchart: {
                        chart: {
                            caption: `${moment().month(month-1).format('MMM')} Weekly PPMH`,
                            xAxisName: 'Week Number',
                            yAxisName: 'PPMH',
                            plottooltext: '$seriesname, Week #: $label, PPMH: $value',  
                            ...chartProps,
                            ...tooltipStyle
                        },
                        categories: [
                            {
                              category: weekDetails.map(({ weekNumber }) => ({ label: `WK${weekNumber}` }))
                            }
                        ],
                        dataset: [
                            {
                                seriesname: "PPMH",
                                data: weekDetails.map(({ laborHours, key }) => ({ 
                                    value: Math.round(laborHours.ppmh),
                                    toolText: ppmhToolText(laborHours, key),
                                }))
                            }
                        ]
                    }
                }))
            }
        }))
      };
      
      const chartConfigs = {
        type: 'msline',
        width: '100%',
        height: '89%',
        dataFormat: 'json',
        dataSource: dataSource
      };

    return isPpmhPerDeptVarianceFetching 
            ? <CustomSpinner/> 
            : collection.length > 0 
                ? <ReactFC {...chartConfigs} />
                : <Empty />
}

export default ScrapVarianceChart;