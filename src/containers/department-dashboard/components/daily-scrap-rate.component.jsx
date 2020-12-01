import React from 'react'
import DailyScrapChart from './daily-scrap-rate-chart.component';

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
                title="South Bend Scrap by Code Trend"
                size="small"
                style={cardHeightStyle}
                className="b--black-10"
                loading={loading}
            >
                <DailyScrapChart/>
            </Card>

        </Col>
    )
})

export default DailyScrapRate;