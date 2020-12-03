import React from 'react'
import styled from 'styled-components'

const Kpi = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 140px;
    font-size: 2.5rem;
`;

const KpiWrapper = ({ children }) => <Kpi>{ children }</Kpi>

export default KpiWrapper