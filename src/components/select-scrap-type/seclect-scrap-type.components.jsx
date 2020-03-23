import React from 'react'
import { 
    Select,
 } from "antd";
 const { Option } = Select;

 const SelectScrapType = ({onChange}) => (
    <Select 
        defaultValue="Sb Scrap"
        onChange={onChange}
        bordered={false}
        size="small"
        style={{ width: '120px' }}
        className="mr2">
        <Option value="SB">Sb Scrap</Option>
        <Option value="Purchased">Purchased Scrap</Option>
    </Select>)

export default SelectScrapType;