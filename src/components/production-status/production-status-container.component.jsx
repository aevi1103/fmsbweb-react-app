import React from 'react'
import { useSelector } from 'react-redux'

import LineStatus from './line-status.component'

import {
    Row
} from 'antd'

const ProductionStatusContainer = () => {

    const productionStatus = useSelector(({ productionStatus }) => productionStatus.productionStatus);

    const { lines } = productionStatus || {};

    return (
        <Row gutter={[10,10]}>

            {
                lines.map(line => <LineStatus key={line.machineName} data={line} />)
            }

        </Row>
    )
}

export default ProductionStatusContainer;