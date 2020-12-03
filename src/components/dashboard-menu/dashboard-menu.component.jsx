import React, { useEffect, useState } from 'react';
import { Link, withRouter } from "react-router-dom";
import moment from 'moment'

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
    DashboardOutlined,
    RadarChartOutlined
} from '@ant-design/icons';

import DashboardSubMenu from './components/dashboard-sub-menu.component'

import { dateFormat } from '../../core/utilities/helpers'
import { useQuery } from '../../core/utilities/custom-hook'

import { Menu } from "antd";

const { SubMenu } = Menu;
const yesterday = moment().add(-1, 'day').format(dateFormat);


const MorningMeetingMenu = ( { location } ) => { 

    const query = useQuery();
    const startQry = query.get('start') ?? yesterday;
    const endQry = query.get('end') ?? yesterday;

    const [date, setDate] = useState(endQry);

    useEffect(() => {

        if (moment(endQry) >= moment().startOf('day')) {
            setDate(moment(endQry).format(dateFormat))
        } else {
            setDate(moment(endQry).add(1, 'd').format(dateFormat))
        }

    }, [endQry])

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
            <Link to={`/dashboard/morningmeeting/safety?start=${startQry}&end=${endQry}`}/>
        </Menu.Item>

        <Menu.Item key="/dashboard/morningmeeting/quality">
            <ExperimentOutlined />
            <span>Quality</span>
            <Link to={`/dashboard/morningmeeting/quality?start=${date}`}/>
        </Menu.Item>

        <Menu.Item key="/dashboard/morningmeeting/logistics">
            <CarOutlined />
            <span>Logistics</span>
            <Link to={`/dashboard/morningmeeting/logistics?start=${date}`}/>
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
                <Link to={`/dashboard/morningmeeting/level0?start=${startQry}&end=${endQry}`}>Level 0 - 1</Link>
            </Menu.Item>

            <Menu.Item key="/dashboard/morningmeeting/level2">
                <Link to={`/dashboard/morningmeeting/level2?start=${startQry}&end=${endQry}`}>Level 2 - 3</Link>
            </Menu.Item>

        </SubMenu>

        <DashboardSubMenu dept="foundry" icon={<AreaChartOutlined/>} /> 
        <DashboardSubMenu dept="machining" icon={<BarChartOutlined/>} /> 
        <DashboardSubMenu dept="finishing" icon={<DotChartOutlined/>} /> 
        <DashboardSubMenu dept="assembly" icon={<PieChartOutlined/>} /> 

        <Menu.Item key={`/dashboard/swot/settings/Foundry`}>
            <BarChartOutlined />
            <span>SWOT</span>
            <Link to={`/dashboard/swot/settings/Foundry`} />
        </Menu.Item>

        <Menu.Item key={`/dashboard/status/Foundry`}>
            <RadarChartOutlined />
            <span>Prod. Dashboard</span>
            <Link to={`/dashboard/status/Foundry`} />
        </Menu.Item>

        <Menu.Item key="/dashboard/morningmeeting/finance">
            <DollarOutlined />
            <span>Finance</span>
            <Link to={`/dashboard/morningmeeting/finance?start=${date}`}/>
        </Menu.Item>

        <Menu.Item key="/dashboard/morningmeeting/downtime">
            <SettingOutlined />
            <span>Downtime</span>
            <Link to={`/dashboard/morningmeeting/downtime`}/>
        </Menu.Item>

        
      </Menu>
  ); 
}

export default withRouter(MorningMeetingMenu);
