import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral'

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../helpers/chart-config'
import CustomSpinner from '../../custom-spinner/custom-spinner.component'

import { Empty } from 'antd';
import moment from 'moment';

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const PlantPpmhChhart = ({
    isPlantPpmhFetching,
    plantPpmhCollection
}) => {

    const [collection, setCollection] = useState([]);
    useEffect(() => {

        try {
            if (plantPpmhCollection) {
                setCollection(plantPpmhCollection); 
            } else {
                setCollection([]);
            }  
        } catch (error) {
            setCollection([]);
        }
        
    },[plantPpmhCollection])

    const numberFormat = '0,0.00[000]';

    const chartProps = {
        showvalues: "1",
        showpercentintooltip: "0",
        enablemultislicing: "1",
        theme: "fusion",
        useDataPlotColorForLabels: "1",
        showLegend: "1",
        drawcrossline: "1",
    }

    const tooltext = (data, period) => {

        const { ppmh, regular, overtime, orientation, 
            sapNetLessDmax, sapNetDmax, overallHours, overallHoursLessDmax } = data;
            
        return `<b>Period:</b> ${period} <br><br>

                <b>Hours:</b><br>
                <b>Regular:</b> ${numeral(regular).format(numberFormat)} <br>
                <b>Overtime:</b> ${numeral(overtime).format(numberFormat)} <br>
                <b>Orientation:</b> ${numeral(orientation).format(numberFormat)} <br>
                <b>Overall:</b> ${numeral(overallHours).format('0,0.00000')} <br>
                <b>Overall - DMAX:</b> ${numeral(overallHoursLessDmax).format('0,0.00000')} <br><br>

                <b>SAP Net (P1A, P1F, P1M): </b><br>
                <b>P1* - DMAX:</b> ${numeral(sapNetLessDmax).format('0,0')} <br>
                <b>DMAX Only:</b> ${numeral(sapNetDmax).format('0,0')} <br><br>

                <b>PPMH:</b> ${numeral(ppmh).format('0,0')}`
    }

    const dataSource = {
        chart: {
            xAxisName: 'Quarter',
            yAxisName: 'PPMH',
            labelDisplay: "rotate",
            slantLabel: "1",
            // rotateValues: "1",
            ...chartProps,
            ...tooltipStyle
        },
        data: collection.map(e => ({
                label: `${e.year}-Q${e.quarter}`,
                value: Math.round(e.ppmh),
                toolText: tooltext(e, `${e.year}-Q${e.quarter}`),
                link: `newchart-xml-${e.year}_Q${e.quarter}`
            })),

            linkeddata: collection.map(({ year, quarter, monthDetails }) => ({
                id: `${year}_Q${quarter}`,
                linkedchart: {
                    chart: {
                        caption: `${year}-Q${quarter} - Plant PPMH by Month (drilldown)`,
                        xAxisName: 'Month',
                        yAxisName: 'PPMH',
                        ...chartProps,
                        ...tooltipStyle
                    },
                    data: monthDetails.map(m => ({ 
                            label: moment().month(m.month).format('MMM'),
                            value: Math.round(m.ppmh),
                            toolText: tooltext(m, `${year}-Q${quarter}-${moment().month(m.month).format('MMM')}`),
                            link: `newchart-xml-${year}_Q${quarter}_M${m.month}`
                        })),
    
                    linkeddata: monthDetails.map(({ month, weekDetails }) => ({
                        id: `${year}_Q${quarter}_M${month}`,
                        linkedchart: {
                            chart: {
                                caption: `${year}-Q${quarter}-${month} - Plant PPMH by Week`,
                                xAxisName: 'Week #',
                                yAxisName: 'PPMH',
                                ...chartProps,
                                ...tooltipStyle
                            },
                            data: weekDetails.map(w => ({ 
                                label: w.weekNumber,
                                value: Math.round(w.ppmh),
                                toolText: tooltext(w, `${year}-Q${quarter}-${moment().month(month).format('MMM')}-WK${w.weekNumber}`),
                            }))
                        }
                    }))
                }
            }))
      };
      
      const chartConfigs = {
        type: 'line',
        width: '100%',
        height: '89%',
        dataFormat: 'json',
        dataSource: dataSource
      };

    //   console.log('PlantPpmhChhart', chartConfigs, plantPpmhCollection)

    return isPlantPpmhFetching 
            ? <CustomSpinner/> 
            : collection.length === 0 
                ? <Empty/>
                : <ReactFC {...chartConfigs} />
}

const mapStateToProps = ({ morningMeeting }) => ({
    isPlantPpmhFetching: morningMeeting.isPlantPpmhFetching,
    plantPpmhCollection: morningMeeting.plantPpmhCollection
})

export default connect(mapStateToProps)(PlantPpmhChhart);