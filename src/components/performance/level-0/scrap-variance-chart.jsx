import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import CustomSpinner from '../../custom-spinner/custom-spinner.component'
import {
    tooltipStyle
} from '../../../helpers/chart-config'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const ScrapVarianceChart = ({
    scrapVarianceCollection,
    isScrapVarianceFetching,
}) => {

    const [collection, setCollection] = useState([]);

    useEffect(() => {

        try {
            if (scrapVarianceCollection) {
                setCollection(scrapVarianceCollection);  
            }
        } catch (error) {
            setCollection([]);
        }
        
    },[collection, scrapVarianceCollection]);

    const dataSource = {
        chart: {
            xAxisName: 'Quarter',
            yAxisName: 'Percentage (%)',
            showValues: '1',
            theme: 'fusion',
            drawcrossline: "1",
            numbersuffix: "%",
            showsum: "1",
            plottooltext: '$seriesname, Quarter: $label, Scrap %: $value %',        
            ...tooltipStyle
        },
        categories: [
            {
              category: collection.map(({ quarter }) => ({ label: quarter }))
            }
          ],
        dataset: [
            {
                seriesname: "SB Scrap %",
                color: "#e74d3d",
                data: collection.map(({ scrapRate, key }) => ({ 
                    value: (scrapRate * 100).toFixed(2),
                    link: `newchart-xml-${key}` 
                }))
            },
            {
              seriesname: "Target",
              color: "#18bc9c",
              data: collection.map(({ target }) => ({ 
                  value: (target * 100).toFixed(2)
                }))
            }          
        ],
        linkeddata: collection.map(({ key, quarter, monthDetails }) => ({
            id: key,
            linkedchart: {
                chart: {
                    caption: `${quarter} Monthly Scrap Rate`,
                    xAxisName: 'Month',
                    yAxisName: 'Percentage (%)',
                    showValues: '1',
                    theme: 'fusion',
                    drawcrossline: "1",
                    numbersuffix: "%",
                    showsum: "1",
                    plottooltext: '$seriesname, Month: $label, Scrap %: $value %',
                    
                    ...tooltipStyle
                },
                categories: [
                    {
                      category: monthDetails.map(({ monthName }) => ({ label: monthName }))
                    }
                  ],
                dataset: [
                    {
                        seriesname: "SB Scrap %",
                        color: "#e74d3d",
                        data: monthDetails.map(({ scrapRate, key }) => ({ 
                            value: (scrapRate * 100).toFixed(1),
                            link: `newchart-xml-${key}` 
                        }))
                    },
                    {
                        seriesname: "Target",
                        color: "#18bc9c",
                        data: monthDetails.map(({ target }) => ({ 
                            value: (target * 100).toFixed(1)
                            }))
                    }
                ],
                linkeddata: monthDetails.map(({ key, monthName, weekDetails }) => ({
                    id: key,
                    linkedchart: {
                        chart: {
                            caption: `${monthName} Weekly Scrap Rate`,
                            xAxisName: 'Week Number',
                            yAxisName: 'Percentage (%)',
                            showValues: '1',
                            theme: 'fusion',
                            drawcrossline: "1",
                            numbersuffix: "%",
                            showsum: "1",
                            plottooltext: '$seriesname, Week: $label, Scrap %: $value %',
                            
                            ...tooltipStyle
                        },
                        categories: [
                            {
                              category: weekDetails.map(({ weekNumber }) => ({ label: weekNumber }))
                            }
                        ],
                        dataset: [
                            {
                                seriesname: "SB Scrap %",
                                color: "#e74d3d",
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

    return isScrapVarianceFetching ? <CustomSpinner/> : <ReactFC {...chartConfigs} />
}

const mapStateToProps = ({ morningMeeting }) => ({
    scrapVarianceCollection: morningMeeting.scrapVarianceCollection,
    isScrapVarianceFetching: morningMeeting.isScrapVarianceFetching
})

export default connect(mapStateToProps)(ScrapVarianceChart);