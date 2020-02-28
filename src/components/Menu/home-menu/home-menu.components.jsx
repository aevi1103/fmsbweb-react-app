import React from 'react';
import { Link, withRouter } from "react-router-dom";
import { Menu, Icon } from "antd";

const { SubMenu } = Menu;

const HomeMenu = ( { location } ) => { 

  return (

    <Menu theme="dark" defaultSelectedKeys={[location.pathname]} mode="inline">

      <Menu.Item key="/">
        <Icon type="home" />
        <span>Home</span>
        <Link to="/" />
      </Menu.Item>

      <SubMenu
        key="dashboard"
        title={
          <span>
            <Icon type="dashboard" />
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
            <Icon type="safety" />
            <span>Safety</span>
          </span>
        }
      >
        <Menu.Item key="incident">Incident Report</Menu.Item>
        <Menu.Item key="history">History</Menu.Item>
        <Menu.Item key="report">Reports</Menu.Item>
        <Menu.Item key="chart">Charts</Menu.Item>
      </SubMenu>

      <SubMenu
        key="foundryTeam"
        title={
          <span>
            <Icon type="team" />
            <span>Foundry</span>
          </span>
        }
      >
        <Menu.Item key="foundryHourByHour">Hour by Hour</Menu.Item>
        <Menu.Item key="hxhHistoryFoundry">HxH History</Menu.Item>
        <Menu.Item key="furnaceTracker">Furnace Tracker</Menu.Item>
        <Menu.Item key="castingParameter">Casting Parameter</Menu.Item>
        <Menu.Item key="foundryEos">EOS</Menu.Item>
        <Menu.Item key="foundryEosEmail">EOS Email</Menu.Item>
      </SubMenu>

      <SubMenu
        key="machTeam"
        title={
          <span>
            <Icon type="team" />
            <span>Machining</span>
          </span>
        }
      >
        <Menu.Item key="machHourByHour">Hour by Hour</Menu.Item>
        <Menu.Item key="hxhHistoryMach">HxH History</Menu.Item>
        <Menu.Item key="machEos">EOS</Menu.Item>
        <Menu.Item key="machEosEmail">EOS Email</Menu.Item>
        <Menu.Item key="machCheckSheets">Mach. Checksheets</Menu.Item>
        <Menu.Item key="lta">LTA</Menu.Item>
      </SubMenu>

      <SubMenu
        key="afteam"
        title={
          <span>
            <Icon type="team" />
            <span>A&F</span>
          </span>
        }
      >
        <Menu.Item key="afHourByHour">Hour by Hour</Menu.Item>

        <Menu.Item key="hxhHistoryAnod">Anodize HxH History</Menu.Item>
        <Menu.Item key="hxhHistorySc">SC HxH History</Menu.Item>
        <Menu.Item key="hxhHistoryAssy">Assembly HxH History</Menu.Item>

        <Menu.Item key="machEos">EOS</Menu.Item>
        <Menu.Item key="machEosEmail">EOS Email</Menu.Item>

        <Menu.Item key="compTraceability">Component Traceability</Menu.Item>
      </SubMenu>

      <SubMenu
        key="maintTeam"
        title={
          <span>
          <Icon type="deployment-unit" />
            <span>Maintenance</span>
          </span>
        }
      >
        <Menu.Item key="pm">PM Status</Menu.Item>
        <Menu.Item key="maintJobs">Maint. Jobs</Menu.Item>

      </SubMenu>

      <SubMenu
        key="qaTeam"
        title={
          <span>
          <Icon type="solution" />
            <span>Quality</span>
          </span>
        }
      >
        <Menu.Item key="qaAlert">Create QA</Menu.Item>
        <Menu.Item key="viewQa">View QA</Menu.Item>
        <Menu.Item key="scrapEscalation">Scrap Escalation</Menu.Item>

      </SubMenu>

      <SubMenu
        key="engTeam"
        title={
          <span>
          <Icon type="tool" />
            <span>Engineering</span>
          </span>
        }
      >
        <Menu.Item key="downtime">Downtime</Menu.Item>

      </SubMenu>
      
    </Menu>

) 
}

export default withRouter(HomeMenu);
