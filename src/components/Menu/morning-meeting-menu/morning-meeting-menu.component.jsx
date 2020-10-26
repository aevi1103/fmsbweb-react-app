import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
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
    HeatMapOutlined,
    SafetyOutlined,
    SettingOutlined,
    DashboardOutlined,
    RadarChartOutlined
} from '@ant-design/icons';

import DepartmentSubMenu from './department-sub-menu.component'

import { Menu } from "antd";

const MorningMeetingMenu = ( { location } ) => { 

    const swotDept = useSelector(state => state.swot.dept);
    const prodStatusDept = useSelector(({ productionStatus }) => productionStatus.dept);

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
            <Link to="/dashboard/morningmeeting/safety" />
        </Menu.Item>

        <Menu.Item key="/dashboard/morningmeeting/quality">
            <ExperimentOutlined />
            <span>Quality</span>
            <Link to="/dashboard/morningmeeting/quality" />
        </Menu.Item>

        <Menu.Item key="/dashboard/morningmeeting/logistics">
            <CarOutlined />
            <span>Logistics</span>
            <Link to="/dashboard/morningmeeting/logistics" />
        </Menu.Item>

        <Menu.Item key="/dashboard/morningmeeting/level0">
            <HeatMapOutlined />
            <span>Performance: L0 - L1</span>
            <Link to="/dashboard/morningmeeting/level0" />
        </Menu.Item>

        <Menu.Item key="/dashboard/morningmeeting/level2">
            <DashboardOutlined />
            <span>Performance: L2 - L3</span>
            <Link to="/dashboard/morningmeeting/level2" />
        </Menu.Item>

        <DepartmentSubMenu dept="foundry" icon={<AreaChartOutlined/>} /> 
        <DepartmentSubMenu dept="machining" icon={<BarChartOutlined/>} /> 
        <DepartmentSubMenu dept="finishing" icon={<DotChartOutlined/>} /> 
        <DepartmentSubMenu dept="assembly" icon={<PieChartOutlined/>} /> 

        <Menu.Item key={`/dashboard/swot/settings/${swotDept}`}>
            <BarChartOutlined />
            <span>SWOT</span>
            <Link to={`/dashboard/swot/settings/${swotDept}`} />
        </Menu.Item>

        <Menu.Item key={`/dashboard/status/${prodStatusDept}`}>
            <RadarChartOutlined />
            <span>Production Dashboard</span>
            <Link to={`/dashboard/status/${prodStatusDept}`} />
        </Menu.Item>

        <Menu.Item key="/dashboard/morningmeeting/finance">
            <DollarOutlined />
            <span>Finance</span>
            <Link to="/dashboard/morningmeeting/finance" />
        </Menu.Item>

        <Menu.Item key="/dashboard/morningmeeting/downtime">
            <SettingOutlined />
            <span>Downtime</span>
            <Link to="/dashboard/morningmeeting/downtime" />
        </Menu.Item>

        
      </Menu>
  ); 
}

export default withRouter(MorningMeetingMenu);
