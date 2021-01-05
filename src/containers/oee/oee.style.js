import styled from 'styled-components'
import { green, yellow, red, lightGray, darkGray } from '../../core/utilities/colors'

const getBgColor = (value) => {

    const max = .85;
    const min = .6;
    
    if (value >= max) return green;
    if (value > min && value < max) return yellow
    if (value <= min) return red

    return lightGray
}

export const Wrapper = styled.div`
    padding: 1rem;
    border: 1px solid ${darkGray};
    background-color: ${props => getBgColor(props.value)};
    color: ${props => getBgColor(props.value) === yellow ? 'black' : 'white'};
    border-radius: 2px;
`

export const Centered = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 195px;
`

export const Kpi = styled.span`
    font-size: 6rem;
    font-weight: bold;
    color: ${props => props.danger ? red : props.success ? green : props.dark ? 'black' : props.warning ? yellow : ''};
`

export const SubTitle = styled.span`
    font-size: 1.5rem;
    color: ${props => props.danger ? red : props.success ? green : props.dark ? 'black' : props.warning ? yellow : ''};
`

export const SmallSubTitle = styled.span`
    font-size: .6rem;
    color: ${props => props.danger ? red : props.success ? green : props.dark ? 'black' : props.warning ? yellow : ''};
`