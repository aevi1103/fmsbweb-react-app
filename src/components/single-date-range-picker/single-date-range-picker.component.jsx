import React from 'react';

import { 
    DatePicker,
    Button,
    Tooltip
 } from "antd";

import { dateFormat } from '../../core/utilities/helpers'

 const DateRangePicker = ({onButtonClick, onChange, defaultValue, ...other}) => (

    <>
        <span className="mr2">Date:</span>
                
        <DatePicker 
            className="mr2"
            onChange={onChange}
            format={dateFormat}
            defaultValue={defaultValue}
            {...other}/>

        <Tooltip placement="top" title={<span>Click to reload dashboard</span>}>
            <Button type="primary" onClick={onButtonClick}>Go</Button>
        </Tooltip>
        
    </>

 )

 export default DateRangePicker;