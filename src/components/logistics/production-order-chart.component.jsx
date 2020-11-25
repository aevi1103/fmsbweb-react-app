import React from 'react';
import moment from 'moment'
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import {
    tooltipStyle
} from '../../core/utilities/chart-config'
import { forOwn } from 'lodash';

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const ProductionOrderChart = ({ 
    data,
    workCenter
}) => {

    const items = data.map((item, i) => ({ key: i, ...item }))

    const categories = items.map(({ date, weekNumber }) => ({ 
        label: `${moment(date).format('ddd, MM/DD/YY')} WK${weekNumber}`
    }))
 
    const holidays = items.filter(({ isHoliday, isToday }) => isHoliday || isToday);

    holidays.forEach(({ holiday, isToday, key }, i) => {
        
        categories.splice(key + i, 0, {
            vline: 'true',
            showOnTop: '1',
            label: isToday ? 'Today' : holiday,
            linePosition: '1',
            dashed: '1',
            dashLen: '10',
            thickness: '5',
            dashGap: '3'
        });

    });

    const dataSource = {
        chart: {
            caption: `${workCenter ?? ''} Cummulative Orders vs Built Cummulative`,
            theme: "fusion",
            paletteColors: "#d91e18, #2ecc71",
            // slantLabel: '1',
            // labelDisplay: 'rotate',
            showdivlinesecondaryvalue: '1',
            drawcrossline: '1',
            showBorder: '1',
            borderColor: '#e2e2e2',
            legendPosition: 'top',
            ...tooltipStyle
        },
        categories: [
            {
                category: categories
            }
        ],
        dataset: [
            {
                seriesname: "Cummulative Orders",
                data: data.map(({ cummulativeOrder }) => ({ value: cummulativeOrder }))
            },
            {
                seriesname: "Built Cummulative",
                data: data.map(({ cummulativeBuilt }) => ({ value: cummulativeBuilt }))
            }
        ]
    }

    const config = {
        type: 'msarea',
        width: '100%',
        height: '600',
        dataFormat: 'json',
        dataSource: dataSource
    }

    return <ReactFC {...config} />

}

export default ProductionOrderChart;