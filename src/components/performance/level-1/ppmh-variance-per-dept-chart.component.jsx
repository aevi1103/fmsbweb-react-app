import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { Empty } from 'antd';

import CustomSpinner from '../../custom-spinner/custom-spinner.component'
import {
    tooltipStyle
} from '../../../helpers/chart-config'
import moment from 'moment';

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const ScrapVarianceChart = ({
    isPpmhPerDeptVarianceFetching,
    ppmhPerDeptVarianceCollection,
}) => {

    const [collection, setCollection] = useState([]);

    useEffect(() => {

        try {
            if (ppmhPerDeptVarianceCollection) {
                setCollection(ppmhPerDeptVarianceCollection);  
            }
        } catch (error) {
            setCollection([]);
        }
        
    },[ppmhPerDeptVarianceCollection]);

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
                color: "#e74d3d",
                data: collection.map(({ laborHours: { ppmh }, key }) => ({ 
                    value: ppmh.toFixed(2),
                    link: `newchart-xml-${key}`,
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
                        color: "#e74d3d",
                        data: monthDetails.map(({ laborHours: { ppmh }, key }) => ({ 
                            value: ppmh.toFixed(1),
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
                            yAxisName: 'Percentage (%)',
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
                                color: "#e74d3d",
                                data: weekDetails.map(({ laborHours: { ppmh } }) => ({ 
                                    value: ppmh.toFixed(1)
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

    //   console.log({chartConfigs, collection, ppmhPerDeptVarianceCollection})

    return isPpmhPerDeptVarianceFetching 
            ? <CustomSpinner/> 
            : collection.length === 0 
                ? <Empty/>
                : <ReactFC {...chartConfigs} />
}

const mapStateToProps = ({ morningMeeting }) => ({
    isPpmhPerDeptVarianceFetching: morningMeeting.isPpmhPerDeptVarianceFetching,
    ppmhPerDeptVarianceCollection: morningMeeting.ppmhPerDeptVarianceCollection
})

export default connect(mapStateToProps)(ScrapVarianceChart);