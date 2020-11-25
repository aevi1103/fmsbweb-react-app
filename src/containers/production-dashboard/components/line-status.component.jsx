import React from 'react'
import numeral from 'numeral'
import _ from 'lodash'
import { useDispatch } from 'react-redux'
import {
    Col,
    Row,
    Card,
    Menu,
    Dropdown,
    Button
} from 'antd'

import HourlyProductionChart from './hourly-prod-chart.component'

import ScrapChart from './scrap-chart.component'
import KpiChart from './kpi-chart.component'
import DowntimeByMachineChart from './downtime-by-machine-chart.component'
import DowntimeByReasonChart from './downtime-by-reason-chart.component'
import AutoGageScrapChart from './autogage-scrap-chart.component'

import {
    setScrapModalVisible,
    setDowntimeModalVisible,
    setHxHModalVisible,
    setLine,
    setScrapCollection,
    setDowntimeByMachineCollection,
    setDowntimeByReasonCollection,
    setHxHCollection,
    setTarget
} from '../../../core/redux/production-status/production-status.action'

import { getTopItems } from '../../../core/utilities/helpers'
import { colorCodes } from '../../swot/service/helper'

const { red } = colorCodes;

const LineStatus = React.memo(({ 
    data,
    gutter
}) => {

    const dispatch = useDispatch();


    const { 
        department,
        machineName,
        swotTarget,
        oae,
        hourlyDetails,
        kpi,
        scrapDefectDetails,
        downtimeDetails,
        hxHUrls,
        autoGageScrap
    } = data;

    const { oaeTarget } = swotTarget;
    const { detailsByMachine, detailsByReason } = downtimeDetails;

    const cardTitle = `${machineName} OAE: ${numeral(oae).format('0%')}`;

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
                dispatch(setScrapCollection(scrapDefectDetails))
                dispatch(setScrapModalVisible(true));
                break;

            case 'downtime':
                dispatch(setDowntimeByMachineCollection(detailsByMachine))
                dispatch(setDowntimeByReasonCollection(detailsByReason))
                dispatch(setDowntimeModalVisible(true));
                break;

            case 'hxh':
                dispatch(setHxHCollection(hourlyDetails))
                dispatch(setTarget(swotTarget))
                dispatch(setHxHModalVisible(true));
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
            <Menu.Item onClick={() => onModalClick('scrap')} disabled={scrapDefectDetails.length === 0}>
                Scrap Pareto
            </Menu.Item>  
            <Menu.Item onClick={() => onModalClick('downtime')} disabled={detailsByMachine.length === 0}>
                Downtime Pareto
            </Menu.Item>    
        </Menu>
    )

    return (
        <Col md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }} id={_.snakeCase(machineName)} >

            <Card 
                size="small" 
                title={cardTitle} 
                style={{ borderColor: oae < oaeTarget ? red : '' }}
                extra={ 
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

                <Row gutter={gutter} >

                    <Col span={24}>
                        <HourlyProductionChart data={hourlyDetails} target={swotTarget} />
                    </Col>

                    <Col span={24}>
                        <KpiChart data={kpi} target={swotTarget} />
                    </Col>

                    <Col lg={{ span: 24 }} xl={{ span: 12 }}>
                        <ScrapChart data={getTopItems(scrapDefectDetails)} caption="Top 5 Scrap Pareto" />      
                    </Col>

                    <Col lg={{ span: 24 }} xl={{ span: 12 }}>
                            {
                                department === 'Machining'
                                    ? <DowntimeByMachineChart data={getTopItems(detailsByMachine)} />
                                    : <DowntimeByReasonChart data={getTopItems(detailsByReason)} />
                            }
                    </Col>

                    {
                        department === 'Machining'
                            ?  <Col span={24}>
                                    <AutoGageScrapChart data={getTopItems(autoGageScrap)} caption="Top 5 AutoGage Scrap" />  
                                </Col>
                            : null
                    }
                    

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