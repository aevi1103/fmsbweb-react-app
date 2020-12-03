import React from 'react'
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import { tooltipStyle } from '../../../core/utilities/chart-config'
import { 
    chartConfigDashboard,
    chartConfigModal
} from '../service/chart-config'

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const DowntimeByMachineChart = React.memo(({
    data,
    height = 150,
    isModal = false,
    modalCaption = ''
}) => {

    const chartConfig = !isModal ? chartConfigDashboard : chartConfigModal;

    const caption = !isModal 
        ? `Top 5 Downtime Pareto by Machine`
        : modalCaption

    const dataSource = {
        chart: {
            caption: caption,
            ...chartConfig,
            ...tooltipStyle
        },
        data: data.map(({label, downtimeLoss}) => ({
                label: label,
                value: downtimeLoss,
                link: `newchart-xml-${label.replace(/\s/g, '_')}`
            })),

            linkeddata: data.map(({ label, details }) => ({
                id: `${label.replace(/\s/g, '_')}`,
                linkedchart: {
                    chart: {
                        caption: `${label} Downtime by Reason`,
                        ...chartConfig,
                        ...tooltipStyle
                    },
                    
                    data: details.map(({ reason, downtimeLoss }) => ({
                        label: reason,
                        value: downtimeLoss
                    }))
                }
            }))
      };

      const chartConfigs = {
        type: 'column2d',
        width: '100%',
        height: height,
        dataFormat: 'json',
        dataSource: dataSource
      };

    return (
        <ReactFC {...chartConfigs} />
    )
})

export default DowntimeByMachineChart;