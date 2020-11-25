import React from 'react'
import numeral from 'numeral'
import _ from 'lodash'

import { 
    Row,
    Col,
 } from "antd";

 import DowntimeParetoByReasonChart from './downtime-pareto-by-reason-chart.component'
 import DowntimeParetoByMachineChart from './downtime-pareto-by-machine.component'
 import DailyDowntimeByReasonChart from './daily-downtime-by-reason-chart.component'
 import DailyDowntimeByMachineChart from './daily-downtime-by-machine-chart.component'

 const DowntimeChartsContainer = ({
     data,
     filters,
     line,
     lineKpi
 }) => {

    const { 
        lastDowntimeByReason,
        lastDowntimeByMachine,
        dailyDowntimeByReason,
        dailyDowntimeByMachine,
        downtimeByReason,
        downtimeByMachine,   
    } = data || {}

    const {
        oae,
        scrapRateByArea
    } = lineKpi;

    const scrapRatesStr = scrapRateByArea.map(({ scrapAreaName, scrapRate }) => (`${scrapAreaName}: ${numeral(scrapRate).format('0.00%')}`)).join(' | ');
    const subCaption = `OAE: ${numeral(oae).format('0%')} | ${scrapRatesStr}`

    return (
        <Row gutter={[8,8]}>

            <Col span={8}>
                <DowntimeParetoByReasonChart 
                    downtimeData={downtimeByReason} 
                    line={line} 
                    filters={filters}
                    subCaption={subCaption}
                    calculatedDateRange={false}/> 
            </Col>

            {
                lastDowntimeByReason !== null
                    ? (<Col span={8}>
                            <DowntimeParetoByReasonChart 
                                downtimeData={lastDowntimeByReason} 
                                line={line} 
                                filters={filters}
                                calculatedDateRange={true} /> 
                        </Col>)
                    : null
            }
            
            {
                dailyDowntimeByReason !== null 
                    ? (<Col span={8}>
                            <DailyDowntimeByReasonChart 
                                downtimeData={dailyDowntimeByReason} 
                                line={line}
                                filters={filters}
                                calculatedDateRange={true} />
                        </Col>)
                    : null
            }

            <Col span={8}>
                <DowntimeParetoByMachineChart
                        downtimeData={downtimeByMachine} 
                        line={line} 
                        filters={filters}
                        subCaption={subCaption}
                        calculatedDateRange={false} />
            </Col>

            {
                lastDowntimeByMachine !== null 
                    ? (<Col span={8}>
                            <DowntimeParetoByMachineChart
                                downtimeData={lastDowntimeByMachine} 
                                line={line} 
                                filters={filters}
                                calculatedDateRange={true} />
                        </Col>)
                    : null
            }
            
            {
                dailyDowntimeByMachine !== null 
                    ? (<Col span={8}>
                            <DailyDowntimeByMachineChart
                                downtimeData={dailyDowntimeByMachine} 
                                line={line}
                                filters={filters}
                                calculatedDateRange={true} /> 
                        </Col>)
                    : null
            }
            
        </Row>
    )
 }

 export default DowntimeChartsContainer;