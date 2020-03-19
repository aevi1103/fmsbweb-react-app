import React from 'react';
import { Link, withRouter } from "react-router-dom";

import {
    AreaChartOutlined,
    BarChartOutlined,
    CarOutlined,
    DollarOutlined,
    DotChartOutlined,
    ExperimentOutlined,
    HomeOutlined,
    InboxOutlined,
    PieChartOutlined,
    RiseOutlined,
    SafetyOutlined,
    SettingOutlined,
} from '@ant-design/icons';

import { Menu } from "antd";

const MorningMeetingMenu = ( { location } ) => { 

  return (
      <Menu theme="dark" defaultSelectedKeys={[location.pathname]} mode="inline">

          <Menu.Item key="/">
              <HomeOutlined />
              <span>Home</span>
              <Link to="/" />
          </Menu.Item>

          <Menu.Item key="/orderstatus/foundry">
              <InboxOutlined />
              <span>Active Orders</span>
              <Link to="/orderstatus/foundry" />
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
              <RiseOutlined />
              <span>Performance: L0 - L1</span>
              <Link to="/dashboard/morningmeeting/level0" />
          </Menu.Item>

          <Menu.Item key="/dashboard/morningmeeting/level2">
              <RiseOutlined />
              <span>Performance: L2 - L3</span>
              <Link to="/dashboard/morningmeeting/level2" />
          </Menu.Item>

          <Menu.Item key="/dashboard/morningmeeting/foundry">
              <AreaChartOutlined />
              <span>Foundry</span>
              <Link to="/dashboard/morningmeeting/foundry" />
          </Menu.Item>

          <Menu.Item key="/dashboard/morningmeeting/machining">
              <PieChartOutlined />
              <span>Machining</span>
              <Link to="/dashboard/morningmeeting/machining" />
          </Menu.Item>

          <Menu.Item key="/dashboard/morningmeeting/finishing">
              <BarChartOutlined />
              <span>Finishing</span>
              <Link to="/dashboard/morningmeeting/finishing" />
          </Menu.Item>

          <Menu.Item key="/dashboard/morningmeeting/assembly">
              <DotChartOutlined />
              <span>Assembly</span>
              <Link to="/dashboard/morningmeeting/assembly" />
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
