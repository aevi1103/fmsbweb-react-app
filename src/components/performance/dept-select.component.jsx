import React from 'react';
import { 
    Select
 } from "antd";
 const { Option } = Select;

const depts = [
    {
        area: 'Foundry Cell',
        dept: 'Foundry'
    },
    {
        area: 'Machine Line',
        dept: 'Machining'
    },
    {
        area: 'Skirt Coat',
        dept: 'Finishing'
    },
    {
        area: 'Assembly',
        dept: 'Assembly'
    },
    {
        area: 'Plant',
        dept: 'Plant'
    }
]

 const DeptSelect = ({
     defaultValue,
     onChange
 }) => (
    <Select 
        defaultValue={defaultValue}
        style={{ width: 120 }}
        onChange={onChange}
        className="mr2">   
            {
                depts.map(({ area, dept }) => <Option value={area}>{dept}</Option>)
            }  
    </Select>
 )

 export default DeptSelect;