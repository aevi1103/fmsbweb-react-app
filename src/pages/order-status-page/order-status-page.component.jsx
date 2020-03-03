import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import axios from 'axios'

import {
    fetchWorkCenterStartAsync
} from '../../redux/order-status/order-status.actions'

import { 
    Layout
} from "antd";

import OrderStatus from '../../components/order-status/order-status.component'

const { Header, Content } = Layout;


const OrderStatusPage = ({ 
        headerTitle,
        area,
        fetchWorkCenterStartAsync,
        isWorkCenterFetching
    }) => {

    useEffect(() => {
        document.title = headerTitle;

        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        fetchWorkCenterStartAsync(area, source.token)

        return function cleanup() {
            source.cancel('Operation cancelled');
        }

    }, [])

    return (
        <>
            <Header className="pa0 custom-header" >
                <h2 className="ml3">{headerTitle}</h2>
            </Header>

            <Content className="ma3 mt0">
                {
                    !isWorkCenterFetching ? <OrderStatus/> : <span>Loading...</span>
                }            
            </Content>      
        </> 
    )
}

const mapDispatchToProps = dispatch => ({
    fetchWorkCenterStartAsync: (area, cancelToken) => dispatch(fetchWorkCenterStartAsync(area, cancelToken))
})

const mapStateToProps = ({orderStatus}) => ({
    isWorkCenterFetching: orderStatus.isWorkCenterFetching
 })

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OrderStatusPage));