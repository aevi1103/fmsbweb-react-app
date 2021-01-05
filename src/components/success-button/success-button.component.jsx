import React from 'react'
import styled from 'styled-components'
import { lighten } from 'polished'
import {
    Button
} from 'antd'

import { colors } from '../../core/utilities/colors'
const { green } = colors;

const Btn = styled(Button)`
    background-color: ${green} !important;
    border-color: ${green} !important;
    color: #fff !important;

    &:hover {
        background-color: ${lighten(.04, green)} !important;
        border-color: ${lighten(.04, green)} !important;
    }
`

const SuccessButton = (props) => {
    return props.disabled 
        ? <Button {...props}> { props.children } </Button>
        : <Btn {...props}> { props.children } </Btn>
}

export default SuccessButton;