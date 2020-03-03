import React, { useState } from 'react';
import { connect } from 'react-redux';

import { 
    Row,
    Col,
    Card,
    Button,
    Tooltip
 } from "antd";

 import OrderStatusChart from '../../components/order-status/order-status-chart.component'

const OrderStatus = ({
        workCenterCollection,
        isOrderStatusFetching
    }) => {

    return (
        <Row gutter={16}>
            {
                workCenterCollection.map(({workCenter, line, side}) => (
                    <Col span={8} key={`order_${workCenter}`}>
                        <Card
                            title={`${line}${side === 'n/a' ? '' : side}`}    
                            bordered={false} size="small"
                            className="mb3"
                            loading={isOrderStatusFetching}
                            style={{height: '25rem'}}
                        >
                            <OrderStatusChart line={line} side={side} workCenter={workCenter}/>
                        </Card>
                    </Col>
                ))
            }
        </Row>
    )
 }

 const mapStateToProps = ({orderStatus}) => ({
    workCenterCollection: orderStatus.workCenterCollection,
    isWorkCenterFetching: orderStatus.isWorkCenterFetching
 })

 export default connect(mapStateToProps)(OrderStatus);