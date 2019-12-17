import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment'

import Logistics from '../../../../components/logistics/logistics.component' 
import DateRangePicker from '../../../../components/date-range-picker/date-range-picker.component'

import { 
    fetchLogisticsStockOverviewStartAsync,
    fetchLogisticsStockOverviewSlocStartAsync,
    fetchLogisticsStatusStartAsync
} from '../../../../redux/morning-meeting/morning-meeting.actions'

import { 
    Layout
 } from "antd";

import '../morning-meeting.styles.scss'

const { Header, Content } = Layout;

const dateFormat = 'MM/DD/YYYY';
const previousDay = moment().add(-1, 'd');
const previousDayFormatted = previousDay.format(dateFormat);

const LogisticsPage = ({setStockOverview, setStockOverviewSloc, setStatus}) => {
    
    const [ startDay, setStartDay ] = useState(previousDayFormatted);
    const [ endDay, setEndDay ] = useState(previousDayFormatted);

    const fetchData = () => {

        const start = moment(startDay, dateFormat).add(1, 'd').format(dateFormat);
        const end = moment(endDay, dateFormat).add(1, 'd').format(dateFormat);
        
        setStockOverview(end);
        setStockOverviewSloc(end);
        setStatus(start, end);
    }

    const onClick = () => {
        fetchData();
    }

    const onCalendarChange = (dates) => {
        const [start, end] = dates;
        setStartDay((start ? start.format(dateFormat) : null))
        setEndDay((end ? end.format(dateFormat) : null))
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
    <>
        <Header className="pa0 custom-header" >
            <h2 className="ml3">Logistics</h2>
        </Header>

        <Content className="ma3 mt0">
            <DateRangePicker defaultValue={previousDay} onButtonClick={onClick} onCalendarChange={onCalendarChange}  />
            <div className="mt3">
                <Logistics/>
            </div>
            
        </Content>      
    </> 
)}

const mapDispatchToProps = dispatch => ({
    setStockOverview: (day) => dispatch(fetchLogisticsStockOverviewStartAsync(day)),
    setStockOverviewSloc: (day) => dispatch(fetchLogisticsStockOverviewSlocStartAsync(day)),
    setStatus: (start, end) => dispatch(fetchLogisticsStatusStartAsync(start, end)),
})

export default connect(null, mapDispatchToProps)(LogisticsPage);