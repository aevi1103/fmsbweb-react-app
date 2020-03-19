import React from 'react';
import { Link, withRouter } from "react-router-dom";

import {
    ApartmentOutlined,
    AreaChartOutlined,
    BarChartOutlined,
    DotChartOutlined,
    HomeOutlined,
    PieChartOutlined,
} from '@ant-design/icons';

import { Menu } from "antd";

const OrderStatusMenu = ( { location } ) => { 

  return (
      <Menu theme="dark" defaultSelectedKeys={[location.pathname]} mode="inline">

          <Menu.Item key="/">
              <HomeOutlined />
              <span>Home</span>
              <Link to="/" />
          </Menu.Item>

          <Menu.Item key="/dashboard/morningmeeting/safety">
              <ApartmentOutlined />
              <span>Morning Meeting</span>
              <Link to="/dashboard/morningmeeting/safety" />
          </Menu.Item>

          <Menu.Item key="/orderstatus/foundry">
              <AreaChartOutlined />
              <span>Foundry</span>
              <Link to="/orderstatus/foundry" />
          </Menu.Item>

          <Menu.Item key="/orderstatus/machining">
              <PieChartOutlined />
              <span>Machining</span>
              <Link to="/orderstatus/machining" />
          </Menu.Item>

          <Menu.Item key="/orderstatus/finishing">
              <BarChartOutlined />
              <span>Finishing</span>
              <Link to="/orderstatus/finishing" />
          </Menu.Item>

          <Menu.Item key="/orderstatus/assembly">
              <DotChartOutlined />
              <span>Assembly</span>
              <Link to="/orderstatus/assembly" />
          </Menu.Item>
        
      </Menu>
  ); 
}

export default withRouter(OrderStatusMenu);
