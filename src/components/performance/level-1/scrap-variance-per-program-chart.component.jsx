import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral'

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../core/utilities/chart-config'
import CustomSpinner from '../../custom-spinner/custom-spinner.component'

import { Empty } from 'antd';

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const ScrapVariancePerProgramChart = ({
    scrapVariancePerProgramCollection,
    isScrapVariancePerProgramFetching
}) => {

    const [collection, setCollection] = useState([]);
    useEffect(() => {

        try {
            if (scrapVariancePerProgramCollection) {
                setCollection(scrapVariancePerProgramCollection); 
            } else {
                setCollection([]);
            }  
        } catch (error) {
            setCollection([]);
        }
        
    },[scrapVariancePerProgramCollection])

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
            xAxisName: 'Program',
            yAxisName: 'Scrap %',
            labelDisplay: "rotate",
            slantLabel: "1",
            rotateValues: "1",
            ...chartProps,
            ...tooltipStyle
        },
        data: collection.map(({program, qty, sapGross, scrapRate}) => ({
                label: program,
                value: (scrapRate * 100).toFixed(2),
                toolText: `<b>Program:</b> ${program} <br>
                            <b>SAP Gross:</b> ${numeral(sapGross).format('0,0')} <br>
                            <b>Scrap Qty:</b> ${numeral(qty).format('0,0')} <br>
                            <b>Scrap %:</b> ${numeral(scrapRate).format('0.00%')}`,
                link: `newchart-xml-${program.replace(' ','_').replace('.','_')}`
            })),
            
        linkeddata: collection.map(({ program, areaDetails }) => ({
            id: program.replace(' ','_').replace('.','_'),
            linkedchart: {
                chart: {
                    caption: `${program} - Scrap % by Area (Drilldown)`,
                    xAxisName: 'Area',
                    yAxisName: 'Scrap %',
                    ...chartProps,
                    ...tooltipStyle
                },
                data: areaDetails.map(({ area, qty, scrapRate }) => ({ 
                        label: area,
                        value: (scrapRate * 100).toFixed(2),
                        toolText: `<b>Program:</b> ${program} <br>
                                    <b>Area:</b> ${area} <br>
                                    <b>Scrap Qty:</b> ${numeral(qty).format('0,0')} <br>
                                    <b>Scrap %:</b> ${numeral(scrapRate).format('0.00%')}`,
                        link: `newchart-xml-${program.replace(' ','_').replace('.','_')}_${area.replace(' ','_')}` 
                    })),

                linkeddata: areaDetails.map(({ area, lineDetails }) => ({
                    id: `${program.replace(' ','_').replace('.','_')}_${area.replace(' ','_')}`,
                    linkedchart: {
                        chart: {
                            caption: `${program} / ${area} - Scrap % by Line`,
                            xAxisName: 'Line',
                            yAxisName: 'Scrap %',
                            ...chartProps,
                            ...tooltipStyle
                        },
                        data: lineDetails.map(({ line, qty, scrapRate }) => ({ 
                            label: line,
                            value: (scrapRate * 100).toFixed(2),
                            toolText: `<b>Program:</b> ${program} <br>
                                        <b>Area:</b> ${area} <br>
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

    return isScrapVariancePerProgramFetching 
            ? <CustomSpinner/> 
            : collection.length === 0 
                ? <Empty/>
                : <ReactFC {...chartConfigs} />
}

const mapStateToProps = ({ morningMeeting }) => ({
    isScrapVariancePerProgramFetching: morningMeeting.isScrapVariancePerProgramFetching,
    scrapVariancePerProgramCollection: morningMeeting.scrapVariancePerProgramCollection
})

export default connect(mapStateToProps)(ScrapVariancePerProgramChart);