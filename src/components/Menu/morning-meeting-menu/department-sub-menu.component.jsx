import React from 'react'
import _ from 'lodash'
import { Link } from "react-router-dom";
import { mapDeptToArea } from '../../../core/utilities/helpers'
import { Menu } from "antd";

const DepartmentSubMenu = ({dept, icon, ...other}) => {

    const area = mapDeptToArea(dept);
    const state = {
        department: area
    }

    return (

        <Menu.SubMenu
            key={area}
            title={
                <span>
                    {icon}
                    <span className="ttc">{dept}</span>
                </span>
            }
            {...other}
        >
            <Menu.Item key={`/dashboard/morningmeeting/${dept}`}>
                <span>Department</span>
                <Link to={{
                    pathname: `/dashboard/morningmeeting/${dept}`,
                    state: state
                }}></Link>
            </Menu.Item>

            <Menu.Item key={`/dashboard/morningmeeting/${dept}/details`}>
                <span>Work Center</span>
                <Link to={{
                    pathname: `/dashboard/morningmeeting/${dept}/details`,
                    state: state
                }}/>
            </Menu.Item>

            <Menu.Item key={`/dashboard/swot/settings/${dept}`}>
                <span>SWOT</span>
                <Link to={{
                    pathname: `/dashboard/swot/settings/${dept === 'finishing' ? 'Skirt Coat' : _.capitalize(dept)}`
                }}/>
            </Menu.Item>

            <Menu.Item key={`/dashboard/status/${dept === 'finishing' ? 'skirt coat' : dept}`}>
                <span>Production</span>
                <Link to={{
                    pathname: `/dashboard/status/${dept === 'finishing' ? 'skirt coat' : dept}`
                }}/>
            </Menu.Item>

            <Menu.Item key={`/dashboard/morningmeeting/${dept}/hourly-production`}>
                <span>Hourly Production</span>
                <Link to={{
                    pathname: `/dashboard/morningmeeting/${dept}/hourly-production`,
                    state: { department: dept }
                }}/>
            </Menu.Item>

            <Menu.Item key={`/orderstatus/${dept}`}>
                <span>Production Orders</span>
                <Link to={{
                    pathname: `/orderstatus/${dept}`,
                    state: state
                }}/>
            </Menu.Item>

            <Menu.Item key={`/oee/${dept}`}>
                <span>OEE</span>
                <Link to={{
                    pathname: `/oee/${dept}`,
                    state: state
                }}/>
            </Menu.Item>

        </Menu.SubMenu>
        )
}

export default DepartmentSubMenu;