import React from 'react'
import _ from 'lodash'
import { Link } from "react-router-dom";
import { mapDeptToArea } from '../../../core/utilities/helpers'
import { Menu } from "antd";

const DepartmentSubMenu = ({
    dept,
    icon,
    start,
    end,
    ...other
}) => {

    const area = mapDeptToArea(dept);

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
                <Link to={`/dashboard/morningmeeting/${dept}?start=${start}&end=${end}`}></Link>
            </Menu.Item>

            <Menu.Item key={`/dashboard/morningmeeting/${dept}/details`}>
                <span>Work Center</span>
                <Link to={`/dashboard/morningmeeting/${dept}/details?start=${start}&end=${end}`}/>
            </Menu.Item>

            <Menu.Item key={`/dashboard/swot/settings/${dept}`}>
                <span>SWOT</span>
                <Link to={`/dashboard/swot/settings/${dept === 'finishing' ? 'Skirt Coat' : _.capitalize(dept)}`}/>
            </Menu.Item>

            <Menu.Item key={`/dashboard/status/${dept === 'finishing' ? 'skirt coat' : dept}`}>
                <span>Prod. Dashboard</span>
                <Link to={`/dashboard/status/${dept === 'finishing' ? 'skirt coat' : dept}`}/>
            </Menu.Item>

            <Menu.Item key={`/dashboard/morningmeeting/${dept}/hourly-production`}>
                <span>Hourly Production</span>
                <Link to={`/dashboard/morningmeeting/${dept}/hourly-production?start=${end}`}/>
            </Menu.Item>

            <Menu.Item key={`/orderstatus/${dept}`}>
                <span>Prod. Orders</span>
                <Link to={`/orderstatus/${dept}`}/>
            </Menu.Item>

            <Menu.Item key={`/oee/${dept}`}>
                <span>OEE (WIP)</span>
                <Link to={`/oee/${dept}`}/>
            </Menu.Item>

        </Menu.SubMenu>
        )
}

export default DepartmentSubMenu;