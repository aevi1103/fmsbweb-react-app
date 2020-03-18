import React from 'react';
import { Link, withRouter } from "react-router-dom";
import { Menu, Icon } from "antd";

const MorningMeetingMenu = ( { location } ) => { 

  return (

    <Menu theme="dark" defaultSelectedKeys={[location.pathname]} mode="inline">

        <Menu.Item key="/">
            <Icon type="home" />
            <span>Home</span>
            <Link to="/" />
        </Menu.Item>

        <Menu.Item key="/orderstatus/foundry">
            <Icon type="inbox" />
            <span>Active Orders</span>
            <Link to="/orderstatus/foundry" />
        </Menu.Item>

        <Menu.Item key="/dashboard/morningmeeting/safety">
            <Icon type="safety" />
            <span>Safety</span>
            <Link to="/dashboard/morningmeeting/safety" />
        </Menu.Item>

        <Menu.Item key="/dashboard/morningmeeting/quality">
            <Icon type="experiment" />
            <span>Quality</span>
            <Link to="/dashboard/morningmeeting/quality" />
        </Menu.Item>

        <Menu.Item key="/dashboard/morningmeeting/logistics">
            <Icon type="car" />
            <span>Logistics</span>
            <Link to="/dashboard/morningmeeting/logistics" />
        </Menu.Item>

        <Menu.Item key="/dashboard/morningmeeting/foundry">
            <Icon type="area-chart" />
            <span>Foundry</span>
            <Link to="/dashboard/morningmeeting/foundry" />
        </Menu.Item>

        <Menu.Item key="/dashboard/morningmeeting/machining">
            <Icon type="pie-chart" />
            <span>Machining</span>
            <Link to="/dashboard/morningmeeting/machining" />
        </Menu.Item>

        <Menu.Item key="/dashboard/morningmeeting/finishing">
            <Icon type="bar-chart" />
            <span>Finishing</span>
            <Link to="/dashboard/morningmeeting/finishing" />
        </Menu.Item>

        <Menu.Item key="/dashboard/morningmeeting/assembly">
            <Icon type="dot-chart" />
            <span>Assembly</span>
            <Link to="/dashboard/morningmeeting/assembly" />
        </Menu.Item>

        <Menu.Item key="/dashboard/morningmeeting/finance">
            <Icon type="dollar" />
            <span>Finance</span>
            <Link to="/dashboard/morningmeeting/finance" />
        </Menu.Item>

        <Menu.Item key="/dashboard/morningmeeting/downtime">
            <Icon type="setting" />
            <span>Downtime</span>
            <Link to="/dashboard/morningmeeting/downtime" />
        </Menu.Item>

      
    </Menu>

) 
}

export default withRouter(MorningMeetingMenu);
