import React from 'react'
import moment from 'moment'
import numeral from 'numeral'
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.powercharts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';
import { tooltipStyle } from '../../../core/utilities/chart-config'

// Resolves charts dependancy
FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const HourlyProductionChart = ({
    data
}) => {

    if (!data) return <span>No data</span>

    const { rows, columns, dataSet } = data;

    const mappedRows = rows.map(({machineId, line}) => ({
        id: line,
        label: line
    }));

    const mappedColumns = columns.map(({ hour, shiftDate, shiftOrder, shift }) => ({
        id: `${moment(shiftDate).format('X')}${shiftOrder}${hour}`,
        label: `${moment(shiftDate).format('MM/DD/YY')} - Shift ${shift} - Hr ${hour}`
    }));

    const getToolText = (item) => {

        const {
            shiftDate,
            shift,
            line,
            hour,
    
            net,
            target,
            swotTarget,
    
            sol,
            eol,
            totalScrap,
    
            totalScrapDefects
        } = item;

        const { oaeTarget } = swotTarget || {};
        const targetNetRate = target * oaeTarget;
        const oae = target === 0 ? 0 : net / target;
        const defects = totalScrapDefects.map(({ scrapAreaName, scrapDesc , qty }) => `<li><b>${scrapDesc}:</b> ${numeral(qty).format('0,0')} (${scrapAreaName})</li>`).join('');

        return `
            <b>${moment(shiftDate).format('MM/DD/YYYY')} - Shift ${shift} - Hr ${hour}</b> <br>
            <b>Line:</b> ${line} <br><br>

            <b>Target:</b> ${numeral(targetNetRate).format('0,0')} / ${numeral(oaeTarget).format('0%')} <br>
            <b>Net:</b> ${numeral(net).format('0,0')} / ${numeral(oae).format('0%')} <br>
            <b>SOL Scrap:</b> ${numeral(sol).format('0,0')} <br>
            <b>EOL Scrap:</b> ${numeral(eol).format('0,0')} <br>
            <b>Total Scrap:</b> ${numeral(totalScrap).format('0,0')} <br><br>

            <b>Defects:</b>
            <ol>${defects}</ol> 

            <span>*Click to view Hxh Page</span>
            `
    }

    const setColor = (target, oaeTarget, net) => {
        if(target === 0) return '#a4a4a5';
        return net < (target * oaeTarget) ? '#FF4136' : '#28A745'
    }

    const mappedDataSet = dataSet.map(d => ({
        columnid: `${moment(d.shiftDate).format('X')}${d.shiftOrder}${d.hour}`,
        rowid: d.line,
        value: d.net.toString(),
        toolText: getToolText(d),
        color: setColor(d.target, d.swotTarget?.oaeTarget, d.net),
        valueFontColor: '#ffffff',
        link: `n-${d.hxHUrl}`
    }))

    const dataSource = {
        chart: {
          xaxisname: "Shift Date - Shift - Hour",
          yaxisname: "Line",
          theme: "fusion",
          showvalues: "1",
          labelDisplay: 'rotate',
          slantLabel: '1',
          bgColor: '#F9FAFC',
          ...tooltipStyle
        },
        rows: {
            row: mappedRows
        },
        columns: {
            column: mappedColumns
        },
        dataset: [
            {
                data: mappedDataSet
            }
        ],
        "colorrange": {
            "gradient": "0",
            "minvalue": "0",
            "code": "E24B1A",
            "startlabel": "Poor",
            "endlabel": "Good",
            "color": [
                {
                    "code": "E24B1A",
                    "minvalue": "-999",
                    "maxvalue": "2",
                    "label": "Bad"
                },
                {
                    "code": "6DA81E",
                    "minvalue": "3",
                    "maxvalue": "999",
                    "label": "Good"
                },
                {
                    "code": "a4a4a5",
                    "minvalue": "999",
                    "maxvalue": "9999",
                    "label": "Not Running / No part selected"
                }
            ]
        }
    }

    const config = {
        type: 'heatmap',
        width: '100%',
        height: '85%',
        dataFormat: 'json',
        dataSource: dataSource
    }

    return <ReactFC {...config} />; 
}

export default HourlyProductionChart;