import React from 'react';

import { 
    DatePicker,
    Button,
    Tooltip
 } from "antd";

 const dateFormat = 'MM/DD/YYYY';

 const DateRangePicker = ({onButtonClick, onChange, defaultValue, otherState}) => (

    <>
        <span className="mr2">Date:</span>
                
        <DatePicker 
            className="mr2"
            onChange={onChange}
            format={dateFormat}
            defaultValue={defaultValue}
            {...otherState}/>

        <Tooltip placement="top" title={<span>Download Data</span>}>
            <Button type="primary" onClick={onButtonClick}>Go</Button>
        </Tooltip>
        
    </>

 )

 export default DateRangePicker;