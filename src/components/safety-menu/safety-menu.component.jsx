import React, { useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";

import {
    HomeOutlined,
    SafetyOutlined,
    FolderOpenOutlined,
    PieChartOutlined
} from '@ant-design/icons';

import { Menu } from "antd";

const SafetyMenu = () => { 

    const location = useLocation();

    const [menuProps, setMenuProps] = useState({
        theme:"dark",
        defaultSelectedKeys:[location.pathname]
    })

    useEffect(() => {

        setMenuProps({
            theme:"dark",
            defaultSelectedKeys:[location.pathname],
            selectedKeys: [location.pathname?.toLowerCase()]
        })

    }, [location])


  return (
        <Menu {...menuProps}>

            <Menu.Item key="/">
                <HomeOutlined />
                <span>Home</span>
                <Link to="/" />
            </Menu.Item>

            <Menu.Item key="incident">
                <SafetyOutlined />
                <span>
                    <a href="http://10.129.224.149/FMSB/Safety/IncidentReport.aspx" rel="noopener noreferrer">Incident Report</a>
                </span>
            </Menu.Item>

            <Menu.Item key="history">
                <FolderOpenOutlined />
                <span>History</span>
                <Link to="/safety/history" />
            </Menu.Item>

            <Menu.Item key="dashboard">
                <PieChartOutlined />
                <span>Dashboard</span>
                <Link to="/safety/dashboard" />
            </Menu.Item>

        </Menu>
  ); 
}

export default SafetyMenu;
