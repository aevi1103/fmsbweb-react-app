import React from 'react';
import { Link, withRouter } from "react-router-dom";

import { Menu } from 'antd';

import {
    DatabaseOutlined,
    HomeOutlined,
    InboxOutlined,
    SaveOutlined,
    UserSwitchOutlined,
    ContainerOutlined
} from '@ant-design/icons';

const AfMenu = ({ location }) => (
    <Menu theme="dark" defaultSelectedKeys={[location.pathname]}>

        <Menu.Item key="/">
            <HomeOutlined />
            <span>Home</span>
            <Link to="/" />
        </Menu.Item>

        <Menu.Item key="afHourByHour">
            <InboxOutlined />   
            <span>Hour by Hour</span>
            <a href="http://10.129.224.149/FMSB/AssemblyFinishing/Inputs/Home.aspx" target="_blank" rel="noopener noreferrer"></a>
        </Menu.Item>

        <Menu.Item key="/af/history">
            <DatabaseOutlined />
            <span>HxH History</span>
            <Link to="/af/history" />
        </Menu.Item>

        <Menu.Item key="/af/eos">
            <SaveOutlined />
            <span>EOS</span>
            <Link to="/af/eos" />
        </Menu.Item>

        <Menu.Item key="/af/recipients">
            <UserSwitchOutlined />
            <span>EOS Recipients</span>
            <Link to="/af/recipients" />
        </Menu.Item>

        <Menu.Item key="/af/traceability">
            <ContainerOutlined />
            <span>Component Traceability</span>
            <Link to="/af/traceability" />
        </Menu.Item>

    </Menu>
)

export default withRouter(AfMenu);