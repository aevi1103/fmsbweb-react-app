import React from 'react'
import numeral from 'numeral'
import ScrapByCodeTable from './scrap-by-code-table.component';

import { 
    Col,
    Row,
    Card,
    Statistic,
    Collapse
} from 'antd'

const { Panel } = Collapse;

const ScrapDetails = React.memo(({
    responsiveProps,
    loading,
    data = null
}) => {

    const { sbScrapByCode, purchaseScrapByCode, scrapByCodeColorCode } = data ?? {}
    const { scrapRate, total } = sbScrapByCode || {};

    const purchaseScrapTotal = purchaseScrapByCode?.total ?? 0;
    const purchaseScrapRate = purchaseScrapByCode?.scrapRate ?? 0
    const sbScrapDetails = sbScrapByCode?.details ?? []
    const purchaseScrapDetails = purchaseScrapByCode?.details ?? [];

    return (
        <Col {...responsiveProps}>
            <Card 
                title="Scrap Details"
                size="small"
                className="b--black-10"
                loading={loading}
            >
                <Row gutter={16}  className="b--black-10">
                    <Col span={12}>
                        <Statistic title="SB Scrap Qty" value={total} valueStyle={{color: scrapByCodeColorCode}} />
                    </Col>

                    <Col span={12}>
                        <Statistic title="SB Scrap %" value={numeral(scrapRate).format('0.00%')} valueStyle={{color: scrapByCodeColorCode}} />
                    </Col>

                </Row>
                <Row gutter={16} className="b--black-10">
                    <Col span={12}>
                        <Statistic title="Purchase Scrap Qty" value={purchaseScrapTotal} />
                    </Col>

                    <Col span={12}>
                        <Statistic title="Purchase Scrap %" value={numeral(purchaseScrapRate).format('0.00%')} />
                    </Col>
                </Row>
                <Collapse>

                    <Panel header="SB Scrap Details" key="1">                     
                        <ScrapByCodeTable 
                            className="mt3"
                            scrapData={sbScrapDetails}
                            isLoading={loading} />
                    </Panel>
                    <Panel header="Purchased Scrap Detail" key="2">
                        <ScrapByCodeTable 
                            className="mt3"
                            scrapData={purchaseScrapDetails}
                            isLoading={loading} />
                    </Panel>

                </Collapse>

            </Card>
        </Col>
    )
})

export default ScrapDetails;