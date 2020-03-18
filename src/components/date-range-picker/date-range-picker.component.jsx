import React from 'react';
import moment from 'moment'

import { 
    DatePicker,
    Button,
    Tooltip
 } from "antd";

 const { RangePicker } = DatePicker;
 const dateFormat = 'MM/DD/YYYY';

//  const ranges = {
//     'Today': [moment(), moment()],
//     'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
//     'Last 7 Days': [moment().subtract(6, 'days'), moment()],
//     'Last 30 Days': [moment().subtract(29, 'days'), moment()],
//     'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
//     'Last 12 Months': [moment().subtract(12, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
//     'This Month': [moment().startOf('month'), moment().endOf('month')],
//     'This Year': [moment().startOf('year'), moment().endOf('year')]
//  }

 const DateRangePicker = ({
    defaultValue,
    onButtonClick,
    onCalendarChange,
    dateRangeValue = null,
    ...otherState
    }) => {
     
    let defaultRange = [
        moment(defaultValue, dateFormat),
        moment(defaultValue, dateFormat)
    ];

    if (dateRangeValue) {
        const {startDate, endDate} = dateRangeValue;
        defaultRange = [
            moment(startDate, dateFormat),
            moment(endDate, dateFormat)
        ];
    }

    return (

    <>
        <span className="mr2">Date Range:</span>
                
        <RangePicker 
            className="mr2"
            onChange={() => {}}
            format={dateFormat}
            onCalendarChange={onCalendarChange}
            defaultValue={defaultRange}
            {...otherState} />

        <Tooltip placement="top" title={<span>Download Data</span>}>
            <Button type="primary" onClick={onButtonClick}>Go</Button>
        </Tooltip>
        
    </>

 )}

 export default DateRangePicker;