import React from 'react'
import numeral from 'numeral'

import ProductionByTypeTable from './production-by-type-table.component';
import ScrapByDeptTable from './scrap-by-dept-tale.component';

import { colors } from '../../../core/utilities/colors'
import { 
    Col,
    Row,
    Card,
    Statistic,
    Collapse
} from 'antd'

const { Panel } = Collapse;

const { green, red } = colors;

const ProductionDetails = React.memo(({
    responsiveProps,
    loading,
    data = null,
    area
}) => {

    const { 
        sapOae,
        target,
        sapNet,
        departmentScrap,
        sapProductionByType,
        sapOaeColorCode,
        hxhOaeColorCode,
        hxHNet,
        hxhOae
    } = data ?? {}

    return (
        <Col {...responsiveProps}>
            <Card 
                title="Production Details" 
                size="small"
                className="b--black-10"
                loading={loading}
            >

                <Row gutter={16} className="b--black-10">

                    <Col span={8}>

                        <Statistic title="Target" value={target} valueStyle={{
                            color: green
                        }} />

                    </Col>

                    <Col span={8}>      

                        <Statistic 
                            title="SAP OAE %"
                            valueStyle={{color: sapOaeColorCode}}
                            value={numeral(sapOae).format('0%')} 
                            suffix={<small>({numeral(sapNet).format('0,0')})</small>}
                            />

                    </Col>

                    <Col span={8}>
                        <Statistic 
                            title={`${area === 'machine line' ? 'EOS' : 'HxH'} OAE %`}
                            valueStyle={{color: hxhOaeColorCode}}
                            value={numeral(hxhOae).format('0%')} 
                            suffix={<small>({numeral(hxHNet).format('0,0')})</small>}
                        />
                    </Col>
                </Row>
                <Row gutter={16} className="b--black-10">              
                    <Col span={8}>
                        <Statistic 
                            title="Department Scrap %"
                            valueStyle={{ color: red }}
                            value={numeral(departmentScrap?.scrapRate ?? 0).format('0.00%')} 
                            suffix={<small>({numeral(departmentScrap?.total ?? 0).format('0,0')})</small>}
                        />
                    </Col>
                </Row>

                <Collapse>                 
                    <Panel header="SAP Production by Type Details" key="1">
                        <ProductionByTypeTable 
                            prodData={sapProductionByType?.details ?? []}
                            isLoading={loading}
                            className="mt3" />
                    </Panel>
                    <Panel header="Department Scrap Details" key="2">
                        <ScrapByDeptTable 
                            scrapData={departmentScrap?.details ?? []}
                            isLoading={loading}
                            className="mt3" />
                    </Panel>
                </Collapse>

            </Card>
        </Col>
    )
})

export default ProductionDetails;