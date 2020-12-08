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
        background-color: ${lighten(.02, green)} !important;
    }
`

const SuccessButton = (props) => (
    <Btn {...props}>
        { props.children }
    </Btn>
)

export default SuccessButton;