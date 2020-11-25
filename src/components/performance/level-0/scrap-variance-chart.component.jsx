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
} from '../../../core/utilities/chart-config'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const ScrapVarianceChart = ({
    scrapVarianceCollection,
    isScrapVarianceFetching,
}) => {

    const defaultCollection = {
        category: [],
        linkedData: [],
        data: [],
        area: ''
    }
    const [collection, setCollection] = useState(defaultCollection);

    useEffect(() => {

        try {
            if (scrapVarianceCollection) {
                setCollection(scrapVarianceCollection);  
            }
        } catch (error) {
            setCollection(defaultCollection);
        }
        
    },[scrapVarianceCollection, defaultCollection]);

    const chartProps = {
        showValues: '1',
        theme: 'fusion',
        drawcrossline: "1",
        numbersuffix: "%",
        showsum: "1",
    }

    const targetLineProps = {
        anchorRadius: "0",
        dashed: "1",
        showValue: "0"
    }

    const seriesData = collection.data.map(({ scrapType, details }) => {

        if (collection.area === 'Plant') {

            return {
                seriesname: `${scrapType} Scrap %`,
                color: scrapType === 'Plant' ? "#001529" : '',  
                data: details.map(({ scrapRate, key }) => ({ 
                    value: (scrapRate * 100).toFixed(2),
                    link: `newchart-xml-${key}`,
                    showValue: "0"    
                }))
            }

        } else {

            return {
                seriesname: `${scrapType} Scrap %`,
                color: "#e74d3d",  
                data: details.map(({ scrapRate, key }) => ({ 
                    value: (scrapRate * 100).toFixed(2),
                    link: `newchart-xml-${key}` 
                }))
            }

        }

    })

    if (collection.area !== 'Plant') {

        seriesData.push({
            seriesname: "Target",
            color: "#18bc9c",
            data: collection.category.map(({ target }) => ({ 
                value: (target * 100).toFixed(2),
                ...targetLineProps
                }))
        });

    }

    const dataSource = {
        chart: {
            xAxisName: 'Quarter',
            yAxisName: 'Percentage (%)',
            plottooltext: '$seriesname, Quarter: $label, Scrap %: $value %',  
            ...chartProps,
            ...tooltipStyle
        },
        categories: [
            {
              category: collection.category.map(({ quarter }) => ({ label: quarter }))
            }
          ],
        dataset: seriesData,
        linkeddata: collection.linkedData.map(({ key, quarter, monthDetails, area }) => ({
            id: key,
            linkedchart: {
                chart: {
                    caption: `${area} - ${quarter} Monthly Scrap Rate`,
                    xAxisName: 'Month',
                    yAxisName: 'Percentage (%)',
                    plottooltext: '$seriesname, Month: $label, Scrap %: $value %',            
                    ...chartProps,
                    ...tooltipStyle
                },
                categories: [
                    {
                      category: monthDetails.map(({ monthName }) => ({ label: monthName }))
                    }
                  ],
                dataset: [
                    {
                        seriesname: `${area} Scrap %`,
                        color: area === 'Plant' ? "#001529" : "#e74d3d",  
                        data: monthDetails.map(({ scrapRate, key }) => ({ 
                            value: (scrapRate * 100).toFixed(1),
                            link: `newchart-xml-${key}`
                        }))
                    },
                    {
                        seriesname: "Target",
                        color: "#18bc9c",
                        data: monthDetails.map(({ target }) => ({ 
                            value: (target * 100).toFixed(1),
                            ...targetLineProps
                        }))
                    }
                ],
                linkeddata: monthDetails.map(({ key, monthName, weekDetails, area }) => ({
                    id: key,
                    linkedchart: {
                        chart: {
                            caption: `${area} - ${monthName} Weekly Scrap Rate`,
                            xAxisName: 'Week Number',
                            yAxisName: 'Percentage (%)',
                            plottooltext: '$seriesname, Week: $label, Scrap %: $value %',
                            ...chartProps,
                            ...tooltipStyle
                        },
                        categories: [
                            {
                              category: weekDetails.map(({ weekNumber }) => ({ label: weekNumber }))
                            }
                        ],
                        dataset: [
                            {
                                seriesname: `${area} Scrap %`,
                                color: area === 'Plant' ? "#001529" : "#e74d3d",
                                data: weekDetails.map(({ scrapRate }) => ({ 
                                    value: (scrapRate * 100).toFixed(1)
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

    //   console.log({chartConfigs, collection, scrapVarianceCollection})

    return isScrapVarianceFetching 
        ? <CustomSpinner/> 
        : collection.length === 0 
            ? <Empty/>
            : <ReactFC {...chartConfigs} />
}

const mapStateToProps = ({ morningMeeting }) => ({
    scrapVarianceCollection: morningMeeting.scrapVarianceCollection,
    isScrapVarianceFetching: morningMeeting.isScrapVarianceFetching
})

export default connect(mapStateToProps)(ScrapVarianceChart);