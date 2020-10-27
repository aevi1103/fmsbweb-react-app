import React from 'react'
import numeral from 'numeral'
import styled from 'styled-components'
import {
    Card,
    Tooltip
} from 'antd'

import {
    colorCodes
} from '../swot/helper'

const Oae = styled.span`
    font-size: 2.5rem;
    color: white;
`;

const LineStatusMicro = ({
    data
}) => {

    const { oae, swotTarget, machineName } = data;
    const { oaeTarget } = swotTarget;
    const { green, red } = colorCodes;

    const headStyle ={
        backgroundColor: oae < oaeTarget ? red : green,
        color: 'white'
    }

    const bodyStyle = {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: oae < oaeTarget ? red : green,
        color: 'white'
    }

    return (
        <Card 
            size="small" 
            title={machineName} 
            headStyle={headStyle}
            bodyStyle={bodyStyle}>

                <Tooltip title={`Target: ${numeral(oaeTarget).format('0%')}`}>
                    <Oae>{numeral(oae).format('0%')}</Oae>
                </Tooltip>
                
        </Card>
    )
}

export default LineStatusMicro;