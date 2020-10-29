import React from 'react'

import {
    Row,
    Col,
    Card
} from 'antd'

import ScrapByTypeChart from '../../components/production-status/charts/scrap-pareto-by-type-chart.component'
import ScrapChart from '../../components/production-status/charts/scrap-chart.component'

const gutter = [8,8]

const ScrapSummary = React.memo(({
    scrapDetails,
    departmentScrap,
    department
}) => {


    return (
        <Row gutter={gutter}>

                <Col sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }} xl={{ span: 4 }}>

                    <Card 
                        size="small" 
                        headStyle={{ display: 'none' }}>
                        <ScrapByTypeChart data={departmentScrap} dept={department} />
                    </Card>
                    
                </Col>

                {
                    scrapDetails.map(scrap => <Col key={scrap.area} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }} xl={{ span: 4 }}>
                                                    <Card size="small" 
                                                            headStyle={{ display: 'none' }}>
                                                            <ScrapChart 
                                                                data={scrap.defects} 
                                                                caption={`Top 5 Scrap Defects Pareto at ${scrap.area}`}
                                                                height={180} 
                                                                isDrillDown={true} />
                                                    </Card>               
                                                </Col>)
                }

            </Row>
    )
})

export default ScrapSummary;