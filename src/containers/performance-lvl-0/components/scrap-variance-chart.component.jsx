import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import CustomSpinner from '../../../components/custom-spinner/custom-spinner.component'
import { tooltipStyle } from '../../../core/utilities/chart-config'

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const ScrapVarianceChart = () => {

    const scrapVariance = useSelector(({ performance0 }) => performance0?.scrapVariance) ?? null;
    const isScrapVarianceFetching = useSelector(({ performance0 }) => performance0.isScrapVarianceFetching);

    const initialState = {
        category: [],
        linkedData: [],
        data: [],
        area: ''
    }
    const [scrapVarianceData, setScrapVariaceData] = useState(initialState);

    useEffect(() => {

        if (scrapVariance) 
            setScrapVariaceData(scrapVariance);  
        
    },[scrapVariance]);

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

    const data = scrapVarianceData?.data ?? [];

    const seriesData = data.map(({ scrapType, details }) => {

        if (scrapVarianceData.area === 'Plant') {

            return {
                seriesname: `${scrapType} Scrap %`,
                color: scrapType === 'Plant' ? "#001529" : '',  
                data: details.map(({ scrapRate, key }) => ({ 
                    value: (scrapRate * 100).toFixed(2),
                    link: `newchart-xml-${key}`,
                    showValue: "0"    
                }))
            }

        } 

        return {
            seriesname: `${scrapType} Scrap %`,
            color: "#e74d3d",  
            data: details.map(({ scrapRate, key }) => ({ 
                value: (scrapRate * 100).toFixed(2),
                link: `newchart-xml-${key}` 
            }))
        }

    })

    if (scrapVarianceData.area !== 'Plant') {

        seriesData.push({
            seriesname: "Target",
            color: "#18bc9c",
            data: scrapVarianceData.category.map(({ target }) => ({ 
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
              category: scrapVarianceData.category.map(({ quarter }) => ({ label: quarter }))
            }
          ],
        dataset: seriesData,
        linkeddata: scrapVarianceData.linkedData.map(({ key, quarter, monthDetails, area }) => ({
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

    return isScrapVarianceFetching 
        ? <CustomSpinner/> 
        : <ReactFC {...chartConfigs} />
}

export default ScrapVarianceChart;