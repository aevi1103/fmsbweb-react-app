import React from 'react';
import moment from 'moment'

import { 
    DatePicker,
    Button,
    Tooltip
 } from "antd";

 const { RangePicker } = DatePicker;
 const dateFormat = 'MM/DD/YYYY';

 const DateRangePicker = ({
    defaultValue,
    onButtonClick,
    onCalendarChange,
    dateRangeValue = null,
    isRenderButton = true,
    isLoading = false,
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

    function disabledDate(current) {
        // Can not select days before today and today
        return current && current > moment().endOf('day');
      }

    return (

    <>
        {
            isRenderButton
            ? <span className="mr2">Date Range:</span>
            : null
        }

        <RangePicker 
            className="mr2"
            onChange={() => {}}
            format={dateFormat}
            onCalendarChange={onCalendarChange}
            defaultValue={defaultRange}
            disabledDate={disabledDate}
            ranges={{
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last Week': [moment().subtract(6, 'days').startOf('week'), moment().subtract(6, 'days').endOf('week')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                'Last 30 days': [moment().subtract(30, 'days').startOf('month'), moment()],
                'MTD': [moment().startOf('month'), moment().add(-1, 'days')],
                'YTD': [moment().startOf('year'), moment().add(-1, 'days')]
              }}
            {...otherState} />


        {
            isRenderButton 
            ? (<Tooltip placement="top" title={<span>Click to reload dashboard</span>}>
                    <Button type="primary" onClick={onButtonClick} loading={isLoading}>Go</Button>
                </Tooltip>)
            : null
        }
        
        
    </>

 )}

 export default DateRangePicker;