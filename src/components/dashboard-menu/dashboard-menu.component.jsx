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

const yesterday = moment().add(-1, 'day').format(dateFormat);

const MorningMeetingMenu = ( { location } ) => { 

    const query = useQuery();
    const startQry = query.get('start') ?? yesterday;
    const endQry = query.get('end') ?? query.get('start') ?? yesterday;
    const deptQry = query.get('dept') ?? '';

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

        <Menu.Item key="/dashboard/morningmeeting/level0">
            <DashboardOutlined />
            <span>Performance L0 - L1</span>
            <Link to={`/dashboard/morningmeeting/level0?start=${startQry}&end=${endQry}&dept=${deptQry}`} />
        </Menu.Item>

        <Menu.Item key="/dashboard/morningmeeting/level2">
            <DashboardOutlined />
            <span>Performance L2 - L3</span>
            <Link to={`/dashboard/morningmeeting/level2?start=${startQry}&end=${endQry}&dept=${deptQry}`} />
        </Menu.Item>

        <Menu.Item key="/dashboard/maintenance">
            <DashboardOutlined />
            <span>Maintenance</span>
            <Link to={`/dashboard/maintenance`} />
        </Menu.Item>

        <DashboardSubMenu start={startQry} end={endQry} dept="assembly" icon={<PieChartOutlined/>} /> 
        <DashboardSubMenu start={startQry} end={endQry} dept="foundry" icon={<AreaChartOutlined/>} /> 
        <DashboardSubMenu start={startQry} end={endQry} dept="machining" icon={<BarChartOutlined/>} /> 
        <DashboardSubMenu start={startQry} end={endQry} dept="finishing" icon={<DotChartOutlined/>} /> 

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
