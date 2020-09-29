import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from "react-router-dom";
import { ReactComponent as Logo } from './assets/logo.svg';
import { ReactComponent as LogoIcon } from './assets/logoIcon.svg';
import { LogoContainer } from './App.styles';
import { setSiderCollapse } from './redux/home/home.actions';
import { Layout, BackTop } from "antd";
import { useWindowSize } from 'react-use'

import './App.css';

import HomePage from './pages/home/home.component';
import NotFound from './pages/404/404.component';

//nenu components
import HomeMenu from './components/Menu/home-menu/home-menu.components';
import MorningMeetingMenu from './components/Menu/morning-meeting-menu/morning-meeting-menu.component';
import AfMenu from './components/Menu/af-menu/af-menu.component';

//page components
import SwotPage from './pages/dashboard/swot/swot.component';

//morning meeting pages
import SafetyPage from './pages/dashboard/morning-meeting/safety-page/safety-page.component';
import QualityPage from './pages/dashboard/morning-meeting/quality-page/quality-page.component';
import LogisticsPage from './pages/dashboard/morning-meeting/logistics-page/logistics-page.component';
import PerformanceLevel0Page from './pages/dashboard/morning-meeting/performance-level0-page/performance-level0-page.component';
import PerformanceLevel2Page from './pages/dashboard/morning-meeting/performance-level2-page/performance-level2-page.component';
import ProductionPage from './pages/dashboard/morning-meeting/production-page/production-page.component';
import ProductionDetailsPage from './pages/dashboard/morning-meeting/production-details-page/production-details-page.component'; 
import HourlyProdPage from './pages/dashboard/morning-meeting/hourly-production-page/hourly-production-page.component'
import FinancePage from './pages/dashboard/morning-meeting/finance-page/finance-page.component';
import DowntimePage from './pages/dashboard/morning-meeting/downtime-page/downtime-page.component';

import OrderStatusPage from './pages/order-status-page/order-status-page.component';
import AfEosPage from './pages/af/eos-page/eos-page.component';

//quality pages
import CheckSheetSettingsPage from './pages/quality/check-sheet/check-sheet-settings-page.component'
import ControlMethodPage from './pages/quality/check-sheet/control-method-page.component'
import CheckSheetLogInPage from './pages/quality/check-sheet/check-sheet-login-page.component'
import CheckSheetDataEntryPage from './pages/quality/check-sheet/check-sheet-data-entry-page.component'
import CheckSheetHistoryPage from './pages/quality/check-sheet/check-sheet-history-page.component'

//machining
import MachiningManningPage from './pages/machining/manning/manning-page.component'

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

  const defaultSiderProps = {
    collapsible: true,
    collapsed,
    onCollapse: setSiderCollapse
  }

  const { width } = useWindowSize();
  const [siderProps, setSiderProps] = useState(defaultSiderProps);

  useEffect(() => {

    if (width <= 1024) {

      setSiderProps({
        breakpoint: 'lg',
        collapsedWidth: '0',
        collapsible: true,
        collapsed,
        onCollapse: setSiderCollapse
      })

    } else {

      setSiderProps({
        collapsible: true,
        collapsed,
        onCollapse: setSiderCollapse
      })

    }

  }, [width, collapsed, setSiderCollapse])

  return (
    <Layout style={{ minHeight: "100vh" }}>

      <Sider {...siderProps}>

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
          <Route path="/orderstatus" component={MorningMeetingMenu} />
          <Route path="/af" component={AfMenu} />
          <Route path="/quality" component={HomeMenu} />
          <Route path="/machining/manning" component={HomeMenu} />
        </Switch>

      </Sider>
      
      <Layout className="site-layout-bg">

        <Switch>

          <Route exact path="/" component={HomePage} />

          {/* SWOT */}
          <Route exact path="/dashboard/swot" component={SwotPage} />

          {/* Monring Meeting */}
          <Route exact path="/dashboard/morningmeeting/safety" component={SafetyPage} />
          <Route exact path="/dashboard/morningmeeting/logistics" component={LogisticsPage} />

          <Route exact path="/dashboard/morningmeeting/foundry" render={() => <ProductionPage area="foundry cell" headerTitle="Foundry" />} />
          <Route exact path="/dashboard/morningmeeting/machining" render={() => <ProductionPage area="machine line" headerTitle="Machining" />} />
          <Route exact path="/dashboard/morningmeeting/finishing" render={() => <ProductionPage area="skirt coat" headerTitle="Finishing / Skirt Coat" />}/>
          <Route exact path="/dashboard/morningmeeting/assembly" render={() => <ProductionPage area="assembly" headerTitle="Assembly" />} />

          <Route exact path="/dashboard/morningmeeting/finance" component={FinancePage} />
          <Route exact path="/dashboard/morningmeeting/quality" component={QualityPage} />
          <Route exact path="/dashboard/morningmeeting/downtime" component={DowntimePage} />

          <Route exact path="/dashboard/morningmeeting/:department/details" component={ProductionDetailsPage} />
          <Route exact path="/dashboard/morningmeeting/*/hourly-production" component={HourlyProdPage} />

          {/* Order Status */}
          <Route exact path="/orderstatus/foundry" render={() => <OrderStatusPage area="foundry cell" headerTitle="Foundry Active Orders" />} />
          <Route exact path="/orderstatus/machining" render={() => <OrderStatusPage area="machine line" headerTitle="Machining Active Orders" />} />
          <Route exact path="/orderstatus/finishing" render={() => <OrderStatusPage area="finishing" headerTitle="Finishing Active Orders" />} />
          <Route exact path="/orderstatus/assembly" render={() => <OrderStatusPage area="assembly" headerTitle="Assembly Active Orders" />} />

          {/* performance Page */}
          <Route exact path="/dashboard/morningmeeting/level0" component={PerformanceLevel0Page} />
          <Route exact path="/dashboard/morningmeeting/level2" component={PerformanceLevel2Page} />

          {/* A&F Page */}
          <Route exact path="/af/eos" component={AfEosPage} />

          {/* Quality */}
          <Route exact path="/quality/checksheets/settings" component={CheckSheetSettingsPage} />
          <Route exact path="/quality/checksheets/history" component={CheckSheetHistoryPage} />
          <Route exact path="/quality/checksheets/history/:controlName/:controlId/line/:lineId/checkSheet/:checkSheetId" render={() => <CheckSheetDataEntryPage isReadOnly={true} />} />
          <Route exact path="/quality/checksheets/controlmethod/:controlName/:controlId/line/:lineId" component={CheckSheetLogInPage} />
          <Route exact path="/quality/checksheets/controlmethod/:controlId" component={ControlMethodPage} />
          <Route exact path="/quality/checksheets/:controlName/:controlId/line/:lineId/checkSheet/:checkSheetId" component={CheckSheetDataEntryPage} />
          
          {/* Machining Page */}
          <Route exact path="/machining/manning/:eosId" component={MachiningManningPage} />

          <Route component={NotFound} />
        </Switch>
        
        <Footer style={{ textAlign: "center" }} className="site-layout-bg">
          FMSBWeb &copy; {new Date().getFullYear()}
        </Footer>

      </Layout>
        
      <BackTop/>

    </Layout>) 
}

//state is the root reducer
const mapStateToProps = state => ({
  collapsed: state.home.collapsed
});

const mapDispatchToProps = dispatch => ({
  setSiderCollapse: collapsed => dispatch(setSiderCollapse(collapsed))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
