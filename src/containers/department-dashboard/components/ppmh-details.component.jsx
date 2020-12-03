import React from 'react'
import numeral from 'numeral'
import moment from 'moment'
import { dateFormat } from '../../../core/utilities/helpers'
import { 
    Col,
    Row,
    Card,
    Statistic
} from 'antd'

const getLaborHoursProp = (laborHours, propName) => {
    if (!laborHours) return 0;
    return numeral(laborHours[propName]).format('0.00');
};

const PpmhDetails = React.memo(({
    responsiveProps,
    loading,
    data = null
}) => {

    const {
        laborHours,
    } = data ?? {};

    const { ppmh } = laborHours || {};

    const title = laborHours 
        ? `PPMH (${moment(laborHours.startDate).format(dateFormat)} - ${moment(laborHours.endDate).format(dateFormat)})`
        : 'PPMH';

    return (
        <Col {...responsiveProps}>
            <Card 
                title={title}
                size="small"
                className="b--black-10"
                loading={loading}
            >
                <Row gutter={16} className="b--black-10">
                    <Col span={8}>
                        <Statistic title="PPMH" value={numeral(ppmh).format('0')} />
                    </Col>
                    <Col span={8}>
                        <Statistic title="Regular" 
                            value={getLaborHoursProp(laborHours, 'regular')} />
                    </Col>
                    <Col span={8}>
                        <Statistic title="Overtime" 
                            value={getLaborHoursProp(laborHours, 'overtime')} />
                    </Col>
                </Row>

                <Row gutter={16} className="b--black-10">
                    <Col span={8}>
                        <Statistic title="Double Time" 
                            value={getLaborHoursProp(laborHours, 'doubleTime')} />
                    </Col>
                    <Col span={8}>
                        <Statistic title="Orientation" 
                            value={getLaborHoursProp(laborHours, 'orientation')} />
                    </Col>
                    <Col span={8}>
                        <Statistic title="Overall" 
                            value={getLaborHoursProp(laborHours, 'overAll')} />
                    </Col>
                </Row>

            </Card>
        </Col>
    )
})

export default PpmhDetails;