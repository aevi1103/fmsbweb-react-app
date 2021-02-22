import React, { useState } from 'react'
import MaintenanceMtbbByDateChart from './maintenance-mtbb-by-date-chart.component'
import { dateFormat } from '../../../core/utilities/helpers'

import {
    Row,
    Col,
    Card,
    Checkbox 
} from 'antd'

const LineCard = ({ lineData, dates, range }) => {

    const { line, data } = lineData
    const [showValues, setShowValues] = useState(true)
    const [stackChart, setStackChart] = useState(false)

    const onShowValuesChange = e => setShowValues(e.target.checked)
    const onStackChartChange = e => setStackChart(e.target.checked)

    const extra = (
        <Row gutter={6}>
            <Col>
                <span className="mr2">Show Values</span>
                <Checkbox defaultChecked={showValues} onChange={onShowValuesChange} /> 
            </Col>
            <Col>
                <span className="mr2">Stack Chart</span>
                <Checkbox defaultChecked={stackChart} onChange={onStackChartChange}/> 
            </Col>
        </Row>
    )

    return (
        <Col span={12}>
            <Card 
                title={line} 
                extra={extra}
                size="small">

                <MaintenanceMtbbByDateChart 
                    data={data}
                    dates={dates}
                    line={line}
                    stackChart={stackChart}
                    showValues={showValues}
                    start={range[0].format(dateFormat)}
                    end={range[1].format(dateFormat)} />

            </Card>
        </Col>
    )

}

export default LineCard;