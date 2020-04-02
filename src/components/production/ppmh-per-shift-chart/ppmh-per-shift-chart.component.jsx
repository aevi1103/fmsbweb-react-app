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

const PpmhPerShiftChart = ({
    isPpmhPerShiftFetching,
    ppmhPerShiftCollection
}) => {

    const [collection, setCollection] = useState([]);
    useEffect(() => {

        try {
            setCollection(ppmhPerShiftCollection || ppmhPerShiftCollection.length > 0 ? ppmhPerShiftCollection : []); 
        } catch (error) {
            setCollection([]);
        }
        
    },[ppmhPerShiftCollection]);

    const numberFormat = '0,0.00';

    const chartProps = {
        showvalues: "1",
        showpercentintooltip: "0",
        enablemultislicing: "1",
        theme: "fusion",
        useDataPlotColorForLabels: "1",
        showLegend: "1",
        drawcrossline: "1"
    };

    const dataSource = {
        chart: {
            xAxisName: 'Shift',
            yAxisName: 'PPMH',
            ...chartProps,
            ...tooltipStyle
        },
        data: collection.map(({shift, sapNet, laborHours: { ppmh, regular, overtime, doubleTime, orientation, overAll }}) => ({
                label: shift,
                value: Math.round(ppmh),
                toolText: `<b>Shift: </b> ${shift} <br>
                            <b>Regular: </b> ${numeral(regular).format(numberFormat)} <br>
                            <b>Overtime: </b> ${numeral(overtime).format(numberFormat)} <br>
                            <b>Double TIme: </b> ${numeral(doubleTime).format(numberFormat)} <br>
                            <b>Orientation: </b> ${numeral(orientation).format(numberFormat)} <br>
                            <b>Overall: </b> ${numeral(overAll).format(numberFormat)} <br>
                            <b>SAP Net: </b> ${numeral(sapNet).format('0,0')} <br>
                            <b>PPMH: </b> ${numeral(ppmh).format('0,0')} <br>
                            `
            }))
            
      };
      
      const chartConfigs = {
        type: 'column2d',
        width: '100%',
        height: '86%',
        dataFormat: 'json',
        dataSource: dataSource
      };

    //   console.log('ScrapVariancePerProgramChart end', chartConfigs)

    return isPpmhPerShiftFetching 
            ? <CustomSpinner/> 
            : collection.length === 0 
                ? <Empty/>
                : <ReactFC {...chartConfigs} />
}

const mapStateToProps = ({ morningMeeting }) => ({
    isPpmhPerShiftFetching: morningMeeting.isPpmhPerShiftFetching,
    ppmhPerShiftCollection: morningMeeting.ppmhPerShiftCollection
})

export default connect(mapStateToProps)(PpmhPerShiftChart);