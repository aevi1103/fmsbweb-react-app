import React from 'react'
import numeral from 'numeral'
import _ from 'lodash'
import styled from 'styled-components'
import {
    Card,
    Tooltip
} from 'antd'

import {
    colorCodes
} from '../../swot/service/helper'

import { scrollToObject } from '../../../core/utilities/helpers'

const Oae = styled.span`
    font-size: 2.5rem;
    color: white;
`;

const LineStatusMicro = ({
    oae,
    oaeTarget,
    line
}) => {

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

    const onClick = () => {
        const el = document.querySelector(`#${_.snakeCase(line)}`);
        scrollToObject(el);
    }

    return (
        <Card 
            size="small" 
            title={line} 
            style={{ cursor: 'pointer' }}
            headStyle={headStyle}
            bodyStyle={bodyStyle}
            onClick={onClick}>

                <Tooltip title={`Target: ${numeral(oaeTarget).format('0%')}`}>
                    <Oae >{numeral(oae).format('0%')}</Oae>
                </Tooltip>
                
        </Card>
    )
}

export default LineStatusMicro;