import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment'
import 'tachyons'

import Logistics from '../../../../components/logistics/logistics.component' 
import DatePicker from '../../../../components/single-date-range-picker/single-date-range-picker.component'

import { 
    fetchLogisticsStockOverviewStartAsync,
    fetchLogisticsStockOverviewSlocStartAsync,
    fetchLogisticsStatusStartAsync
} from '../../../../redux/morning-meeting/morning-meeting.actions'

import { 
    Layout,
    Button
 } from "antd";

import '../morning-meeting.styles.scss'
const { Header, Content } = Layout;
const dateFormat = 'MM/DD/YYYY';

const LogisticsPage = ({
        setStockOverview,
        setStockOverviewSloc,
        setStatus,
        endDate
    }) => {
    
    const endDatePlusOneDay = moment(endDate, dateFormat).add(1, 'd').format(dateFormat)
    const [ date, setDate ] = useState(endDatePlusOneDay);

    const fetchData = () => {
        setStockOverview(date);
        setStockOverviewSloc(date);
        setStatus(date, date);
    }

    const onClick = () => {
        fetchData();
    }

    const onChange = (date, dateStr) => {
        setDate(dateStr);
    }

    useEffect(() => {
        document.title = `Morning Meeting - Logistics`;
        fetchData();
    }, [])

    return (
    <>
        <Header className="pa0 custom-header" >
            <h2 className="ml3">Logistics: {date}</h2>
        </Header>

        <Content className="ma3 mt0">
            <DatePicker onButtonClick={onClick} onChange={onChange} 
                    defaultValue={moment(endDatePlusOneDay, 'MM/DD/YYYY')} />

            <Button type="primary" className="ml2">
                <a href="http://10.129.224.149/FMSB/Logistics/MorningMeeting.aspx" target="_blank">Enter Data</a>
            </Button>

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

const mapStateToProps = ({morningMeeting}) => ({
    endDate: morningMeeting.endDate
})

export default connect(mapStateToProps, mapDispatchToProps)(LogisticsPage);