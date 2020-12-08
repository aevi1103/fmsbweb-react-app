import React from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import numeral from 'numeral'
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../core/utilities/chart-config'
import { red, green } from '../../../core/utilities/colors'
import { chartProps } from '../service/helper'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const DailyScrapRateChart = ({
    scrapData,
    targets,
    filters
}) => {

    const { chartWidth, chartHeight } = useSelector(({ swot }) => swot);

    if (!scrapData) return null;

    const { startDate, endDate, line, shiftDates, data } = scrapData || {};
    const { overallScrapTarget } = targets || {};
    const { lastDays } = filters || {};

    const categories = shiftDates?.map(date => ({ label: moment(date).format('MM/DD/YY') }));
    const dataset = data?.map(({ shift, details }) => ({
        seriesname: shift === 'All' ? shift : `Shift ${shift}`,
        data: details.map(d => ({
            value: d.scrapRate < 1 ? (d.scrapRate * 100) : null,
            link: `newchart-xml-shift_${d.shift}_${moment(d.shiftDate).format('MMDDYY')}`
        }))
    }));

    const linkedData = data.flatMap(({ details }) => details)
                        .map(({ shiftDate, shift, scrapRate, scrapAreaDetails, scrap }) => ({
                            id: `shift_${shift}_${moment(shiftDate).format('MMDDYY')}`,
                            linkedchart: {
                                chart: {
                                    caption: `Shift ${shift} > ${moment(shiftDate).format('MM/DD/YY')} Scrap Pareto by Type`,
                                    subCaption: `Total Scrap %: ${numeral(scrapRate).format('0.00%')} | Total Qty: ${numeral(scrap).format('0,0')}`,
                                    xAxisName: 'Scrap Type',
                                    yAxisName: 'Scrap %',
                                    numberSuffix: '%',
                                    ...chartProps,
                                    ...tooltipStyle
                                },
                                data: scrapAreaDetails.map(({ scrapAreaName, colorCode, scrapRate, qty }) => ({
                                    label: scrapAreaName,
                                    value: scrapRate * 100,
                                    color: colorCode,
                                    link: `newchart-xml-shift_${shift}_${moment(shiftDate).format('MMDDYY')}_${scrapAreaName.replace(/\s/g, '_')}`,
                                    tooltext: `<b>Shift Date: </b> ${moment(shiftDate).format('MM/DD/YY')} <br>
                                                <b>Shift: </b> ${shift} <br>
                                                <b>Scrap Type: </b> ${scrapAreaName} <br>
                                                <b>Qty: </b> ${numeral(qty).format('0,0')} <br>
                                                <b>Scrap Rate: </b> ${numeral(scrapRate).format('0.00%')}`
                                })),
                                linkeddata: scrapAreaDetails.map(({ scrapAreaName, defectDetails, scrapRate, qty, colorCode }) => ({
                                    id: `shift_${shift}_${moment(shiftDate).format('MMDDYY')}_${scrapAreaName.replace(/\s/g, '_')}`,
                                    linkedchart: {
                                        chart: {
                                            caption: `Shift ${shift} > ${moment(shiftDate).format('MM/DD/YY')} > ${scrapAreaName} Scrap Pareto by Defect`,
                                            subCaption: `Total Scrap %: ${numeral(scrapRate).format('0.00%')} | Total Qty: ${numeral(qty).format('0,0')}`,
                                            xAxisName: 'Defect',
                                            yAxisName: 'Scrap %',
                                            numberSuffix: '%',
                                            decimals: '3',
                                            rotateValues: '1',
                                            ...chartProps,
                                            ...tooltipStyle
                                        },
                                        data: defectDetails.map(({ scrapDesc, qty, scrapRate }) => ({
                                            label: scrapDesc,
                                            value: scrapRate * 100,
                                            color: colorCode,
                                            tooltext: `<b>Shift Date: </b> ${moment(shiftDate).format('MM/DD/YY')} <br>
                                                        <b>Shift: </b> ${shift} <br>
                                                        <b>Scrap Type: </b> ${scrapAreaName} <br>
                                                        <b>Defect: </b> ${scrapDesc} <br>
                                                        <b>Qty: </b> ${numeral(qty).format('0,0')} <br>
                                                        <b>Scrap Rate: </b> ${numeral(scrapRate).format('0.00%')}`
                                        }))
                                    }
                                }))
                            }
                        }))



    const dataSource = {
        chart: {
            caption: `${line} Last ${lastDays} Days Total SB Scrap %`,
            subCaption: `${startDate} - ${endDate}`,
            xAxisName: 'Shift Dates',
            yAxisName: 'Scrap %',
            numberSuffix: '%',
            rotateValues: '1',
            ...chartProps,
            ...tooltipStyle
        },
        categories: [
            {
                category: categories
            }
        ],
        dataset: dataset,
        linkeddata: linkedData,
        trendlines: [
            {
                line: [
                    {
                        startvalue: overallScrapTarget * 100,
                        color: red,
                        valueOnRight: '1',
                        displayvalue: `Target (${numeral(overallScrapTarget).format('0.00%')})`,
                        dashed: '1'
                    }
                ]
            }
        ]
      };

    const chartConfigs = {
        type: 'mscolumn2d',
        width: chartWidth,
        height: chartHeight,
        dataFormat: 'json',
        dataSource: dataSource,
        events: {
            beforeRender: function (evt, args) {
                evt.sender.configureLink({
                    type: "column2d"
                }, 0);
            }
        }
      };

    return (
        <ReactFC {...chartConfigs} />
    )
}


export default DailyScrapRateChart;