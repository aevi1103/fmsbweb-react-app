import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from "react-router-dom";

import { ReactComponent as Logo } from './assets/logo.svg'
import { ReactComponent as LogoIcon } from './assets/logoIcon.svg'

import {
  LogoContainer
} from './App.styles';

import { setSiderCollapse } from './redux/home/home.actions'
import { Layout } from "antd";

import HomePage from './pages/home/home.component'
import SwotPage from './pages/dashboard/swot/swot.component'
import NotFound from './pages/404/404.component';

import HomeMenu from './components/Menu/home-menu/home-menu.components';
import MorningMeetingMenu from './components/Menu/morning-meeting-menu/morning-meeting-menu.component'

import SafetyPage from './pages/dashboard/morning-meeting/safety/safety.component';
import LogisticsPage from './pages/dashboard/morning-meeting/logistics/logistics.component'

const { Footer, Sider } = Layout;

const logoStyles = {
  height: "100%",
  width: "100%"
}

const logoStylesWhite = {
  height: "100%",
  width: "100%",
  filter: "brightness(0) invert(1)"
}

const App = ( { collapsed, setSiderCollapse } ) => { 
  
  return (

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

      <Switch>
        <Route exact path="/" component={HomeMenu} />

        <Route path="/dashboard/morningmeeting" component={MorningMeetingMenu} />

        <Route exact path="/dashboard/swot" component={HomeMenu} />
      </Switch>

    </Sider>
    
    <Layout>

      <Switch>
        <Route exact path="/" component={HomePage} />

        <Route exact path="/dashboard/morningmeeting/safety" component={SafetyPage} />
        <Route exact path="/dashboard/morningmeeting/logistics" component={LogisticsPage} />

        <Route exact path="/dashboard/swot" component={SwotPage} />
        <Route component={NotFound} />
      </Switch>

      <Footer style={{ textAlign: "center" }}>
        FMSBWeb &copy; {new Date().getFullYear()}
      </Footer>

    </Layout>

  </Layout>

) 
}

//state is the root reducer
const mapStateToProps = state => ({
  collapsed: state.home.collapsed
});

const mapDispatchToProps = dispatch => ({
  setSiderCollapse: collapsed => dispatch(setSiderCollapse(collapsed))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
