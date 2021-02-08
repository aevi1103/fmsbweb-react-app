import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, Switch } from "react-router-dom";
import { ReactComponent as Logo } from './assets/logo.svg';
import { ReactComponent as LogoIcon } from './assets/logoIcon.svg';
import { LogoContainer } from './App.styles';
import { useWindowSize } from 'react-use'
import { setSiderCollapse } from './core/redux/home/home.actions'

import { 
  Layout,
  BackTop
 } from "antd";

import HomePage from './containers/home/home.component';
import NotFound from './containers/404/404.component';

//* nenu components
import HomeMenu from './components/home-menu/home-menu.components';
import DashboardMenu from './components/dashboard-menu/dashboard-menu.component';
import AfMenu from './components/af-menu/af-menu.component';
import LogisticsMenu from './components/logistics-menu/logistics-menu.component'

//* swot components
import SwotSettings from './containers/swot-settings/swot-settings.component';
import Swot from './containers/swot/swot.component';
import PrintWotChartsPage from './containers/swot/swot-print.component';

//* production dashboard
import ProductionDashboard from './containers/production-dashboard/production-dashboard.component'

//* dashboard
import SafetyPage from './containers/safety/safety.component';
import QualityPage from './containers/quality/quality.component';
import LogisticsDashboard from './containers/logistics-dashboard/logistics-dashboard.component';
import PerformanceLevel0Page from './containers/performance-lvl-0/performance-level0-page.component';
import PerformanceLevel2Page from './containers/performance-lvl-2/performance-level2-page.component';
import DepartmentDashboard from './containers/department-dashboard/department-dashboard.component';
import WorkCenterDetails from './containers/work-center-details/work-center-details.component'; 
import HourlyProdPage from './containers/hourly-production/hourly-production-page.component'
import FinancePage from './containers/finance/finance.component';
import DowntimePage from './containers/downtime/downtime-page.component';

import ProductionOrderPage from './containers/production-order/production-order-page.component';
import AfEosPage from './containers/af-eos/af-eos.component';

//* Project Tracker
import ProjectTracker from './containers/project-tracker/project-tracker.component'

//* quality pages
import CheckSheetSettingsPage from './containers/quality-check-sheet/check-sheet-settings-page.component'
import ControlMethodPage from './containers/quality-check-sheet/control-method-page.component'
import CheckSheetLogInPage from './containers/quality-check-sheet/check-sheet-login-page.component'
import CheckSheetDataEntryPage from './containers/quality-check-sheet/check-sheet-data-entry-page.component'
import CheckSheetHistoryPage from './containers/quality-check-sheet/check-sheet-history-page.component'

//* machining
import MachiningManningPage from './containers/machining-manning/machining-manning.component'

//* logistics settings page
import InvetoryPage from './containers/logistics-inventory-file-upload/inventory-page.component'
import CostTaregtsPage from './containers/logitics-costs-targets/logistics-costs-targets.component'
import InventoryMinMaxTargets from './containers/inventory-min-max-targets/inventory-min-max-targets.component'
import ProductionOrderFileUpload from './containers/production-order-file-upload/production-order-file-upload.componen'

//* OEE
import OeeLines from './containers/oee-lines/oee-lines.component'
import Oee from './containers/oee/oee.component'

import ChatPage from './containers/chat/chat-page.component'

import './App.less'

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

const App = () => { 

  const { width } = useWindowSize();

  //* dispatcher
  const dispatch = useDispatch();
  const collapseSider = useCallback(collapsed => dispatch(setSiderCollapse(collapsed)), [dispatch]) 

  //* selectors
  const collapsed = useSelector(({ home }) => home.collapsed)

  const defaultSiderProps = {
    collapsible: true,
    collapsed,
    onCollapse: collapseSider
  }
  
  //* global error handler
  const [siderProps, setSiderProps] = useState(defaultSiderProps);

  //* coallapse effect
  useEffect(() => {

    if (width <= 1024) {

      setSiderProps({
        breakpoint: 'lg',
        collapsedWidth: '0',
        collapsible: true,
        collapsed,
        onCollapse: collapseSider
      })

    } else {

      setSiderProps({
        collapsible: true,
        collapsed,
        onCollapse: collapseSider
      })

    }

  }, [width, collapseSider, collapsed])

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
          <Route path="/dashboard/*" component={DashboardMenu} />
          <Route path="/orderstatus" component={DashboardMenu} />
          <Route path="/af" component={AfMenu} />
          <Route path="/quality" component={HomeMenu} />
          <Route path="/machining/manning" component={HomeMenu} />
        </Switch>

      </Sider>
      
      <Layout className="site-layout-bg">

        <Switch>

          <Route exact path="/" component={HomePage} />

          {/* SWOT */}
          <Route exact path="/dashboard/swot/settings/:department" component={SwotSettings} />
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

          <Route exact path="/dashboard/morningmeeting/foundry" render={() => <DepartmentDashboard area="foundry cell" />} />
          <Route exact path="/dashboard/morningmeeting/machining" render={() => <DepartmentDashboard area="machine line" />} />
          <Route exact path="/dashboard/morningmeeting/finishing" render={() => <DepartmentDashboard area="skirt coat" />}/>
          <Route exact path="/dashboard/morningmeeting/assembly" render={() => <DepartmentDashboard area="assembly" />} />
          <Route exact path="/dashboard/morningmeeting/:department/details" component={WorkCenterDetails} />

          <Route exact path="/dashboard/morningmeeting/finance" component={FinancePage} />
          <Route exact path="/dashboard/morningmeeting/quality" component={QualityPage} />
          <Route exact path="/dashboard/morningmeeting/downtime" component={DowntimePage} />

          <Route exact path="/dashboard/morningmeeting/*/hourly-production" component={HourlyProdPage} />

          {/* OEE Page */}
          <Route exact path="/oee/:department" component={OeeLines} />
          <Route exact path="/oee/:department/:guid" component={Oee} />

          {/* Order Status */}
          <Route exact path="/orderstatus/:department" component={ProductionOrderPage} />

          {/* performance Page */}
          <Route exact path="/dashboard/morningmeeting/level0" component={PerformanceLevel0Page} />
          <Route exact path="/dashboard/morningmeeting/level2" component={PerformanceLevel2Page} />

          {/* A&F Page */}
          <Route exact path="/af/eos" component={AfEosPage} />
          <Route exact path="/af/project-tracker" component={ProjectTracker} />

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


export default App;
