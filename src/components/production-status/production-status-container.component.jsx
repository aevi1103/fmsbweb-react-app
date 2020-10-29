import React from 'react'
import LineStatus from './line-status.component'
import LineStatusMicro from './line-status-micro.component'
import ScrapParetoModal from '../../components/production-status/scrapParetoModal.component'
import DowntimeParetoModal from '../../components/production-status/downtimeParetoModal.component'
import HxHParetoModal from '../../components/production-status/hxhParetoModal.component'
import DepartmentStatus from './department-status.component'
import ScrapSummary from './scrap-summary.component'

import {
    Row,
    Col
} from 'antd'

const gutter = [8,8]

const ProductionStatusContainer = React.memo(({
    productionStatus
}) => {

    const { lines, department, scrapDetails, scrapDetailsByDepartment } = productionStatus || {};
    const { oae, swotTarget } = department || {};
    const { oaeTarget } = swotTarget;

    return (

        <>

            {/* Micro Line OAE */}
            <Row gutter={gutter}>

                {
                    oae > 0
                     ?  <Col sm={{ span: 24 }}  md={{ span: 12 }} lg={{ span: 6 }} xl={{ span: 2 }}>
                            <LineStatusMicro oae={oae} oaeTarget={oaeTarget} line={department.department} />
                        </Col>
                    : null
                }
                
                {
                    lines.length > 0 
                        ?  lines.map(({ oae, machineName, swotTarget: { oaeTarget } }) => (
                            <Col key={machineName} sm={{ span: 24 }}  md={{ span: 12 }} lg={{ span: 6 }} xl={{ span: 2 }}>
                                <LineStatusMicro oae={oae} oaeTarget={oaeTarget} line={machineName} />
                            </Col>
                        ))
                        : null
                }

            </Row>

            <ScrapSummary scrapDetails={scrapDetails} departmentScrap={scrapDetailsByDepartment} department={department.department} />

            <Row gutter={gutter}>

                <DepartmentStatus data={department} /> 

                {
                    lines.length > 0 
                        ?   lines.map(line => <LineStatus key={line.machineName} data={line} gutter={gutter} />)
                        :   null
                }

            </Row>

            <ScrapParetoModal />
            <DowntimeParetoModal />
            <HxHParetoModal />

        </>
        
    )
})

export default ProductionStatusContainer;