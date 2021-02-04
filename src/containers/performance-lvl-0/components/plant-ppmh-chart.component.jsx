import React from 'react';
import { useSelector } from 'react-redux';
import numeral from 'numeral'
import moment from 'moment';

import { tooltipStyle } from '../../../core/utilities/chart-config'
import CustomSpinner from '../../../components/custom-spinner/custom-spinner.component'

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const numberFormat = '0,0.00[000]';

const PlantPpmhChhart = () => {

    const collection = useSelector(({ performance0 }) => performance0?.plantPpmhCollection) ?? [];
    const isPlantPpmhFetching = useSelector(({ performance0 }) => performance0.isPlantPpmhFetching);

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

        const { 
            ppmh, regular, overtime, orientation, 
            sapNetLessDmax, sapNetDmax, overallHours,
            overallHoursLessDmax } = data;
            
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
                                label: `${year}-Q${quarter}-${month}-WK${w.weekNumber}`,
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

    return isPlantPpmhFetching 
            ? <CustomSpinner/> 
            : <ReactFC {...chartConfigs} />
}

export default PlantPpmhChhart;