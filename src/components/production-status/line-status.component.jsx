import React from 'react'
import numeral from 'numeral'
import {
    Col,
    Row,
    Card
} from 'antd'

import HourlyProductionChart from './charts/hourly-prod-chart.component'
import KpiChart from './charts/kpi-chart.component'
import ScrapChart from './charts/scrap-chart.component'
import DowntimeChart from './charts/downtime-chart.component'

const LineStatus = ({ 
    data
}) => {

    const { 
        department,
        machineName,
        swotTarget,
        oae,
        hourlyDetails,
        kpi,
        scrapDefectDetails,
        downtimeDetails
    } = data;

    const { oaeTarget } = swotTarget;

    const title = `${machineName} OAE: ${numeral(oae).format('0%')}`;

    const topFiveScrap = [...scrapDefectDetails].slice(0,5);

    const { detailsByMachine, detailsByReason } = downtimeDetails;
    const topFiveDowntime = department === 'Machining'
            ? [...detailsByMachine].splice(0,5)
            : [...detailsByReason].splice(0,5)

    const gutter = [6,6]
            
    return (
        <Col span={8}>
            <Card size="small" title={title} extra={ 
                [
                <span>Target: {numeral(oaeTarget).format('0%')}</span>
                ]
            }>

                <Row gutter={gutter}>
                    <Col span={24}>
                        <HourlyProductionChart data={hourlyDetails} target={swotTarget} />
                    </Col>
                </Row>

                <Row gutter={gutter}>

                    <Col span={12}>
                        <KpiChart data={kpi} target={swotTarget} />
                    </Col>

                    <Col span={12}>
                        
                        <Row gutter={gutter}>
                            <Col span={24}>
                                <ScrapChart data={topFiveScrap} />
                            </Col>
                            <Col span={24}>
                                <DowntimeChart data={topFiveDowntime} />
                            </Col>
                        </Row>

                    </Col>

                </Row>

                {/* <Row gutter={gutter}>

                    <Col span={24}>
                        Auto Gage Chart
                    </Col>

                </Row> */}

            </Card>
        </Col>
    )
}

export default LineStatus;