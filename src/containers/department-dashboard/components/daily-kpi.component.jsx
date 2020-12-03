import React from 'react'
import DailyKpiChart from './daily-kpi-chart.component';

import { 
    Col,
    Card
} from 'antd'

const DailyScrapRate = React.memo(({
    responsiveProps,
    cardHeightStyle,
    loading
}) => {

    return (
        <Col {...responsiveProps}>

            <Card 
                title="Department KPI"
                size="small"
                style={cardHeightStyle}
                className="b--black-10"
                loading={loading}
            >
                <DailyKpiChart/>
            </Card>

        </Col>
    )
})

export default DailyScrapRate;