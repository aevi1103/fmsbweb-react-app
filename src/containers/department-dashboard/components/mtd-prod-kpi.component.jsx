import React from 'react'
import numeral from 'numeral'
import moment from 'moment'
import KpiWrapper from '../../../components/kpi-wrapper/kpi-wrapper.component'
import { dateFormat } from '../../../core/utilities/helpers'
import { colors } from '../../../core/utilities/colors'

import { 
    Col,
    Card
} from 'antd'

const { green } = colors;

const MtdProdKpi = React.memo(({
    responsiveProps,
    loading,
    data = null
}) => {

    const startDate = data?.startDate ?? ''
    const endDate = data?.endDate ?? ''
    const sapProd = data?.sapProd ?? 0

    return (
        <Col {...responsiveProps}>

            <Card 
                title={`MTD Production (${moment(startDate).format(dateFormat)} - ${moment(endDate).format(dateFormat)})`}
                size="small"
                className="b--black-10"
                loading={loading}
            >

                <KpiWrapper>
                    <h1 style={{ color: green }}>{numeral(sapProd).format('0,0')}</h1>
                </KpiWrapper>

            </Card>

        </Col>
    )
})

export default MtdProdKpi;