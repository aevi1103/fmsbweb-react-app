import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from "react-router-dom";
import { ReactComponent as Logo } from './assets/logo.svg';
import { ReactComponent as LogoIcon } from './assets/logoIcon.svg';
import { LogoContainer } from './App.styles';
import { 
  setSiderCollapse
 } from './core/redux/home/home.actions';

import { 
  Layout,
  BackTop
 } from "antd";

import { useWindowSize } from 'react-use'

import './App.css';
import './App.scss'

import HomePage from './containers/home/home.component';
import NotFound from './containers/404/404.component';

//nenu components
import HomeMenu from './components/Menu/home-menu/home-menu.components';
import MorningMeetingMenu from './components/Menu/morning-meeting-menu/morning-meeting-menu.component';
import AfMenu from './components/Menu/af-menu/af-menu.component';
import LogisticsMenu from './components/Menu/logistics/logistics-menu.component'

//swot components
import SwotSettings from './containers/swot-settings/swot-settings.component';
import Swot from './containers/swot/swot.component';
import PrintWotChartsPage from './containers/swot/swot-print.component';

//department dashboard
import ProductionDashboard from './containers/production-dashboard/production-dashboard.component'

//morning meeting pages
import SafetyPage from './containers/safety/safety-page.component';
import QualityPage from './containers/quality/quality-page.component';
import LogisticsDashboard from './containers/logistics-dashboard/logistics-dashboard.component';
import PerformanceLevel0Page from './containers/dashboard/kpi/performance-level0-page.component';
import PerformanceLevel2Page from './containers/dashboard/kpi/performance-level2-page.component';
import DepartmentPage from './containers/dashboard/kpi/department-page.component';
import ProductionDetailsPage from './containers/dashboard/kpi/production-details-page.component'; 
import HourlyProdPage from './containers/hourly-production/hourly-production-page.component'
import FinancePage from './containers/finance/finance-page.component';
import DowntimePage from './containers/downtime/downtime-page.component';

import ProductionOrderPage from './containers/production-order/production-order-page.component';
import AfEosPage from './containers/af-eos/af-eos.component';

//quality pages
import CheckSheetSettingsPage from './containers/quality-check-sheet/check-sheet-settings-page.component'
import ControlMethodPage from './containers/quality-check-sheet/control-method-page.component'
import CheckSheetLogInPage from './containers/quality-check-sheet/check-sheet-login-page.component'
import CheckSheetDataEntryPage from './containers/quality-check-sheet/check-sheet-data-entry-page.component'
import CheckSheetHistoryPage from './containers/quality-check-sheet/check-sheet-history-page.component'

//machining
import MachiningManningPage from './containers/machining-manning/machining-manning.component'

//logistics settings page
import InvetoryPage from './containers/logistics-inventory-file-upload/inventory-page.component'
import CostTaregtsPage from './containers/logitics-costs-targets/logistics-costs-targets.component'
import InventoryMinMaxTargets from './containers/inventory-min-max-targets/inventory-min-max-targets.component'
import ProductionOrderFileUpload from './containers/production-order-file-upload/production-order-file-upload.componen'

// OEE
import OeeLines from './containers/dashboard/oee/lines-page.component'

import ChatPage from './containers/chat/chat-page.component'

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

const App = ( { 
  collapsed,
  setSiderCollapse
 } ) => { 

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

      <Sider {...siderProps} id="sider">

        <LogoContainer>
          {
            collapsed 
              ? (<LogoIcon style={logoStyles} />) 
              : (<Logo style={logoStylesWhite} fill="white" />)
          }
        </LogoContainer>

        <Switch>
          <Route exact path="/" component={HomeMenu} />
          <Route path="/dashboard/morningmeeting/logistics/settings/*" component={LogisticsMenu} />
          <Route path="/dashboard/*" component={MorningMeetingMenu} />
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
          <Route exact path="/dashboard/swot/settings/:department?" component={SwotSettings} />
          <Route exact path="/dashboard/swot/:department" component={Swot} />
          <Route exact path="/dashboard/swot/:department/print" component={PrintWotChartsPage} />

          {/* Department Dashboard */}
          <Route exact path="/dashboard/status/:department" component={ProductionDashboard} />

          {/* Monring Meeting */}
          <Route exact path="/dashboard/morningmeeting/safety" component={SafetyPage} />
          <Route exact path="/dashboard/morningmeeting/logistics" component={LogisticsDashboard} />
          <Route exact path="/dashboard/morningmeeting/logistics/settings/inventory" component={InvetoryPage} />
          <Route exact path="/dashboard/morningmeeting/logistics/settings/cost/targets" component={CostTaregtsPage} />
          <Route exact path="/dashboard/morningmeeting/logistics/settings/inventory/minmax" component={InventoryMinMaxTargets} />
          <Route exact path="/dashboard/morningmeeting/logistics/settings/order" component={ProductionOrderFileUpload} />

          <Route exact path="/dashboard/morningmeeting/foundry" render={() => <DepartmentPage area="foundry cell" headerTitle="Foundry" />} />
          <Route exact path="/dashboard/morningmeeting/machining" render={() => <DepartmentPage area="machine line" headerTitle="Machining" />} />
          <Route exact path="/dashboard/morningmeeting/finishing" render={() => <DepartmentPage area="skirt coat" headerTitle="Finishing / Skirt Coat" />}/>
          <Route exact path="/dashboard/morningmeeting/assembly" render={() => <DepartmentPage area="assembly" headerTitle="Assembly" />} />

          <Route exact path="/dashboard/morningmeeting/finance" component={FinancePage} />
          <Route exact path="/dashboard/morningmeeting/quality" component={QualityPage} />
          <Route exact path="/dashboard/morningmeeting/downtime" component={DowntimePage} />

          <Route exact path="/dashboard/morningmeeting/:department/details" component={ProductionDetailsPage} />
          <Route exact path="/dashboard/morningmeeting/*/hourly-production" component={HourlyProdPage} />

          {/* OEE Page */}
          <Route exact path="/oee/:department" component={OeeLines} />
          <Route exact path="/oee/:department/:id" component={OeeLines} />

          {/* Order Status */}
          <Route exact path="/orderstatus/:department" component={ProductionOrderPage} />

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

          <Route exact path="/chat" component={ChatPage} />

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
const mapStateToProps = ({ home, requests }) => ({
  collapsed: home.collapsed,
  progress: requests.progress,
  totalRequests: requests.totalRequests
});

const mapDispatchToProps = dispatch => ({
  setSiderCollapse: collapsed => dispatch(setSiderCollapse(collapsed))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
