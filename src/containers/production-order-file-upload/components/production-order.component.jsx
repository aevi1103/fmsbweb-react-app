import React, { useState, useEffect } from 'react'
import ProductionOrderChart from './production-order-chart.component'

import {
    Row,
    Col,
    Select,
    Tooltip,
    Alert
} from 'antd'

import api from '../../../core/utilities/api'

const { Option } = Select;


const ProductionOrder = () => {

    const [workCenters, setWorkCenters] = useState([]);
    const [workCenterLoading, setWorkCenterLoading] = useState(false);
    const [error, setError] = useState(null);

    const [workCenter, setWorkCenter] = useState(null)
    const [orders, setOrders] = useState([])
    const [ordersLoading, setOrdersLoading] = useState(false)

    useEffect(() => {

        const getWorkcenters = async () => {

            try {
                
                setWorkCenterLoading(true)
                const response = await api.get(`logistics/order/workcenters`);
                setWorkCenters(response.data) 

            } catch (error) {
                setError(error)
            } finally {
                setWorkCenterLoading(false)
            }
            
        }

        getWorkcenters();

        return () => setWorkCenters([])

    }, [])

    useEffect(() => {

        const getOrders = async () => {

            try {
                
                setOrdersLoading(true)
                const response = await api.get(`logistics/order/${workCenter}`);
                setOrders(response.data) 

            } catch (error) {
                setError(error)
            } finally {
                setOrdersLoading(false)
            }
            
        }

        if (workCenter) 
            getOrders() 
        
        return () => setOrders([])

    }, [workCenter])

    const onWorkCenterChange = value => setWorkCenter(value);

    return (
        <Row gutter={[12,12]}>

            {
                error 
                    ?   <Col>
                            <Alert className="mb2" message={error} type="error" showIcon /> 
                        </Col>
                    : null
            }

            <Col span={24}>

                <Tooltip title="Select Work Center to udpate chart" >
                    <Select 
                        showSearch
                        placeholder="Select a work center"
                        style={{ width: '12rem' }} 
                        loading={ordersLoading || workCenterLoading}
                        onChange={onWorkCenterChange}>
                        {
                            workCenters.map(workCenter => <Option 
                                key={workCenter} 
                                name={workCenter} 
                                value={workCenter} >{workCenter}</Option>)
                        }
                    </Select>
                </Tooltip>
                
            </Col>

            <Col span={24}>
            
                <ProductionOrderChart data={orders} workCenter={workCenter} />

            </Col>

        </Row>
    )

}

export default ProductionOrder;