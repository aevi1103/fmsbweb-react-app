import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral';

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../helpers/chart-config';
import CustomSpinner from '../../custom-spinner/custom-spinner.component';

import { Empty } from 'antd';

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const ScrapVariancePerShiftChart = ({
    isScrapVarianceByShiftFetching,
    scrapVarianceByShiftCollection
}) => {

    const [collection, setCollection] = useState([]);
    useEffect(() => {

        try {
            setCollection(scrapVarianceByShiftCollection || scrapVarianceByShiftCollection.length > 0 ? scrapVarianceByShiftCollection : []); 
        } catch (error) {
            setCollection([]);
        }
        
    },[scrapVarianceByShiftCollection])

    const chartProps = {
        showvalues: "1",
        showpercentintooltip: "0",
        enablemultislicing: "1",
        theme: "fusion",
        useDataPlotColorForLabels: "1",
        showLegend: "1",
        drawcrossline: "1",
        numberSuffix: "%"
    }

    const dataSource = {
        chart: {
            xAxisName: 'Shift',
            yAxisName: 'Scrap %',
            ...chartProps,
            ...tooltipStyle
        },
        data: collection.map(({shift, qty, sapGross, scrapRate}) => ({
                label: shift,
                value: (scrapRate * 100).toFixed(2),
                toolText: `<b>Shift:</b> ${shift} <br>
                            <b>SAP Gross:</b> ${numeral(sapGross).format('0,0')} <br>
                            <b>Scrap Qty:</b> ${numeral(qty).format('0,0')} <br>
                            <b>Scrap %:</b> ${numeral(scrapRate).format('0.00%')}`,
                link: `newchart-xml-${shift.replace(' ','_')}`
            })),
            
        linkeddata: collection.map(({ shift, scrapAreaNameDetails }) => ({
            id: shift.replace(' ','_'),
            linkedchart: {
                chart: {
                    caption: `Shift: ${shift} - Scrap % by Scrap Type (Drilldown)`,
                    xAxisName: 'Scrap Type',
                    yAxisName: 'Scrap %',
                    ...chartProps,
                    ...tooltipStyle
                },
                data: scrapAreaNameDetails.map(({ scrapAreaName, shift, qty, scrapRate }) => ({ 
                        label: scrapAreaName,
                        value: (scrapRate * 100).toFixed(2),
                        toolText: `<b>Shift:</b> ${shift} <br>
                                    <b>Scrap Type:</b> ${scrapAreaName} <br>
                                    <b>Scrap Qty:</b> ${numeral(qty).format('0,0')} <br>
                                    <b>Scrap %:</b> ${numeral(scrapRate).format('0.00%')}`,
                        link: `newchart-xml-${shift.replace(' ','_')}_${scrapAreaName.replace(' ','_')}` 
                    })),

                linkeddata: scrapAreaNameDetails.map(({ shift, scrapAreaName, lineDetails }) => ({
                    id: `${shift.replace(' ','_')}_${scrapAreaName.replace(' ','_')}`,
                    linkedchart: {
                        chart: {
                            caption: `Shift: ${shift} / Scrap Type: ${scrapAreaName} - Scrap % by Line`,
                            xAxisName: 'Line',
                            yAxisName: 'Scrap %',
                            ...chartProps,
                            ...tooltipStyle
                        },
                        data: lineDetails.map(({ line, qty, scrapRate }) => ({ 
                            label: line,
                            value: (scrapRate * 100).toFixed(2),
                            toolText: `<b>Shift:</b> ${shift} <br>
                                        <b>Scrap Type:</b> ${scrapAreaName} <br>
                                        <b>Line:</b> ${line} <br>
                                        <b>Scrap Qty:</b> ${numeral(qty).format('0,0')} <br>
                                        <b>Scrap %:</b> ${numeral(scrapRate).format('0.00%')}`,
                        }))
                    }
                }))
            }
        }))
      };
      
      const chartConfigs = {
        type: 'column2d',
        width: '100%',
        height: '89%',
        dataFormat: 'json',
        dataSource: dataSource
      };

    //   console.log('ScrapVariancePerProgramChart end', chartConfigs)

    return isScrapVarianceByShiftFetching 
            ? <CustomSpinner/> 
            : collection.length === 0 
                ? <Empty/>
                : <ReactFC {...chartConfigs} />
}

const mapStateToProps = ({ morningMeeting }) => ({
    isScrapVarianceByShiftFetching: morningMeeting.isScrapVarianceByShiftFetching,
    scrapVarianceByShiftCollection: morningMeeting.scrapVarianceByShiftCollection
})

export default connect(mapStateToProps)(ScrapVariancePerShiftChart);