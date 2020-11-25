import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Safety from '../../../../components/safety/safety.component' 
import DateRangePicker from '../../../../components/date-range-picker/date-range-picker.component'

import { 
    fetchSafetyMonthlyIncidentRateStartAsync,
    fetchSafetyIncidentByDeptStartAsync,
    fetchSafetyIncidentStartAsync,

    setStartDate,
    setEndDate

} from '../../../../redux/morning-meeting/morning-meeting.actions'

import { 
    Layout,
    Button
 } from "antd";

import '../morning-meeting.styles.scss'


const { Header, Content } = Layout;

const dateFormat = 'MM/DD/YYYY';

const SafetyPage = ({
        setMonthlyIncidentRate,
        setIncidentByDept,
        setIncidents,

        startDate,
        endDate,
        setStartDate,
        setEndDate
    }) => {
    
    const [startFormat, setStartFormat] = useState(startDate);
    const [endFormat, setSendFormat] = useState(endDate);

    const fetchData = (start = startFormat, end = endFormat) => {
        setMonthlyIncidentRate();
        setIncidentByDept();
        setIncidents(start, end);
    }

    const onClick = () => {
        setStartDate(startFormat);
        setEndDate(endFormat);
        fetchData(startFormat, endFormat);
    }

    const onCalendarChange = (dates) => {

        const [start, end] = dates;
        setStartFormat(start ? start.format(dateFormat) : null);
        setSendFormat(end ? end.format(dateFormat) : null);

    }

    useEffect(() => {
        document.title = `Safety`;
        fetchData();
    }, [])

    return (
    <React.Fragment>
        <Header className="pa0 custom-header" >
            <h2 className="ml3">Safety: {startDate} - {endDate}</h2>
        </Header>

        <Content className="ma3 mt0">
            <DateRangePicker 
                dateRangeValue={{startDate: startDate, endDate: endDate}}
                onButtonClick={onClick}
                onCalendarChange={onCalendarChange} />

            <Button type="primary" className="ml2">
                <a href="http://10.129.224.149/FMSB/Safety2/Charts.aspx" target="_blank" rel="noopener noreferrer">More Charts</a>
            </Button>

            <div className="mt3">
                <Safety/>
            </div>
            
        </Content>      
    </React.Fragment>
)}

const mapDispatchToProps = dispatch => ({
    setMonthlyIncidentRate: () => dispatch(fetchSafetyMonthlyIncidentRateStartAsync()),
    setIncidentByDept: () => dispatch(fetchSafetyIncidentByDeptStartAsync()),
    setIncidents: (start, end) => dispatch(fetchSafetyIncidentStartAsync(start, end)),

    setStartDate: (date) => dispatch(setStartDate(date)),
    setEndDate: (date) => dispatch(setEndDate(date))
})

const mapStateToProps = ({morningMeeting}) => ({
    startDate: morningMeeting.startDate,
    endDate: morningMeeting.endDate
})

export default connect(mapStateToProps, mapDispatchToProps)(SafetyPage);