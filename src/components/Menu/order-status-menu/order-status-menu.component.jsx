import React from 'react';
import { Link, withRouter } from "react-router-dom";
import { Menu, Icon } from "antd";

const OrderStatusMenu = ( { location } ) => { 

  return (

    <Menu theme="dark" defaultSelectedKeys={[location.pathname]} mode="inline">

        <Menu.Item key="/">
            <Icon type="home" />
            <span>Home</span>
            <Link to="/" />
        </Menu.Item>

        <Menu.Item key="/dashboard/morningmeeting/safety">
            <Icon type="apartment" />
            <span>Morning Meeting</span>
            <Link to="/dashboard/morningmeeting/safety" />
        </Menu.Item>

        <Menu.Item key="/orderstatus/foundry">
            <Icon type="area-chart" />
            <span>Foundry</span>
            <Link to="/orderstatus/foundry" />
        </Menu.Item>

        <Menu.Item key="/orderstatus/machining">
            <Icon type="pie-chart" />
            <span>Machining</span>
            <Link to="/orderstatus/machining" />
        </Menu.Item>

        <Menu.Item key="/orderstatus/finishing">
            <Icon type="bar-chart" />
            <span>Finishing</span>
            <Link to="/orderstatus/finishing" />
        </Menu.Item>

        <Menu.Item key="/orderstatus/assembly">
            <Icon type="dot-chart" />
            <span>Assembly</span>
            <Link to="/orderstatus/assembly" />
        </Menu.Item>
      
    </Menu>

) 
}

export default withRouter(OrderStatusMenu);
