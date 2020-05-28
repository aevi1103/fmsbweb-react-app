import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import DateRangePicker from '../../../../components/date-range-picker/date-range-picker.component'
import { 
    setStartDate,
    setEndDate,

    fetchDowntimeStartAsync
} from '../../../../redux/morning-meeting/morning-meeting.actions'

import DowntimeChart from '../../../../components/downtime/downtime-chart/downtime-chart.component'
import DowntimeByOwnerChart from '../../../../components/downtime/downtime-chart/downtime-by-owner-chart.component'
import DowntimeByLineChart from '../../../../components/downtime/downtime-chart/downtime-by-line-chart.component'

import { 
    Layout,
    Button,
    Row,
    Col,
    Card
 } from "antd";

 import '../morning-meeting.styles.scss'

 const { Header, Content } = Layout;
 const dateFormat = 'MM/DD/YYYY';

 const cardHeightStyle = {
    height: "500px"
}

 const DowntimePage = ({
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    fetchDowntimeStartAsync,

    isDowntimeFetching,

    downtimeByOwnerCollection,
    downtimeByLineCollection
 }) => {

    const [startFormat, setStartFormat] = useState(startDate);
    const [endFormat, setSendFormat] = useState(endDate);

    const { ownerTitle } = downtimeByOwnerCollection;
    const { lineTitle } = downtimeByLineCollection;

    const fetchData = (start = startFormat, end = endFormat) => {
        fetchDowntimeStartAsync(start, end);
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
        document.title = `Morning Meeting - Downtime`;
        fetchData();
    }, [])

    return (
        <>
            <Header className="pa0 custom-header" >
                <h2 className="ml3">Downtime: {startDate} - {endDate}</h2>
            </Header>
    
            <Content className="ma3 mt0">
            
                <DateRangePicker 
                    dateRangeValue={{startDate: startDate, endDate: endDate}}
                    onButtonClick={onClick}
                    onCalendarChange={onCalendarChange}/>

                <Button type="primary" className="ml2">
                    <a href="http://10.129.224.149/FMSB/Engineering/Downtime.aspx" target="_blank">View More Charts</a>
                </Button>

                <div className="mt3">
                    <Row gutter={[12,12]}>  

                        <Col span={12}>
                            <Card 
                                title="Downtime by Department and Shift (Minutes)"
                                size="small"
                                className="ba b--black-10"
                                style={cardHeightStyle}
                            >
                                <DowntimeChart/>
                            </Card>         
                        </Col>

                        <Col span={12}>
                            <Card 
                                title={ownerTitle}
                                size="small"
                                className="ba b--black-10"
                                style={cardHeightStyle}
                            >
                                <DowntimeByOwnerChart/>
                            </Card>         
                        </Col>

                        <Col span={24}>
                            <Card 
                                title={lineTitle}
                                size="small"
                                className="ba b--black-10"
                                style={cardHeightStyle}
                            >
                                <DowntimeByLineChart/>
                            </Card>         
                        </Col>

                    </Row>
                </div>
                
            </Content>      
        </>)
    }

const mapDispatchToProps = dispatch => ({
    fetchDowntimeStartAsync: (start, end) => dispatch(fetchDowntimeStartAsync(start, end)),
    setStartDate: (date) => dispatch(setStartDate(date)),
    setEndDate: (date) => dispatch(setEndDate(date))
})

const mapStateToProps = ({morningMeeting}) => ({
    startDate: morningMeeting.startDate,
    endDate: morningMeeting.endDate,

    isDowntimeFetching: morningMeeting.isDowntimeFetching,

    downtimeByOwnerCollection: morningMeeting.downtimeByOwnerCollection,
    downtimeByLineCollection: morningMeeting.downtimeByLineCollection
})

export default connect(mapStateToProps, mapDispatchToProps)(DowntimePage);