import React from 'react'
import numeral from 'numeral'
import KpiWrapper from '../../../components/kpi-wrapper/kpi-wrapper.component'

import { 
    Col,
    Card,
    Typography
} from 'antd'

const { Text } = Typography;

const OaeKpi = React.memo(({
    area,
    responsiveProps,
    loading,
    data = null
}) => {

    const { 
        targets,
        sapOaeColorCode,
        sapOae,
        hxhOaeColorCode,
        hxhOae 
    } = data || {};

    const { oaeTarget } = targets || {};
    const target = numeral(oaeTarget / 100).format('0%');

    return (
        <Col {...responsiveProps}>

            <Card 
                title={ area === 'skirt coat' ? 'HxH OAE %' : 'SAP OAE %' }
                size="small"
                className="b--black-10"
                loading={loading}
                extra={
                    <Text type="secondary" className="b">Target: {target}</Text>
                }
            >

                <KpiWrapper>
                    {
                        area !== 'skirt coat' 

                            ?   <h1 style={{color: sapOaeColorCode}}>
                                    {numeral(sapOae).format('0%')}
                                </h1>

                            :   <h1 style={{color: hxhOaeColorCode}}>
                                    {numeral(hxhOae).format('0%')}
                                </h1>
                    }
                </KpiWrapper>

            </Card>

        </Col>
    )
})

export default OaeKpi;