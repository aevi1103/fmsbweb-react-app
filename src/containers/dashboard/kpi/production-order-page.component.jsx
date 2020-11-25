import React, { useEffect, useState } from 'react';
import _ from 'lodash'
import { connect } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import axios from 'axios'
import api from '../../../core/utilities/api'

import OrderStatusChart from '../../../components/order-status/order-status-chart.component'

import {
    mapDeptToArea
 } from '../../../core/utilities/helpers'

import { 
    Layout,
    Row,
    Col,
    Card,
    PageHeader
} from "antd";

const { Content } = Layout;

const ProductionOrderPage = ({ 
        progress
    }) => {

    const { department } = useParams();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [header, setHeader] = useState('')

    useEffect(() => {
        const ttl = `${_.capitalize(department)} Active Orders`;
        document.title = ttl;
        setHeader(ttl)
    }, [department])

    useEffect(() => {

        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();
        const { token } = source;

        const getWorkCenters = async () => {

            try {
                
                setLoading(true);

                const response = await api.get(`sap/workcenters?area=${mapDeptToArea(department) === 'skirt coat' ? 'finishing' : mapDeptToArea(department)}`, { cancelToken: token });
                const workCenters = response.data;
                const requests = workCenters.map(({ workCenter, line, side }) => api.get(`sap/odata?line=${line}&side=${side}`, { cancelToken: token }));

                try {
                    
                    const workCenterResponse = await axios.all(requests);
                    const orders = workCenterResponse
                                    .filter(({ data }) => data.length > 0)
                                    .map(({ data }) => ({
                                        line: data[0].line,
                                        orders: data
                                    }))
                            
                    setOrders(orders)
                    // console.log({orders})

                } catch (error) {
                    console.error('Something went wrong')
                }

            } catch (error) {
                console.error('Something went wrong!')
            } finally {
                setLoading(false);
            }
        
        }

        getWorkCenters();

        return () => source.cancel('Operation cancelled');

    }, [department])


    return (
        <>
            <PageHeader 
                className="site-page-header" 
                title={header}
                onBack={() => history.goBack()} />

            <Content className="ma3 mt0">
                {
                    loading 
                        ? <span>Loading <b>{progress}%</b>, Please wait...</span> 
                        : <Row gutter={[12,12]}>
                                {
                                    orders.map(data => (
                                        <Col xs={24} md={24} lg={24} xl={8} key={data.line}>
                    
                                            <Card
                                                key={`card_${data.line}`}
                                                title={data.line}    
                                                size="small"
                                                className="ba b--black-10"
                                                style={{height: '25rem'}}
                                            >
                                                <OrderStatusChart data={data}/>
                                            </Card>
                    
                                        </Col>
                                    ))
                                } 
                            </Row>
                }
            </Content>      
        </> 
    )
}

const mapStateToProps = ({ requests }) => ({
    progress: requests.progress
}
)
export default connect(mapStateToProps)(ProductionOrderPage);