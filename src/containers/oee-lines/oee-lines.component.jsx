import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router'
import styled from 'styled-components'
import _ from 'lodash'
import api from '../../core/utilities/api'

import {
    LoadingOutlined,
  } from '@ant-design/icons';

import {
    PageHeader,
    Layout
} from 'antd'

const { Content } = Layout;

const Container = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10rem, 15rem));
    grid-gap: 1rem;
`

const Button = styled.a`

    height: 10rem;
    background-color: #0053A7;
    display: grid;
    align-items: center;
    justify-items: center;
    color: white;
    font-size: 2rem;
    border-radius: 4px;

    &,
    &:link,
    &:active,
    &:focus,
    &:hover,
    &:visited
    {
        color: white;
        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    }

    &:hover {
        opacity: .9;
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
        transform: translateY(-.3rem);
    }
`

const Lines = () => {

    const { department } = useParams();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [lines, setLines] = useState([]);
    const [title, setTitle] = useState(null)

    useEffect(() => {

        (async function getLines() {
            
            try {
                
                setLoading(true);
                const response = await api.get(`/oee/lines?$filter=department eq '${department}'&$orderby=groupName`);
                setLines(response.data);

                const ttl = `${_.startCase(department)} Lines`;
                document.title = ttl;
                setTitle(ttl)

            } catch (error) {

            } finally {
                setLoading(false);
            }

        }) ()

    }, [])

    return (
        <>
            <PageHeader 
                title={loading ? <span>Loading <LoadingOutlined /></span> : title} 
                onBack={() => history.goBack()}
                className="site-page-header" />

            <Content className="ma3 mt0">

                <Container>

                    {
                        lines.map(({ groupName, oeeLineId }) => <Button
                            key={oeeLineId}
                            href={`/oee/assembly/${oeeLineId}`} >{groupName}</Button>)
                    }

                </Container>

                
            </Content>
        
        </>
    )
}

export default Lines;