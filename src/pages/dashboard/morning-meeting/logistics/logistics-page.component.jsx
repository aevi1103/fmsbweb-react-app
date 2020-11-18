import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
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
    Button,
    PageHeader
 } from "antd";

import '../morning-meeting.styles.scss'
const { Content } = Layout;
const dateFormat = 'MM/DD/YYYY';

const LogisticsPage = ({
        setStockOverview,
        setStockOverviewSloc,
        setStatus,
        endDate
    }) => {
    
    const endDatePlusOneDay = moment(endDate, dateFormat).add(1, 'd').format(dateFormat)
    const [ date, setDate ] = useState(endDatePlusOneDay);

    const fetchData = useCallback(() => {
        setStockOverviewSloc(date);
        setStockOverview(date);

        //todo: modify or add new store for this action
        setStatus(date); 

    }, [date, setStatus, setStockOverview, setStockOverviewSloc])

    const onClick = () => {
        fetchData();
    }

    const onChange = (date, dateStr) => setDate(dateStr);

    useEffect(() => {
        
        document.title = `Morning Meeting - Logistics`;
        fetchData();

    }, [fetchData])

    return (
    <>
        <PageHeader
            className="site-page-header"
            title={`Logistics: ${date}`}
        />

        <Content className="ma3 mt0">
            <DatePicker onButtonClick={onClick} onChange={onChange} 
                    defaultValue={moment(endDatePlusOneDay, 'MM/DD/YYYY')} />

            <Button type="primary" className="ml2">
                <a href="http://10.129.224.149/FMSB/Logistics/MorningMeeting.aspx" target="_blank" rel="noopener noreferrer">Enter Data</a>
                {/* <Link to="/dashboard/morningmeeting/logistics/settings/inventory" >Enter Data</Link> */}
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
    setStatus: (date) => dispatch(fetchLogisticsStatusStartAsync(date)),
})

const mapStateToProps = ({morningMeeting}) => ({
    endDate: morningMeeting.endDate
})

export default connect(mapStateToProps, mapDispatchToProps)(LogisticsPage);