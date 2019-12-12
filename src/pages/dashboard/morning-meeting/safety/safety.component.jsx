import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment'

import Safety from '../../../../components/safety/safety.component' 

import DateRangePicker from '../../../../components/date-range-picker/date-range-picker.component'

import { 
    fetchSafetyMonthlyIncidentRateStartAsync,
    fetchSafetyIncidentByDeptStartAsync,
    fetchSafetyIncidentStartAsync
} from '../../../../redux/morning-meeting/morning-meeting.actions'

import { 
    Layout
 } from "antd";

import '../morning-meeting.styles.scss'


const { Header, Content } = Layout;

const dateFormat = 'MM/DD/YYYY';
const previousDay = moment().add(-1, 'd');
const previousDayFormatted = previousDay.format(dateFormat);

const SafetyPage = ({setMonthlyIncidentRate, setIncidentByDept, setIncidents}) => {
    
    const [ startDay, setStartDay ] = useState(previousDayFormatted);
    const [ endDay, setEndDay ] = useState(previousDayFormatted);

    const fetchData = () => {
        setMonthlyIncidentRate();
        setIncidentByDept();
        setIncidents(startDay, endDay);
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
            <h2 className="ml3">Safety</h2>
        </Header>

        <Content className="ma3 mt0">
            <DateRangePicker defaultValue={previousDay} onButtonClick={onClick} onCalendarChange={onCalendarChange}  />
            <div className="mt3">
                <Safety/>
            </div>
            
        </Content>      
    </> 
)}

const mapDispatchToProps = dispatch => ({
    setMonthlyIncidentRate: () => dispatch(fetchSafetyMonthlyIncidentRateStartAsync()),
    setIncidentByDept: () => dispatch(fetchSafetyIncidentByDeptStartAsync()),
    setIncidents: (start, end) => dispatch(fetchSafetyIncidentStartAsync(start, end))
})

export default connect(null, mapDispatchToProps)(SafetyPage);