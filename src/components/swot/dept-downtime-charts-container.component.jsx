import React from 'react'
import numeral from 'numeral'
import { useParams } from 'react-router-dom';
import _ from 'lodash'

import { 
    Row,
    Col,
 } from "antd";

 import DowntimeParetoByReasonChart from './downtime-charts/downtime-pareto-by-reason-chart.component'
 import DowntimeParetoByMachineChart from './downtime-charts/downtime-pareto-by-machine.component'
 import DailyDowntimeByReasonChart from './downtime-charts/daily-downtime-by-reason-chart.component'
 import DailyDowntimeByMachineChart from './downtime-charts/daily-downtime-by-machine-chart.component'

 const DeptDowntimeChartsContainer = ({
     data,
     filters,
     lineKpi
 }) => {

    const { department } = useParams();

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
        <>
            <Row gutter={[8,8]}>

                <Col span={8}>
                    <DowntimeParetoByReasonChart 
                        downtimeData={downtimeByReason} 
                        line={department} 
                        filters={filters}
                        subCaption={subCaption}
                        calculatedDateRange={false}/> 
                </Col>

                {
                    lastDowntimeByReason !== null
                        ? (<Col span={8}>
                                <DowntimeParetoByReasonChart 
                                    downtimeData={lastDowntimeByReason} 
                                    line={department} 
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
                                    line={department}
                                    filters={filters}
                                    calculatedDateRange={true} />
                            </Col>)
                        : null
                }
                
            </Row>
            
            <Row gutter={[8,8]}>

                <Col span={8}>
                    <DowntimeParetoByMachineChart
                            downtimeData={downtimeByMachine} 
                            line={department} 
                            filters={filters}
                            subCaption={subCaption}
                            calculatedDateRange={false} />
                </Col>

                {
                    lastDowntimeByMachine !== null 
                        ? (<Col span={8}>
                                <DowntimeParetoByMachineChart
                                    downtimeData={lastDowntimeByMachine} 
                                    line={department} 
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
                                    line={department}
                                    filters={filters}
                                    calculatedDateRange={true} /> 
                            </Col>)
                        : null
                }
                


            </Row>
        </>

    )
 }

 export default DeptDowntimeChartsContainer;