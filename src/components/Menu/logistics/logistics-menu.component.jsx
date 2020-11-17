import React from 'react';
import { Link, withRouter } from "react-router-dom";

import { Menu } from 'antd';

import {
    DatabaseOutlined,
    SaveOutlined,
    UserSwitchOutlined,
    ContainerOutlined,
    CarOutlined
} from '@ant-design/icons';

const AfMenu = ({ location }) => (
    <Menu theme="dark" defaultSelectedKeys={[location.pathname]}>

        <Menu.Item key="/dashboard/morningmeeting/logistics">
            <CarOutlined />
            <span>Logistics</span>
            <Link to="/dashboard/morningmeeting/logistics" />
        </Menu.Item>

        <Menu.Item key="/dashboard/morningmeeting/logistics/settings/inventory">
            <DatabaseOutlined />
            <span>Inventory</span>
            <Link to="/dashboard/morningmeeting/logistics/settings/inventory" />
        </Menu.Item>

        <Menu.Item key="/dashboard/morningmeeting/logistics/settings/cost/targets">
            <SaveOutlined />
            <span>Cost Target</span>
            <Link to="/dashboard/morningmeeting/logistics/settings/cost/targets" />
        </Menu.Item>

        <Menu.Item key="/dashboard/morningmeeting/logistics/settings/order">
            <UserSwitchOutlined />
            <span>Production Order</span>
            <Link to="/dashboard/morningmeeting/logistics/settings/order" />
        </Menu.Item>

        <Menu.Item key="/dashboard/morningmeeting/logistics/settings/inventory/minmax">
            <ContainerOutlined />
            <span>Inv. Min/Max Target</span>
            <Link to="/dashboard/morningmeeting/logistics/settings/inventory/minmax" />
        </Menu.Item>

    </Menu>
)

export default withRouter(AfMenu);