import React from 'react'
import numeral from 'numeral'
import { useDispatch } from 'react-redux'
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
import DowntimeByMachineChart from './charts/downtime-by-machine-chart.component'
import DowntimeByReasonChart from './charts/downtime-by-reason-chart.component'

import {
    setScrapModalVisible,
    setDowntimeModalVisible,
    setHxHModalVisible,
    setLine
} from '../../redux/production-status/production-status.action'

const LineStatus = React.memo(({ 
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

    const dispatch = useDispatch();

    const { oaeTarget } = swotTarget;
    const title = `${machineName} OAE: ${numeral(oae).format('0%')}`;

    const topFiveScrap = [...scrapDefectDetails].slice(0,5);
    const { detailsByMachine, detailsByReason } = downtimeDetails;
    const deptTopFiveDowntimeByMachine = [...detailsByMachine].splice(0,5);
    const deptTopFiveDowntimeByReason = [...detailsByReason].splice(0,5);

    const hxhMenu = (
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

    const onModalClick = (type) => {

        dispatch(setLine(machineName));

        switch (type) {

            case 'scrap':
                dispatch(setScrapModalVisible(true));
                break;

            case 'downtime':
                dispatch(setDowntimeModalVisible(true))
                break;

            case 'hxh':
                dispatch(setHxHModalVisible(true))
                break;
        
            default:
                break;
        }

    }

    const moreMenu = (
        <Menu>
            <Menu.Item onClick={() => onModalClick('hxh')} disabled={hourlyDetails.length === 0}>
                Hourly Production
            </Menu.Item>  
            <Menu.Item onClick={() => onModalClick('scrap')} disabled={topFiveScrap.length === 0}>
                Scrap Pareto
            </Menu.Item>  
            <Menu.Item onClick={() => onModalClick('downtime')} disabled={deptTopFiveDowntimeByMachine.length === 0}>
                Downtime Pareto
            </Menu.Item>    
        </Menu>
    )

    return (
        <Col md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }} >

            <Card size="small" title={title} extra={ 
                [
                    <span key="target">Target: {numeral(oaeTarget).format('0%')}</span>,
                    <Dropdown key="hxhs" overlay={hxhMenu} placement="bottomLeft" arrow>
                        <Button type="link" className="pr0 pl2">Open HxH</Button>
                    </Dropdown>,
                    <Dropdown key="more" overlay={moreMenu} placement="bottomLeft" arrow>
                        <Button type="link" className="pr0 pl2">More</Button>
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
                            {
                                department === 'Machining'
                                    ? <DowntimeByMachineChart data={deptTopFiveDowntimeByMachine} />
                                    : <DowntimeByReasonChart data={deptTopFiveDowntimeByReason} />
                            }
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
})

export default LineStatus;