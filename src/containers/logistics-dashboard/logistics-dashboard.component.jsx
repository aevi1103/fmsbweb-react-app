import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'
import moment from 'moment'
import 'tachyons'

import DatePicker from '../../components/single-date-range-picker/single-date-range-picker.component'
import Logistics from './components/logistics.component' 

import { 
    fetchLogisticsStockOverviewStartAsync,
    fetchLogisticsStockOverviewSlocStartAsync,
    fetchLogisticsStatusStartAsync
} from '../../core/redux/morning-meeting/morning-meeting.actions'

import { dateFormat } from '../../core/utilities/helpers'

import { 
    Layout,
    Button,
    PageHeader,
    Row,
    Col
 } from "antd";

const { Content } = Layout;


const LogisticsDashboard = () => {
    
    const dispatch = useDispatch();
    const endDate = useSelector(({ morningMeeting }) => morningMeeting.endDate);
    const endDatePlusOneDay = moment(endDate, dateFormat).add(1, 'd').format(dateFormat)
    const [ date, setDate ] = useState(endDatePlusOneDay);

    const fetchData = useCallback(() => {
        dispatch(fetchLogisticsStockOverviewSlocStartAsync(date))
        dispatch(fetchLogisticsStockOverviewStartAsync(date))
        dispatch(fetchLogisticsStatusStartAsync(date))
    }, [date, dispatch])

    const onClick = () => fetchData();
    const onChange = (date, dateStr) => setDate(dateStr);

    useEffect(() => {
        
        document.title = `Logistics`;
        fetchData();

    }, [])

    const disabledDate = current => current > moment().endOf('day');

    return (
    <>
        <PageHeader
            className="site-page-header"
            title={`Logistics: ${date}`}
        />

        <Content className="ma3 mt0">

            <Row gutter={[12,12]}>

                <Col span={24}>
                    
                    <DatePicker 
                        onButtonClick={onClick} 
                        onChange={onChange} 
                        disabledDate={disabledDate}
                        format={dateFormat}
                        defaultValue={moment(endDatePlusOneDay, dateFormat)} />

                    <Button type="primary" className="ml2">
                        <Link to="/dashboard/morningmeeting/logistics/settings/inventory" >Enter Data</Link>
                    </Button>
                </Col>

                <Col span={24}>
                    <Logistics/>
                </Col>

            </Row>
            
        </Content>      
    </> 
)}

export default LogisticsDashboard;