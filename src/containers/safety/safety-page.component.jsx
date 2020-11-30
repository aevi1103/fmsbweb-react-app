import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import DateRangePicker from '../../components/date-range-picker/date-range-picker.component'

import MonthlyIncidentRateChart from './components/monthly-incident-rate-chart.component'
import IncidentByDeptChart from './components/incident-by-dept-chart.component'
import IncidentTable from './components/incidents-table'

import { 
    fetchSafetyMonthlyIncidentRateStartAsync,
    fetchSafetyIncidentByDeptStartAsync,
    fetchSafetyIncidentStartAsync,
    setStartDate,
    setEndDate
} from '../../core/redux/morning-meeting/morning-meeting.actions'

import { 
    Layout,
    Button,
    PageHeader,
    Row,
    Col,
    Card
 } from "antd";

const { Content } = Layout;
const dateFormat = 'MM/DD/YYYY';

const cardHeightStyle = {
    height: "500px"
}


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

        <PageHeader
            className="site-page-header"
            title={`Safety: ${startDate} - ${endDate}`}
        />

        <Content className="ma3 mt0">
            
            <Row gutter={[12,12]}>

                <Col span={24}>

                    <DateRangePicker 
                        dateRangeValue={{startDate: startDate, endDate: endDate}}
                        onButtonClick={onClick}
                        onCalendarChange={onCalendarChange} />

                    <Button type="primary" className="ml2">
                        <a href="http://10.129.224.149/FMSB/Safety2/Charts.aspx" target="_blank" rel="noopener noreferrer">More Charts</a>
                    </Button>
                
                </Col>

                <Col span={8} lg={8} md={24} xs={24}>
                    <Card 
                        title="Monthly Incident Date"
                        size="small"
                        className="ba b--black-10"
                        style={cardHeightStyle}
                        >                     
                        <MonthlyIncidentRateChart/>
                    </Card>
                </Col>
                <Col span={8} lg={8} md={24} xs={24}>
                    <Card 
                        title="Incident Occurence by Department"
                        
                        size="small"
                        className="ba b--black-10" 
                        style={cardHeightStyle}
                        >
                        <IncidentByDeptChart/>
                    </Card>
                </Col>
                <Col span={8} lg={8} md={24} xs={24}>
                    <Card 
                        title="Incidents"
                        size="small"
                        className="ba b--black-10"
                        style={cardHeightStyle}>
                        <IncidentTable/>
                    </Card>
                </Col>
            </Row>
                    
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