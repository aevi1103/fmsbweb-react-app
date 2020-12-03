import React from 'react'
import numeral from 'numeral'
import KpiWrapper from '../../../components/kpi-wrapper/kpi-wrapper.component'

import { 
    Col,
    Card,
    Typography
} from 'antd'

const { Text } = Typography;

const SbScrapRateKpi = React.memo(({
    responsiveProps,
    loading,
    data = null
}) => {

    const { targets, scrapByCodeColorCode, sbScrapByCode } = data || {};
    const { scrapRateTarget } = targets || {};
    const { scrapRate } = sbScrapByCode || {};

    return (
        <Col {...responsiveProps}>

            <Card 
                title="South Bend Scrap Rate by Code"
                size="small"
                className="b--black-10"
                loading={loading}
                extra={
                    <Text type="secondary" className="b">Target: {numeral(scrapRateTarget / 100).format('0.00%')}</Text>
                }
            >
                <KpiWrapper>
                    <h1 style={{color: scrapByCodeColorCode}}>
                        {numeral(scrapRate).format('0.0%')}
                    </h1>
                </KpiWrapper>
                
            </Card>

        </Col>
    )
})

export default SbScrapRateKpi;