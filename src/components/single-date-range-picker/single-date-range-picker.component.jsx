import React from 'react';

import { 
    DatePicker,
    Button
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

        <Button type="primary" onClick={onButtonClick}>Go</Button>
    </>

 )

 export default DateRangePicker;