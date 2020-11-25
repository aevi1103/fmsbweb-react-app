import React, { useEffect, useState } from 'react'
import api from '../../../core/utilities/api'
import { useLocation, Link, useParams } from "react-router-dom";
import { 
    Layout,
    Spin,
    Button,
    Alert,
    PageHeader
 } from "antd";

import { LoadingOutlined } from '@ant-design/icons';

const { Content } = Layout;
const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const styles = {
    margin: '0 .5rem .5rem 0',
    width: '8rem',
    height: '8rem',
    fontSize: '3rem'
}

const ControlMethodPage = () => {

    const location = useLocation();
    const { controlId } = useParams();
    const { state } = location;
    const { name, id } = state || {}

    const [lines, setLines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [controlMethod, setControlMethod] = useState(name || '')
    const [controlMethodId, setControlMethodId] = useState(id || controlId)
    const [title, setTitle] = useState('');

    useEffect(() => {

        setLoading(true);
        api.get('quality/checksheets/line')
        .then(response => {
            setLines(response.data)
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false))

    }, [])

    useEffect(() => {

        if (!state) {

            api.get('quality/checksheets/controlmethod')
            .then(response => {
                const result = response.data.find(c => c.controlMethodId === +controlMethodId)
                setControlMethod(result.method)
                setControlMethodId(result.controlMethodId)
            })
            .catch(err => setError(err.message))

        } else {
            setControlMethod(name);
            setControlMethodId(id);
        }

        const ttl = `Select Lines: ${controlMethod}`
        document.title = ttl;
        setTitle(ttl);

    }, [state, id, name, controlMethod, controlMethodId])


    return (
        <React.Fragment>
            <PageHeader
                className="site-page-header"
                title={title}
            />

            <Content className="ma3 mt0">
                {
                    error ? <Alert className="mb2" message={error} type="error" showIcon closable /> : null
                }
                {
                    loading 
                    ? <Spin indicator={loadingIcon} />
                    : lines.map(({ lineId, value }) => (<Button key={lineId} style={styles}>
                        <Link to={{
                            pathname: `/quality/checksheets/controlmethod/${controlMethod}/${controlMethodId}/line/${lineId}`,
                            state: {
                                line: value,
                                id: lineId
                            }
                        }} >{value}</Link>
                    </Button>))
                }
            </Content>
        </React.Fragment>
    )
}

export default ControlMethodPage;