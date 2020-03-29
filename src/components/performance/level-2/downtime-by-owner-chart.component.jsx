import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral';
import _ from 'lodash';

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../helpers/chart-config';
import CustomSpinner from '../../custom-spinner/custom-spinner.component';

import { Empty } from 'antd';

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const DeptKpiChart = ({
    isDowntimeByOwnerFetching,
    downtimeByOwnerCollections
}) => {

    const [collection, setCollection] = useState([])

    useEffect(() => {

        try {
            setCollection(downtimeByOwnerCollections ? downtimeByOwnerCollections : []); 
        } catch (error) {
            setCollection([]);
        } 
        
    },[downtimeByOwnerCollections]);

    const getColorCode = (owner) => {
        switch (owner.toLowerCase()) {
            case 'maintenance':
                return '#f44336';
            case 'process tech':
                return '#2196F3';
            case 'quality tech':
                return '#FFC107';
            case 'operator (auto)':
                return '#607D8B';
            case 'operator (manual)':
                return '#424242';
            default:
                return '#CFD8DC';
        }
    };

    const chartAttributes = {
        theme: "fusion",
        showvalues: "1",        
        useDataPlotColorForLabels: "1",
        showLegend: "1",
        legendItemFontSize: '12',
        legendPosition: 'left',
        labelFontSize: '12'
    }

    const dataSource = {
        chart: {
            ...chartAttributes,
            ...tooltipStyle
        },
        data: collection.map(({ type, downtimeLoss }) => ({
            label: type,
            value: downtimeLoss,
            toolText: `<b>Owner: </b> ${type} <br>
                        <b>Downtime: </b> ${numeral(downtimeLoss).format('0,0')} minutes <br>
                        <b>Downtime: </b> ${numeral((downtimeLoss/60)).format('0,0')} hours <br>`,
            color: getColorCode(type),
            link: `newchart-xml-${type.replace(' ','_')}`
        })),
        linkeddata: collection.map(({ type, lineDetails }) => ({
            id: `${type.replace(' ','_')}`,
            linkedchart: {
                chart: {             
                    caption: `${type} - Downtime Loss by Line`,
                    xAxisName: 'Line',
                    yAxisName: 'Scrap %',
                    ...chartAttributes,
                    ...tooltipStyle
                },
                data: lineDetails.map(({ line, type, downtimeLoss }) => ({ 
                    label: line,
                    value: downtimeLoss,        
                    toolText: `<b>Owner: </b> ${type} <br>
                                <b>Line: </b> ${line} <br>
                                <b>Downtime: </b> ${numeral(downtimeLoss).format('0,0')} minutes <br>
                                <b>Downtime: </b> ${numeral((downtimeLoss/60)).format('0,0')} hours <br>`,
                    link: `newchart-xml-${_.camelCase(type)}_${_.camelCase(line)}`,
                })),
                linkeddata: lineDetails.map(({ type, line, mahcineDetails }) => ({
                    id: `${_.camelCase(type)}_${_.camelCase(line)}`,
                    linkedchart: {
                        chart: {             
                            caption: `${type} / ${line} - Downtime Loss by Machine`,
                            xAxisName: 'Machine',
                            yAxisName: 'Scrap %',
                            ...chartAttributes,
                            ...tooltipStyle
                        },
                        data: mahcineDetails.map(({ type, line, machine, downtimeLoss }) => ({ 
                            label: _.capitalize(machine),
                            value: downtimeLoss,        
                            toolText: `<b>Owner: </b> ${type} <br>
                                        <b>Line: </b> ${line} <br>
                                        <b>Machine: </b> ${_.capitalize(machine)} <br>
                                        <b>Downtime: </b> ${numeral(downtimeLoss).format('0,0')} minutes <br>
                                        <b>Downtime: </b> ${numeral((downtimeLoss/60)).format('0,0')} hours <br>`,
                            link: `newchart-xml-${_.camelCase(type)}_${_.camelCase(line)}_${_.camelCase(machine)}`,
                        })),
                        linkeddata: mahcineDetails.map(({ type, line, machine, reasonDetails }) => ({
                            id: `${_.camelCase(type)}_${_.camelCase(line)}_${_.camelCase(machine)}`,
                            linkedchart: {
                                chart: {             
                                    caption: `${type} / ${line} / ${machine} - Top 10 Downtime Loss by Reason`,
                                    xAxisName: 'Reason',
                                    yAxisName: 'Scrap %',
                                    ...chartAttributes,
                                    ...tooltipStyle
                                },
                                data: reasonDetails.map(({ type, line, machine, reason2, downtimeLoss }) => ({ 
                                    label: _.capitalize(reason2),
                                    value: downtimeLoss,        
                                    toolText: `<b>Owner: </b> ${type} <br>
                                                <b>Line: </b> ${line} <br>
                                                <b>Machine: </b> ${_.capitalize(machine)} <br>
                                                <b>Reason: </b> ${_.capitalize(reason2)} <br>
                                                <b>Downtime: </b> ${numeral(downtimeLoss).format('0,0')} minutes <br>
                                                <b>Downtime: </b> ${numeral((downtimeLoss/60)).format('0,0')} hours <br>`
                                }))
                            }
                        }))
                    }
                }))
            }
        }))
      };
      
      const chartConfigs = {
        type: 'doughnut2d',
        width: '100%',
        height: '89%',
        dataFormat: 'json',
        dataSource: dataSource
      };

      return isDowntimeByOwnerFetching 
        ? <CustomSpinner/> 
        : collection.length === 0 
            ? <Empty/>
            : <ReactFC {...chartConfigs} />
    }

const mapStateToProps = ({ morningMeeting }) => ({
    isDowntimeByOwnerFetching: morningMeeting.isDowntimeByOwnerFetching,
    downtimeByOwnerCollections: morningMeeting.downtimeByOwnerCollections
})

export default connect(mapStateToProps)(DeptKpiChart);