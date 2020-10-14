import React from 'react'
import _ from 'lodash'

import { 
    Row,
    Col,
 } from "antd";

 import DowntimeParetoByReasonChart from './downtime-charts/downtime-pareto-by-reason-chart.component'
 import DowntimeParetoByMachineChart from './downtime-charts/downtime-pareto-by-machine.component'
 import DailyDowntimeByReasonChart from './downtime-charts/daily-downtime-by-reason-chart.component'
 import DailyDowntimeByMachineChart from './downtime-charts/daily-downtime-by-machine-chart.component'

 const DowntimeChartsContainer = ({
     data,
     filters,
     line
 }) => {

    const { 
        lastDowntimeByReason,
        lastDowntimeByMachine,
        dailyDowntimeByReason,
        dailyDowntimeByMachine,
        downtimeByReason,
        downtimeByMachine
    } = data || {}


    return (
        <>
            <Row gutter={[8,8]}>

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
                    <DowntimeParetoByReasonChart 
                        downtimeData={downtimeByReason} 
                        line={line} 
                        filters={filters}
                        calculatedDateRange={false}/> 
                </Col>

            </Row>
            
            <Row gutter={[8,8]}>

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
                
                <Col span={8}>
                    <DowntimeParetoByMachineChart
                            downtimeData={downtimeByMachine} 
                            line={line} 
                            filters={filters}
                            calculatedDateRange={false} />
                </Col>

            </Row>
        </>

    )
 }

 export default DowntimeChartsContainer;