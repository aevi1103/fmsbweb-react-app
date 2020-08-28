import React from 'react'
import numeral from 'numeral'
import {
    Row,
    Col
} from 'antd'

const ToleranceBar = ({
    isPassFail,
    targets,
    ...others
}) => {

    const { min, max, lowerBound, upperBound } = targets;
    
    const format = '0.[00]'
    const minStr = numeral(min).format(format)
    const maxStr = numeral(max).format(format)
    const lowerStr = numeral(lowerBound).format(format)
    const upperStr = numeral(upperBound).format(format)

    return !isPassFail 

    ?   <Col span={24} {...others}>
            <Row className="tc">
                <b>Tolerance:</b>
            </Row>
            <Row className="tc">
                <Col span={4} className="bg-red white pt1 pb1">{`<${minStr}`}</Col>
                <Col span={5} className="bg-yellow pt1 pb1">{`${minStr} - ${lowerStr}`}</Col>
                <Col span={6} className="bg-green white pt1 pb1">{`${lowerStr} - ${upperStr}`}</Col>
                <Col span={5} className="bg-yellow pt1 pb1">{`${upperStr} - ${maxStr}`}</Col>
                <Col span={4} className="bg-red white pt1 pb1">{`>${maxStr}`}</Col>
            </Row>
        </Col>

    : <Col span={24} {...others}>
        <Row className="tc">
            <b>Tolerance:</b>
        </Row>
        <Row className="tc">
            <Col span={12} className="bg-green white pt1 pb1">Pass</Col>
            <Col span={12} className="bg-red white pt1 pb1">Fail</Col>                    
        </Row>
    </Col>

}

export default ToleranceBar;