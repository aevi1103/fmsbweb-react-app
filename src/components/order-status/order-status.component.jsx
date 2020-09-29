import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment'
import UIDGenerator   from 'uid-generator'

import { 
    Row,
    Col,
    Card,
    Button
 } from "antd";

 import OrderStatusChart from '../../components/order-status/order-status-chart.component'

 

const OrderStatus = ({
    workCenterCollection,
    isOrderStatusFetching
}) => {

    const uidgen = new UIDGenerator(); 
    const [workCenters, setWorkCenters] = useState(workCenterCollection)

    const onClickRefresh = (workCenter) => {
        
        setWorkCenters(
            workCenters.map(item => {
                if (item.workCenter === workCenter) {
                    return { 
                        ...item,
                        lastUpdate: `Last Updated at ${moment().format('M/D/YY h:mm:ss A')}`,
                        url: `sap/odata?line=${item.line}&side=${item.side}&token=${uidgen.generateSync()}`
                    }
                } else {
                    return item;
                }
            })
        )
    }

    return (
        <Row gutter={[12,12]}>
            {
                workCenters.map(({workCenter, url, lastUpdate}) => (
                    <Col xs={24} md={24} lg={24} xl={8} key={`order_${workCenter}`}>
                        <Card
                            key={`card_${workCenter}`}
                            title={workCenter}    
                            size="small"
                            className="ba b--black-10"
                            loading={isOrderStatusFetching}
                            style={{height: '25rem'}}
                            extra={<Button key={`btn_${workCenter}`}
                                        type="link" 
                                        onClick={() => onClickRefresh(workCenter)}
                                        style={{paddingRight: 0}} >Refresh</Button>}
                        >
                            <OrderStatusChart key={`chart_${workCenter}`} workCenter={workCenter} url={url} lastUpdate={lastUpdate}/>
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