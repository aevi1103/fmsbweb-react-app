import React from 'react'
import numeral from 'numeral'
import _ from 'lodash'
import { useDispatch } from 'react-redux'
import ScrapChart from '../../components/production-status/charts/scrap-chart.component'
import KpiChart from '../../components/production-status/charts/kpi-chart.component'
import DowntimeByMachineChart from './charts/downtime-by-machine-chart.component'
import DowntimeByReasonChart from './charts/downtime-by-reason-chart.component'
import AutoGageScrapChart from './charts/autogage-scrap-chart.component'

import {
    setScrapModalVisible,
    setDowntimeModalVisible,
    setLine,
    setScrapCollection,
    setDowntimeByMachineCollection,
    setDowntimeByReasonCollection
} from '../../redux/production-status/production-status.action'

import {
    Col,
    Row,
    Card,
    Dropdown,
    Button,
    Menu
} from 'antd'

import {  getTopItems } from '../../helpers/helpers'
import { colorCodes } from '../swot/helper'

const { red } = colorCodes;
const gutter = [8,8]

const DepartmentStatus = React.memo(({
    data
}) => {

    const dispatch = useDispatch();
    const { 
        oae,
        scrapDefectDetails,
        downtimeDetails,
        swotTarget,
        kpi,
        hxHUrls,
        department,
        autoGageScrap
    } = data;

    const { oaeTarget } = swotTarget;
    const { detailsByMachine, detailsByReason } = downtimeDetails;
    const title = `${department} OAE: ${numeral(oae).format('0%')}`;

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

        dispatch(setLine(department));

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
        
            default:
                break;
        }

    }

    const moreMenu = (
        <Menu>
            <Menu.Item onClick={() => onModalClick('scrap')} disabled={scrapDefectDetails.length === 0}>
                Scrap Pareto
            </Menu.Item>  
            <Menu.Item onClick={() => onModalClick('downtime')} disabled={detailsByMachine.length === 0}>
                Downtime Pareto
            </Menu.Item>    
        </Menu>
    )

    return (
        <Col md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }} id={_.snakeCase(department)}>

                    <Card 
                        size="small" 
                        title={title} 
                        style={{ borderColor: oae < oaeTarget ? red : '' }}
                        extra={ 
                        [
                            <span key="target">Target: {numeral(oaeTarget).format('0%')}</span>,
                            <Dropdown key="action" overlay={hxhMenu} placement="bottomLeft" arrow>
                                <Button type="link" className="pr0 pl2">Open HxH</Button>
                            </Dropdown>,
                            <Dropdown key="more" overlay={moreMenu} placement="bottomLeft" arrow>
                                <Button type="link" className="pr0 pl2">More</Button>
                            </Dropdown>
                        ]
                    }>

                        <Row gutter={gutter}>

                            <Col span={24}>
                                <ScrapChart data={getTopItems(scrapDefectDetails)} caption="Top 5 Scrap Pareto" isDrillDown={true} />  
                            </Col>

                            <Col span={24}>
                                <KpiChart data={kpi} target={swotTarget} />
                            </Col>

                            <Col span={24}>
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

                    </Card>

                </Col>
    )
})

export default DepartmentStatus;