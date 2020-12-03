import React from 'react'
import numeral from 'numeral'
import { colors } from '../../../core/utilities/colors'
import ScrapByCodeTable from './scrap-by-code-table.component';
import { 
    Col,
    Row,
    Card,
    Statistic,
    Collapse,
} from 'antd'

const { Panel } = Collapse;
const { green } = colors;

const MtdDetails = React.memo(({
    responsiveProps,
    loading,
    data = null
}) => {

    const sapProd = data?.sapProd ?? 0
    const sbScrap = data?.sbScrap ?? 0
    const purchasedScrap = data?.purchasedScrap ?? 0
    const sapOae = data?.sapOae ?? 0
    const sbScrapRate = data?.sbScrapRate ?? 0
    const purchaseScrapRate = data?.purchaseScrapRate ?? 0
    const sbScrapDetail = data?.sbScrapDetail ?? []
    const purchaseScrapDetail = data?.purchaseScrapDetail ?? []

    return (
        <Col {...responsiveProps}>

                <Card 
                    title="MTD Details"
                    size="small"
                    className="b--black-10"
                    loading={loading}
                >

                    <Row gutter={16} className="b--black-10">
                        <Col span={8}>
                            <Statistic title="Production" value={numeral(sapProd).format('0,0')} valueStyle={{ color: green }} />
                        </Col>
                        <Col span={8}>
                            <Statistic title="SB Scrap" value={numeral(sbScrap).format('0,0')} />
                        </Col>
                        <Col span={8}>
                            <Statistic title="Purchased Scrap %" value={numeral(purchasedScrap).format('0,0')} />
                        </Col>
                    </Row>

                    <Row gutter={16} className="b--black-10">
                        <Col span={8}>
                            <Statistic title="SAP OAE %" value={numeral(sapOae).format('0.0%')} />
                        </Col>
                        <Col span={8}>
                            <Statistic title="SB Scrap %" value={numeral(sbScrapRate).format('0.00%')} />
                        </Col>
                        <Col span={8}>
                            <Statistic title="Purchased Scrap %" value={numeral(purchaseScrapRate).format('0.00%')} />
                        </Col>
                    </Row>

                    <Collapse>

                        <Panel header="SB Scrap Details" key="1">                     
                            <ScrapByCodeTable 
                                className="mt3"
                                scrapData={sbScrapDetail}
                                isLoading={loading} />
                        </Panel>
                        <Panel header="Purchased Scrap Detail" key="2">
                            <ScrapByCodeTable 
                                className="mt3"
                                scrapData={purchaseScrapDetail}
                                isLoading={loading} />
                        </Panel>

                    </Collapse>

                </Card>
            </Col>
    )
})

export default MtdDetails;