import React from 'react'
import DailyProdChart from './daily-prod-chart.component';

import { 
    Col,
    Card
} from 'antd'

const MtdProduction = React.memo(({
    responsiveProps,
    cardHeightStyle,
    loading
}) => {

    return (
        <Col {...responsiveProps}>

            <Card 
                title={`MTD Daily SAP Production`}
                size="small"
                style={cardHeightStyle}
                className="b--black-10"
                loading={loading}
            >
                <DailyProdChart/>
            </Card>
            
        </Col>
    )
})

export default MtdProduction;