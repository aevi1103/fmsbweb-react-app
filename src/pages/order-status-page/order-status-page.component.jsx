import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import axios from 'axios'
import api from '../../API'

import { 
    Layout,
    Row,
    Col,
    Card,
    Progress,
    PageHeader
} from "antd";

import OrderStatusChart from '../../components/order-status/order-status-chart.component'

const { Header, Content } = Layout;


const OrderStatusPage = ({ 
        headerTitle,
        area,
        progress
    }) => {

    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([])

    useEffect(() => {
        document.title = headerTitle;
    }, [headerTitle])

    useEffect(() => {

        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();
        const { token } = source;

        const getWorkCenters = async () => {

            try {
                
                setLoading(true);

                const response = await api.get(`sap/workcenters?area=${area}`, { cancelToken: token });
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
                    console.log({orders})

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

    }, [area])

    return (
        <>
            <PageHeader className="site-page-header" title={headerTitle} />

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
export default connect(mapStateToProps)(OrderStatusPage);