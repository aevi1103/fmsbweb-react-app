import React from 'react';
import { Link, withRouter } from "react-router-dom";

import {
  DashboardOutlined,
  DeploymentUnitOutlined,
  HomeOutlined,
  SafetyOutlined,
  SolutionOutlined,
  TeamOutlined,
  ToolOutlined,
} from '@ant-design/icons';

import { Menu } from "antd";

const { SubMenu } = Menu;

const HomeMenu = ( { location } ) => { 

  return (
    <Menu theme="dark" defaultSelectedKeys={[location.pathname]} >

      <Menu.Item key="/">
        <HomeOutlined />
        <span>Home</span>
        <Link to="/" />
      </Menu.Item>

      <SubMenu
        key="dashboard"
        title={
          <span>
            <DashboardOutlined />
            <span>Dashboard</span>
          </span>
        }
      >

        <Menu.Item key="/dashboard/morningmeeting/safety">
          <span>Morning Meeting</span>
          <Link to="/dashboard/morningmeeting/safety" />
        </Menu.Item>

        <Menu.Item key="/orderstatus">
          <span>Order Status</span>
          <Link to="/orderstatus/foundry" />
        </Menu.Item>

        <Menu.Item key="/dashboard/swot">
          <span>SWOT</span>
          <Link to="/dashboard/swot" />
        </Menu.Item>

        <Menu.Item key="infoScreen">Info Screen</Menu.Item>
      </SubMenu>

      <SubMenu
        key="safety"
        title={
          <span>
            <SafetyOutlined />
            <span>Safety</span>
          </span>
        }
      >
        <Menu.Item key="incident">Incident Report</Menu.Item>
        <Menu.Item key="history">History</Menu.Item>
        <Menu.Item key="report">Reports</Menu.Item>
      </SubMenu>

      <SubMenu
        key="foundryTeam"
        title={
          <span>
            <TeamOutlined />
            <span>Foundry</span>
          </span>
        }
      >
        <Menu.Item key="foundryHourByHour">
          <a href="http://10.129.224.149/FMSBHXH/HxH/Lines?dept=Foundry&h=1" target="_blank" rel="noopener noreferrer">Hour by Hour</a>
        </Menu.Item>
        <Menu.Item key="hxhHistoryFoundry">
          <a href="http://10.129.224.149/FMSB/hourbyhour/hxh/History.aspx?dept=Foundry" target="_blank" rel="noopener noreferrer">HxH History</a>
        </Menu.Item>
        <Menu.Item key="furnaceTracker">Furnace Tracker</Menu.Item>
        <Menu.Item key="castingParameter">Casting Parameter</Menu.Item>
        <Menu.Item key="foundryEos">EOS</Menu.Item>
        <Menu.Item key="foundryEosEmail">EOS Recipients</Menu.Item>
      </SubMenu>

      <SubMenu
        key="machTeam"
        title={
          <span>
            <TeamOutlined />
            <span>Machining</span>
          </span>
        }
      >
        <Menu.Item key="machHourByHour">
          <a href="http://10.129.224.149/FMSBHXH/HxH/Lines?dept=Machining&h=1" target="_blank" rel="noopener noreferrer">Hour by Hour</a>
        </Menu.Item>
        <Menu.Item key="hxhHistoryMach">
          <a href="http://10.129.224.149/FMSB/hourbyhour/hxh/History.aspx?dept=Machining" target="_blank" rel="noopener noreferrer">HxH History</a>
        </Menu.Item>
        <Menu.Item key="machEos">EOS</Menu.Item>
        <Menu.Item key="machEosEmail">EOS Recipients</Menu.Item>
      </SubMenu>

      <SubMenu
        key="afteam"
        title={
          <span>
            <TeamOutlined />
            <span>A&F</span>
          </span>
        }
      >
        <Menu.Item key="afHourByHour">
          <a href="http://10.129.224.149/FMSB/AssemblyFinishing/Inputs/Home.aspx" target="_blank" rel="noopener noreferrer">Hour by Hour</a>
        </Menu.Item>
        <Menu.Item key="/af/history">
          <span>HxH History</span>
          <Link to="/af/history" />
        </Menu.Item>
        <Menu.Item key="/af/eos">
          <span>EOS</span>
          <Link to="/af/eos" />
        </Menu.Item>
        <Menu.Item key="/af/recipients">
          <span>EOS Recipients</span>
          <Link to="/af/recipients" />
        </Menu.Item>
        <Menu.Item key="/af/traceability">
          <span>Component Traceability</span>
          <Link to="/af/traceability" />
        </Menu.Item>
      </SubMenu>

      <SubMenu
        key="maintTeam"
        title={
          <span>
          <DeploymentUnitOutlined />
            <span>Maintenance</span>
          </span>
        }
      >
        <Menu.Item key="pm">
          <a href="http://10.129.224.149/FMSBWEBHR/PreventiveMaintenances/MaintenanceDashboard" target="_blank" rel="noopener noreferrer">PM Status</a>
        </Menu.Item>
        <Menu.Item key="maintJobs">
          <a href="http://10.129.224.149/FMSBWEBHR/MaintenanceAlerts" target="_blank" rel="noopener noreferrer">Job Status</a>
        </Menu.Item>
        <Menu.Item key="maintEos">
          <a href="http://10.129.224.149/FMSBWEBHR/MaintenanceEndOfShift" target="_blank" rel="noopener noreferrer">EOS</a>
        </Menu.Item>
        <Menu.Item key="maintPlanner">
          <a href="http://10.129.224.149/FMSBWEBHR/MaintenancePlanner" target="_blank" rel="noopener noreferrer">Planner Log</a>
        </Menu.Item>
        <Menu.Item key="maintPlannedWorkLog">
          <a href="http://10.129.224.149/FMSBWEBHR/MaintenancePlannedWork" target="_blank" rel="noopener noreferrer">Planned Work Log</a>
        </Menu.Item>
      </SubMenu>

      <SubMenu
        key="qaTeam"
        title={
          <span>
          <SolutionOutlined />
            <span>Quality</span>
          </span>
        }
      >
        <Menu.Item key="qaAlert">Create QA</Menu.Item>
        <Menu.Item key="viewQa">View QA</Menu.Item>
        <Menu.Item key="scrapEscalation">Scrap Escalation</Menu.Item>

        <Menu.Item key="/quality/checksheets">
          <span>Check Sheet</span>
          <Link to="/quality/checksheets" />
        </Menu.Item>

        <Menu.Item key="/quality/checksheets/settings">
          <span>Check Sheet Settings</span>
          <Link to="/quality/checksheets/settings" />
        </Menu.Item>

      </SubMenu>

      <SubMenu
        key="engTeam"
        title={
          <span>
          <ToolOutlined />
            <span>Engineering</span>
          </span>
        }
      >
        <Menu.Item key="downtime">Downtime</Menu.Item>

      </SubMenu>
      
    </Menu>
  ); 
}

export default withRouter(HomeMenu);
