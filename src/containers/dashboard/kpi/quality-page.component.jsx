import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment'

import DatePicker from '../../../components/single-date-range-picker/single-date-range-picker.component'

import { 
    fetchQualityStartAsync
} from '../../../core/redux/morning-meeting/morning-meeting.actions'

import { 
    Layout,
    Button,
    PageHeader
 } from "antd";

import Quality from '../../../components/quality/quality.component'

const { Content } = Layout;
const dateFormat = 'MM/DD/YYYY';

const QualityPage = ({
        fetchQualityStartAsync,
        endDate
    }) => {
    
    const endDatePlusOneDay = moment(endDate, dateFormat).add(1, 'd').format(dateFormat)

    const [ date, setDate ] = useState(endDatePlusOneDay);

    const fetchData = () => {
        fetchQualityStartAsync(date);
    }

    const onClick = () => {
        fetchData();
    }

    const onChange = (date, dateStr) => {
        setDate(dateStr);
    }

    useEffect(() => {
        document.title = `Quality`;
        fetchData();
    }, [])

    return (
    <>
        <PageHeader
            className="site-page-header"
            title={`Quality: ${date}`}
        />

        <Content className="ma3 mt0">
            <DatePicker onButtonClick={onClick} onChange={onChange} 
                    defaultValue={moment(endDatePlusOneDay, dateFormat)} />

            <Button type="primary" className="ml2">
                <a href="http://10.129.224.149/FMSB/Quality/Customer/Record.aspx" target="_blank" rel="noopener noreferrer">Enter Data</a>
            </Button>
            
            <div className="mt3">
                <Quality/>
            </div>
            
        </Content>      
    </> 
)}

const mapDispatchToProps = dispatch => ({
    fetchQualityStartAsync: date => dispatch(fetchQualityStartAsync(date))
})

const mapStateToProps = ({morningMeeting}) => ({
    endDate: morningMeeting.endDate
})

export default connect(mapStateToProps, mapDispatchToProps)(QualityPage);