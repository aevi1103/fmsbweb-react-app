import styled from 'styled-components'
import { green, yellow, red, lightGray, darkGray } from '../../core/utilities/colors'

const getColor = (value) => {

    const max = .85;
    const min = .6;

    if (!value) return {
        bgColor: lightGray,
        fontColor: 'black'
    }
    
    if (value >= max) return {
        bgColor: green,
        fontColor: 'white'
    };

    if (value > min && value < max) return {
        bgColor: yellow,
        fontColor: 'black'
    }

    if (value <= min) return {
        bgColor: red,
        fontColor: 'white'
    }

}

export const Wrapper = styled.div`
    padding: 1rem;
    border: 1px solid ${darkGray};
    background-color: ${props => getColor(props.value).bgColor};
    color: ${props => getColor(props.value).fontColor};
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