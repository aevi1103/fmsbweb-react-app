import React from 'react';
import { 
    Select
 } from "antd";
 const { Option } = Select;

 const DeptSelect = ({
     defaultValue,
     onChange,
     type = "scrap"
 }) => (
    <Select 
        defaultValue={defaultValue}
        style={{ width: 120 }}
        onChange={onChange}
        className="mr2">       
        <Option value="Foundry Cell">Foundry</Option>
        <Option value="Machine Line">Machining</Option>
        <Option value="Skirt Coat">Finishing</Option> 
        <Option value="Assembly">Assembly</Option>
        <Option value="Plant">Plant</Option>      
    </Select>
 )

 export default DeptSelect;