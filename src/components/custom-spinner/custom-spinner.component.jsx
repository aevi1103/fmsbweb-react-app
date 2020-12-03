import React from 'react';
import styled from 'styled-components'

import { 
    Spin
 } from "antd";

const KpiContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
`

const CustomSpinner = () => (
    <KpiContainer>
        <Spin tip="Loading chart..." ></Spin>
    </KpiContainer>
)

export default CustomSpinner;