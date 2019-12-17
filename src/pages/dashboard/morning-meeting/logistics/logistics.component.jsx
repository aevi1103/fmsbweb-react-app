import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment'

import Logistics from '../../../../components/logistics/logistics.component' 
import DatePicker from '../../../../components/single-date-range-picker/single-date-range-picker.component'

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
const today = moment();
const todayFormatted = today.format(dateFormat);

const LogisticsPage = ({setStockOverview, setStockOverviewSloc, setStatus}) => {
    
    const [ date, setDate ] = useState(todayFormatted);

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
            <h2 className="ml3">Logistics</h2>
        </Header>

        <Content className="ma3 mt0">
            <DatePicker onButtonClick={onClick} onChange={onChange} 
                    defaultValue={today} />

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