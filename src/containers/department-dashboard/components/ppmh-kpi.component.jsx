import React from 'react'
import numeral from 'numeral'
import moment from 'moment'
import KpiWrapper from '../../../components/kpi-wrapper/kpi-wrapper.component'
import { dateFormat } from '../../../core/utilities/helpers'

import { 
    Col,
    Card,
    Typography
} from 'antd'

const { Text } = Typography;

const PpmhKpi = React.memo(({
    responsiveProps,
    loading,
    data = null
}) => {

    const { laborHours, targets, ppmhColorCode } = data || {};
    const { ppmhTarget } = targets || {};
    const { ppmh } = laborHours || {};

    const title = laborHours 
        ? `PPMH (${moment(laborHours.startDate).format(dateFormat)} - ${moment(laborHours.endDate).format(dateFormat)})`
        : 'PPMH';

    const target = numeral(ppmhTarget).format('0');

    return (
        <Col {...responsiveProps}>

            <Card 
                title={title}
                size="small"
                className="b--black-10"
                loading={loading}
                extra={
                    <Text type="secondary" className="b">Target: {target}</Text>
                }
            >
                <KpiWrapper>
                    <h1 style={{color: ppmhColorCode}} className="b">{numeral(ppmh).format('0')}</h1>
                </KpiWrapper>

            </Card>

        </Col>
    )
})

export default PpmhKpi;