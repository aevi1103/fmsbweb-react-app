import React from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import numeral from 'numeral'
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../helpers/chart-config'

import {
    chartProps,
    colorCodes
} from '../helper'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const DailyScrapRateChart = ({
    scrapData,
    targets
}) => {

    const { chartWidth, chartHeight } = useSelector(({ swot }) => swot);

    if (!scrapData) return;

    const { startDate, endDate, line, shiftDates, data } = scrapData;
    const { foundryScrapTarget, machineScrapTarget, afScrapTarget } = targets;
    const overallTarget = foundryScrapTarget + machineScrapTarget + afScrapTarget;

    const categories = shiftDates?.map(date => ({ label: moment(date).format('MM/DD/YY') }));
    const dataset = data?.map(({ shift, details }) => ({
        seriesname: shift === 'All' ? shift : `Shift ${shift}`,
        data: details.map(d => ({
            value: d.scrapRate < 1 ? (d.scrapRate * 100) : null,
            link: `newchart-xml-shift_${d.shift}_${moment(d.shiftDate).format('MMDDYY')}`
        }))
    }));

    const linkedData = data.flatMap(({ details }) => details)
                        .map(({ shiftDate, shift, scrapRate, scrapAreaDetails }) => ({
                            id: `shift_${shift}_${moment(shiftDate).format('MMDDYY')}`,
                            linkedchart: {
                                chart: {
                                    caption: `Shift ${shift} / ${moment(shiftDate).format('MM/DD/YY')} Scrap Pareto by Type`,
                                    subCaption: `Scrap Rate: ${numeral(scrapRate).format('0.00%')}`,
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
                                    tooltext: `<b>Scrap Type: </b> ${scrapAreaName} <br>
                                                <b>Qty: </b> ${numeral(qty).format('0,0')} <br>
                                                <b>Scrap Rate: </b> ${numeral(scrapRate).format('0.00%')}`
                                }))
                            }
                        }))



    const dataSource = {
        chart: {
            caption: `${line} Daily Total SB Scrap %`,
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
                        startvalue: overallTarget * 100,
                        color: colorCodes.red,
                        valueOnRight: '1',
                        displayvalue: `Target (${numeral(overallTarget).format('0.00%')})`,
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