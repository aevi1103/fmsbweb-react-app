import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from "react-router-dom";
import { ReactComponent as Logo } from './assets/logo.svg';
import { ReactComponent as LogoIcon } from './assets/logoIcon.svg';
import { LogoContainer } from './App.styles';
import { setSiderCollapse } from './redux/home/home.actions';
import { Layout, BackTop } from "antd";

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
import CheckSheetDataEntryPage from './pages/quality/check-sheet/check-sheet-data-entry.component'

const GetRenderedProdPage = (area, header) => <ProductionPage area={area} headerTitle={header} />
const RenderedFoundryPage = () => GetRenderedProdPage("foundry cell", "Foundry");
const RenderedMachiningPage = () => GetRenderedProdPage("machine line", "Machining");
const RenderedFinishingPage = () => GetRenderedProdPage("skirt coat", "Finishing / Skirt Coat");
const RenderedAssemblyPage = () => GetRenderedProdPage("assembly", "Assembly");

//order status page
const GetRenderedOrderPage = (area, header) => <OrderStatusPage area={area} headerTitle={header} />
const RenderedFoundryOrderStatPage = () => GetRenderedOrderPage("foundry cell", "Foundry Active Orders");
const RenderedMachiningOrderStatPage = () => GetRenderedOrderPage("machine line", "Machining Active Orders");
const RenderedFinishingOrderStatPage = () => GetRenderedOrderPage("finishing", "Finishing Active Orders");
const RenderedAssemblyOrderStatPage = () => GetRenderedOrderPage("assembly", "Assembly Active Orders");

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
        breakpoint="xl"
        collapsedWidth="0"
        // collapsible
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
          <Route path="/orderstatus" component={MorningMeetingMenu} />
          <Route path="/af" component={AfMenu} />
          <Route path="/quality" component={HomeMenu} />
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
          <Route exact path="/dashboard/morningmeeting/foundry" component={RenderedFoundryPage} />
          <Route exact path="/dashboard/morningmeeting/machining" component={RenderedMachiningPage} />
          <Route exact path="/dashboard/morningmeeting/finishing" component={RenderedFinishingPage}/>
          <Route exact path="/dashboard/morningmeeting/assembly" component={RenderedAssemblyPage} />
          <Route exact path="/dashboard/morningmeeting/finance" component={FinancePage} />
          <Route exact path="/dashboard/morningmeeting/quality" component={QualityPage} />
          <Route exact path="/dashboard/morningmeeting/downtime" component={DowntimePage} />
          <Route exact path="/dashboard/morningmeeting/*/details" component={ProductionDetailsPage} />
          <Route exact path="/dashboard/morningmeeting/*/hourly-production" component={HourlyProdPage} />

          {/* Order Status */}
          <Route exact path="/orderstatus/foundry" component={RenderedFoundryOrderStatPage} />
          <Route exact path="/orderstatus/machining" component={RenderedMachiningOrderStatPage} />
          <Route exact path="/orderstatus/finishing" component={RenderedFinishingOrderStatPage} />
          <Route exact path="/orderstatus/assembly" component={RenderedAssemblyOrderStatPage} />

          {/* performance Page */}
          <Route exact path="/dashboard/morningmeeting/level0" component={PerformanceLevel0Page} />
          <Route exact path="/dashboard/morningmeeting/level2" component={PerformanceLevel2Page} />

          {/* A&F Page */}
          <Route exact path="/af/eos" component={AfEosPage} />

          {/* Quality */}
          <Route exact path="/quality/checksheets/settings" component={CheckSheetSettingsPage} />
          <Route exact path="/quality/checksheets/controlmethod/:controlName/:controlId/line/:lineId" component={CheckSheetLogInPage} />
          <Route exact path="/quality/checksheets/controlmethod/:controlId" component={ControlMethodPage} />
          <Route exact path="/quality/checksheets/:controlName/:controlId/line/:lineId/checkSheet/:checkSheetId" component={CheckSheetDataEntryPage} />

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
