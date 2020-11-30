import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DateRangePicker from '../../components/date-range-picker/date-range-picker.component'
import { 
    setStartDate,
    setEndDate,
    fetchDowntimeStartAsync
} from '../../core/redux/morning-meeting/morning-meeting.actions'

import DowntimeChart from './components/downtime-chart.component'
import DowntimeByOwnerChart from './components/downtime-by-owner-chart.component'
import DowntimeByLineChart from './components/downtime-by-line-chart.component'

import { 
    Layout,
    Button,
    Row,
    Col,
    Card,
    PageHeader
 } from "antd";

 const { Content } = Layout;
 const dateFormat = 'MM/DD/YYYY';

 const cardHeightStyle = {
    height: "500px"
}

 const DowntimePage = () => {

    const dispatch = useDispatch();

    const startDate = useSelector(({ morningMeeting }) => morningMeeting.startDate)
    const endDate = useSelector(({ morningMeeting }) => morningMeeting.endDate)
    const ownerTitle = useSelector(({ morningMeeting }) => morningMeeting?.downtimeByOwnerCollection?.ownerTitle) ?? null;
    const lineTitle = useSelector(({ morningMeeting }) => morningMeeting?.downtimeByLineCollection?.lineTitle) ?? null;


    const [startFormat, setStartFormat] = useState(startDate);
    const [endFormat, setSendFormat] = useState(endDate);

    const fetchData = (start = startFormat, end = endFormat) => dispatch(fetchDowntimeStartAsync(start, end))

    const onClick = () => {
        dispatch(setStartDate(startFormat))
        dispatch(setEndDate(endFormat))
        fetchData(startFormat, endFormat);
    }

    const onCalendarChange = (dates) => {
        const [start, end] = dates;
        setStartFormat(start ? start.format(dateFormat) : null);
        setSendFormat(end ? end.format(dateFormat) : null);
    }

    useEffect(() => {
        document.title = `Downtime`;
        fetchData();
    }, [])

    const responsiveProps = {
        xs: 24,
        xl: 12
    }

    return (
        <>

            <PageHeader
                className="site-page-header"
                title={`Downtime: ${startDate} - ${endDate}`}
            />
    
            <Content className="ma3 mt0">
            
                <Row gutter={[12,12]}>

                    <Col span={24}>

                        <DateRangePicker 
                            dateRangeValue={{startDate: startDate, endDate: endDate}}
                            onButtonClick={onClick}
                            onCalendarChange={onCalendarChange}/>

                        <Button type="primary" className="ml2">
                            <a href="http://10.129.224.149/FMSB/Engineering/Downtime.aspx" target="_blank" rel="noopener noreferrer">More Charts</a>
                        </Button>

                    </Col>

                    <Col span={24}>

                        <Row gutter={[12,12]}>  

                            <Col {...responsiveProps}>
                                <Card 
                                    title="Downtime by Department and Shift (Minutes)"
                                    size="small"
                                    className="ba b--black-10"
                                    style={cardHeightStyle}
                                >
                                    <DowntimeChart/>
                                </Card>         
                            </Col>

                            <Col {...responsiveProps}>
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
                                        
                    </Col>

                </Row>
                
            </Content>      
        </>)
    }

export default DowntimePage;