import React, { useEffect, useState } from 'react';
import { Link, withRouter } from "react-router-dom";
import api from '../../core/utilities/api'

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

const HomeMenu = React.memo(({ location }) => { 

  const [controlMethods, setControlMethods] = useState([]);

  useEffect(() => {

      api.get('quality/checksheets/controlmethod')
      .then(response => {
          setControlMethods(response.data)
      })
      .catch(err => console.error(err.message))

  }, [])

  return (
    <Menu theme="dark" defaultSelectedKeys={[location.pathname]} >

      <Menu.Item key="/">
        <HomeOutlined />
        <span>Home</span>
        <Link to="/" />
      </Menu.Item>

      <Menu.Item key="/dashboard/morningmeeting/safety">
        <DashboardOutlined />
        <span>Dashboard</span>
        <Link to="/dashboard/morningmeeting/safety" />
      </Menu.Item>

      <SubMenu
        key="safety"
        title={
          <span>
            <SafetyOutlined />
            <span>Safety</span>
          </span>
        }
      >
        <Menu.Item key="incident">
          <a href="http://10.129.224.149/FMSB/Safety/IncidentReport.aspx" rel="noopener noreferrer">Incident Report</a>
        </Menu.Item>
        <Menu.Item key="history">
          <a href="http://10.129.224.149/FMSB/Safety2/History.aspx" rel="noopener noreferrer">History</a>
        </Menu.Item>
        <Menu.Item key="report">
          <a href="http://10.129.224.149/FMSB/Safety2/Charts.aspx" rel="noopener noreferrer">Dashboard</a>
        </Menu.Item>
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

        <Menu.Item key="/af/project-tracker">
            <span>Project Tracker</span>
            <Link to="/af/project-tracker" />
        </Menu.Item>

        <Menu.Item key="/af/eos">
          <span>EOS</span>
          <Link to="/af/eos" />
        </Menu.Item>

        <Menu.Item key="afHourByHour">
          <a href="http://10.129.224.149/FMSB/AssemblyFinishing/Inputs/Home.aspx" target="_blank" rel="noopener noreferrer">Hour by Hour</a>
        </Menu.Item>


        {/* <Menu.Item key="/af/history">
          <span>HxH History</span>
          <Link to="/af/history" />
        </Menu.Item>
        <Menu.Item key="/af/recipients">
          <span>EOS Recipients</span>
          <Link to="/af/recipients" />
        </Menu.Item>
        <Menu.Item key="/af/traceability">
          <span>Component Traceability</span>
          <Link to="/af/traceability" />
        </Menu.Item> */}

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

        <SubMenu key="sub3" title="Check Sheet">
          {
            controlMethods.map(({controlMethodId, method}) => (
                <Menu.Item key={`/quality/checksheets/controlmethod/${controlMethodId}`}>
                  <span>{method}</span>
                  <Link to={{
                    pathname: `/quality/checksheets/controlmethod/${controlMethodId}`,
                    state: {
                      name: method,
                      id: controlMethodId
                    }
                  }} />
                </Menu.Item>
            ))
          }
        </SubMenu>

        <Menu.Item key="/quality/checksheets/history">
          <span>Check Sheet History</span>
          <Link to="/quality/checksheets/history" />
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
})

export default withRouter(HomeMenu);
