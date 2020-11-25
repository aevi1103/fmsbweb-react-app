import React, { useEffect, useState } from 'react';
import { Link, withRouter } from "react-router-dom";

import {
    AreaChartOutlined,
    BarChartOutlined,
    CarOutlined,
    DollarOutlined,
    DotChartOutlined,
    ExperimentOutlined,
    HomeOutlined,
    PieChartOutlined,
    SafetyOutlined,
    SettingOutlined,
    DashboardOutlined
} from '@ant-design/icons';

import DepartmentSubMenu from './department-sub-menu.component'

import { Menu } from "antd";
const { SubMenu } = Menu;

const MorningMeetingMenu = ( { location } ) => { 

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

        <Menu.Item key="/dashboard/morningmeeting/safety">
            <SafetyOutlined />
            <span>Safety</span>
            <Link to="/dashboard/morningmeeting/safety"/>
        </Menu.Item>

        <Menu.Item key="/dashboard/morningmeeting/quality">
            <ExperimentOutlined />
            <span>Quality</span>
            <Link to="/dashboard/morningmeeting/quality"/>
        </Menu.Item>

        <Menu.Item key="/dashboard/morningmeeting/logistics">
            <CarOutlined />
            <span>Logistics</span>
            <Link to="/dashboard/morningmeeting/logistics"/>
        </Menu.Item>

        <SubMenu
            key="performance"
            title={
            <span>
                <DashboardOutlined />
                <span>Performance</span>
            </span>
            }
        >

            <Menu.Item key="/dashboard/morningmeeting/level0">
                <Link to="/dashboard/morningmeeting/level0">Level 0 - 1</Link>
            </Menu.Item>

            <Menu.Item key="/dashboard/morningmeeting/level2">
                <Link to="/dashboard/morningmeeting/level2">Level 2 - 3</Link>
            </Menu.Item>

        </SubMenu>

        <DepartmentSubMenu dept="foundry" icon={<AreaChartOutlined/>} /> 
        <DepartmentSubMenu dept="machining" icon={<BarChartOutlined/>} /> 
        <DepartmentSubMenu dept="finishing" icon={<DotChartOutlined/>} /> 
        <DepartmentSubMenu dept="assembly" icon={<PieChartOutlined/>} /> 

        {/* <Menu.Item key={`/dashboard/swot/settings/${swotDept}`}>
            <BarChartOutlined />
            <span>SWOT</span>
            <Link to={`/dashboard/swot/settings/${swotDept}`} />
        </Menu.Item> */}

        {/* <Menu.Item key={`/dashboard/status/${prodStatusDept}`}>
            <RadarChartOutlined />
            <span>Production Dashboard</span>
            <Link to={`/dashboard/status/${prodStatusDept}`} />
        </Menu.Item> */}

        <Menu.Item key="/dashboard/morningmeeting/finance">
            <DollarOutlined />
            <span>Finance</span>
            <Link to="/dashboard/morningmeeting/finance"/>
        </Menu.Item>

        <Menu.Item key="/dashboard/morningmeeting/downtime">
            <SettingOutlined />
            <span>Downtime</span>
            <Link to="/dashboard/morningmeeting/downtime"/>
        </Menu.Item>

        
      </Menu>
  ); 
}

export default withRouter(MorningMeetingMenu);
