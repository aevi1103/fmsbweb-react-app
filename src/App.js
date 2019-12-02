import React from 'react';
import { connect } from 'react-redux';
import { Link, Route, withRouter } from "react-router-dom";

import { ReactComponent as Logo } from './assets/logo.svg'
import { ReactComponent as LogoIcon } from './assets/logoIcon.svg'

import {
  LogoContainer
} from './App.styles';

import { setSiderCollapse } from './redux/home/home.actions'
import { Layout, Menu, Icon } from "antd";

import HomePage from './pages/home/home.component'

import MorningMeetingPage from './pages/dashboard/morning-meeting/morning-meeting.component'
import SwotPage from './pages/dashboard/swot/swot.component'


const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const logoStyles = {
  height: "100%",
  width: "100%"
}

const logoStylesWhite = {
  height: "100%",
  width: "100%",
  filter: "brightness(0) invert(1)"
}

const App = ( { collapsed, setSiderCollapse, location } ) => (

  <Layout style={{ minHeight: "100vh" }}>

    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setSiderCollapse}
    >

      <LogoContainer>
        {
          collapsed 
          ? (<LogoIcon style={logoStyles} />) 
          : (<Logo style={logoStylesWhite} fill="white" />)
        }
      </LogoContainer>

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

          <Menu.Item key="/dashboard/morningmeeting">
            <span>Morning Meeting</span>
            <Link to="/dashboard/morningmeeting" />
          </Menu.Item>

          <Menu.Item key="/dashboard/swot">
            <span>SWOT</span>
            <Link to="/dashboard/swot" />
          </Menu.Item>

          <Menu.Item key="infoScreen">Info Screen</Menu.Item>
          <Menu.Item key="foundry">Foundry</Menu.Item>
          <Menu.Item key="mach">Machining</Menu.Item>
          <Menu.Item key="anod">Anodize</Menu.Item>
          <Menu.Item key="sc">Skirt Coat</Menu.Item>
          <Menu.Item key="assy">Assembly</Menu.Item>
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
    
    </Sider>
    
    <Layout>

      <Header style={{ background: "#fff", padding: 0 }} />

      <Content style={{ margin: "0 16px" }}>

        <Route exact path="/" component={HomePage} />
        <Route exact path="/dashboard/morningmeeting" component={MorningMeetingPage} />
        <Route exact path="/dashboard/swot" component={SwotPage} />

      </Content>

      <Footer style={{ textAlign: "center" }}>
        FMSBWeb &copy; {new Date().getFullYear()}
      </Footer>

    </Layout>

  </Layout>

) 

//state is the root reducer
const mapStateToProps = state => ({
  collapsed: state.home.collapsed
});

const mapDispatchToProps = dispatch => ({
  setSiderCollapse: collapsed => dispatch(setSiderCollapse(collapsed))
})

export default connect(mapStateToProps, mapDispatchToProps)(
  withRouter(App)
);
