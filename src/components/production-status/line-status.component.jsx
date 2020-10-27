import React from 'react'
import numeral from 'numeral'
import {
    Col,
    Row,
    Card,
    Menu,
    Dropdown,
    Button
} from 'antd'

import HourlyProductionChart from './charts/hourly-prod-chart.component'
import KpiChart from './charts/kpi-chart.component'
import ScrapChart from './charts/scrap-chart.component'
import DowntimeChart from './charts/downtime-chart.component'

const LineStatus = ({ 
    data,
    gutter
}) => {

    const { 
        department,
        machineName,
        swotTarget,
        oae,
        hourlyDetails,
        kpi,
        scrapDefectDetails,
        downtimeDetails,
        hxHUrls
    } = data;

    const { oaeTarget } = swotTarget;

    const title = `${machineName} OAE: ${numeral(oae).format('0%')}`;
    
    const topFiveScrap = [...scrapDefectDetails].slice(0,5);
    const { detailsByMachine, detailsByReason } = downtimeDetails;
    const topFiveDowntime = department === 'Machining'
            ? [...detailsByMachine].splice(0,5)
            : [...detailsByReason].splice(0,5)


    const actionMenu = (
        <Menu>
            {
                hxHUrls.map(({ shiftDate, shift, line, hxHUrl }) => (
                    <Menu.Item key={line}>
                        <a href={hxHUrl} target="_blank" rel="noreferrer" >{`${shiftDate} - Shift ${shift} - ${line} HxH`}</a>
                    </Menu.Item>
                ))
            }
            
        </Menu>
    )

    return (
        <Col md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }} >

            <Card size="small" title={title} extra={ 
                [
                    <span key="target">Target: {numeral(oaeTarget).format('0%')}</span>,
                    <Dropdown key="action" overlay={actionMenu} placement="bottomLeft" arrow>
                        <Button type="link" className="pr0 pl2">Open HxH</Button>
                    </Dropdown>
                ]
            }>

                <Row gutter={gutter}>

                    <Col span={24}>
                        <HourlyProductionChart data={hourlyDetails} target={swotTarget} />
                    </Col>

                    <Col span={24}>
                        <KpiChart data={kpi} target={swotTarget} />
                    </Col>

                    <Col lg={{ span: 24 }} xl={{ span: 12 }}>
                        <ScrapChart data={topFiveScrap} caption="Top 5 Scrap Pareto" />      
                    </Col>

                    <Col lg={{ span: 24 }} xl={{ span: 12 }}>
                        <DowntimeChart data={topFiveDowntime} dept={department} />
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