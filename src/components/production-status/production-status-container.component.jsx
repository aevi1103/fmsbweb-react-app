import React from 'react'
import numeral from 'numeral'
import LineStatus from './line-status.component'
import LineStatusMicro from './line-status-micro.component'

import KpiChart from '../../components/production-status/charts/kpi-chart.component'
import ScrapChart from '../../components/production-status/charts/scrap-chart.component'
import DowntimeChart from '../../components/production-status/charts/downtime-chart.component'

import ScrapByTypeChart from '../../components/production-status/charts/scrap-pareto-by-type-chart.component'

import {
    Row,
    Card,
    Col,
    Menu,
    Dropdown,
    Button
} from 'antd'

const ProductionStatusContainer = ({
    productionStatus
}) => {

    const { lines, department, scrapDetails, scrapDetailsByDepartment } = productionStatus || {};
    const { oae, scrapDefectDetails, downtimeDetails, swotTarget, kpi, hxHUrls } = department || {};
    const { oaeTarget } = swotTarget;

    const title = `${department.department} OAE: ${numeral(oae).format('0%')}`;
    const deptTopFiveScrap = [...scrapDefectDetails].slice(0,5);
    const deptTopFiveDowntime = department === 'Machining'
            ? [...downtimeDetails.detailsByMachine].splice(0,5)
            : [...downtimeDetails.detailsByReason].splice(0,5)

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

    const gutter = [8,8]


    return (

        <>

            <Row gutter={gutter}>

                {
                    lines.length > 0 
                        ?  lines.map(line => (
                            <Col key={line.machineName} sm={{ span: 24 }}  md={{ span: 12 }} lg={{ span: 6 }} xl={{ span: 2 }}>
                                <LineStatusMicro data={line} />
                            </Col>
                        ))
                        : null
                }

            </Row>

            <Row gutter={gutter}>

                <Col sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }} xl={{ span: 4 }}>

                    <Card 
                        size="small" 
                        headStyle={{ display: 'none' }}>
                        <ScrapByTypeChart data={scrapDetailsByDepartment} dept={department.department} />
                    </Card>
                    
                </Col>

                {
                    scrapDetails.map(scrap => <Col key={scrap.area} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }} xl={{ span: 4 }}>
                                                    <Card 
                                                        size="small" 
                                                        headStyle={{ display: 'none' }}>
                                                            <ScrapChart 
                                                                data={scrap.defects} 
                                                                caption={`Top 5 Scrap Defects Pareto at ${scrap.area}`}
                                                                height="180" />
                                                    </Card>               
                                                </Col>)
                }

            </Row>

            {/* <Divider>Lines</Divider> */}

            <Row gutter={gutter}>

                <Col md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }}>

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
                                <ScrapChart data={deptTopFiveScrap} caption="Top 5 Scrap Pareto" />  
                            </Col>

                            <Col span={24}>
                                <KpiChart data={kpi} target={swotTarget} />
                            </Col>

                            <Col span={24}>
                                <DowntimeChart data={deptTopFiveDowntime} dept={department.department} /> 
                            </Col>

                        </Row>

                    </Card>

                </Col>

                {
                    lines.length > 0 
                        ?   lines.map(line => <LineStatus key={line.machineName} data={line} gutter={gutter} />)
                        :   null
                }

            </Row>

        </>
        
    )
}

export default ProductionStatusContainer;